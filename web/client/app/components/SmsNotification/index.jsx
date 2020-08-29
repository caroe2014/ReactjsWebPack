// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Button, Text } from 'rebass';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import SmsInput from 'web/client/app/components/SmsInput';

const Container = styled(Flex)`
  align-items: center;
  margin: auto;
  max-width: 400px;
  padding-bottom: 20px;
  ${props => props.theme.mediaBreakpoints.desktop`margin-top: 170px;`};
  ${props => props.theme.mediaBreakpoints.tablet`margin-top: 170px;`};
  ${props => props.theme.mediaBreakpoints.mobile`
    margin-top: 120px; padding-bottom: 20px; 
    border: none;
    max-width: 100%; 
    height: inherit;
    padding-left: 10px;
    padding-right: 10px;
    background: ${props => props.theme.colors.light};
  `};
  flex-direction: column;
  width: 100%;
  margin-bottom: auto !important;
`;

const ChildBox = styled(Flex)`
  flex-direction: column;
  width: 100%;
  background: ${props => props.theme.colors.light};
  padding: 20px;
  ${props => props.theme.mediaBreakpoints.desktop`border: 1px solid lightgrey; margin-bottom: 20px`};
  ${props => props.theme.mediaBreakpoints.tablet`border: 1px solid lightgrey;`};
  ${props => props.theme.mediaBreakpoints.mobile`border: none; margin-top: 0px;`};
`;

const InputContainer = styled(Flex)`
  flex-direction: column;
  border-bottom: none;
  border-top: none;
  padding-top: 20px;
  width: 100%;
  align-self: center;
  margin-top: 20px;
  .input-field-wrapper {
    width: 100%;
  }
`;

const HeaderLabel = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  text-align: center;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  align-self: center;
  max-width: 360px;
  justify-content: center;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonParent = styled(Flex)`
  flex-direction: column;
  min-height: 60px;
`;

const Instructiontext = styled(Text)`
  text-align: center;
  color: ${props => props.theme.colors.secondaryTextColor};
  margin: 16px 0px 0px;
  font-size: 18px;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const PayButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.md};
  float: right;
  width: 100%;
  height: 60px;
  min-height: 60px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;;
  }
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SkipButton = styled(Button)`
  background: ${props => props.theme.colors.light};
  border: 0.5px solid ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.md};
  float: right;
  width: 100%;
  height: 60px;
  min-height: 60px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  margin: 15px auto 0 auto;
  border-radius: 0;
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class SmsNotification extends Component {

  constructor (props) {
    super(props);
    const formatNumber = this.props.mobileNumber || '';
    this.state = {error: '',
      mobileNumber: formatNumber.replace(/\D/g, ''),
      isValidNumber: !!formatNumber,
      formatNumber,
      selectedCountry: this.props.selectedCountry || '',
      updatedNumber: this.props.mobileNumber || ''
    };
    this.skipSms = this.skipSms.bind(this);
    this.continuePay = this.continuePay.bind(this);
    this.handleSmsInfo = this.handleSmsInfo.bind(this);
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  handleSmsInfo (formatNumber, isValidNumber, selectedCountry, updatedNumber) {
    this.setState({
      mobileNumber: formatNumber.replace(/[- )(]/g, ''),
      formatNumber,
      isValidNumber,
      selectedCountry,
      updatedNumber
    });
  }

  continuePay () {
    const { mobileNumber, selectedCountry, isValidNumber, updatedNumber } = this.state;
    const { onContinuePay } = this.props;
    if (!mobileNumber || !isValidNumber) {
      this.setState({error: i18n.t('PHONE_NUMBER_ERROR')});
      return;
    }
    this.setState({error: ''});
    onContinuePay(`${updatedNumber}`, selectedCountry);
  }

  skipSms () {
    const { onContinuePay } = this.props;
    this.setState({error: '', mobileNumber: '', formatNumber: ''});
    onContinuePay('');
  }

  render () {
    const { isMobileNumberRequired, smsInstructionText, deliveryDestination, smsHeaderText } = this.props;
    const { isValidNumber } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Container className='phone-number-container'>
          <ChildBox className='child-box' id='sms-child'>
            <HeaderLabel className='header-text' tabIndex={0} aria-label={smsHeaderText || i18n.t('SMS_HEADER_TEXT')}>
              {smsHeaderText || <Trans i18nKey='SMS_HEADER_TEXT'/>}
            </HeaderLabel>
            {smsInstructionText && <Instructiontext className='instruction-text'
              tabIndex={0}
              role='form'
              ariaLabel={smsInstructionText}>
              {smsInstructionText}
            </Instructiontext>}
            <InputContainer>
              <SmsInput
                countryCodeList={this.props.countryCodeList}
                mobileNumber={this.props.mobileNumber}
                selectedCountry={this.props.selectedCountry}
                regionCode={this.props.regionCode}
                countryCode={this.props.countryCode}
                updateSmsInfo={this.handleSmsInfo}
                label={'PHONE_NUMBER_LABEL'}
                errorText={'PHONE_NUMBER_ERROR'}
                placeHolder={'PHONE_NUMBER_PLACEHOLDER'}
              />
              <ButtonParent>
                <PayButton
                  className='pay-button'
                  children={<Trans i18nKey={deliveryDestination ? 'NEXT_LABEL' : 'DELIVERY_LOCATION_CONTINUE_PAY'} />}
                  onClick={this.continuePay}
                  role='button'
                  tabIndex={!isValidNumber}
                  aria-label={deliveryDestination ? i18n.t('NEXT_LABEL') : i18n.t('DELIVERY_LOCATION_CONTINUE_PAY')}
                  disabled={!isValidNumber}
                />
                {!isMobileNumberRequired && <SkipButton
                  className='skip-btn'
                  role='button'
                  tabIndex={0}
                  aria-label={i18n.t('SKIP_LABEL')}
                  children={<Trans i18nKey='SKIP_LABEL'/>}
                  onClick={this.skipSms}/>}
              </ButtonParent>
            </InputContainer>
          </ChildBox>
        </Container>
      </ThemeProvider>
    );
  }
}

export default SmsNotification;
