// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Heading, Provider, Text, Image, Button } from 'rebass';
import config from 'app.config';
import { I18nextProvider, Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const Container = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  height: auto;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const Header = styled(Heading)`
  color: #303030;
  font-weight: bold;
  font-size: 24px;
  flex-grow: 1;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InfoText = styled(Text)`
  margin-top: 10px;
  color: #303030;
  font-size: 16px;
  flex-grow: 1;
  text-align: center;
  font-weight: ${props => {
    if (props.normal) return '400';
    if (props.medium) return '500';
    return '400';
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SiteBox = styled(Flex)`
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
  max-width: 420px;
`;

const ImageBox = styled(Image)`
  flex-direction: column;
  max-width: 360px;
  max-height: 250px;
  margin: 120px 20px 30px 20px;
  @media screen and (max-width: 767px) {
    max-width: 300px;
    max-height: 200px;
    margin: 10px 20px 30px 20px;
  }
`;

const SendButton = styled(Button)`
  background: #0099FF;
  color: #FFFFFF;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  float: right;
  width: 100%;
  height: 50px;
  padding: 10px;
  margin: 40px 10px;
  text-transform: uppercase;
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  border: none;
  border-radius: 8px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonGroup = styled(Flex)`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export default class SiteDown extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true
    };
    this.onLanguageChanged = this.onLanguageChanged.bind(this);
  }

  componentDidMount () {
    i18n.on('loaded', this.onLanguageChanged);
  }

  onLanguageChanged (loaded) {
    this.setState({loading: false});
  }

  render () {
    return !this.state.loading && (
      <Provider theme={theme} style={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
        <Container>
          <I18nextProvider i18n={i18n} >
            <Announcements ariaLive='assertive'
              message={`${i18n.t('SITE_DOWN_HEADER')}${i18n.t('SITE_DOWN_LINE1')}${i18n.t('SITE_DOWN_LINE2')}`} />
            <SiteBox className='site-box'>
              <ImageBox className='image-box' src={`${config.webPaths.assets}pageLoadError.png`}/>
              <Flex
                className='flex-div'
                flexDirection='column'
                style={{ padding: 0, maxWidth: '30em', width: '100%' }}
              >
                <Header className='header' tabIndex={0} aria-label={i18n.t('SITE_DOWN_HEADER')}>
                  <Trans i18nKey='SITE_DOWN_HEADER'/>
                </Header>
                <InfoText medium='true' className='line-1' tabIndex={0} aria-label={i18n.t('SITE_DOWN_LINE1')}>
                  <Trans i18nKey='SITE_DOWN_LINE1'/>
                </InfoText>
                <InfoText normal='true' className='line-2' tabIndex={0} aria-label={i18n.t('SITE_DOWN_LINE2')}>
                  <Trans i18nKey='SITE_DOWN_LINE2'/>
                </InfoText>
              </Flex>
              <ButtonGroup>
                <SendButton
                  className='send-button'
                  type='submit'
                  role='button'
                  tabIndex={0} aria-label={i18n.t('SITE_DOWN_TRY_AGAIN')}
                  onClick={() => window.location.reload()}
                  children={<Trans i18nKey='SITE_DOWN_TRY_AGAIN'/>}
                />
              </ButtonGroup>
            </SiteBox>
          </I18nextProvider>
        </Container>

      </Provider>
    );
  }
}
