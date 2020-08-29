// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import joi from 'joi';
import styled from 'styled-components';
import theme from 'web/client/theme';
import { email } from 'web/validation';
import { Form, Text } from 'react-form';
import { Border, Flex, Heading, Label, Box, Image, Link, Provider, Button } from 'rebass';
import config from 'app.config';
import auth from 'web/client/auth';
import { I18nextProvider, Trans } from 'react-i18next';
import i18n from 'web/client/i18n';

const logger = config.logger.child({ childName: 'login-email' });

const LoginBox = ({ className, children }) => (
  <Border className={className}>
    {children}
  </Border>
);

const Container = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  margin: 0;
  padding: 0;
  opacity: 0.99;
`;

const Header = styled(Heading)`
  margin: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  color: ${props => props.theme.colors.light};
  font-weight: normal;
  flex-grow: 1;
  text-align: ${props => {
    if (props.center) return 'center';
    if (props.left) return 'left';
    if (props.left) return 'right';
    return 'unset';
  }};
`;

const LoginBoxContainer = styled(LoginBox)`
  padding: ${props => props.theme.spacing.nm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.loginFormBackground};
  color: ${props => props.theme.colors.light}
`;

const Input = styled(Text)`
  font-size: ${props => props.theme.fontSize.nm};
  height: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.sm} 0;
  width: 100%;
  font-weight: normal;
  background-color: transparent;
  color: ${props => props.theme.colors.light};
  border: none;
  border-bottom: solid 1px ${props => props.theme.colors.light};
  outline: none;
  &::placeholder {
    font-style: italic
  }
`;

const SuccessMessage = styled.p`
  color: ${props => props.theme.colors.light};
  text-align: ${props => {
    if (props.center) return 'center';
    if (props.left) return 'left';
    if (props.left) return 'right';
    return 'unset';
  }};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSize.sm}
  margin-top: 0px;
  min-height: 1.2em
`;

const BGVid = styled.video`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -100;
  -ms-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const BGVidOverlay = styled(Box)`
  position: fixed;
  z-index: -99;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  top: 50%;
  left: 50%;
  -ms-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  background-image: radial-gradient(transparent -80%, #000 80%);
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 1;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const Logo = styled(Image)`
  left: 50%
  transform: translate(-50%, 0);
  position: absolute;
  top: 1em;
  width: 100%;
  max-width: 700px;
`;

const BoxContainer = styled(Box)`
  height: 100%;
  margin-bottom: 20px;
  overflow: 'hidden',
  position: 'relative',
  textAlign: 'center'
`;

const SendButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  float: right;
  width: 100%;
  height: 50px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px black;
    -webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.23);
    -moz-box-shadow: 0px 0px 10px 2px black;
  }
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
`;

export default class Email extends Component {
  constructor (props) {
    super(props);
    this.state = {
      emailSent: false,
      loading: false,
      logo: 'agilysys_logo.png'
    };
    this.tenantId = document.getElementById('tenantId').value;
    this.isAuth = props.emailAddress && props.loginToken;
    this.login = this.login.bind(this);
    this.validate = this.validate.bind(this);
    this.authenticateEmail = this.authenticateEmail.bind(this);
  }
  async componentWillMount () {
    if (this.tenantId) {
      try {
        const logo = await axios.get(`${config.webPaths.api}config/logo/${this.tenantId}`);
        this.setState({ logo: logo.data });
        logger.info(`Found logo for tenant ${this.tenantId}`);
      } catch (ex) {
        logger.warn(`Could not find logo for tenant ${this.tenantId}`);
      }
    }
  }
  componentDidMount () {
    if (this.isAuth) {
      this.authenticateEmail(this.props.emailAddress, this.props.loginToken);
    }
  }

  async authenticateEmail (email, loginToken) {
    try {
      const test = await axios.put(`${config.webPaths.api}login/email/${email}/${loginToken}`);
      if (test.data.tenantId) {
        logger.warn('GOOD REDIRECT');
        auth.login(test.headers);
      } else {
        logger.error('BAD REDIRECT');
        auth.logout();
      }
    } catch (ex) {
      logger.fatal('REALLY BAD REDIRECT');
      logger.fatal(ex);
      auth.logout();
    }
  }

  validate (value) {
    const { error } = joi.validate({ email: value }, email);
    return !error ? null : i18n.t('EMAIL_INVALID_EMAIL');
  };

  login (values) {
    this.setState({ loading: true });
    axios.post(`${config.webPaths.base}login/email`, values)
      .then((results) => {
        this.setState({ emailSent: true, loading: false, validationEmail: results.data });
      })
      .catch(error => {
        logger.error(error.response.data.message);
        this.setState({ error: error.response.data.message, loading: false });
      });
  };

  render () {
    const { emailSent, error, validationEmail, logo } = this.state;

    return !this.isAuth && (
      <Provider theme={theme} style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        {
          window.localStorage.getItem(config.auth.apiHeader) &&
          <Redirect to='/' />
        }
        <Container>
          <I18nextProvider i18n={i18n} >
            <React.Fragment>
              <Link href={config.webPaths.base}><Logo src={`${config.webPaths.assets}${logo}`} /></Link>
              <BGVidOverlay />
              <BGVid marginLeft={['-50%', 'initial']} playsinline autoPlay muted loop id='bgvid'>
                <source src={`${config.webPaths.assets}login_demo.webm`} type='video/webm' />
              </BGVid>
              <Flex
                width={[1, 2 / 3, 2 / 5]}
                px={[30, 0]}
                flexDirection='column'
                style={{ padding: 0, maxWidth: '30em' }}
              >
                <Header center='true'>
                  {emailSent ? <Trans i18nKey='EMAIL_THANK_YOU'/> : <Trans i18nKey='EMAIL_SIGN_IN'/>}
                </Header>
                <LoginBoxContainer className='login-container'>
                  {
                    emailSent ? (
                      <SuccessMessage className='success-message' center='true'>
                        <Trans i18nKey='EMAIL_LINK_TEXT'/>
                        <br />
                        <a className='validation-email-link' href={validationEmail}>{validationEmail}</a>
                      </SuccessMessage>
                    ) : (
                      <Form onSubmit={this.login} >
                        {formApi => (
                          <form onSubmit={formApi.submitForm} >
                            <Label className='email-label'><Trans i18nKey='EMAIL_LABEL'/></Label>
                            <Input
                              className='email-input-text'
                              field='email'
                              validate={this.validate}
                              validateOnSubmit={'true'}
                              placeholder={i18n.t('EMAIL_PLACEHOLDER')}
                              type='email'
                            />
                            <ErrorMessage className='error-message'>
                              {!error && formApi.errors && formApi.errors.email}
                              {error}
                            </ErrorMessage>
                            <BoxContainer width={[1]} >
                              <SendButton className='signin-button button' type='submit'
                                disabled={this.state.loading} children={<Trans i18nKey='EMAIL_SIGN_IN_BUTTON'/>}/>
                            </BoxContainer>

                          </form>
                        )}
                      </Form>
                    )
                  }
                </LoginBoxContainer>
              </Flex>
            </React.Fragment>
          </I18nextProvider>
        </Container>
      </Provider>
    );
  }
}
