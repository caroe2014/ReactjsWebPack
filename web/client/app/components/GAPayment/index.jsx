// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text, Input } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import SecondaryButton from 'web/client/app/components/SecondaryButton';
import IconButton from 'web/client/app/components/IconButton';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import { currencyLocaleFormat, formatGAAccountNumber } from 'web/client/app/utils/NumberUtils';
import config from 'app.config';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import get from 'lodash.get';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import GAPaymentOptions from './GAPaymentOptions';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const StyledFloatingLabelInput = styled(FloatingLabelInput)`
  margin-top: 10px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionImageContainer = styled(Flex)`
  width: auto;
  max-width: 300px;
  height: auto;
  margin: auto;
  margin-bottom: 50px;
`;

const AccountsImageContainer = styled(InstructionImageContainer)`
  margin: 20px 0px;
`;

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1100;
  width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; height: 100%`};
`;

const ModalBackground = styled(Fixed)`
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const ModalTitle = styled(Heading)`
  margin: 25px 0 0 0;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 16px;
  text-align: center;
  padding: 0px 10px;
  margin: 20px auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const GAFetchFailedText = styled(ModalText)`
  margin: 0px auto;
  color: ${props => props.theme.colors.error};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalAccountText = styled(ModalText)`
  font-weight: bold;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalErrorText = styled(ModalText)`
color: ${props => props.theme.colors.error};
&:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalTotalText = styled(ModalText)`
  font-weight: bold;
  margin: 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalRemainingText = styled(ModalText)`
  font-weight: bold;
  margin: 20px;
  color: ${props => props.theme.colors.buttonControlColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalBody = styled(Flex)`
  flex-direction: column;
  width: 85%;
  margin: 0 auto;
  flex-shrink: 0;
  padding: 15px 15px 0px;
`;

const ModalFooter = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  margin-top: 35px;
  width: 80%;
  margin 0 auto;
  flex-shrink: 0;
  padding: 15px;
`;

const Footer = styled(Flex)`
  border-top: 2px solid lightgrey;
  margin: 10px 0px 0px 0px;
  position: sticky;
  bottom: 0;
  min-height: 50px;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  background-color: white;
  justify-content: ${props => {
    if (props.remaining) return 'space-between';
    return 'center';
  }};
`;

const MainButton = styled(props => <PrimaryButton {...props} />)`
  border-radius: 4px;
  font-size: 16px;
  margin: 10px auto;
  padding: 15px 0;
  text-align: center;
  font-weight: bold;
  height: 40px;
  line-height: 10px;
  &:disabled {
    cursor: auto;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const GaProcessButton = styled(MainButton)`
  margin: 20px auto 10px;
`;

const CancelButton = styled(props => <SecondaryButton {...props} />)`
  border-radius: 4px;
  font-size: 16px;
  margin: 10px auto;
  padding: 15px 0;
  text-align: center;
  font-weight: bold;
  border: none;
  height: 40px;
  line-height: 10px;
  width: auto;
  box-shadow: none !important;
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'pointer';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  color: #1F1F1F;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  left: 20px;
  top: 15px;
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'pointer';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'pointer';
  }};
`;

const StyledLoadingComponent = styled(LoadingComponent)`
  height: 40px;
  width: 40px; 
`;

const CurrencyParent = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  font-weight: bold;
  .left-div{
    flex: 1.5 1 auto;
    justify-content: flex-start;
    .display-text{
      padding-left: 0px;
      margin: 20px 0px;
      text-align: left;
    }
  }
  .right-div{
    flex: 1 1 75%;
    justify-content: flex-end;
    .display-text{
      padding-right: 0px;
      margin: 20px 0px;
    }
  }
`;

const CurrencyDiv = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const CustomFlex = styled(Flex)`
  border-bottom: 1px solid lightgrey;
  margin: 30px auto 0px;
  justify-content: center;
  width: 50%;
  align-items: center;
  align-self: center;
  align-items: center;
  justify-content: center;
  &>input::-ms-clear {
    display: none;
  }
  &>input::-webkit-inner-spin-button,
  &>input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'unset';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'auto';
  }};
