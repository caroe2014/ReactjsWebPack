// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import config from 'app.config';
import { Flex, Text } from 'rebass';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import { Trans } from 'react-i18next';
import CheckBox from 'web/client/app/components/CheckBox';
import UrlImageLoader from 'web/client/app/components/UrlImageLoader';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

import {
  ModalContainer, ModalBackground, ModalTitle,
  ModalTotalText, ModalRemainingText, ModalFooter, MainButton, CloseButton, CancelButton,
  ModalErrorText, ModalBody, InstructionImageContainer, ModalAccountText
} from 'web/client/app/components/ModalComponents';

const ModalInstructionText = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 16px;
  text-align: center;
  padding: 0px 10px;
  margin: 20px auto 0px auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const LoyaltyVoucherContainer = styled(Flex)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  cursor: pointer;
`;

const ExpirateDateContainer = styled(Flex)`
  margin-top: 2px;
  font-size: 12px;
  color: ${props => props.theme.colors.secondaryTextColor};
`;

const LabelAndExpirationContainer = styled(Flex)`
  flex-direction: column;
`;

class LoyaltyVouchersModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      vouchersSelected: []
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.processLoyaltyVouchers = this.processLoyaltyVouchers.bind(this);
    this.voucherSelected = this.voucherSelected.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.enableRemovePayment = this.enableRemovePayment.bind(this);
    this.removeLoyaltyVoucherPayment = this.removeLoyaltyVoucherPayment.bind(this);
    this.filterDisabledVoucherTypes = this.filterDisabledVoucherTypes.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount () {
    this.setInitialState();
    document.getElementById('loyalty-voucher-title') &&
      document.getElementById('loyalty-voucher-title').focus();
  }

  setInitialState () {
    const { loyaltyVoucherInfo } = this.props;
    const paidVouchers = loyaltyVoucherInfo.voucherSummaries.filter(voucher => voucher.amountToBeCharged);
    this.setState({
      vouchersSelected: paidVouchers
    });
  }

  onModalClose () {
    const { closeModal } = this.props;
    this.setState(this.baseState);
    closeModal();
    this.props.clearLoyaltyError();
  }

  processLoyaltyVouchers () {
    const { loyaltyPaymentError, removeLoyaltyPaymentError,
      processSplitLoyaltyVoucherPayment, totalWithTip, remaining,
      processingLoyaltyTransaction, isTipExempt, remainingTipAmount, totalWithoutTip, loyaltyVoucherInfo,
      removeAndProcessLoyaltyVoucherPayments } = this.props;

    const { vouchersSelected } = this.state;

    if (processingLoyaltyTransaction) return;

    const paidVouchers = loyaltyVoucherInfo.voucherSummaries.filter(voucher => voucher.amountToBeCharged);
    const paymentsRemoved = paidVouchers.filter(paidVoucher => !vouchersSelected.find(voucher => voucher.voucherId === paidVoucher.voucherId));

    let remainingTotal;
    let totalVoucherValue;
    let amountFromBalance;
    let isLastPayment;
    let remainingPayableTotal;
    if (paymentsRemoved.length > 0) {
      // update total based on payments removed, amountCharged
      const vouchersRemovedPriceReducer = (accumulator, currentVoucher) => accumulator + parseFloat(currentVoucher.amountToBeCharged);
      const totalOfRemovedVouchers = paymentsRemoved.reduce(vouchersRemovedPriceReducer, 0);
      const nonPaidVouchers = vouchersSelected.filter(voucher => !voucher.amountToBeCharged);
      remainingTotal = parseFloat(remaining || totalWithTip);
      let remainingPayableTotalBeforeRemovingVouchers;

      if (isTipExempt) {
        remainingPayableTotalBeforeRemovingVouchers = remaining ? remaining - remainingTipAmount : totalWithoutTip;
      } else {
        remainingPayableTotalBeforeRemovingVouchers = remainingTotal;
      }

      remainingPayableTotal = totalOfRemovedVouchers + remainingPayableTotalBeforeRemovingVouchers;

      const voucherAddedPriceReducer = (accumulator, currentVoucher) => accumulator + parseFloat(currentVoucher.currencyAmount);
      totalVoucherValue = nonPaidVouchers.reduce(voucherAddedPriceReducer, 0);
      amountFromBalance = totalVoucherValue > remainingPayableTotal ? remainingPayableTotal : totalVoucherValue;
      isLastPayment = remainingPayableTotal <= parseFloat(amountFromBalance);

      removeAndProcessLoyaltyVoucherPayments(paymentsRemoved, nonPaidVouchers, parseFloat(amountFromBalance).toFixed(2), false, isLastPayment); // eslint-disable-line max-len
      !loyaltyPaymentError && !removeLoyaltyPaymentError && this.props.accessible('loyaltyVoucher');

      // calculate totalVoucherValue
    } else {
      remainingTotal = parseFloat(remaining || totalWithTip);

      if (isTipExempt) {
        remainingPayableTotal = remaining ? remaining - remainingTipAmount : totalWithoutTip;
      } else {
        remainingPayableTotal = remainingTotal;
      }
      const vouchersToPaid = paidVouchers && paidVouchers.length > 0 ? vouchersSelected.filter(voucher => paidVouchers.find(paidVoucher => paidVoucher.voucherId !== voucher.voucherId)) : vouchersSelected; // eslint-disable-line max-len
      const voucherPriceReducer = (accumulator, currentVoucher) => accumulator + parseFloat(currentVoucher.currencyAmount); // eslint-disable-line max-len
      totalVoucherValue = vouchersToPaid.reduce(voucherPriceReducer, 0);
      amountFromBalance = totalVoucherValue > remainingPayableTotal ? remainingPayableTotal : totalVoucherValue;
      isLastPayment = remainingTotal <= parseFloat(amountFromBalance);
      processSplitLoyaltyVoucherPayment(vouchersToPaid, parseFloat(amountFromBalance).toFixed(2), false, isLastPayment); // eslint-disable-line max-len
      !loyaltyPaymentError && !removeLoyaltyPaymentError && this.props.accessible('loyaltyVoucher');
    }
  }

  removeLoyaltyVoucherPayment () {
    const { processingLoyaltyTransaction, removeLoyaltyPayments } = this.props;
    const { vouchersSelected } = this.state;
    if (processingLoyaltyTransaction) return;
    removeLoyaltyPayments(vouchersSelected);
    this.props.accessible('loyaltyVoucher');
  }

  enableRemovePayment () {
    const { vouchersSelected } = this.state;

    const checkContains = vouchersSelected.length > 0 && vouchersSelected.every(voucher => !!voucher.paymentResponse);
    return checkContains;
  }

  voucherSelected (voucher) {
    const { loyaltyVoucherInfo } = this.props;
    this.setState((prevState, props) => {
      const voucherIndexToRemove = prevState.vouchersSelected.indexOf(voucher);

      if (voucherIndexToRemove >= 0) {
        return {
          voucherSelected: prevState.vouchersSelected.splice(voucherIndexToRemove, 1),
          ...prevState
        };
      } else {
        voucher.primaryAccountId = loyaltyVoucherInfo.primaryAccountId;
        return {
          vouchersSelected: prevState.vouchersSelected.push(voucher),
          ...prevState
        };
      }
    });
    this.props.clearLoyaltyError();
  }

  handleKeyPress (event, voucher) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (32 is spacebar)
    if (event.which === 32) {
      this.voucherSelected(voucher);
    }
  }

  calculateDaysUntil (expirationDate) {
    const currentDate = moment();
    const momentExpirationDate = moment(expirationDate);
    const difference = momentExpirationDate.diff(currentDate, 'days');

    return difference;
  }

  filterDisabledVoucherTypes (voucher) {
    const { loyaltyVoucherInfo } = this.props;

    if (voucher.instrumentType === 'OFFER') {
      return loyaltyVoucherInfo.voucherOfferEnabled;
    } else if (voucher.instrumentType === 'COUPON') {
      return loyaltyVoucherInfo.voucherCouponEnabled;
    } else if (voucher.instrumentType === 'PRIZE') {
      return loyaltyVoucherInfo.voucherPrizeEnabled;
    } else if (voucher.instrumentType === 'CASH') {
      return loyaltyVoucherInfo.voucherCashEnabled;
    } else if (voucher.instrumentType === 'COMP') {
      return loyaltyVoucherInfo.voucherCompEnabled;
    } else {
      return false;
    }
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  isSelectedVoucherAmountIsValid (vouchersSelected) {
    const { remaining, totalWithTip, isTipExempt, remainingTipAmount, totalWithoutTip, multiPaymentEnabled } = this.props;
    const remainingTotal = parseFloat(remaining || totalWithTip);
    let remainingPayableTotal;
    if (multiPaymentEnabled) {
      return vouchersSelected.length > 0;
    }
    if (isTipExempt) {
      remainingPayableTotal = remaining ? remaining - remainingTipAmount : totalWithoutTip;
    } else {
      remainingPayableTotal = remainingTotal;
    }
    return multiPaymentEnabled || vouchersSelected.reduce((total, voucher) => { return total + parseFloat(voucher.currencyAmount); }, 0) >= remainingPayableTotal; // eslint-disable-line max-len
  }

  render () {
    const { loyaltyPaymentConfiguration, totalWithTip, currencyDetails, processingLoyaltyTransaction,
      loyaltyPaymentError, remaining, loyaltyVoucherInfo, contextId, tenantId, removeLoyaltyPaymentError } = this.props;
    const { vouchersSelected } = this.state;
    const disableProcessButton = vouchersSelected.length === 0 || !this.isSelectedVoucherAmountIsValid(vouchersSelected, totalWithTip);
    const { vouchers } = loyaltyPaymentConfiguration;
    const accountNumberLast4 = loyaltyVoucherInfo.primaryAccountId.substring(loyaltyVoucherInfo.primaryAccountId.length - 4);
    const instructionImageUrl = config.getPOSImageURL(contextId, vouchers.image, tenantId);

    return (
      <Flex id='loyalty-voucher-modal'>
        <ModalBackground />
        <ModalContainer className='modal-container' role='dialog' onKeyDown={this.onEscape}>
          {processingLoyaltyTransaction &&
            <Announcements message={i18n.t('PROCESSING_TEXT')} />}
          <ModalBody className='modal-body'>
            <ModalTitle className='modal-title' id='loyalty-voucher-title' tabIndex={0} aria-label={vouchers.displayLabel || i18n.t('LOYALTY_VOUCHER_TITLE')}>
              {vouchers.displayLabel || <Trans i18nKey='LOYALTY_VOUCHER_TITLE' />}
            </ModalTitle>
            <ModalInstructionText className='instruction-text' tabIndex={0} aria-label={vouchers.instructionText || i18n.t('LOYALTY_VOUCHER_INSTRUCTION_TEXT')}>
              {vouchers.instructionText || <Trans i18nKey='LOYALTY_VOUCHER_INSTRUCTION_TEXT' />}
            </ModalInstructionText>

            <ModalAccountText tabIndex={0} aria-label={`${loyaltyPaymentConfiguration.displayLabel || i18n.t('LOYALTY_PAYMENT_DISPLAY_LABEL')} ${accountNumberLast4}`} >
              {loyaltyPaymentConfiguration.displayLabel || <Trans i18nKey='LOYALTY_PAYMENT_DISPLAY_LABEL' />} ...{accountNumberLast4}
            </ModalAccountText>
            {
              vouchers.image &&
              <InstructionImageContainer className='instruction-image-container'>
                <UrlImageLoader src={instructionImageUrl} alt='' />
              </InstructionImageContainer>
            }
            {
              loyaltyVoucherInfo.voucherSummaries.filter(this.filterDisabledVoucherTypes).map((voucher, index) => (
                <LoyaltyVoucherContainer onClick={() => this.voucherSelected(voucher)}
                  onKeyPress={(e) => this.handleKeyPress(e, voucher)}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <CheckBox
                      classDesc={'checkbox'}
                      // label={voucher.name}
                      style={{ alignItems: 'flex-start', marginTop: '-8px' }}
                      capacityText
                      // selectedOption={() => this.voucherSelected(voucher)}
                      selected={this.state.vouchersSelected.includes(voucher)}
                      ariaLabel={`${voucher.name}${i18n.t('LOYALTY_PAYMENT_EXPIRES_IN')} ${this.calculateDaysUntil(voucher.expirationDate)} ${i18n.t('LOYALTY_PAYMENT_DAYS')}`}
                      tabIndex={0}
                      ariaChecked={this.state.vouchersSelected.includes(voucher)}
                    />
                    <LabelAndExpirationContainer className='label-exp-container'>
                      <Flex className='label-name-container'>
                        {voucher.name}
                      </Flex>
                      <ExpirateDateContainer className='exp-date-container'>
                        <Trans i18nKey='LOYALTY_PAYMENT_EXPIRES_IN' />
                        {this.calculateDaysUntil(voucher.expirationDate)} <Trans i18nKey='LOYALTY_PAYMENT_DAYS' />
                      </ExpirateDateContainer>
                    </LabelAndExpirationContainer>
                  </div>
                  <Flex tabIndex={0} aria-label={currencyLocaleFormat(voucher.currencyAmount, currencyDetails)}>
                    <div className='currency-text'>{currencyLocaleFormat(voucher.currencyAmount, currencyDetails)}</div>
                  </Flex>
                </LoyaltyVoucherContainer>
              ))
            }

            <MainButton
              className='main-btn'
              onClick={this.processLoyaltyVouchers}
              disabled={disableProcessButton}
              tabIndex={disableProcessButton ? -1 : 0}
              aria-label={i18n.t('GA_PROCESS_BUTTON')}
              style={{ padding: '0px 0px 3px 0px' }}>
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
                    <Trans i18nKey='GA_PROCESS_BUTTON' />
                  </div>
              }
            </MainButton>

            <CancelButton
              disabled={processingLoyaltyTransaction}
              tabIndex={processingLoyaltyTransaction ? -1 : 0}
              aria-label={i18n.t('MODAL_CANCEL')}
              onClick={this.onModalClose}>
              <Trans i18nKey='MODAL_CANCEL' />
            </CancelButton>
            {
              this.enableRemovePayment() &&
              <CancelButton
                disabled={processingLoyaltyTransaction} // TODO:
                tabIndex={processingLoyaltyTransaction ? -1 : 0}
                aria-label={i18n.t('MODAL_REMOVE_PAYMENT')}
                onClick={this.removeLoyaltyVoucherPayment}
              >
                <Trans i18nKey='MODAL_REMOVE_PAYMENT' />
              </CancelButton>
            }
            {
              (loyaltyPaymentError || removeLoyaltyPaymentError) &&
              <ModalErrorText aria-live='polite'
                aria-label={i18n.t('GENERIC_PAYMENT_FAILURE')}
                tabIndex={(loyaltyPaymentError || removeLoyaltyPaymentError) ? 0 : -1}>
                <Trans i18nKey='GENERIC_PAYMENT_FAILURE' />
              </ModalErrorText>
            }
          </ModalBody>

          <ModalFooter remaining={this.props.remaining}>
            <ModalTotalText className='total-due' tabIndex={0} aria-label={`${i18n.t('TOTAL_FOOTER')} ${currencyLocaleFormat(totalWithTip, currencyDetails)}`}>
              <Trans i18nKey='TOTAL_FOOTER' />: {currencyLocaleFormat(totalWithTip, currencyDetails)}
            </ModalTotalText>
            {
              this.props.remaining &&
              <ModalRemainingText className='remaining' tabIndex={0} aria-label={`${i18n.t('REMAINING_FOOTER')} ${currencyLocaleFormat(remaining, currencyDetails)}`}>
                <Trans i18nKey='REMAINING_FOOTER' />: {currencyLocaleFormat(remaining, currencyDetails)}
              </ModalRemainingText>
            }
          </ModalFooter>
          <CloseButton children='&#10005;'
            disabled={processingLoyaltyTransaction}
            tabIndex={processingLoyaltyTransaction ? -1 : 0}
            role='button'
            aria-label={i18n.t('EXIT_DIALOG')}
            onClick={this.onModalClose}
          />

        </ModalContainer>
      </Flex>

    );
  }
}

export default LoyaltyVouchersModal;
