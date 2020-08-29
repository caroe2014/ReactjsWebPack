/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Text, Button } from 'rebass';
import { Trans } from 'react-i18next';
import RadioButton from 'web/client/app/components/RadioButton';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import { PHONE_NUMBER_FORMAT_REGEX,
  PHONE_NUMBER_PATTERN,
  CARD_NUMBER_FORMAT_REGEX,
  DEFAULT_LOYALTY_PIN_LENGTH
} from 'web/client/app/utils/constants';
import i18n from 'web/client/i18n';
import get from 'lodash.get';

const Container = styled(Flex)`
  align-items: center;
  max-width: 400px;
  padding: 0px 20px 0px 20px;
  flex-direction: column;
  background: #ffffff;
  width: 100%;
  ${props => props.theme.mediaBreakpoints.mobile`
    border: none;
    max-width: 100%; 
    height: auto;
    padding-left: 24px;
    padding-right: 24px;
  `};
  
`;

const LoyaltyButton = styled(Button)`
  background-color:  ${props => props.theme.colors.buttonControlColor};
  width: 100%;
  margin: 20px 0px;
  border-radius: 0;
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.nm};
  disabled: ${props => props.disabled}
  font-weight: 400;
  padding: 12px;
  text-transform: uppercase;
  min-width: 240px;
  height: 40px;
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 6px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:disabled{
    cursor: not-allowed;
  }
`;

const ButtonParent = styled(Flex)`
  justify-content: center;
  margin-top: 15px;
  width: 100%;
`;

const RadioButtonContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  .input-field-wrapper .input-text {
    border-bottom: 1px solid #7d7d7d;
  }
  .input-field-wrapper {
    margin-bottom: 0px;
    width: 100%;
  }
