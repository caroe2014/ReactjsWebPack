// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Fixed } from 'rebass';
import PaymentOptions from 'web/client/app/components/PaymentOptions';
import { connect } from 'react-redux';
import { makeCharge, resetStripe } from 'web/client/app/modules/stripepay/sagas';
import { toggleFetchAuthResponse, selectedAccount } from 'web/client/app/modules/gaPayment/sagas';
import { setAppError, removeCCPaymentCard } from 'web/client/app/modules/iFrame/sagas';
import { ConnectedPayment, ConnectedCapacityWindow } from 'web/client/app/reduxpages/ConnectedComponents';
import Loader from 'web/client/app/components/Loader/index';
import { getOrderConfigurationDetails } from 'web/client/app/utils/OrderConfig';
import { setShowCapacityWindow } from 'web/client/app/modules/scheduleorder/sagas';
import { getSites, setOrderConfig, setCurrencyForPay, getSiteTaxRuleData } from 'web/client/app/modules/site/sagas';
import i18n from 'web/client/i18n';
import get from 'lodash.get';
import config from 'app.config';
import { showSavedCardsPopup, saveUserPage } from 'web/client/app/modules/guestProfile/sagas';
import { STRIPE_COUNTRY, paymentTypes } from 'web/client/app/utils/constants';
import {
  processMultiPayment, setPaymentsAmount, removePaymentsAmount
} from 'web/client/app/modules/payOptions/sagas';
import { removeRoomChargeAccountInfo, clearRoomChargeError } from 'web/client/app/modules/roomCharge/sagas';
import { removeMemberChargeAccountInfo, clearMemberChargeError } from 'web/client/app/modules/memberCharge/sagas';
import { getLoyaltyInquiry, sendLoyaltyInquiry } from 'web/client/app/modules/loyalty/sagas';
import {
  atriumInquiry, atriumRemovePayment, authAtriumPayment, authAtriumAutoDetectPayment
} from 'web/client/app/modules/atrium/sagas';
import Modal from 'web/client/app/components/Modal';

const logger = config.logger.child({ childName: 'payments' });

const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: rgba(0,0,0,0.5);
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StripeLoader = styled(LoadingContainer)`
  background-color: rgba(0, 0, 0, 0.5);
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Container = styled(Flex)`
  align-items: left;
  flex-wrap: wrap;
  flex-direction: row;
  height: auto;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  ${props => props.theme.mediaBreakpoints.desktop`
    padding-left: 0px; 
    padding-right: 0px;
    min-height: 680px;
    `}
  margin: 120px auto 0px auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BackgroundContainer = styled.div`
  max-width: 641px;
  width: 100%;
  background: ${props => props.theme.colors.light};
  z-index: -1;
  position: fixed;
  height: 100%;
  border-left: 1px solid lightgrey;
  border-right: 1px solid lightgrey;
  ${props => props.theme.mediaBreakpoints.tablet`
    border-left: 20px solid ${props => props.theme.colors.light};
    border-right: 20px solid ${props => props.theme.colors.light};
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const PaymentList = styled(Flex)`
  flex-wrap: wrap;
  flex-direction: column;
  height: auto;
  flex-grow:
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  ${props => props.theme.mediaBreakpoints.desktop`height: 100%;`};
`;

const responsiveMatch = global.matchMedia(`(min-width: 64em)`);

class PaymentPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOptionId: 'rGuestIframe',
      isMobile: !responsiveMatch.matches,
      isPayValid: false,
      refreshSession: false,
      showModal: false
    };
    this._mediaQueryChanged = this._mediaQueryChanged.bind(this);
    this.checkPaymentApi = this.checkPaymentApi.bind(this);
    this.handlePaymentToken = this.handlePaymentToken.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.initializeStripe = this.initializeStripe.bind(this);
    this.onCapacityWindowClose = this.onCapacityWindowClose.bind(this);
    this.showSavedCards = this.showSavedCards.bind(this);
    this.closeIframeModal = this.closeIframeModal.bind(this);
    this.getPayOptions = this.getPayOptions.bind(this);
    this.showPaymentDeleteModal = this.showPaymentDeleteModal.bind(this);
    this.onModalContinue = this.onModalContinue.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getAtriumAccountInquiry = this.getAtriumAccountInquiry.bind(this);
  }

  componentWillMount () {
    responsiveMatch.addListener(this._mediaQueryChanged);
    this.setState({
      responsiveMatch,
      isMobile: !responsiveMatch.matches
    });
    this.onEmptyCart();
    if (this.props.storesList.length === 0) {
      this.props.getSites();
    }
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.initializeStripe(this.props.stripePublishableKey, this.props.countryCode);
    this.props.setShowCapacityWindow(false);
    this.props.getLoyaltyInquiry();
    // TODO: getLoyaltyInquiryByCallbackId
    this.getAtriumAccountInquiry(this.props);
  }

  initializeStripe (stripePublishableKey, countryCode) {
    try {
      if (stripePublishableKey) {
        this.stripe = Stripe(stripePublishableKey); // eslint-disable-line no-undef
        this.paymentRequest = this.stripe.paymentRequest({
          country: countryCode || STRIPE_COUNTRY,
          currency: get(this.props.currencyDetails, 'currencyCode', 'USD').toLowerCase(),
          total: {
            label: i18n.t('STRIPE_LABEL'),
            amount: Math.round(Number(this.props.remaining || this.props.total) * 100)
          },
          requestPayerName: true,
          requestPayerEmail: true,
          requestPayerPhone: true
        });
        this.checkPaymentApi();
        this.handlePaymentToken();
      }
    } catch (err) {
      logger.error(err);
    }
  }

  checkPaymentApi = async () => {
    const compInstance = this;
    this.paymentRequest.canMakePayment().then(function (result) {
      if (result) {
        compInstance.setState({ isPayValid: true, isApplePay: result.applePay });
      } else {
        compInstance.setState({ isPayValid: false });
      }
    });
  }

  handlePaymentToken () {
    const { cartItems, appconfig } = this.props;
    const businessContextId = cartItems[0].contextId;
    const profileId = appconfig.storeList.filter(store => store.businessContextId === businessContextId)[0].displayProfileId; // eslint-disable-line max-len

    this.paymentRequest.on('token', (ev) => {
      const obj = {
        token: ev.token.id,
        amount: this.props.multiPaymentEnabled ? (this.props.remaining || this.props.totalWithTip) : this.props.total,
        currency: get(this.props.currencyDetails, 'currencyCode', 'USD').toLowerCase(),
        label: i18n.t('STRIPE_LABEL'),
        businessContextId,
        profileId
      };
      if (obj.token) {
        ev.complete('success');
        this.props.makeCharge(obj);
        if (this.props.multiPaymentEnabled) {
          this.props.setPaymentsAmount(this.props.remaining ||
            parseFloat(this.props.totalWithTip), parseFloat(this.props.totalWithTip), 0);
        }
      } else {
        ev.complete('fail');
      }
    });
  }

  handlePayment (selectedOption) {
    if (this.state.isPayValid) {
      this.paymentRequest.update({
        total: {
          label: i18n.t('STRIPE_LABEL'),
          amount: Math.round(Number(this.props.remaining || this.props.totalWithTip) * 100)
        }
      });
      this.paymentRequest.show();
      this.setState({ selectedOptionId: selectedOption });
    }
  }

  componentWillReceiveProps (nextProps) {
    const { cartItems, storesList, history, getSiteTaxRuleData, vatEnabled, displayProfileId } = this.props;
    if (storesList.length !== nextProps.storesList.length && nextProps.storesList.length > 0) {
      const orderConfig = getOrderConfigurationDetails(cartItems, nextProps.storesList, displayProfileId);
      if (vatEnabled && !orderConfig.taxRuleData) {
        getSiteTaxRuleData(cartItems[0].contextId, displayProfileId, true);
      }
      this.props.setOrderConfig(orderConfig);
      this.props.setCurrencyForPay(cartItems[0].contextId, displayProfileId);
      this.initializeStripe(get(orderConfig, 'pay.stripeConfig.config.publishableKey'), get(orderConfig, 'pay.stripeConfig.config.countryCode')); // eslint-disable-line max-len
      this.getAtriumAccountInquiry(this.props);
    }
    if ((this.props.taxError !== nextProps.taxError && nextProps.taxError) ||
      (this.props.siteError !== nextProps.siteError && nextProps.siteError)) {
      history.replace('/');
    }

    if (storesList.length > 0 && this.props.userId !== nextProps.userId && nextProps.userId) {
      this.getAtriumAccountInquiry(nextProps);
    }
  }

  componentDidUpdate (prevProps) {
    const { chargeData } = this.props;
    if (prevProps.chargeData !== chargeData) {
      this.redirectToSuccess();
      return;
    }
    this.onEmptyCart();
  }

  getAtriumAccountInquiry (values) {
    const props = values || this.props;
    if (props.payOptions && props.payOptions.length > 0) {
      const atriumPayConfig = props.payOptions.find(option => option.type === 'atrium');
      if (props.atriumAccountInfo.length === 0 && atriumPayConfig && props.userId && props.storesList.length > 0) {
        props.atriumInquiry();
      }
    }
  }

  onEmptyCart () {
    const { items, lastCartLocation, history } = this.props;
    if (!items || items.length === 0) {
      history.replace(lastCartLocation || '/');
    }
  }

  _mediaQueryChanged () {
    this.state.responsiveMatch && this.setState({
      isMobile: !this.state.responsiveMatch.matches
    });
  }

  redirectToSuccess () {
    this.props.history.push('/paymentSuccess');
  }

  handleOption (selectedOption) {
    this.setState({ selectedOptionId: selectedOption });
    if (selectedOption === 'rGuestIframe') {
      this.setState({ showModal: true });
    } else if (selectedOption === 'multipass') {

    }
  }

  closeIframeModal () {
    this.setState({ showModal: false });
  }

  componentWillUnmount () {
    responsiveMatch && responsiveMatch.removeListener(this._mediaQueryChanged);
  }

  onCapacityWindowClose () {
    const { tokenizedData, stripeChargeData, totalWithTip, roomChargeAccountInfo,
      memberChargeAccountInfo } = this.props;
    if (this.props.paymentType === paymentTypes.IFRAME) {
      this.setState({ refreshSession: !this.state.refreshSession });
    } else if (this.props.paymentType === paymentTypes.GA || this.props.paymentType === paymentTypes.GA_LASTMULTIPAYMENT) { // eslint-disable-line max-len
      this.props.toggleFetchAuthResponse(false);
    } else if (this.props.paymentType === paymentTypes.MULTIPAYMENT) {
      this.props.removeCCPaymentCard();
      this.props.resetStripe();
      if (tokenizedData || stripeChargeData) {
        const amountAgainstPayment = tokenizedData ? get(tokenizedData, 'paymentDetails.multiPaymentAmount', '0.00') : get(stripeChargeData, 'amount', '0.00'); // eslint-disable-line max-len
        this.props.removePaymentsAmount(amountAgainstPayment, totalWithTip);
      } else if (roomChargeAccountInfo) {
        this.props.removeRoomChargeAccountInfo();
      } else if (memberChargeAccountInfo) {
        this.props.removeMemberChargeAccountInfo();
      }
      this.props.toggleFetchAuthResponse(false);
    } else if (this.props.paymentType === paymentTypes.STRIPE) {
      this.props.resetStripe();
    } else if (this.props.paymentType === paymentTypes.ROOM_CHARGE) {
      this.props.removeRoomChargeAccountInfo();
    } else if (this.props.paymentType === paymentTypes.MEMBER_CHARGE) {
      this.props.removeMemberChargeAccountInfo();
    }
  }

  showSavedCards () {
    this.props.showSavedCardsPopup(true);
  }

  getPayOptions () {
    const { multiPassEnabled, payOptions } = this.props;
    if (multiPassEnabled) {
      return [{
        type: 'mutipass',
        paymentEnabled: true,
        displayLabel: 'Pay At Cashier',
        valid: true
      }];
    }
    return payOptions;
  }

  showPaymentDeleteModal (paymentType, callbackValue) {
    this.setState({ paymentType, callbackValue, showDeletePaymentModal: true });
  }

  onModalContinue () {
    this.props.atriumRemovePayment(this.state.callbackValue);
    this.setState({ paymentType: undefined, callbackValue: undefined, showDeletePaymentModal: false });
  }

  closePopup () {
    this.setState({ paymentType: undefined, callbackValue: undefined, showDeletePaymentModal: false });
  }

  render () {
    const { configFetching, siteFetching, history, storesList, stripeEnabled,
      stripeCreditCard, stripeApplePay, capacityFetching, stripeFetching,
      iFrameFetching, multiPaymentFetching, removingAllPayments, fetchingTax,
      paymentLoyaltyDetails, showTaxableTendersOnly } = this.props;

    const payOptions = this.getPayOptions();
    const { showDeletePaymentModal } = this.state;

    return (
      (!configFetching && !siteFetching && !fetchingTax && !removingAllPayments && storesList.length > 0)
        ? <ThemeProvider theme={theme}>
          <React.Fragment>
            <Container className='payments-container-parent'>
              {(stripeFetching || capacityFetching || iFrameFetching) && <StripeLoader><Loader /></StripeLoader>}
              <BackgroundContainer className='container-background' />
              <PaymentList className='desktop-pay'>
                <PaymentOptions
                  instructionText={this.props.paymentInstructionText}
                  keyProps={payOptions}
                  savedCards={this.props.savedCards}
                  gaAccounts={this.props.gaAccounts}
                  gaAccountInfoSuccess={this.props.gaAccountInfoSuccess}
                  selectedOptionId={this.state.selectedOptionId}
                  onSelectOption={(data) => this.handleOption(data)}
                  contextId={this.props.order.contextId}
                  handlePayment={this.handlePayment}
                  isPayValid={this.state.isPayValid}
                  isApplePay={this.state.isApplePay}
                  stripeEnabled={stripeEnabled}
                  stripeCreditCard={stripeCreditCard}
                  stripeApplePay={stripeApplePay}
                  showSavedCards={this.showSavedCards}
                  paymentLoyaltyDetails={paymentLoyaltyDetails}
                  showPaymentDeleteModal={this.showPaymentDeleteModal}
                  showModal={this.state.showModal}
                  getAtriumAccountInquiry={this.getAtriumAccountInquiry}
                  showTaxableTendersOnly={showTaxableTendersOnly}
                  {...this.props}
                />
              </PaymentList>
              {this.state.showModal &&
                <ConnectedPayment history={history}
                  closeModal={this.closeIframeModal}
                  refreshSession={this.state.refreshSession}
                />
              }
              {this.props.showCapacityWindow &&
                <ConnectedCapacityWindow
                  history={this.props.history}
                  onHandleClose={this.onCapacityWindowClose}
                />}
            </Container>
            {multiPaymentFetching && <LoadingContainer className='loading-container'><Loader /></LoadingContainer>}
            {showDeletePaymentModal &&
              <Modal
                open={showDeletePaymentModal}
                showCancelButton
                showClose
                onCancel={this.closePopup}
                onClose={this.closePopup}
                onContinue={this.onModalContinue}
                cancelButtonText={i18n.t('MODAL_CANCEL')}
                continueButtonText={i18n.t('MODAL_OK')}
                title={''}
                textI18nKey={i18n.t('MODAL_REMOVE_PAYMENT_MESSAGE')}
              />}
          </React.Fragment>
        </ThemeProvider>
        : <LoadingContainer><Loader /></LoadingContainer>
    );
  }
}

