// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text, Button, Box } from 'rebass';
import IconButton from 'web/client/app/components/IconButton';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import joi from 'joi';
import get from 'lodash.get';
import { email } from 'web/validation';
import SmsInput from 'web/client/app/components/SmsInput';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1101;
  width: 420px;
  padding: 15px 15px 30px;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border-radius: 0px; height: 100%`};
`;

const ModalBackground = styled(Fixed)`
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1101;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const ModalTitle = styled(Heading)`
  margin: 25px 20px 25px;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1.5em;
  font-weight: 500;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  text-align: center;
  padding: 0px 40px 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  color: ${props => props.theme.colors.textGrey};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  top: 15px;
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'unset';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SendBtnContainer = styled(Box)`
  margin-top: 20px;
  height: auto;
  margin-bottom: 20px;
  padding: 0px 26px;
`;

const TextContainer = styled(Flex)`
  padding: 0px 20px;
  .input-field-wrapper {
    width: 100%;
  }
 `;

const SendButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  border-radius: 6px !important;
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  float: right;
  width: 100%;
  height: 50px;
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'unset';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class ReceiptPopup extends Component {
  constructor (props) {
    super(props);
    const formatNumber = this.props.mobileNumber || this.props.loyaltyNumber || '';
    let emailAddress = this.getEmailAddress();
    this.state = {
      errorEmail: '',
      errorMobile: '',
      email: emailAddress,
      emailSent: false,
      mobile: formatNumber.replace(/\D/g, ''),
      isValidNumber: !!formatNumber,
      formatNumber,
      emailValid: false,
      loader: this.props.modalLoader || false,
      selectedCountry: this.props.selectedCountry || '',
      updatedNumber: this.props.mobileNumber || ''
    };
    this.onClickSend = this.onClickSend.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.handleSmsInfo = this.handleSmsInfo.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.sendReceipt = this.sendReceipt.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.getEmailAddress = this.getEmailAddress.bind(this);
  }

  componentDidMount () {
    document.getElementById('receipt-title') &&
      document.getElementById('receipt-title').focus();
  }

  getEmailAddress () {
    const { platformGuestProfile } = this.props;
    let entry = {};
    let addresses = platformGuestProfile && get(platformGuestProfile, 'gpBusinessCard.emailAddresses');
    if (addresses && addresses.length > 0) {
      entry = addresses.find(address => address.ordinal === 0);
    }
    return (entry && entry.emailAddress) || '';
  }

  handleSmsInfo (formatNumber, isValidNumber, selectedCountry, updatedNumber) {
    this.setState({
      mobile: formatNumber.replace(/[- )(]/g, ''),
      formatNumber,
      isValidNumber,
      selectedCountry,
      updatedNumber
    });
  }

  handleEmailChange (propertyName, inputValue) {
    this.setState({
      mobile: '',
      formatNumber: '',
      email: inputValue,
      errorEmail: !inputValue ? '' : this.state.errorEmail,
      errorMobile: '',
      emailValid: this.validateEmail(inputValue) != null
    });
  }

  validateEmail (value) {
    const { error } = joi.validate({ email: value }, email);
    return !error ? null : i18n.t('PAYMENT_SUCCESS_INVALID_EMAIL');
  }

  onClickSend () {
    this.props.acceptCapacityTime();
  }

  onClickClose () {
    this.props.accessible('receipt');
    this.props.closePopup();
  }

  sendReceipt () {
    const { type } = this.props;
    const { email, mobile, isValidNumber, updatedNumber, selectedCountry } = this.state;
    if (type === 'email') {
      if (email === '') {
        this.setState({ errorEmail: i18n.t('PAYMENT_SUCCESS_INVALID_EMAIL') });
        return false;
      } else {
        const emailError = this.validateEmail(email);
        this.setState({ errorEmail: emailError, errorMobile: '' });
        if (emailError != null) {
          return false;
        }
      }
    } else {
      if (!mobile || !isValidNumber) {
        this.setState({ errorMobile: i18n.t('PAYMENT_SUCCESS_INVALID_MOBILE') });
        return false;
      }
    }

    if (type === 'email' && email) {
      this.setState({ loader: true });
      this.props.sendEmail({ sendTo: email });
      this.onClickClose();
    } else if (mobile) {
      this.setState({ loader: true });
      this.props.sendSMS({ sendTo: `${updatedNumber}`, selectedCountry });
      this.onClickClose();
    }
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  render () {
    const { errorEmail, errorMobile, loader, email, emailValid, mobile, isValidNumber } = this.state;
    const { emailReceipt, textReceipt, type } = this.props;
    return (
      <Flex id='receipt-modal'>
        <ModalBackground className='receipt-modal-background'/>
        <ModalContainer className='receipt-modal-parent' role='dialog' onKeyDown={this.onEscape}>
          <ModalTitle className='modal-title' tabIndex={0} id='receipt-title'
            aria-label={`${type === 'email'
              ? emailReceipt && emailReceipt.headerText || i18n.t('RECEIPT_POPUP_EMAIL_TITLE')
              : textReceipt && textReceipt.headerText || i18n.t('RECEIPT_POPUP_SMS_TITLE')}`}>
            {type === 'email'
              ? (emailReceipt && emailReceipt.headerText) || <Trans i18nKey='RECEIPT_POPUP_EMAIL_TITLE'/>
              : (textReceipt && textReceipt.headerText) || <Trans i18nKey='RECEIPT_POPUP_SMS_TITLE'/>}
          </ModalTitle>
          <ModalText className='modal-text' tabIndex={0}
            aria-label={`${type === 'email'
              ? (emailReceipt && emailReceipt.instructionText) || i18n.t('RECEIPT_POPUP_EMAIL_INST')
              : (textReceipt && textReceipt.instructionText) || i18n.t('RECEIPT_POPUP_SMS_INST')}`}>
            {type === 'email'
              ? (emailReceipt && emailReceipt.instructionText) || <Trans i18nKey='RECEIPT_POPUP_EMAIL_INST'/>
              : (textReceipt && textReceipt.instructionText) || <Trans i18nKey='RECEIPT_POPUP_SMS_INST'/> }
          </ModalText>
          <TextContainer className='text-container'>
            {type === 'email'
              ? <FloatingLabelInput
                ariaLabel={i18n.t('PAYMENT_SUCCESS_EMAIL')}
                tabIndex={0}
                propertyName={<Trans i18nKey='PAYMENT_SUCCESS_EMAIL'/>}
                label={<Trans i18nKey='PAYMENT_SUCCESS_EMAIL'/>}
                value={email}
                error={errorEmail}
                callBack={this.handleEmailChange}
                clearIcon
                receipt
                inputType={'email'}
                placeHolder={<Trans i18nKey='EMAIL_ID_PLACEHOLDER'/>}/>
              : <SmsInput
                countryCodeList={this.props.countryCodeList}
                mobileNumber={this.props.mobileNumber}
                loyaltyNumber={this.props.loyaltyNumber}
                selectedCountry={this.props.selectedCountry}
                regionCode={this.props.regionCode}
                countryCode={this.props.countryCode}
                updateSmsInfo={this.handleSmsInfo}
                label={'PAYMENT_SUCCESS_MOBILE'}
                receiptSms
                errorMobile={errorMobile}
                errorText={'PAYMENT_SUCCESS_INVALID_MOBILE'}
                placeHolder={'PHONE_NUMBER_PLACEHOLDER'}
              />
            }
          </TextContainer>
          <SendBtnContainer width={[1]} >
            <SendButton
              className='send-button button'
              type='submit'
              disabled={loader || type === 'email' ? (!email || emailValid) : (!mobile || !isValidNumber)}
              onClick={!loader && this.sendReceipt}
              children={<Trans i18nKey='PAYMENT_SUCCESS_EMAIL_SEND'/>}
              role='button'
              tabIndex={loader || type === 'email'
                ? (!email || emailValid) : (!mobile || !isValidNumber) ? -1 : 0}
              aria-label={i18n.t('PAYMENT_SUCCESS_EMAIL_SEND')}
            />
          </SendBtnContainer>
          <CloseButton children='&#10005;' role='button' aria-label={i18n.t('EXIT_DIALOG')}
            tabIndex={0} disabled={loader} onClick={!loader && this.onClickClose} />
        </ModalContainer>
      </Flex>
    );
  };
}

export default ReceiptPopup;
