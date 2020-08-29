/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex } from 'rebass';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import { Trans } from 'react-i18next';
import { ModalContainer, ModalBackground, ModalTitle, ModalText, ModalTotalText, ModalRemainingText,
  ModalBody, ModalFooter, MainButton, CloseButton, CancelButton, ErrorText, CustomAmountInput, CurrencyText,
  ModalErrorText, ModalAccountText, InstructionImageContainer } from 'web/client/app/components/ModalComponents';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import config from 'app.config';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const LoyaltyPointsAccountInformationContainer = styled(Flex)`
  display: flex;
  justify-content: space-between;
`;

const CustomModalAccountText = styled(ModalAccountText)`
  margin: 20px 0px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

// TODO: all copied from GAPayment, pull out into something to reuse
const CustomFlex = styled(Flex)`
  border-bottom: 1px solid lightgrey;
  margin: 15px auto 20px;
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

class LoyaltyPointsModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      customAmountInput: '',
      invalidInputErrorMessage: ''
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.processLoyaltyPoints = this.processLoyaltyPoints.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.setAutoFillAmount = this.setAutoFillAmount.bind(this);
    this.onRemovePayment = this.onRemovePayment.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidMount () {
    this.setAutoFillAmount();
    document.getElementById('loyalty-points-title') &&
        document.getElementById('loyalty-points-title').focus();
  }

  onModalClose () {
    const { closeModal } = this.props;
    this.setState(this.baseState);
    closeModal();
    this.props.clearLoyaltyError();
  }

  processLoyaltyPoints () {
    const { selectedLoyaltyAccount, loyaltyPaymentConfiguration,
      processSplitLoyaltyPointsPayment, totalWithTip, totalWithoutTip, remaining, remainingTipAmount, processingLoyaltyTransaction,
      isTipExempt, loyaltyPaymentError, removeLoyaltyPaymentError } = this.props;

    if (processingLoyaltyTransaction) return;
    const previousAmountDeducted = selectedLoyaltyAccount.amountToBeCharged;
    const promptPaymentEnabled = loyaltyPaymentConfiguration.tenderComps.isPromptPaymentEnabled;
    let remainingPayableTotal;
    const remainingTotal = parseFloat(remaining || totalWithTip);

    if (isTipExempt) {
      remainingPayableTotal = remaining ? remaining - remainingTipAmount : totalWithoutTip;
    } else {
      remainingPayableTotal = remainingTotal;
    }

    let actualAccountBalance = selectedLoyaltyAccount.currencyAmount;
    let amountToChargeAccountIfPromptDisabled = parseFloat(actualAccountBalance) > remainingPayableTotal
      ? remainingPayableTotal : parseFloat(actualAccountBalance);

    let amountToChargeAccountIfPromptEnabled = parseFloat(this.state.customAmountInput) > remainingPayableTotal
      ? remainingPayableTotal : parseFloat(this.state.customAmountInput);

    let amountToCharge = promptPaymentEnabled ? amountToChargeAccountIfPromptEnabled
      : amountToChargeAccountIfPromptDisabled;

    if (amountToCharge === 0) {
      this.setState({
        invalidInputErrorMessage: 'You are exceeding your maximum allowed charge.'
      });
    } else {
      const isAmountModified = previousAmountDeducted && parseFloat(previousAmountDeducted) !== parseFloat(amountToCharge); // eslint-disable-line max-len

      const isLastPayment = remainingTotal <= parseFloat(amountToCharge);
      processSplitLoyaltyPointsPayment(selectedLoyaltyAccount, parseFloat(amountToCharge).toFixed(2), isAmountModified, isLastPayment); // eslint-disable-line max-len
      !loyaltyPaymentError && !removeLoyaltyPaymentError && this.props.accessible('loyaltyPoints');
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
    this.props.clearLoyaltyError();
  }

  onRemovePayment () {
    const { processingLoyaltyTransaction, removeLoyaltyPayments, selectedLoyaltyAccount } = this.props;
    if (processingLoyaltyTransaction) return;
    this.props.accessible('loyaltyPoints');
    removeLoyaltyPayments([selectedLoyaltyAccount]);
  }

  setAutoFillAmount () {
    const { remaining, totalWithTip, totalWithoutTip, selectedLoyaltyAccount, isTipExempt, remainingTipAmount } = this.props;
    const loyaltyPointsBalance = selectedLoyaltyAccount.currencyAmount;

    let remainingPayableTotal;

    if (isTipExempt) {
      remainingPayableTotal = remaining ? remaining - remainingTipAmount : totalWithoutTip;
    } else {
      remainingPayableTotal = remaining || totalWithTip;
    }

    const autoFillAmount = selectedLoyaltyAccount && selectedLoyaltyAccount.amountToBeCharged
      ? parseFloat(selectedLoyaltyAccount.amountToBeCharged).toFixed(2)
      : (parseFloat(remainingPayableTotal) < parseFloat(loyaltyPointsBalance)
        ? parseFloat(remainingPayableTotal) : parseFloat(loyaltyPointsBalance));

    this.setState({ customAmountInput: parseFloat(autoFillAmount).toFixed(2) });
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  render () {
    const { selectedLoyaltyAccount, loyaltyPaymentConfiguration, totalWithTip, currencyDetails, processingLoyaltyTransaction,
      loyaltyPaymentError, remaining, removeLoyaltyPaymentError, processingMultipleActions, contextId, tenantId, multiPaymentEnabled } = this.props;
    const { customAmountInput } = this.state;
    const { tenderComps } = loyaltyPaymentConfiguration;
    const disableProcessButton = !parseFloat(customAmountInput) > 0 || parseFloat(selectedLoyaltyAccount.amountToBeCharged) === parseFloat(customAmountInput) ||
      parseFloat(customAmountInput) > parseFloat(selectedLoyaltyAccount.currencyAmount) ||
      (!multiPaymentEnabled && tenderComps.isPromptPaymentEnabled && (parseFloat(totalWithTip) > selectedLoyaltyAccount.currencyAmount));
    const currencyLocale = currencyLocaleFormat(0, currencyDetails).charAt(0) === currencyDetails.currencySymbol;
    const accountNumberLast4 = selectedLoyaltyAccount.primaryAccountId.substring(selectedLoyaltyAccount.primaryAccountId.length - 4);
    const processing = processingMultipleActions || processingLoyaltyTransaction;
    const instructionImageUrl = config.getPOSImageURL(contextId, tenderComps.image, tenantId);

    return (
      <Flex id='loyalty-points-modal' role='dialog' onKeyDown={this.onEscape}>
        <ModalBackground />
        <ModalContainer className='modal-container'>
          {processing &&
          <Announcements message={i18n.t('PROCESSING_TEXT')} />}
          <ModalBody className='modal-body'>
            <ModalTitle className='modal-title' tabIndex={0} id='loyalty-points-title'
              aria-label={tenderComps.displayLabel || i18n.t('LOYALTY_POINTS_TITLE')}>
              {tenderComps.displayLabel || <Trans i18nKey='LOYALTY_POINTS_TITLE'/>}
            </ModalTitle>
            <ModalText className='instruction-text' tabIndex={0}
              aria-label={tenderComps.instructionText || i18n.t('LOYALTY_POINTS_INSTRUCTION_TEXT')}>
              {tenderComps.instructionText || <Trans i18nKey='LOYALTY_POINTS_INSTRUCTION_TEXT'/>}
            </ModalText>

            {
              tenderComps.image &&
              <InstructionImageContainer className='instruction-image-container'>
                <UrlImageLoader src={instructionImageUrl} alt=''/>
              </InstructionImageContainer>
            }

            <LoyaltyPointsAccountInformationContainer>
              <CustomModalAccountText
                style={{ paddingLeft: '0px', textAlign: 'left' }} tabIndex={0}
                aria-label={`${loyaltyPaymentConfiguration.displayLabel || i18n.t('LOYALTY_PAYMENT_DISPLAY_LABEL')} ${accountNumberLast4}`}>
                {loyaltyPaymentConfiguration.displayLabel ||
                  <Trans i18nKey='LOYALTY_PAYMENT_DISPLAY_LABEL'/>}....{accountNumberLast4}</CustomModalAccountText>
              <CustomModalAccountText style={{paddingRight: '0px', textAlign: 'right'}}
                className='currency-text' tabIndex={0}
                aria-label={currencyLocaleFormat(selectedLoyaltyAccount.currencyAmount, currencyDetails)}>
                {currencyLocaleFormat(selectedLoyaltyAccount.currencyAmount, currencyDetails)}
              </CustomModalAccountText>
            </LoyaltyPointsAccountInformationContainer>
            {tenderComps.isPromptPaymentEnabled && multiPaymentEnabled && <CustomFlex
              className='custom-flex'
              disabled={false}
            >
              { currencyLocale &&
              <CurrencyText className='currency-text' value={customAmountInput}
                tabIndex={processingLoyaltyTransaction || !tenderComps.isPromptPaymentEnabled ? -1 : 0}
                aria-label={`${currencyDetails.currencySymbol} ${customAmountInput}`}
                disabled={processing || !tenderComps.isPromptPaymentEnabled}>
                {currencyDetails.currencySymbol}
              </CurrencyText>
              }
              <CustomAmountInput
                innerRef={(e) => { this.customAmount = e; }}
                className='custom-amount-input-field'
                aria-label={`${i18n.t('AMOUNT_PAYABLE')}${customAmountInput}`}
                tabIndex={processing ? -1 : 0}
                type='number'
                disabled={processing}
                customamountinput={customAmountInput}
                autoFocus
                onChange={(e) => this.handleUserInput(e)}
                onKeyPress={(e) => (e.which === 45 || e.which === 43 ||
                  e.keyCode === 107 || e.keyCode === 109) &&
                  e.preventDefault()}
                value={customAmountInput}
              />
              { !currencyLocale &&
              <CurrencyText className='currency-text'
                tabIndex={0}
                aria-label={`${currencyDetails.currencySymbol} ${customAmountInput}`} value={customAmountInput}>
                {currencyDetails.currencySymbol}
              </CurrencyText>
              }
            </CustomFlex>
            }

            <MainButton
              className='main-btn'
              onClick={this.processLoyaltyPoints}
              disabled={disableProcessButton}
              tabIndex={disableProcessButton ? -1 : 0}
              aria-label={i18n.t('GA_PROCESS_BUTTON')}
              style={{ padding: '0px 0px 3px 0px' }}>
              {
                processing
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
                  : <div className='submit-btn-room-charge'>
                    <Trans i18nKey='GA_PROCESS_BUTTON'/>
                  </div>
              }
            </MainButton>
            <CancelButton
              disabled={processing}
              tabIndex={processing ? -1 : 0}
              aria-label={i18n.t('MODAL_CANCEL')}
              onClick={this.onModalClose}>
              <Trans i18nKey='MODAL_CANCEL'/>
            </CancelButton>
            {
              selectedLoyaltyAccount && selectedLoyaltyAccount.amountToBeCharged &&
              <CancelButton
                disabled={processing} // TODO:
                tabIndex={processing ? -1 : 0}
                aria-label={i18n.t('MODAL_REMOVE_PAYMENT')}
                onClick={this.onRemovePayment}
              >
                <Trans i18nKey='MODAL_REMOVE_PAYMENT'/>
              </CancelButton>
            }
            {this.state.invalidInputErrorMessage &&
              <ErrorText aria-live='polite' tabIndex={0} aria-label={this.state.invalidInputErrorMessage}
              >{ this.state.invalidInputErrorMessage }</ErrorText> }
            {
              !disableProcessButton && (loyaltyPaymentError || removeLoyaltyPaymentError) &&
              <ModalErrorText aria-live='polite' tabIndex={0} aria-label={i18n.t('GENERIC_PAYMENT_FAILURE')}>
                <Trans i18nKey='GENERIC_PAYMENT_FAILURE'/>
              </ModalErrorText>
            }
          </ModalBody>
          <ModalFooter remaining={remaining}>
            <ModalTotalText className='total-due' tabIndex={0}
              aria-label={`${i18n.t('TOTAL_FOOTER')}${currencyLocaleFormat(totalWithTip, currencyDetails)}`}>
              <Trans i18nKey='TOTAL_FOOTER'/>: {currencyLocaleFormat(totalWithTip, currencyDetails)}
            </ModalTotalText>
            {remaining &&
              <ModalRemainingText className='remaining' tabIndex={0}
                aria-label={`${i18n.t('REMAINING_FOOTER')} ${currencyLocaleFormat(remaining, currencyDetails)}`}>
                <Trans i18nKey='REMAINING_FOOTER'/>: { currencyLocaleFormat(remaining, currencyDetails)}
              </ModalRemainingText>}
          </ModalFooter>
          <CloseButton children='&#10005;'
            disabled={processing}
            onClick={this.onModalClose}
            tabIndex={processing ? -1 : 0}
            aria-label={i18n.t('EXIT_DIALOG')}
            role='button'
          />
        </ModalContainer>
      </Flex>

    );
  }
}

export default LoyaltyPointsModal;