const mapStateToProps = (state, props) => ({
  ...state.payments,
  ...state.stripepayments,
  ...state.cart,
  ...state.paymentOptions,
  ...state.loyalty,
  displayProfileId: state.cart.displayProfileId,
  showTaxableTendersOnly: state.paymentOptions.showTaxableTenders,
  appconfig: state.app.config,
  currencyDetails: state.sites.currencyDetails,
  paymentDetails: state.sites.orderConfig.pay,
  paymentInstructionText: get(state.sites.orderConfig, 'pay.paymentInstructionText'),
  payOptions: get(state.sites.orderConfig, 'pay.payOptions'),
  storesList: state.sites.list,
  cartItems: state.cart.items,
  configFetching: state.app.fetching,
  siteFetching: state.sites.fetching,
  stripeEnabled: get(state.sites.orderConfig, 'pay.stripeConfig.paymentEnabled', false),
  stripePublishableKey: get(state.sites.orderConfig, 'pay.stripeConfig.config.publishableKey'),
  countryCode: get(state.sites.orderConfig, 'pay.stripeConfig.config.countryCode'),
  stripeCreditCard: get(state.sites.orderConfig, 'pay.stripeConfig.creditAndDebitCardConfig'),
  stripeApplePay: get(state.sites.orderConfig, 'pay.stripeConfig.applePayConfig'),
  stripeFetching: state.stripepayments.fetching,
  capacityFetching: state.scheduleorder.fetching,
  iFrameFetching: state.payments.saleFetching,
  ccCardInfo: state.payments.ccCardInfo,
  showCapacityWindow: state.scheduleorder.showCapacityWindow,
  paymentType: state.scheduleorder.paymentType,
  multiPaymentData: state.scheduleorder.multiPaymentData,
  savedCards: state.profile.cardInfo,
  accountPopupFlag: state.gaPayment.accountPopupFlag,
  gaAccounts: state.gaPayment.gaAccountsInfoList,
  gaAccountInfoSuccess: state.gaPayment.accountInfoSuccess,
  remaining: state.paymentOptions.remaining,
  remainingTipAmount: state.paymentOptions.remainingTipAmount,
  multiPaymentEnabled: state.sites.orderConfig.multiPaymentEnabled,
  totalWithTip: state.cart.total + parseFloat(state.tip.tipAmount),
  totalWithoutTip: state.cart.total,
  multiPaymentFetching: state.paymentOptions.multiPaymentFetching,
  removingAllPayments: state.paymentOptions.removingAllPayments,
  gaSplitAuthResponse: state.gaPayment.authResponse,
  removeGAPaymentResponse: state.gaPayment.removeGAPaymentResponse,
  roomChargeAccountInfo: state.roomCharge.roomChargeAccountInfo,
  memberChargeAccountInfo: state.memberCharge.memberChargeAccountInfo,
  loyaltyAccounts: state.loyalty.loyaltyProcess.loyaltyLinkedAccounts,
  loyaltyPaymentResponse: state.loyalty.loyaltyPaymentResponse,
  removeLoyaltyPaymentResponse: state.loyalty.removeLoyaltyPaymentResponse,
  displayOptions: state.sites.orderConfig.displayOptions,
  siteError: state.sites.error,
  taxError: state.sites.taxError,
  paymentLoyaltyDetails: state.sites.orderConfig.loyaltyDetails,
  multiPassEnabled: state.app.multiPassEnabled,
  atriumAccountInfo: state.atrium.accountInfo,
  atriumFetchingInquiry: state.atrium.fetchingInquiry,
  orderConfig: state.sites.orderConfig,
  userId: state.profile.userId,
  atriumInquiryError: state.atrium.inquiryError,
  proccessAtriumAccount: state.atrium.proccessAtriumAccount,
  atriumEntryPoint: get(state, 'app.config.siteAuth.config.integrationUrl'),
  samlFriendlyName: get(state, 'app.config.siteAuth.config.samlFriendlyName'),
  samlHostDomain: get(state, 'app.config.siteAuth.config.samlHostDomain'),
  samlIdentifierFormat: get(state, 'app.config.siteAuth.config.samlIdentifierFormat'),
  samlAssertPathOverride: get(state, 'app.config.siteAuth.config.samlAssertPathOverride'),
  keystoreLocation: get(state, 'app.config.siteAuth.config.keystoreLocation'),
  vatEnabled: state.cart.vatEnabled,
  _props: props
});

