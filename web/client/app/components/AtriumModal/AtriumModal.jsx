/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex } from 'rebass';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import IncrementDecrementInput from 'web/client/app/components/IncrementDecrementInput/IncrementDecrementInput';
import { ModalContainer, ModalBackground, ModalTitle, ModalText, ModalTotalText, ModalRemainingText,
  ModalBody, ModalFooter, MainButton, CloseButton, CancelButton as GenericCancelButton
} from 'web/client/app/components/ModalComponents';

const CustomFlex = styled(Flex)`
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
  .decrement {
    opacity: ${props => {
    if (props['disable-decrement']) return '0.5 !important';
    return 'unset';
  }};
    cursor: ${props => {
    if (props['disable-decrement']) return 'not-allowed';
    return 'auto';
  }};
  }};
  .increment {
    opacity: ${props => {
    if (props['disable-increment']) return '0.5 !important';
    return 'unset';
  }};
    cursor: ${props => {
    if (props['disable-increment']) return 'not-allowed';
    return 'auto';
  }};
  }
`;

const CancelButton = styled(GenericCancelButton)`
  margin: 0px auto 10px auto;
`;

const AccountDetailsParent = styled(Flex)`
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

const AccountDetailsDiv = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

class AtriumModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mealCreditValue: 1
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.processPayment = this.processPayment.bind(this);
    this.handleRemovePayment = this.handleRemovePayment.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidMount () {
    this.setInitialState();
    document.getElementById('atrium-meal-credit-title') &&
        document.getElementById('atrium-meal-credit-title').focus();
  }

  setInitialState () {
    const { atriumAccount } = this.props;
    if (atriumAccount.authResponse) {
      const mealCreditValue = atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.applied;
      this.setState({
        mealCreditValue,
        mealCreditInAuthResponse: mealCreditValue
      });
    }
  }

  onModalClose () {
    const { closeModal } = this.props;
    this.setState(this.baseState);
    closeModal();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  handleIncrement () {
    const { atriumAccount, remaining, totalWithTip } = this.props;
    const { mealCreditValue } = this.state;
    const existingAuthAmount = atriumAccount.authResponse ? parseFloat(atriumAccount.amountToBeCharged) : 0;
    const remainingToPaid = parseFloat(remaining || totalWithTip) + existingAuthAmount;
    const incrementMealCreditValue = parseInt(mealCreditValue) + 1;
    const amountToIncrement = parseInt(mealCreditValue) * parseFloat(atriumAccount.limitOnAccount);
    if (incrementMealCreditValue <= parseFloat(atriumAccount.amount.remaining) && remainingToPaid % amountToIncrement !== remainingToPaid) {
      this.setState({
        mealCreditValue: incrementMealCreditValue,
        disableIncrement: remainingToPaid % (amountToIncrement + parseFloat(atriumAccount.limitOnAccount)) === remainingToPaid,
        disableDecrement: false
      });
    } else {
      this.setState({
        disableIncrement: true,
        disableDecrement: false
      });
    }
  }

  handleDecrement () {
    const { mealCreditValue } = this.state;
    const decrementMealCreditValue = parseInt(mealCreditValue) - 1;
    if (decrementMealCreditValue >= 0) {
      this.setState({
        mealCreditValue: decrementMealCreditValue,
        disableDecrement: decrementMealCreditValue === 0,
        disableIncrement: false
      });
    } else {
      this.setState({disableDecrement: true, disableIncrement: false});
    }
  }

  processPayment () {
    const { atriumAccount, remaining, totalWithTip, closeModal } = this.props;
    const { mealCreditValue, mealCreditInAuthResponse } = this.state;
    const existingAuthAmount = atriumAccount.authResponse ? parseFloat(atriumAccount.amountToBeCharged) : 0;
    const remainingToPaid = parseFloat(remaining || totalWithTip) + existingAuthAmount;
    const amountToCharge = parseFloat((parseInt(mealCreditValue) * parseFloat(atriumAccount.limitOnAccount) > remainingToPaid ? remainingToPaid : parseInt(mealCreditValue) * parseFloat(atriumAccount.limitOnAccount)).toFixed(2));
    const isMealCountModified = mealCreditInAuthResponse && parseInt(mealCreditInAuthResponse) !== parseInt(mealCreditValue);
    this.props.authAtriumPayment(atriumAccount, amountToCharge, atriumAccount.isAutoDetect, isMealCountModified);
    closeModal();
  }

  handleRemovePayment () {
    this.props.atriumRemovePayment(this.props.atriumAccount);
    this.props.closeModal();
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
      if (child.id !== 'atrium-meal-credit-modal') {
        child.inert = false;
      }
    });
  }

  render () {
    const { totalWithTip, currencyDetails, remaining, atriumAccount } = this.props;

    const { mealCreditValue, disableIncrement, disableDecrement } = this.state;

    const disableProcessButton = parseInt(mealCreditValue) === 0 || (atriumAccount.authResponse && parseInt(atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.applied) === parseInt(mealCreditValue));
    const disableRemovePayment = !atriumAccount.authResponse;
    const remainingMealCount = atriumAccount.authResponse ? atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.remaining : atriumAccount.amount.remaining;
    return (
      <Flex id='atrium-meal-credit-modal' role='dialog'>
        <ModalBackground />
        <ModalContainer className='modal-container' onKeyDown={this.onEscape} >
          <ModalBody className='modal-body'>
            <ModalTitle className='modal-title' tabIndex={0} id='atrium-meal-credit-title'
              aria-label={i18n.t('ATRIUM_MEAL_CREDIT')}>
              {<Trans i18nKey='ATRIUM_MEAL_CREDIT'/>}
            </ModalTitle>
            <ModalText className='instruction-text' tabIndex={0}
              aria-label={i18n.t('ATRIUM_MEAL_CARD_INSTRUCTION')}>
              <Trans i18nKey='ATRIUM_MEAL_CARD_INSTRUCTION'/>
            </ModalText>
            <AccountDetailsParent className='currency-parent'>
              <AccountDetailsDiv className='left-div'>
                <ModalText className='display-text'
                  tabIndex={0}
                  aria-label={'Test'}>
                  {atriumAccount.instructionText}
                </ModalText>
              </AccountDetailsDiv>
              <AccountDetailsDiv className='right-div'>
                <ModalText className='display-text'
                  tabIndex={0}
                  aria-label={'Test'}>
                  {remainingMealCount} <Trans i18nKey='ATRIUM_MEAL_CARD_REMAINING'/>
                </ModalText>
              </AccountDetailsDiv>
            </AccountDetailsParent>
            <CustomFlex
              disable-increment={disableIncrement}
              disable-decrement={disableDecrement}>
              <IncrementDecrementInput
                increment={this.handleIncrement}
                decrement={this.handleDecrement}
                value={mealCreditValue}
              />
            </CustomFlex>
            <MainButton
              className='main-btn'
              onClick={this.processPayment}
              disabled={disableProcessButton}
              tabIndex={disableProcessButton ? -1 : 0}
              aria-label={i18n.t('GA_PROCESS_BUTTON')}
              style={{ padding: '0px 0px 3px 0px', margin: '15px auto' }}>
              {
                // processingAtriumAccount
                //   ? <LoadingComponent
                //     className='loading-cont'
                //     color='white'
                //     containerHeight='100%'
                //     containerWidth='100%'
                //     aria-label={i18n.t('PROCESSING_TEXT')}
                //     height='25px'
                //     width='25px'
                //     borderSize={2}
                //     style={{ justifyContent: 'center' }}
                //   />
                //   :
                <div className='submit-btn-room-charge'>
                  <Trans i18nKey='GA_PROCESS_BUTTON'/>
                </div>
              }
            </MainButton>

            <CancelButton
              tabIndex={disableRemovePayment ? -1 : 0}
              aria-label={i18n.t('MODAL_CANCEL')}
              onClick={this.onModalClose}>
              <Trans i18nKey='MODAL_CANCEL'/>
            </CancelButton>
            {
              <CancelButton
                disabled={disableRemovePayment} // TODO:
                tabIndex={disableRemovePayment ? -1 : 0}
                aria-label={i18n.t('MODAL_REMOVE_PAYMENT')}
                onClick={this.handleRemovePayment}
              >
                <Trans i18nKey='MODAL_REMOVE_PAYMENT'/>
              </CancelButton>
            }
            {/* {
              !disableProcessButton &&
              <ModalErrorText aria-live='polite' tabIndex={0} aria-label={i18n.t('GENERIC_PAYMENT_FAILURE')}>
                <Trans i18nKey='GENERIC_PAYMENT_FAILURE'/>
              </ModalErrorText>
            } */}
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
            tabIndex={0}
            aria-label={i18n.t('EXIT_DIALOG')}
            onClick={this.onModalClose}
          />
        </ModalContainer>
      </Flex>

    );
  }
}

export default AtriumModal;