`;

const HeaderText = styled(Text)`
  width: 100%;
  word-break: break-word;
  font-weight: bold;
  font-size: 24px;
  color: ${props => props.theme.colors.primaryTextColor};
  margin: 38px 0px 20px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  ${props => props.theme.mediaBreakpoints.mobile`
    margin: 32px 0px 18px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionText = styled(Text)`
  width: 100%;
  word-break: break-word;
  font-size: 14px;
  color: ${props => props.theme.colors.secondaryTextColor};
  margin: 12px 0px 24px;
  text-align: center;
  padding-bottom: 10px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledText = styled(Text)`
  margin-left: 0px;
  color: ${props => props.theme.colors.secondaryTextColor};
  display: inline-block;
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 400;
  cursor: pointer;
  &.active {
    font-weight: 500;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const FetchAccountText = styled(StyledText)`
  margin: 0px 0px 10px 0px;
  text-align: center;
`;

class LoyaltyActivity extends Component {

  constructor (props) {
    super(props);
    const { loyaltyInfoMap, siteId, cartLoyaltyInfo } = this.props;
    const loyaltyInfoDetails = cartLoyaltyInfo || (loyaltyInfoMap && siteId && loyaltyInfoMap[siteId]);
    this.state = {
      error: '',
      pinError: '',
      showSubmitBtn: !!((loyaltyInfoDetails && loyaltyInfoDetails.loyaltyInfo)),
      selectedOption: (loyaltyInfoDetails && loyaltyInfoDetails.loyaltyInfo && loyaltyInfoDetails.selectedOption),
      formatNumber: (loyaltyInfoDetails && loyaltyInfoDetails.loyaltyInfo) || '',
      pin: ''
    };

    this.radioButtonLabel = {
      phone: i18n.t('LOYALTY_CAPTURE_PHONE'),
      card: i18n.t('LOYALTY_CAPTURE_CARD'),
      account: i18n.t('LOYALTY_CAPTURE_ACCOUNT')
    };

    this.loyaltyInputLabel = {
      phone: i18n.t('LOYALTY_CAPTURE_PHONE_NUMBER_LABEL'),
      card: i18n.t('LOYALTY_CAPTURE_CARD_NUMBER_LABEL'),
      account: i18n.t('LOYALTY_CAPTURE_ACCOUNT_NUMBER_LABEL'),
      pin: i18n.t('LOYALTY_CAPTURE_PIN_LABEL')
    };

    this.loyaltyPlaceholderLabel = {
      phone: i18n.t('LOYALTY_CAPTURE_PHONE_PLACEHOLDER'),
      card: i18n.t('LOYALTY_CAPTURE_CARD_PLACEHOLDER'),
      account: i18n.t('LOYALTY_CAPTURE_ACCOUNT_PLACEHOLDER'),
      pin: i18n.t('LOYALTY_CAPTURE_PIN_PLACEHOLDER')
    };

    this.loyaltyErrorMap = {
      phone: i18n.t('LOYALTY_CAPTURE_PHONE_ERROR'),
      card: i18n.t('LOYALTY_CAPTURE_CARD_ERROR'),
      account: i18n.t('LOYALTY_CAPTURE_ACCOUNT_ERROR'),
      pin: i18n.t('LOYALTY_CAPTURE_PIN_ERROR')
    };

    this.checkSelected = this.checkSelected.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handlePinChange = this.handlePinChange.bind(this);
  }

  checkSelected (type) {
    this.setState({ selectedOption: type, formatNumber: '', showSubmitBtn: false, error: '', pin: '' });
  }

  getFormatPhoneValue (inputValue) {
    const x = inputValue.replace(/\D/g, '').match(PHONE_NUMBER_FORMAT_REGEX);
    const formatNumber = !x[2]
      ? x[1] : x[1] + '-' + x[2] + (x[3] ? '-' + x[3] : '');
    return formatNumber;
  }

  getFormatNumberValue (inputValue) {
    const x = inputValue.replace(/\D/g, '').match(CARD_NUMBER_FORMAT_REGEX);
    const formatNumber = !x[2] ? x[1] : '';
    return formatNumber;
  }

  handleChange (propertyName, inputValue) {
    const formatNumber = propertyName === 'phone'
      ? this.getFormatPhoneValue(inputValue)
      : this.getFormatNumberValue(inputValue);
    let showSubmitBtn = !(!formatNumber ||
      (propertyName === 'phone' && formatNumber.replace(/[-\s]+/g, '').length < 10));
    this.setState({
      formatNumber,
      showSubmitBtn,
      error: !inputValue ? '' : this.state.error
    });
  }

  handlePinChange (propertyname, inputValue) {
    const { loyaltyPaymentConfiguration } = this.props;
    const configuredPinLength = parseInt(get(loyaltyPaymentConfiguration, 'accountEntry.pinLength') || DEFAULT_LOYALTY_PIN_LENGTH);

    if (inputValue.length <= configuredPinLength) {
      this.setState({
        pin: inputValue
      });
    }
  }

  onSubmit () {
    const { formatNumber, selectedOption, pin } = this.state;
    const { handleLoyaltyInfo, displayProfileId, siteId, loyaltyPaymentConfiguration } = this.props;
    const configuredPinLength = parseInt(get(loyaltyPaymentConfiguration, 'accountEntry.pinLength') || DEFAULT_LOYALTY_PIN_LENGTH);

    if (!formatNumber || (loyaltyPaymentConfiguration && !pin) || (selectedOption === 'phone' && formatNumber.replace(/[-\s]+/g, '').length < 10)) {
      this.setState({error: this.loyaltyErrorMap[selectedOption]});
      return;
    } else if (loyaltyPaymentConfiguration && pin.length !== configuredPinLength) {
      this.setState({pinError: `Pin should be ${configuredPinLength} digits`});
      return;
    }
    this.setState({
      error: '',
      pinError: ''
    });
    const loyaltyInquiryInfo = {
      formatNumber: formatNumber,
      selectedOption,
      pin: window.btoa(pin),
      siteId,
      displayProfileId
    };
    handleLoyaltyInfo(loyaltyInquiryInfo);
  }

  onCancel () {
    const { cancelLoyaltyInfo } = this.props;
    cancelLoyaltyInfo();
  }

  componentDidMount () {
    document.getElementById('loyalty-activity-header') &&
      document.getElementById('loyalty-activity-header').focus();
  }

  render () {
    const { loyaltyDetailsAccounts, fetching, fetchAccount, loyaltyDetails, loyaltyPaymentConfiguration } = this.props;
    const { error, formatNumber, selectedOption, showSubmitBtn, pin, pinError } = this.state;

    const filteredAccountDetails = loyaltyDetailsAccounts
      ? loyaltyDetailsAccounts.filter(accountItems => accountItems.enabled) : [];

    return (
      <ThemeProvider theme={theme}>
        <Container className='loyalty-activity-container'>
          <HeaderText className='loyalty-activity-header' id='loyalty-activity-header'
            tabIndex={0} role='header' aria-label={(loyaltyDetails && loyaltyDetails.header) || i18n.t('LOYALTY_CAPTURE_POINTS')}>
            {(loyaltyDetails && loyaltyDetails.header) || <Trans i18nKey='LOYALTY_CAPTURE_POINTS'/>}
          </HeaderText>
          {loyaltyDetails && loyaltyDetails.instructionText &&
            <InstructionText aria-label={loyaltyDetails.instructionText}
              tabIndex={0}
              className='instruction-text'>
              {loyaltyDetails.instructionText}
            </InstructionText>}
          <RadioButtonContainer role='radiogroup' className='loyalty-activity-radio-div'>
            {
              filteredAccountDetails.length > 0 &&
               filteredAccountDetails.map((accountItems, index) => (
                 <React.Fragment key={`account-${index}`}>
                   <RadioButton
                     className={`${accountItems.id}-radio`}
                     classDesc={`${accountItems.id}`}
                     label={this.radioButtonLabel[accountItems.id]}
                     type={accountItems.id}
                     capacityText
                     selectedOption={this.checkSelected}
                     selected={selectedOption === accountItems.id}
                     ariaChecked={selectedOption === accountItems.id}
                     tabIndex={0}
                     ariaLabel={this.radioButtonLabel[accountItems.id]}
                   />
                 </React.Fragment>
               ))}
            {
              selectedOption &&
              <React.Fragment>
                <FloatingLabelInput
                  ariaLabel={this.loyaltyInputLabel[selectedOption]}
                  propertyName={selectedOption}
                  label={this.loyaltyInputLabel[selectedOption]}
                  value={formatNumber}
                  error={error}
                  callBack={this.handleChange}
                  clearIcon
                  inputType={'tel'}
                  pattern={PHONE_NUMBER_PATTERN}
                  loyalty
                  disabled={fetching}
                  placeHolder={this.loyaltyPlaceholderLabel[selectedOption]}
                  tabIndex={0}
                />
              </React.Fragment>
            }
            {
              selectedOption && loyaltyPaymentConfiguration &&
              <FloatingLabelInput
                ariaLabel={this.loyaltyInputLabel['pin']}
                propertyName='pin'
                label={this.loyaltyInputLabel['pin']}
                value={this.state.pin}
                error={pinError}
                inputType='password'
                callBack={this.handlePinChange}
                clearIcon
                loyalty
                tabIndex={0}
              />
            }

          </RadioButtonContainer>
          {fetchAccount && <FetchAccountText tabIndex={0}
            aria-label={i18n.t('LOYALTY_FETCHING_ACCOUNT_LABEL')}>
            <Trans i18nKey='LOYALTY_FETCHING_ACCOUNT_LABEL'/>
          </FetchAccountText>}
          {selectedOption && showSubmitBtn && (!loyaltyPaymentConfiguration || pin.length > 0) &&
            <ButtonParent className='button-parent'>
              <LoyaltyButton
                className='submit-button'
                onClick={fetching ? this.onCancel : this.onSubmit}
                role='button'
                tabIndex={0}
                aria-label={fetching ? i18n.t('MODAL_CANCEL') : i18n.t('LOYALTY_CAPTURE_SUBMIT')}>
                {<Trans i18nKey={fetching ? 'MODAL_CANCEL' : 'LOYALTY_CAPTURE_SUBMIT'}/>}
              </LoyaltyButton>
            </ButtonParent>}
        </Container>

      </ThemeProvider>
    );
  }
}

export default LoyaltyActivity;