const mapDispatchToProps = (dispatch) => ({
  makeCharge: (data) => dispatch(makeCharge(data)),
  setAppError: (data) => dispatch(setAppError(data)),
  getSites: () => dispatch(getSites()),
  setOrderConfig: (orderConfig) => dispatch(setOrderConfig(orderConfig)),
  setShowCapacityWindow: (flag) => dispatch(setShowCapacityWindow(flag)),
  showSavedCardsPopup: (flag) => dispatch(showSavedCardsPopup(flag)),
  toggleFetchAuthResponse: (flag) => dispatch(toggleFetchAuthResponse(flag)),
  selectedAccount: (account) => dispatch(selectedAccount(account)),
  processMultiPayment: (account) => dispatch(processMultiPayment(account)),
  setPaymentsAmount: (amount, total, oldAmount) => dispatch(setPaymentsAmount(amount, total, oldAmount)),
  removeCCPaymentCard: () => dispatch(removeCCPaymentCard()),
  resetStripe: () => dispatch(resetStripe()),
  removePaymentsAmount: (amountRemoved, totalAmount) => dispatch(removePaymentsAmount(amountRemoved, totalAmount)),
  removeRoomChargeAccountInfo: () => dispatch(removeRoomChargeAccountInfo()),
  removeMemberChargeAccountInfo: () => dispatch(removeMemberChargeAccountInfo()),
  clearRoomChargeError: () => dispatch(clearRoomChargeError()),
  clearMemberChargeError: () => dispatch(clearMemberChargeError()),
  getLoyaltyInquiry: () => dispatch(getLoyaltyInquiry()),
  sendLoyaltyInquiry: (loyaltyInfo, selectedOption, siteId, displayProfileId) => dispatch(sendLoyaltyInquiry(loyaltyInfo, selectedOption, siteId, displayProfileId)), // eslint-disable-line max-len
  setCurrencyForPay: (siteId, displayProfileId) => dispatch(setCurrencyForPay(siteId, displayProfileId)),
  getSiteTaxRuleData: (siteId, displayProfileId, showError) => dispatch(getSiteTaxRuleData(siteId, displayProfileId, showError)), // eslint-disable-line max-len
  atriumInquiry: () => dispatch(atriumInquiry()),
  atriumRemovePayment: (atriumAccount) => dispatch(atriumRemovePayment(atriumAccount)),
  authAtriumAutoDetectPayment: (account, amountToCharge) => dispatch(authAtriumAutoDetectPayment(account, amountToCharge)), // eslint-disable-line max-len
  authAtriumPayment: (account, amountToCharge, isAutoDetect) => dispatch(authAtriumPayment(account, amountToCharge, isAutoDetect)), // eslint-disable-line max-len
  saveUserPage: (page) => dispatch(saveUserPage(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
