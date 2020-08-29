// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Button, Text } from 'rebass';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import config from 'app.config';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import { MULTI_PASS_ORDER_GUID } from 'web/client/app/utils/constants';

const Container = styled(Flex)`
  flex-direction: column;
  margin: 70px auto 0px auto;
  height: auto;
  max-width: 100%;
  width: 100%;
  padding: 0px;
  flex: 1 1 auto;
  align-items: center;
`;

const ChildBox = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 0px;
  flex: 1 1 100%;
  margin-bottom: ${props => `${props['footer-height'] || 0}px`}
  background-color: ${props => props.theme.colors.light};
`;

const DetailedContainer = styled(Flex)`
  flex-direction: column;
  max-width: 75em;
  width: 100%;
  align-self: center;
  margin-top: 20px;
  align-items: center;
  padding-bottom: 20px;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
  `};
`;

const FindButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.nm};
  width: 250px;
  height: 40px;
  min-height: 40px;
  padding: 1px 0px 0px 0px;
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;;
  }
  text-align: center;
  border: none;
  border-radius: 20px;
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:disabled {
    background: ${props => props.theme.colors.hint};
    opacity: 1;
    cursor: not-allowed;
  }
  ${props => props.theme.mediaBreakpoints.mobile`
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    font-style: normal !important;
  `}
`;

const HeaderParent = styled(Flex)`
  position: relative;
  flex: 1 1 55%;
  align-items: center;
  width: 100%;
  min-height: 150px;
  background-color: ${props => props['background-color'] || '#fff'}
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
    font-size: 40px;
    text-align: center;
  `};
  .image {
    position: absolute;
  }
`;

const HeaderText = styled(Flex)`
  font-size: 40px;
  color: ${props => props['text-color']};
  font-weight: bold;
  word-break: break-word;
  align-items: center;
  justify-content: center;
  max-width: 75em;
  text-align: center;
  width: 100%;
  z-index: 1;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
    font-size: 40px;
  `};
`;

const SubHeaderText = styled(HeaderText)`
  max-width: 100%;
  background-color: ${props => props.theme.colors.addonBg};
  font-size: ${props => props.theme.fontSize.nm};
  padding: 15px 5px;
  justify-content: center;
  max-height: 50px;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
  `};
`;

const FindButtonDiv = styled(Flex)`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  ${props => props.theme.mediaBreakpoints.mobile`
    align-self: center;
    display: block;
  `}
`;

const InstructionText = styled(Flex)`
  flex-direction: column;
  max-width: 500px;
  align-items: left;
  justify-content: center;
  align-self: center;
  color: ${props => props.theme.colors.primaryTextColor};
  ${props => props.theme.mediaBreakpoints.mobile`
    align-items: left;
    padding: 0px 10px;
    max-width: 100%;
  `}
  &>div {
    padding: 10px 0px;
  }
`;

const Footer = styled(Flex)`
  flex-direction: column;
  position: fixed;
  bottom: 0;
  color: ${props => props.theme.colors.primaryTextColor};
  background-color: ${props => props.theme.colors.addonBg}
  padding: 15px 10px
  width: 100%;
  z-index: 1;
  align-items: center;
  .addtional-text {
    font-size: 12px;
    padding-top: 5px;
  }
  .table-check {
    font-size: 12px;
  }
  .table-check, .server-info {
    padding-bottom: 5px;
  }
`;

const FooterText = styled(Text)`
  font-size: 14px;
  max-width: 500px;
  text-align: center;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
  `}
`;

class OrderAtTable extends Component {

  constructor (props) {
    super(props);
    this.state = {
    };
    this.onFindFood = this.onFindFood.bind(this);
  }

  onFindFood () {
    const { selectSite, currentSite } = this.props;
    const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
    orderGuid && selectSite(currentSite.id, currentSite.displayProfileId);
  }

  render () {
    const { homeScreen, footer } = this.props.currentSite;
    const { currentSite, appConfig, igOrderProperties } = this.props;
    const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
    return (
      <ThemeProvider theme={theme}>
        <Container className='oaat-order'>
          <HeaderParent background-color={homeScreen.showImage ? '' : homeScreen.color}>
            <HeaderText
              className='header-text'
              text-color={homeScreen.welcomeTextColor || theme.colors.light}>
              {homeScreen.welcomeText || <Trans i18nKey='OATT_WELCOME_TEXT'/>}
            </HeaderText>
            {homeScreen.showImage && <UrlImageLoader
              src={config.getPOSImageURL(currentSite.id, homeScreen.backgroundImage, appConfig.tenantID)} />
            }
          </HeaderParent>
          <ChildBox footer-height={this.state.clientHeight}>
            <SubHeaderText className='sub-header-text'>{homeScreen.headerText ||
            <Trans i18nKey='OATT_HEADER_TEXT'/>}
            </SubHeaderText>
            <InstructionText>
              {homeScreen.instructionText ? homeScreen.instructionText.split('\n').map(data =>
                <Text>{data}</Text>) : <Trans i18nKey='OATT_INSTRUCTION_TEXT'/>}
            </InstructionText>
            <DetailedContainer className='detailed-container'>
              <FindButtonDiv className='find-button-div'>
                <FindButton
                  className='pay-button'
                  children={homeScreen.buttonText || <Trans i18nKey='OATT_BUTTON_TEXT'/>}
                  onClick={this.onFindFood}/>
              </FindButtonDiv>
            </DetailedContainer>
          </ChildBox>
          {footer && footer.isEnabled && <Footer innerRef={(e) => {
            this.footer = e;
            if (!this.state.clientHeight || (this.footer && this.footer.clientHeight !== this.state.clientHeight)) {
              this.setState({clientHeight: this.footer ? this.footer.clientHeight : 0});
            }
          }}>
            {/* {footer.showServerInfo && <FooterText className='server-info'>
              {`${i18n.t('OATT_SERVER_LABEL')} Kumar`}
            </FooterText>} */}
            {(footer.showTableInfo || footer.showCheckInfo) && <FooterText className='table-check'>
              {footer.showTableInfo && `${i18n.t('OATT_TABLE_LABEL')} ${(igOrderProperties && igOrderProperties.tableNumber) || '--'}${footer.showCheckInfo ? ' | ' : ''}`} {/* eslint-disable-line max-len */}
              {footer.showCheckInfo && `${i18n.t('OATT_CHECK_LABEL')} ${(igOrderProperties && igOrderProperties.orderNumber) || '--'}`}{/* eslint-disable-line max-len */}
            </FooterText>}
            {footer.additionalFooterText && <FooterText className='addtional-text'>
              {footer.additionalFooterText}
            </FooterText>}
          </Footer>}
        </Container>
      </ThemeProvider>
    );
  }
}

export default OrderAtTable;
