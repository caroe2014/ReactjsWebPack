// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import joi from 'joi';
import theme from 'web/client/theme';
import { Form, Text } from 'react-form';
import { Flex, Heading, Label, Box, Provider, Button, Fixed } from 'rebass';
import config from 'app.config';
import auth from 'web/client/auth';
import Loading from 'web/client/app/components/Loader/loading';
import styled, { css, ThemeProvider } from 'styled-components';
import { I18nextProvider, Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import { themeUpdate } from 'web/client/app/utils/AppThemeUpdate';
import Loader from 'web/client/app/components/Loader/index';

const GATEWAY_TOKEN = 'gateway-token';
const ACCESS_TOKEN = 'access-token';
const EXPIRES_KEY = config.auth.expiresKey;
const localStorage = window.localStorage;

const loadingTheme = {
  colors: {
    ...theme.colors,
    light: theme.colors.loginFormBackground,
    tertiary: theme.colors.light
  },
  mediaBreakpoints: {
    mobile: (...args) => css`@media (max-width: 32em) {${css(...args)}}`,
    tablet: (...args) => css`@media (max-width: 72em) {${css(...args)}}`,
    desktop: (...args) => css`@media (min-width: 72em) {${css(...args)}}`
  }
};

const logger = config.logger.child({ childName: 'login-ldap' });

const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;  
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const Container = styled(Flex)`
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  margin: 0;
  padding: 0;
  opacity: 0.99;
`;

const AppBackground = styled.div`
  ${props => props.theme.mediaBreakpoints.desktop`display:block`};
  ${props => props.theme.mediaBreakpoints.tablet`display:none`};
  ${props => props.theme.mediaBreakpoints.mobile`display:none`};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width:100%;
`;

const AppBackgroundMobile = styled.div`
  ${props => props.theme.mediaBreakpoints.desktop`display:none`};
  ${props => props.theme.mediaBreakpoints.tablet`display:block`};
  ${props => props.theme.mediaBreakpoints.mobile`display:block`};
  position: fixed;
  top: 0;
  bottom: 0;
  width:100%;
`;

const FieldContainer = styled.div`
  margin: 0px;
  &>input {
    border-color: ${props => props.theme.colors.loginField};
    color: ${props => props.theme.colors.black} !important;
    font-size: 18px;
  }
  &>label {
    border-color: ${props => props.theme.colors.loginField};
    color: ${props => props.theme.colors.placeHolder};
    font-size: 18px;
    overflow-x: initial;
  }
  &>input:not(:focus).mui--is-not-empty~label {
    color: ${props => props.theme.colors.primaryTextColor};
    font-size: 16px;
  }
  &>input:focus {
    border-color: ${props => props.theme.colors.loginField};
    border-width: 1px;
  }
  &>input:focus~label {
    border-color: ${props => props.theme.colors.loginField};
    color: ${props => props.theme.colors.primaryTextColor};
    font-size: 16px;
  }
`;

const Header = styled(Heading)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-weight: 300;
  font-size: 40px;
  line-height: 40px;
  flex-grow: 1;
  text-align: ${props => {
    if (props.center) return 'center';
    if (props.left) return 'left';
    if (props.left) return 'right';
    return 'unset';
  }};
`;

const LoginContainer = styled(Flex)`
  width: 100%;
  height: auto;
  max-width: 400px;
  min-height: 668px;
  background: ${props => props.theme.colors.light};
  padding: 20px 0px 30px 0px;
  box-shadow: 0 0 10px rgba(0,0,0,0.6);
  ${props => props.theme.mediaBreakpoints.mobile`
    padding: 0px 0px 20px 0px;
    height: 100%;
    box-shadow: none;
    max-width: 100%;
  `};
`;

const LoginBoxContainer = styled(Flex)`
  padding: 40px 0px 0px 0px;
  max-width: 300px;
  align-self: center;
  width: 100%;
  color: ${props => props.theme.colors.light}
  .common-error {
    margin: 10px 0px 24px 0px;
  }
  ${props => props.theme.mediaBreakpoints.mobile`
    padding: 20px 0px 0px 0px;
    background-color: transparent;
    max-width: 260px;
  `};
`;

const Field = styled(Text)`
  color: ${props => props.theme.colors.loginField} !important;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin: 5px 0px 16px 0px;
  min-height: 14px;
  line-height: 14px;
`;

const BoxContainer = styled(Box)`
  height: 50px;
  position: relative;
  text-align: center;
  padding-top: 16px;
`;

const SendButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 700;
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
  border-radius: 0px;
  &:focus {
    box-shadow: none;
    outline: none;
  }
`;

const LogoContainer = styled(Flex)`
  min-height: 150px;
  height: 150px;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.bannerAndFooter};
  ${props => props.theme.mediaBreakpoints.mobile`
    min-height: 100px;
    height: 100px;
  `}
  & > img {
    ${props => props.theme.mediaBreakpoints.mobile`
      max-width: 260px !important;
      max-height: 60px !important;
    `};
  }
`;

const logoStyle = {
  height: 'auto',
  width: 'auto',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  maxWidth: '300px',
  maxHeight: '75px'
};

export default class LDAP extends Component {
  constructor (props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: false
    };
    this.tenantId = document.getElementById('tenantId').value || undefined;
    this.login = this.login.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.onLanguageChanged = this.onLanguageChanged.bind(this);
  }

  componentWillMount () {
    if (this.props.cboConfig) {
      localStorage.setItem(this.props.cboConfig.gatewayToken ? GATEWAY_TOKEN : ACCESS_TOKEN, this.props.cboConfig.gatewayToken || this.props.cboConfig.accessToken); // eslint-disable-line max-len
      localStorage.setItem(EXPIRES_KEY, this.props.cboConfig.gatewayToken || this.props.cboConfig.accessToken);
      this.updateTheme();
    }
  }

  componentDidMount () {
    i18n.on('loaded', this.onLanguageChanged);
  }

  componentDidUpdate (prevProps) {
    if (prevProps.cboConfig !== this.props.cboConfig) {
      this.updateTheme();
    }
  }

  onLanguageChanged (loaded) {
    this.setState({loading: false});
  }

  validateUsername (value) {
    const { error } = joi.validate({ username: value ? value.trim() : '' }, { username: joi.string().email().required() }); // eslint-disable-line max-len
    return !error ? null : i18n.t('LDAP_EMAIL_ERROR');
  }

  validatePassword (value) {
    const { error } = joi.validate({ password: value }, { password: joi.string().required() });
    return !error ? null : i18n.t('LDAP_PASSWORD_ERROR');
  }

  login (values) {
    values.username = values.username.trim();
    this.setState({ loading: true, error: '' });
    axios.post(`${config.webPaths.api}login/ldap`, { ...values, tenantId: this.props.tenantId })
      .then((results) => {
        this.setState({ authenticated: true, loading: false, error: undefined });
        auth.login(results.headers);
      })
      .catch(error => {
        if (error.response) {
          logger.error(`${error.response.status}: ${error.response.data.message}`);
          this.setState({ error: `${error.response.data.message}`, loading: false });
        } else {
          logger.error(i18n.t('UNKNOWN_ERROR'));
          this.setState({ error: i18n.t('UNKNOWN_ERROR'), loading: false });
        }
      });
  }

  getBackground = (cboConfig) => {
    if (cboConfig) {
      return {
        showImage: cboConfig.desktop.showImage,
        desktopBackground: cboConfig.desktop.showImage ? cboConfig.desktop.backgroundImage : cboConfig.desktop.color, // eslint-disable-line max-len
        mobileBackground: cboConfig.mobile ? cboConfig.mobile.color : theme.colors.light // eslint-disable-line max-len
      };
    } else {
      return false;
    }
  }

  updateTheme () {
    const { cboConfig } = this.props;
    if (cboConfig && cboConfig.theme) {
      theme.colors = themeUpdate(cboConfig.theme).colors;
    }
  }

  render () {
    const { authenticated, error } = this.state;
    const { cboConfig } = this.props;
    let background = this.getBackground(cboConfig);
    return !this.isAuth && (
      <Provider className='provider' theme={theme}
        style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}
      >
        {
          window.localStorage.getItem(config.auth.apiHeader) &&
          <Redirect to='/' />
        }
        <Container className='container'>
          <AppBackground className='app-background'>
            {background &&
          background.showImage
              ? <UrlImageLoader
                src={config.getPOSImageURL(cboConfig.contextID, background.desktopBackground,
                  this.tenantId)} />
              : <AppBackground className='app-background' style={{backgroundColor: background.desktopBackground
                ? background.desktopBackground : theme.colors.light}} />}
          </AppBackground>
          {background && background.mobileBackground
            ? <AppBackgroundMobile
              className='mobile-app-background'
              style={{backgroundColor: background.mobileBackground}}
            />

            : <AppBackgroundMobile className='mobile-app-background' style={{backgroundColor: theme.colors.light}}/>}
          <I18nextProvider i18n={i18n} >
            <React.Fragment>
              <LoginContainer
                className='login-container'
                width={[1, 2 / 3, 2 / 5]}
                flexDirection='column'
                style={{ zIndex: 1 }}
              >
                <LogoContainer className='image-container'>
                  {cboConfig.logo &&
                  <UrlImageLoader src={config.getPOSImageURL(cboConfig.contextID, cboConfig.logo,
                    this.tenantId)} imageStyle={logoStyle}/>
                  }
                </LogoContainer>

                <LoginBoxContainer className='login-box-container'>
                  {authenticated && <ThemeProvider theme={loadingTheme}><Loading /></ThemeProvider>}
                  {!authenticated &&
                  <Form className='form' onSubmit={this.login}>
                    {formApi => (
                      <form className='submit-form' onSubmit={formApi.submitForm} style={{ width: '100%' }}>
                        <React.Fragment>
                          <Header className='header-text' left='true'><Trans i18nKey='LDAP_SIGN_IN'/></Header>
                          <ErrorMessage className='common-error'>
                            {error}
                          </ErrorMessage>
                          <FieldContainer className='field-container mui-textfield mui-textfield--float-label'>
                            <Field
                              className='UsernameField mui--is-empty mui--is-pristine mui--is-touched'
                              field='username'
                              type='username'
                              name='username'
                              validate={this.validateUsername}
                              validateOnSubmit
                              autoComplete='email'
                            />
                            <Label><Trans i18nKey='LDAP_EMAIL_ADDRESS'/></Label>
                          </FieldContainer>
                          <ErrorMessage>
                            {formApi.errors && formApi.errors.username && <Trans i18nKey='LDAP_EMAIL_ERROR'/>}
                          </ErrorMessage>
                          <FieldContainer className='field-container mui-textfield mui-textfield--float-label'>
                            <Field
                              className='PasswordField mui--is-empty mui--is-pristine mui--is-touched'
                              field='password'
                              type='password'
                              name='password'
                              validate={this.validatePassword}
                              validateOnSubmit
                              autoComplete='new-password'
                            />
                            <Label><Trans i18nKey='LDAP_PASSWORD'/></Label>
                          </FieldContainer>
                          <ErrorMessage className='error-message'>
                            {formApi.errors &&
                              formApi.errors.password && <Trans i18nKey='LDAP_PASSWORD_ERROR'/>}
                          </ErrorMessage>
                          <BoxContainer width={[1]} >
                            <SendButton
                              className='signin-button SubmitButton button'
                              type='submit'
                              disabled={this.state.loading}
                              children={<Trans i18nKey='LDAP_SIGN_IN'/>}
                            />
                          </BoxContainer>
                        </React.Fragment>
                      </form>
                    )}
                  </Form>
                  }
                </LoginBoxContainer>
                {(this.state.loading) && <LoadingContainer><Loader /></LoadingContainer>}
              </LoginContainer>
            </React.Fragment>
          </I18nextProvider>
        </Container>
      </Provider>
    );
  }
}
