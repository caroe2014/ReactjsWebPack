/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled from 'styled-components';
import config from 'app.config';
import { Flex } from 'rebass';
import FloatingLabelInput from 'web/client/app/components/FloatingLabelInput';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import { Trans } from 'react-i18next';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

import { ModalContainer, ModalBackground, ModalTitle, ModalText, ModalTotalText, ModalRemainingText,
  ModalBody, ModalFooter, MainButton, CloseButton, CancelButton as GenericCancelButton, ModalErrorText, CustomAmountInput, CurrencyText,
  InstructionImageContainer } from 'web/client/app/components/ModalComponents';

const CustomFlex = styled(Flex)`
  border-bottom: 1px solid lightgrey;
  margin: 15px auto 15px;
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

const CancelButton = styled(GenericCancelButton)`
  margin: 0px auto 10px auto;
`;

class LoyaltyHostCompVoucherModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voucherNumber: '',
      amountToCharge: '',
      removePaymentModal: false
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.processLoyaltyHostCompVoucher = this.processLoyaltyHostCompVoucher.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAmountChargedChange = this.handleAmountChargedChange.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.removeLoyaltyVoucherPayment = this.removeLoyaltyVoucherPayment.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidMount () {
    this.setInitialState();
    document.getElementById('loyalty-host-comp-title') &&
        document.getElementById('loyalty-host-comp-title').focus();
  }

  setInitialState () {
    const { hostCompVoucherPayments, selectedLoyaltyAccount } = this.props;
    if (hostCompVoucherPayments.length > 0 && hostCompVoucherPayments[0].primaryAccountId === selectedLoyaltyAccount.primaryAccountId) {
      const hostCompVoucherPayment = hostCompVoucherPayments[0];
      this.setState({
        voucherNumber: hostCompVoucherPayment.voucherId,
        amountToCharge: hostCompVoucherPayment.amountToBeCharged,
        removePaymentModal: true
      });
    }
  }

  onModalClose () {
    const { closeModal } = this.props;
    this.setState(this.baseState);
    closeModal();
    this.props.clearLoyaltyError();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  processLoyaltyHostCompVoucher () {
    const { selectedLoyaltyAccount,
      processSplitLoyaltyHostCompVoucherPayment, totalWithTip, remaining,
      processingLoyaltyTransaction, remainingTipAmount,
      totalWithoutTip, isTipExempt, disableProcessButton
      , loyaltyPaymentError } = this.props;

    const { voucherNumber, amountToCharge } = this.state;

    const hostCompVoucher = {
      voucherId: voucherNumber,
      primaryAccountId: selectedLoyaltyAccount.primaryAccountId,
      voucherType: 'COUPON',
      isHostComp: true,
      displayLabel: selectedLoyaltyAccount.displayLabel
    };

    if (processingLoyaltyTransaction) {
      return;
    }

    const remainingTotal = parseFloat(remaining || totalWithTip);
    let remainingPayableTotal;
    if (isTipExempt) {
      remainingPayableTotal = remaining ? remaining - remainingTipAmount : totalWithoutTip;
    } else {
      remainingPayableTotal = remainingTotal;
    }

    const amountToChargeAccount = parseFloat(amountToCharge) > remainingPayableTotal
      ? remainingPayableTotal : parseFloat(amountToCharge);

    const isLastPayment = remainingTotal <= amountToChargeAccount;
    processSplitLoyaltyHostCompVoucherPayment(hostCompVoucher, amountToChargeAccount.toFixed(2), false, isLastPayment); // eslint-disable-line max-len
    !disableProcessButton && !loyaltyPaymentError && this.props.accessible('loyaltyHostCompVoucher');
  }

  removeLoyaltyVoucherPayment () {
    const { processingLoyaltyTransaction, removeLoyaltyPayments, hostCompVoucherPayments } = this.props;
    if (processingLoyaltyTransaction) return;
    hostCompVoucherPayments[0].isHostComp = true;
    this.props.accessible('loyaltyHostCompVoucher');
    removeLoyaltyPayments(hostCompVoucherPayments);
  }

  handleChange (propertyName, inputValue) {
    this.setState({
      [propertyName]: inputValue
    });
    this.props.clearLoyaltyError();
  }

  handleAmountChargedChange (e) {
    const value = e.target.value;
    var reg = /^\d{1,4}$|^\d{1,4}\.\d{1,2}$|^\d{1,4}\.$|^0\.$|^0$|^[1-9]\d{1,2}\.$|^\.\d{1,2}$|^0\.\d{1,2}$|^[1-9]\d{1,2}\.\d{1,2}$/; // eslint-disable-line max-len
    if (e.target.value === '.') {
      this.setState({ amountToCharge: value });
    } else {
      if (e.target.value) {
        reg.exec(value) && this.setState({ amountToCharge: value });
      } else {
        this.setState({ amountToCharge: '' });
        this.customAmount.value = '';
      }
    }
    this.props.clearLoyaltyError();
  }

  makeEverythingAccessible () {
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer .pay-list-top-container');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = false;
    const footer = document.querySelector('.BottomContainer .footer');
    footer.inert = false;
    const Children = bottomContainer.children;
    Array.from(Children).forEach(child => {
      if (child.id !== 'loyalty-host-comp-modal') {
        child.inert = false;
      }
    });
  }

  render () {
    const { loyaltyPaymentConfiguration, totalWithTip, currencyDetails, processingLoyaltyTransaction, remaining,
      loyaltyPaymentError, multiPaymentEnabled, tenantId, contextId } = this.props;

    const { hostComps } = loyaltyPaymentConfiguration;
    const { voucherNumber, amountToCharge, removePaymentModal } = this.state;
    const disableProcessButton = voucherNumber.length === 0 ||
    (!amountToCharge || parseFloat(amountToCharge) <= 0) ||
    (!multiPaymentEnabled && (parseFloat(totalWithTip) > parseFloat(amountToCharge)));
    const currencyLocale = currencyLocaleFormat(0, currencyDetails).charAt(0) === currencyDetails.currencySymbol;
    const instructionImageUrl = config.getPOSImageURL(contextId, hostComps.image, tenantId);

    return (
      <Flex id='loyalty-host-comp-modal' role='dialog'>
        <ModalBackground />
        <ModalContainer className='modal-container' onKeyDown={this.onEscape} >
          <ModalBody className='modal-body'>
            {processingLoyaltyTransaction &&
              <Announcements message={i18n.t('PROCESSING_TEXT')} />}
            <ModalTitle className='modal-title' tabIndex={0} id='loyalty-host-comp-title'
              aria-label={hostComps.displayLabel || i18n.t('LOYALTY_HOSTCOMP_VOUCHER_TITLE')}>
              {hostComps.displayLabel || <Trans i18nKey='LOYALTY_HOSTCOMP_VOUCHER_TITLE'/>}
            </ModalTitle>
            <ModalText className='instruction-text' tabIndex={0}
              aria-label={hostComps.instructionText || i18n.t('LOYALTY_HOSTCOMP_VOUCHER_INSTRUCTION_TEXT')}>
              {hostComps.instructionText || <Trans i18nKey='LOYALTY_HOSTCOMP_VOUCHER_INSTRUCTION_TEXT'/>}
            </ModalText>
            {
              hostComps.image &&
              <InstructionImageContainer className='instruction-image-container'>
                <UrlImageLoader src={instructionImageUrl} alt=''/>
              </InstructionImageContainer>
            }
            <FloatingLabelInput
              className='host-comp-voucher-number-input'
              ariaLabel={i18n.t('LOYALTY_HOSTCOMP_VOUCHER_NUMBER')}
              tabIndex={processingLoyaltyTransaction || removePaymentModal ? -1 : 0}
              propertyName='voucherNumber'
              label={<Trans i18nKey='LOYALTY_HOSTCOMP_VOUCHER_NUMBER' />}
              value={voucherNumber}
              callBack={this.handleChange}
              clearIcon
              disabled={processingLoyaltyTransaction || removePaymentModal}
              placeHolder={<Trans i18nKey='LOYALTY_HOSTCOMP_VOUCHER_NUMBER' />}
            />

            <CustomFlex
              className='custom-flex'
              disabled={false}
            >
              { currencyLocale &&
                <CurrencyText className='currency-text'
                  value={this.state.customAmountInput}
                  disabled={processingLoyaltyTransaction || removePaymentModal}
                  tabIndex={processingLoyaltyTransaction || removePaymentModal ? -1 : 0}
                  aria-label={`${currencyDetails.currencySymbol} ${this.state.customAmountInput !== undefined ? this.state.customAmountInput : ''}`}>
                  {currencyDetails.currencySymbol}
                </CurrencyText>
              }
              <CustomAmountInput
                innerRef={(e) => { this.customAmount = e; }}
                className='custom-amount-input-field'
                aria-label={`${i18n.t('AMOUNT_PAYABLE')}${amountToCharge}`}
                tabIndex={processingLoyaltyTransaction || removePaymentModal ? -1 : 0}
                propertyname='amountToCharge'
                type='number'
                disabled={processingLoyaltyTransaction || removePaymentModal}
                customamountinput={amountToCharge}
                onChange={(e) => this.handleAmountChargedChange(e)}
                onKeyPress={(e) => (e.which === 45 || e.which === 43 ||
                e.keyCode === 107 || e.keyCode === 109) &&
                e.preventDefault()}
                value={amountToCharge}
              />
              { !currencyLocale &&
                <CurrencyText className='currency-text' tabIndex={0}
                  aria-label={`${currencyDetails.currencySymbol} ${amountToCharge}`} value={amountToCharge}>
                  {currencyDetails.currencySymbol}
                </CurrencyText>
              }
            </CustomFlex>

            <MainButton
              className='main-btn'
              onClick={this.processLoyaltyHostCompVoucher}
              disabled={disableProcessButton || removePaymentModal}
              tabIndex={disableProcessButton || removePaymentModal ? -1 : 0}
              aria-label={i18n.t('GA_PROCESS_BUTTON')}
              style={{ padding: '0px 0px 3px 0px', margin: '15px auto' }}>
              {
                processingLoyaltyTransaction
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
              disabled={processingLoyaltyTransaction}
              tabIndex={processingLoyaltyTransaction ? -1 : 0}
              aria-label={i18n.t('MODAL_CANCEL')}
              onClick={this.onModalClose}>
              <Trans i18nKey='MODAL_CANCEL'/>
            </CancelButton>
            {
              removePaymentModal &&
              <CancelButton
                disabled={processingLoyaltyTransaction} // TODO:
                tabIndex={processingLoyaltyTransaction ? -1 : 0}
                aria-label={i18n.t('MODAL_REMOVE_PAYMENT')}
                onClick={this.removeLoyaltyVoucherPayment}
              >
                <Trans i18nKey='MODAL_REMOVE_PAYMENT'/>
              </CancelButton>
            }
            {
              !disableProcessButton && (loyaltyPaymentError) &&
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
                aria-label={`${i18n.t('REMAINING_FOOTER')}${currencyLocaleFormat(remaining, currencyDetails)}`}>
                <Trans i18nKey='REMAINING_FOOTER'/>: { currencyLocaleFormat(remaining, currencyDetails)}
              </ModalRemainingText>}
          </ModalFooter>
          <CloseButton children='&#10005;'
            disabled={processingLoyaltyTransaction}
            tabIndex={processingLoyaltyTransaction ? -1 : 0}
            aria-label={i18n.t('EXIT_DIALOG')}
            onClick={this.onModalClose}
          />
        </ModalContainer>
      </Flex>

    );
  }
}

export default LoyaltyHostCompVoucherModal;