`;

const CurrencyText = styled(Text)`
  height: auto;
  color: darkgrey;
  font-size: 24px;
  margin-right: 0px;
  margin-left: -4px;
  color: ${props => {
    if (props.value) return `${props.theme.colors.primaryTextColor}`;
    return `darkgrey`;
  }};
${props => props.theme.mediaBreakpoints.mobile`
  font-size: 20px;
  margin-right: 0px;
  margin-left: 0px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CustomAmountInput = styled(Input)`
  padding: 0px;
  height: auto;
  &::placeholder {
    color: #BCBCBC;
    opacity: 1;
  }
  width: 65%;
  width:  ${props => {
    if (props.customamountinput) {
      return `${((props.customamountinput.length + 1 -
        (props.customamountinput.includes('.') ? 1 : 0)) * 16) -
        12}px`;
    }
    return `15px`;
  }};
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 24px;
  text-align: center;
  box-shadow: none;
  -moz-appearance: textfield;
  ${props => props.theme.mediaBreakpoints.mobile`
  font-size: 20px;
  `};
  opacity: ${props => {
    if (props.disabled) return '0.6 !important';
    return 'unset';
  }};
  cursor: ${props => {
    if (props.disabled) return 'not-allowed';
    return 'auto';
  }};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class GAPaymentModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      accountNumber: '',
      secondaryVerificationValue: '',
      indexOfSelectedGAAccount: null,
      sameAccountError: false,
      customAmountInput: (this.props.selectedGaOption && this.props.selectedGaOption.amountToBeCharged) || ''
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getGAAccountInfo = this.getGAAccountInfo.bind(this);
    this.gaAccountClicked = this.gaAccountClicked.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.disableContinueButton = this.disableContinueButton.bind(this);
    this.baseState = this.state;
    this.showTenderBalance = this.showTenderBalance.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleGaPayment = this.handleGaPayment.bind(this);
    this.setAutoFillAmount = this.setAutoFillAmount.bind(this);
    this.onRemovePayment = this.onRemovePayment.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.processSingleGAPayment = this.processSingleGAPayment.bind(this);
  }

  componentDidMount () {
    this.setAutoFillAmount();
    document.getElementById('ga-modal-title') &&
      document.getElementById('ga-modal-title').focus();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.saleData !== this.props.saleData) {
      this.props.history.push('/paymentSuccess');
    }
    if (prevProps.accountPopupFlag !== this.props.accountPopupFlag && this.props.multiPaymentEnabled) {
      this.resetState();
    }
    if (prevProps.fetchingGAAccountInfo !== this.props.fetchingGAAccountInfo) {
      this.setAutoFillAmount();
    }
    if ((prevProps.authResponse !== this.props.authResponse && this.props.authResponse) ||
      (prevProps.removeGAPaymentResponse !== this.props.removeGAPaymentResponse && this.props.removeGAPaymentResponse)) { // eslint-disable-line max-len
      this.resetState();
    }
  }

  handleClose () {
    const { showTimeout, clearIdleFlags, history } = this.props;
    // clear idle and timeout flags
    clearIdleFlags();
    if (showTimeout) {
      // redirect to siteList and reload fresh data
      history.replace('/');
      window.location.reload();
    }
  }

  handleChange (propertyName, inputValue) {
    this.setState({
      [propertyName]: inputValue,
      sameAccountError: false
    });
    !this.props.multiPaymentEnabled && this.props.clearGAState();
    this.props.clearGAErrors();
  }

  getGAAccountInfo () {
    const { getGAAccountInfo, gaPaymentConfig, gaAccountsList, fetchingAccountInfo, gaAccountConfig } = this.props;
    const { accountNumber, secondaryVerificationValue } = this.state;

    if (fetchingAccountInfo) return;
    if (gaAccountsList.includes(accountNumber)) {
      this.setState({ sameAccountError: true });
      return;
    }
    if (!this.props.open && this.props.multiPaymentEnabled) {
      this.props.accessible('genericAuthorization');
    }
    getGAAccountInfo(formatGAAccountNumber(gaAccountConfig, accountNumber), gaPaymentConfig.secondaryVerificationType,
      secondaryVerificationValue);
  }

  gaAccountClicked (type) {
    const { getGAAccountInquiryInfo, gaAccountInfo, setSelectedIndexWithoutInquiry } = this.props;

    const index = gaAccountInfo.accountAssociatedGaTenders.findIndex(item => item.gaTenderName === type);

    if (!gaAccountInfo.accountAssociatedGaTenders[index].remainingBalance) {
      getGAAccountInquiryInfo(index);
    } else {
      setSelectedIndexWithoutInquiry(index);
    }
  }

  processSingleGAPayment () {
    !this.props.authorizeGAPaymentError && this.props.accessible('genericAuthorization');
    this.props.authorizeGAPayment();
  }

  onModalClose () {
    const { fetchingAuthResponse, removingGaAuth } = this.props;
    if (fetchingAuthResponse || removingGaAuth) return;
    this.setState(this.baseState);
    this.props.onCancel();
    this.props.clearGAErrors();
    this.props.resetSelectedAccount();
  }

  resetState () {
    this.setState(this.baseState);
    this.props.clearGAErrors();
    this.props.resetSelectedAccount();
  }

  disableContinueButton () {
    const { gaAccountInfo, indexOfSelectedGAPaymentType,
      selectedGaOption, multiPaymentEnabled, gaPaymentConfig, totalWithTip, remaining } = this.props;

    const promptPaymentEnabled = multiPaymentEnabled && gaPaymentConfig.promptPayment
      ? (selectedGaOption.limitOnAccount
        ? gaPaymentConfig.promptPayment.isDecliningBalanceEnabled
        : gaPaymentConfig.promptPayment.isIncliningBalanceEnabled)
      : false;

    const promptText = this.state.customAmountInput;

    const remainingTotal = remaining || totalWithTip;

    let selectedTender = selectedGaOption;
    let hasEnoughFunds;
    if (multiPaymentEnabled && promptPaymentEnabled) {
      hasEnoughFunds = (parseFloat(promptText) > 0 && (!selectedTender.limitOnAccount ||
        parseFloat(promptText) <= get(selectedTender, 'remainingBalance.amount', 0)));
    } else if (multiPaymentEnabled) {
      hasEnoughFunds = selectedTender &&
      (!selectedTender.limitOnAccount || (get(selectedTender, 'remainingBalance.amount', 0)) > 0);
    } else {
      const tenders = gaAccountInfo.accountAssociatedGaTenders;
      selectedTender = tenders[indexOfSelectedGAPaymentType];
      hasEnoughFunds = selectedTender &&
      (!selectedTender.limitOnAccount || (
        get(selectedTender, 'remainingBalance.amount', 0) > 0 &&
        !(get(selectedTender, 'remainingBalance.amount', 0) < remainingTotal)
      ));
    }

    return !selectedTender || !selectedTender.remainingBalance || !hasEnoughFunds;
  }

  setAutoFillAmount () {
    const { selectedGaOption, remaining, totalWithTip } = this.props;

    const remainingTotal = remaining || totalWithTip;
    const actualAccountBalance = selectedGaOption ? (selectedGaOption.limitOnAccount
      ? selectedGaOption.remainingBalance && selectedGaOption.remainingBalance.amount
      : remainingTotal) : '0.0';

    const autoFillAmount = selectedGaOption && selectedGaOption.amountToBeCharged
      ? parseFloat(selectedGaOption.amountToBeCharged).toFixed(2)
      : (parseFloat(remainingTotal) < parseFloat(actualAccountBalance)
        ? parseFloat(remainingTotal) : parseFloat(actualAccountBalance));
    this.setState({ customAmountInput: parseFloat(autoFillAmount).toFixed(2) });
  }

  showTenderBalance (gaTenderAccount) {
    const { currencyDetails } = this.props;

    if (gaTenderAccount.limitOnAccount) {
      return currencyLocaleFormat(gaTenderAccount.remainingBalance.amount, currencyDetails);
    } else {
      return currencyLocaleFormat(gaTenderAccount.chargeToDate.amount, currencyDetails);
    }

  }

  handleUserInput (e) {
    const value = e.target.value;
    var reg = /^\d{1,4}$|^\d{1,4}\.\d{1,2}$|^\d{1,4}\.$|^0\.$|^0$|^[1-9]\d{1,2}\.$|^\.\d{1,2}$|^0\.\d{1,2}$|^[1-9]\d{1,2}\.\d{1,2}$/; // eslint-disable-line max-len
    if (e.target.value === '.') {
      this.setState({ customAmountInput: value });
    } else {
      if (e.target.value) {
        reg.exec(value) && this.setState({ customAmountInput: value });
      } else {
        this.setState({ customAmountInput: '' });
        this.customAmount.value = '';
      }
    }
  }

  handleGaPayment () {
    const { multiPaymentEnabled, selectedGaOption, gaPaymentConfig,
      authorizeGaSplitPayment, authorizeGAPayment, totalWithTip, remaining,
      fetchingAuthResponse, removingGaAuth, getGAAccountError, getGAAccountInquiryError
      , authorizeGAPaymentError, removeGaPaymentError } = this.props;

    if (fetchingAuthResponse || removingGaAuth) return;

    const previousAmountDeducted = selectedGaOption.amountToBeCharged;

    const promptPaymentEnabled = gaPaymentConfig.promptPayment
      ? (selectedGaOption.limitOnAccount
        ? gaPaymentConfig.promptPayment.isDecliningBalanceEnabled
        : gaPaymentConfig.promptPayment.isIncliningBalanceEnabled)
      : false;
    let amountFromBalance;
    if (multiPaymentEnabled) {
      const remainingTotal = parseFloat(remaining || totalWithTip);
      let actualAccountBalance = selectedGaOption.limitOnAccount ? selectedGaOption.remainingBalance.amount
        : selectedGaOption.chargeToDate.amount;
      actualAccountBalance = parseFloat(actualAccountBalance) > remainingTotal
        ? remainingTotal : parseFloat(actualAccountBalance);

      let actualPromptValue = parseFloat(this.state.customAmountInput) > remainingTotal
        ? remainingTotal : parseFloat(this.state.customAmountInput);

      if (selectedGaOption.amountToBeCharged) {
        let remainingTemp = parseFloat(remaining) + parseFloat(selectedGaOption.amountToBeCharged);

        actualPromptValue = parseFloat(this.state.customAmountInput) > parseFloat(remainingTemp)
          ? parseFloat(remainingTemp) : parseFloat(this.state.customAmountInput);
      }

      amountFromBalance = promptPaymentEnabled ? actualPromptValue
        : actualAccountBalance;
      const isAmountModified = previousAmountDeducted && parseFloat(previousAmountDeducted) !== parseFloat(amountFromBalance); // eslint-disable-line max-len

      const isLastPayment = remainingTotal <= parseFloat(amountFromBalance);
      !getGAAccountError && !this.state.sameAccountError &&
        !getGAAccountInquiryError && !authorizeGAPaymentError &&
        !removeGaPaymentError && this.props.accessible('genericAuthorization');
      authorizeGaSplitPayment(selectedGaOption, parseFloat(amountFromBalance).toFixed(2), isAmountModified, isLastPayment); // eslint-disable-line max-len
    } else {
      !getGAAccountError && !this.state.sameAccountError &&
        !getGAAccountInquiryError && !authorizeGAPaymentError &&
        !removeGaPaymentError && this.props.accessible('genericAuthorization');
      authorizeGAPayment();
    }

  }

  onRemovePayment () {
    const { fetchingAuthResponse, removingGaAuth } = this.props;
    if (fetchingAuthResponse || removingGaAuth) return;
    this.props.accessible('genericAuthorization');
    this.props.removeGaSplitPayment(this.props.selectedGaOption);
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  render () {
    const { selectedGaOption, totalWithTip, remaining, currencyDetails,
      gaPaymentConfig, getGAAccountError, getGAAccountInquiryError, authorizeGAPaymentError,
      fetchingAccountInfo, fetchingAuthResponse, contextId, tenantId, idleFlag, appError,
      showGetAccount, showAccountInfo, fetchingGAAccountInfo, gaAccountInfo, multiPaymentEnabled,
      removeGaPaymentError, removingGaAuth, indexOfSelectedGAPaymentType} = this.props;
    const { secondaryVerificationType, secondaryVerificationLabelText } = gaPaymentConfig;
    const { accountNumber, secondaryVerificationValue } = this.state;
    const disableShowAccountsButton = accountNumber.length === 0 ||
    (secondaryVerificationType !== 'NONE' && secondaryVerificationValue.length === 0);
    const instructionImageUrl = config.getPOSImageURL(contextId, gaPaymentConfig.instructionImage, tenantId);
    const currencyLocale = currencyLocaleFormat(0, currencyDetails).charAt(0) === currencyDetails.currencySymbol;

    return (
      <React.Fragment>
        {(showGetAccount || showAccountInfo) && !idleFlag && !appError && (
          <Flex className='ga-modal' id='ga-modal' >
            <ModalBackground />
            <ModalContainer className='modal-container' onKeyDown={this.onEscape} role='dialog'>
              <div>
                <ModalBody className='modal-body'>
                  <ModalTitle className='modal-title' id='ga-modal-title'
                    tabIndex={0} aria-label={gaPaymentConfig.displayLabel || i18n.t('GA_TITLE')}>
                    {gaPaymentConfig.displayLabel || <Trans i18nKey='GA_TITLE'/>}
                  </ModalTitle>
                  {showGetAccount && multiPaymentEnabled &&
                    <React.Fragment>
                      {(fetchingAccountInfo || fetchingAuthResponse || removingGaAuth) &&
                      <Announcements message={i18n.t('PROCESSING_TEXT')} />}
                      {gaPaymentConfig.instructionText &&
                      <ModalText className='instruction-text'
                        tabIndex={0}
                        aria-label={gaPaymentConfig.instructionText}>
                        {gaPaymentConfig.instructionText}
                      </ModalText>
                      }
                      {
                        gaPaymentConfig.instructionImage &&
                        <InstructionImageContainer className='instruction-image-container'>
                          <UrlImageLoader src={instructionImageUrl} alt=''/>
                        </InstructionImageContainer>
                      }

                      <StyledFloatingLabelInput
                        className='styled-floating-label-input accountNumber'
                        propertyName='accountNumber'
                        ariaLabel={gaPaymentConfig.accountNumberLabelText}
                        label={gaPaymentConfig.accountNumberLabelText}
                        value={accountNumber}
                        callBack={this.handleChange}
                        clearIcon
                        tabIndex={0}
                      />

                      {
                        secondaryVerificationType !== 'NONE' &&
                        <StyledFloatingLabelInput
                          className='styled-floating-label-input secondaryVerification'
                          propertyName='secondaryVerificationValue'
                          ariaLabel={secondaryVerificationLabelText}
                          label={secondaryVerificationLabelText}
                          value={secondaryVerificationValue}
                          callBack={this.handleChange}
                          clearIcon
                          tabIndex={0}
                        />
                      }
                      {
                        <MainButton
                          className='main-btn'
                          onClick={this.getGAAccountInfo}
                          disabled={disableShowAccountsButton}
                          tabIndex={disableShowAccountsButton ? -1 : 0}
                          style={{ padding: '0px 0px 3px 0px' }}>
                          {
                            fetchingAccountInfo
                              ? <LoadingComponent
                                className='loading-cont'
                                color='white'
                                containerHeight='100%'
                                containerWidth='100%'
                                aria-label={i18n.t('PROCESSING_TEXT')}
                                height='25px'
                                width='25px'
                                borderSize={2}
                                style={{ justifyContent: 'center' }}
                              />
                              : <div className='submit-btn-account-fetch'>
                                <Trans i18nKey='GA_CONFIRM_BUTTON'/>
                              </div>
                          }
                        </MainButton>
                      }
                      {
                        getGAAccountError &&
                        <ModalErrorText className='error-text'
                          tabIndex={0}
                          aria-live='polite'
                          aria-label={i18n.t(`${getGAAccountError}`)}>
                          <Trans i18nKey={`${getGAAccountError}`}/>
                        </ModalErrorText>
                      }

                      {this.state.sameAccountError && <ModalErrorText
                        tabIndex={0}
                        aria-live='polite'
                        aria-label={i18n.t('GA_ACCOUNT_EXISTS')}>
                        <Trans i18nKey='GA_ACCOUNT_EXISTS'/>
                      </ModalErrorText>}
                    </React.Fragment>
                  }
                  {showAccountInfo &&
                    <React.Fragment>
                      <ModalAccountText className='account-text'
                        tabIndex={0}
                        aria-label={`${i18n.t('GA_ACCOUNT_LABEL')} ${selectedGaOption.account}`}>
                        <Trans i18nKey='GA_ACCOUNT_LABEL'/>{selectedGaOption.account}
                      </ModalAccountText>

                      <CurrencyParent className='currency-parent'>
                        <CurrencyDiv className='left-div'>
                          <ModalText className='display-text'
                            tabIndex={0}
                            aria-label={`${i18n.t('SELECTED_ACCOUNT')}${selectedGaOption.displayLabel}`}>
                            {selectedGaOption.displayLabel}
                          </ModalText>
                        </CurrencyDiv>
                        <CurrencyDiv className='right-div'>
                          {fetchingGAAccountInfo && !selectedGaOption.remainingBalance
                            ? <StyledLoadingComponent
                              className='loading-div'
                              height='25px'
                              width='25px'
                              borderSize={2}
                            />
                            : selectedGaOption.remainingBalance && <ModalText className='display-text'
                              tabIndex={0}
                              aria-label={`${i18n.t('REMAINING_BALANCE')}
                              ${this.showTenderBalance(selectedGaOption, currencyDetails)}`}>
                              { this.showTenderBalance(selectedGaOption, currencyDetails) }
                            </ModalText>
                          }
                        </CurrencyDiv>
                      </CurrencyParent>

                      {multiPaymentEnabled && selectedGaOption.remainingBalance && gaPaymentConfig.promptPayment &&
                      (selectedGaOption.limitOnAccount
                        ? gaPaymentConfig.promptPayment.isDecliningBalanceEnabled
                        : gaPaymentConfig.promptPayment.isIncliningBalanceEnabled) &&
                        <CustomFlex
                          className='custom-flex'
                          disabled={fetchingGAAccountInfo && !selectedGaOption.remainingBalance}
                        >
                          {currencyLocale &&
                          <CurrencyText className='currency-text' value={this.state.customAmountInput}
                            tabIndex={0}
                            aria-label={`${currencyDetails.currencySymbol} ${this.state.customAmountInput}`}>
                            {currencyDetails.currencySymbol}
                          </CurrencyText>
                          }
                          <CustomAmountInput
                            innerRef={(e) => { this.customAmount = e; }}
                            className='custom-amount-input-field'
                            type='number'
                            disabled={fetchingGAAccountInfo && !selectedGaOption.remainingBalance}
                            customamountinput={this.state.customAmountInput}
                            autoFocus
                            onChange={(e) => this.handleUserInput(e)}
                            onKeyPress={(e) => (e.which === 45 || e.which === 43 ||
                            e.keyCode === 107 || e.keyCode === 109) &&
                            e.preventDefault()}
                            value={this.state.customAmountInput}
                            tabIndex={fetchingGAAccountInfo && !selectedGaOption.remainingBalance ? -1 : 0}
                            aria-label={`${i18n.t('AMOUNT_PAYABLE')}${this.state.customAmountInput}`}
                          />
                          {!currencyLocale &&
                          <CurrencyText className='currency-text' value={this.state.customAmountInput}
                            tabIndex={0}
                            aria-label={`${currencyDetails.currencySymbol} ${this.state.customAmountInput}`}>
                            {currencyDetails.currencySymbol}
                          </CurrencyText>
                          }
                        </CustomFlex>
                      }

                    </React.Fragment>
                  }

                  {showGetAccount && !multiPaymentEnabled &&
                  <React.Fragment>
                    <ModalText className='instruction-text'
                      tabIndex={gaPaymentConfig.instructionText ? 0 : -1}
                      aria-label={gaPaymentConfig.instructionText}>
                      {gaPaymentConfig.instructionText}
                    </ModalText>
                    {
                      gaPaymentConfig.instructionImage &&
                      <AccountsImageContainer className='instruction-image-container'>
                        <UrlImageLoader src={instructionImageUrl} alt=''/>
                      </AccountsImageContainer>
                    }
                    <StyledFloatingLabelInput
                      className='styled-floating-label-input accountNumber'
                      propertyName='accountNumber'
                      ariaLabel={gaPaymentConfig.accountNumberLabelText}
                      label={gaPaymentConfig.accountNumberLabelText}
                      value={(!multiPaymentEnabled && this.props.accountNumber) || accountNumber}
                      callBack={this.handleChange}
                      clearIcon
                    />
                    {
                      secondaryVerificationType !== 'NONE' &&
                      <StyledFloatingLabelInput
                        className='styled-floating-label-input secondaryVerification'
                        propertyName='secondaryVerificationValue'
                        ariaLabel={secondaryVerificationLabelText}
                        label={secondaryVerificationLabelText}
                        value={(!multiPaymentEnabled && this.props.secondaryVerificationValue) ||
                              secondaryVerificationValue}
                        callBack={this.handleChange}
                        clearIcon
                        tabIndex={0}
                      />
                    }
                    {
                      !gaAccountInfo && !getGAAccountError &&
                      <MainButton
                        className='main-btn'
                        onClick={this.getGAAccountInfo}
                        disabled={disableShowAccountsButton}
                        tabIndex={disableShowAccountsButton ? -1 : 0}
                        style={{ padding: '0px 0px 3px 0px' }}>
                        {
                          fetchingAccountInfo
                            ? <LoadingComponent
                              className='loading-cont'
                              color='white'
                              containerHeight='100%'
                              containerWidth='100%'
                              aria-label={i18n.t('PROCESSING_TEXT')}
                              height='25px'
                              width='25px'
                              borderSize={2}
                              style={{ justifyContent: 'center' }}
                            />
                            : <div className='submit-btn-account-fetch'>
                              <Trans i18nKey='GA_SHOW_ACCOUNTS_BUTTON'/>
                            </div>
                        }
                      </MainButton>
                    }
                    { getGAAccountError &&
                    <GAFetchFailedText
                      className='error-text'
                      aria-live='polite'
                      tabIndex={0} aria-label={i18n.t(`${getGAAccountError}`)}>
                      <Trans i18nKey={getGAAccountError}/></GAFetchFailedText>
                    }
                    { gaAccountInfo &&
                    <React.Fragment>
                      <GAPaymentOptions
                        gaAccountList={gaAccountInfo.accountAssociatedGaTenders}
                        onGAAccountSelected={this.gaAccountClicked}
                        indexOfSelectedGAAccount={indexOfSelectedGAPaymentType}
                        currencyDetails={currencyDetails}
                        total={totalWithTip}
                        getGAAccountInquiryError={getGAAccountInquiryError}
                        fetchingGAAccountInfo={fetchingGAAccountInfo}
                      />
                      <GaProcessButton
                        onClick={this.processSingleGAPayment}
                        className='main-btn'
                        disabled={this.disableContinueButton()}
                        style={{ padding: '0px 0px 3px 0px' }}
                        tabIndex={this.disableContinueButton() ? -1 : 0}
                      >
                        {
                          fetchingAuthResponse
                            ? <LoadingComponent
                              className='loading-cont'
                              color='white'
                              containerHeight='100%'
                              containerWidth='100%'
                              aria-label={i18n.t('PROCESSING_TEXT')}
                              height='25px'
                              width='25px'
                              borderSize={2}
                              style={{ justifyContent: 'center' }}
                            />
                            : <div className='submit-btn-accounts-list'>
                              <Trans i18nKey='GA_CONTINUE_BUTTON'/>
                            </div>
                        }
                      </GaProcessButton>
                      { authorizeGAPaymentError &&
                      <ModalText
                        aria-live='polite'
                        tabIndex={0}
                        aria-label={i18n.t(`${authorizeGAPaymentError}`)}>
                        <Trans i18nKey={authorizeGAPaymentError}/></ModalText>
                      }
                    </React.Fragment>
                    }
                  </React.Fragment>
                  }
                </ModalBody>
                <ModalFooter className='modal-footer'>
                  {showAccountInfo &&
                    <React.Fragment>
                      {
                        selectedGaOption &&
                        <React.Fragment>
                          <MainButton
                            className='ga-main-btn'
                            onClick={this.handleGaPayment}
                            disabled={this.disableContinueButton()}
                            tabIndex={this.disableContinueButton() ? -1 : 0}
                            style={{ padding: '0px 0px 3px 0px' }}
                          >
                            {
                              fetchingAuthResponse || removingGaAuth
                                ? <LoadingComponent
                                  className='ga-loading-comp'
                                  color='white'
                                  containerHeight='100%'
                                  containerWidth='100%'
                                  aria-label={i18n.t('PROCESSING_TEXT')}
                                  height='25px'
                                  width='25px'
                                  borderSize={2}
                                  style={{ justifyContent: 'center' }}
                                />
                                : <div className='submit-btn-ga-pay'><Trans i18nKey='GA_PROCESS_BUTTON'/></div>
                            }
                          </MainButton>

                        </React.Fragment>
                      }
                      {
                        getGAAccountInquiryError &&
                        <ModalErrorText tabIndex={0}
                          aria-live='polite'
                          aria-label={getGAAccountInquiryError}>
                          { getGAAccountInquiryError }</ModalErrorText>
                      }
                      {
                        (authorizeGAPaymentError || removeGaPaymentError) &&
                        <ModalErrorText tabIndex={0}
                          aria-live='polite'
                          aria-label={authorizeGAPaymentError ? i18n.t(`${authorizeGAPaymentError}`)
                            : i18n.t(`${removeGaPaymentError}`)}>
                          <Trans i18nKey={authorizeGAPaymentError || removeGaPaymentError}/>
                        </ModalErrorText>
                      }
                    </React.Fragment>
                  }
                  <CancelButton
                    className='cancel-btn1'
                    disabled={fetchingAuthResponse || removingGaAuth || fetchingAccountInfo}
                    onClick={this.onModalClose}
                    tabIndex={fetchingAuthResponse || removingGaAuth || fetchingAccountInfo ? -1 : 0}
                    aria-label={i18n.t('MODAL_CANCEL')}>
                    <Trans i18nKey='MODAL_CANCEL'/>
                  </CancelButton>

                  {this.props.selectedGaOption && this.props.selectedGaOption.amountToBeCharged &&
                    <CancelButton
                      disabled={fetchingAuthResponse || removingGaAuth}
                      onClick={this.onRemovePayment}
                      tabIndex={fetchingAuthResponse || removingGaAuth ? -1 : 0}
                      aria-label={i18n.t('MODAL_REMOVE_PAYMENT')}
                    >
                      <Trans i18nKey='MODAL_REMOVE_PAYMENT'/>
                    </CancelButton>
                  }
                </ModalFooter>
              </div>
              {(showAccountInfo || gaAccountInfo) &&
                <Footer remaining={this.props.remaining}>
                  <ModalTotalText className='total-due'
                    tabIndex={0}
                    aria-label={`${i18n.t('GA_TOTAL_DUE')}${currencyLocaleFormat(totalWithTip, currencyDetails)}`}>
                    <Trans i18nKey='GA_TOTAL_DUE'/>: {currencyLocaleFormat(totalWithTip, currencyDetails)}
                  </ModalTotalText>
                  {this.props.remaining &&
                  <ModalRemainingText className='remaining'
                    tabIndex={0}
                    aria-label={`${i18n.t('GA_REMAINING')}${currencyLocaleFormat(remaining, currencyDetails)}`}>
                    <Trans i18nKey='GA_REMAINING' /> { currencyLocaleFormat(remaining, currencyDetails)}
                  </ModalRemainingText>}

                </Footer>
              }
              <CloseButton children='&#10005;'
                className='close-btn'
                disabled={fetchingAuthResponse || removingGaAuth || fetchingAccountInfo}
                onClick={this.onModalClose}
                tabIndex={fetchingAuthResponse || removingGaAuth || fetchingAccountInfo ? -1 : 0}
                role='button'
                aria-label={i18n.t('EXIT_DIALOG')}
              />
            </ModalContainer>
          </Flex>
        )}
      </React.Fragment>
    );
  }
}

export default GAPaymentModal;
