/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import NavigationMenu from 'web/client/app/components/NavigationMenu/NavigationMenu';
import PaymentSuccess from 'web/client/app/components/PaymentSuccess';
import Cart from 'web/client/app/components/Cart';
import CommunalCart from 'web/client/app/components/CommunalCart';
import CartNotification from 'web/client/app/components/CartNotification';
import ContextBar from 'web/client/app/components/ContextBar';
import BackLink from 'web/client/app/components/BackLink';
import Payment from 'web/client/app/components/Payment';
import InvalidOrderGuidModal from 'web/client/app/components/OrderAtTable/InvalidOrderGuidModal';
import ThrottleCapacityWindow from 'web/client/app/components/ThrottleCapacityWindow';
import { toggleCart, modifyCartItem, incrementItemCount, decrementItemCount, cancelCart, closeCart, closeCartNotification, clearReadyTime, lastCartLocation, checkModifyOrder } from 'web/client/app/modules/cart/sagas'; // eslint-disable-line max-len
import { toggleCommunalCart, modifyCommunalCartItem, cancelCommunalCart, closeCommunalCart, closeCommunalCartNotification, lastCommunalCartLocation, processAndUpadateCommunalCart, fetchingCommunalCartByOrderGuid } from 'web/client/app/modules/communalCart/sagas'; // eslint-disable-line max-len
import { fetchingToken, autoFetchingToken, setTokenizedData, setAppError, setCCPaymentCard, removeCCPaymentCard } from 'web/client/app/modules/iFrame/sagas'; // eslint-disable-line max-len
import { sendReceiptEmail, sendReceiptSMS, getPrintData, sendCustomerEmail }
  from 'web/client/app/modules/communication/sagas';
import { setOrderConfig, getSites, resetSites } from 'web/client/app/modules/site/sagas';
import { setHideScheduleTime, setShowCapacityWindow,
  acceptCapacityTime, setScheduleOrderData, resetScheduleOrderData } from 'web/client/app/modules/scheduleorder/sagas';
import { resetTipData } from 'web/client/app/modules/tip/sagas';
import Loader from 'web/client/app/components/Loader/index';
import LoyaltyProcess from 'web/client/app/components/LoyaltyProcess';
import { sendLoyaltyInquiry, sendLoyaltyInfo, processLoyaltyAccrue, setCartLoyaltyInfo,
  cancelLoyaltyInfo, clearLoyaltyState, processSplitLoyaltyPointsPayment, processSplitLoyaltyVoucherPayment,
  removeLoyaltyPayments, processSplitLoyaltyHostCompVoucherPayment, captureLoyaltyPayment,
  removeAndProcessLoyaltyVoucherPayments, clearLoyaltyError, loadLoyaltyPage } from 'web/client/app/modules/loyalty/sagas';
import { getGAAccountInfo, getGAAccountInquiryInfo, clearGAState, clearGAErrors,
  selectedAccount, resetSelectedAccount, setSelectedIndexWithoutInquiry, authorizeGAPayment,
  authorizeGaSplitPayment, removeAmountAgainstGA, removeGaSplitPayment }
  from 'web/client/app/modules/gaPayment/sagas';
import { processRoomCharge, fetchRoomChargeBySiteId } from 'web/client/app/modules/roomCharge/sagas';
import { fetchMemberChargeBySiteId, processMemberCharge } from 'web/client/app/modules/memberCharge/sagas';
import GAPayment from 'web/client/app/components/GAPayment';
import { showLoginPopup, showSavedCardsPopup, fetchUserInfo, samlLogout } from 'web/client/app/modules/guestProfile/sagas';
import { setTimeoutFlag } from 'web/client/app/modules/error/sagas';
import { setPaymentsAmount, removePaymentsAmount, resetRemaining, removeAllMultiPayments } from 'web/client/app/modules/payOptions/sagas';

import get from 'lodash.get';
import GuestDetails from 'web/client/app/components/GuestDetails';
import { getDeliveryEnabled } from 'web/client/app/utils/LocationUtils';
import { getIframeAuthValue } from 'web/client/app/utils/PaymentUtils';
import RoomCharge from 'web/client/app/components/RoomCharge';
import MemberCharge from 'web/client/app/components/MemberCharge';
import LoyaltyVouchersModal from 'web/client/app/components/LoyaltyModals/LoyaltyVouchersModal';
import LoyaltyPointsModal from 'web/client/app/components/LoyaltyModals/LoyaltyPointsModal';
import LoyaltyHostCompVoucherModal from 'web/client/app/components/LoyaltyModals/LoyaltyHostCompVoucherModal';
import AtriumModal from 'web/client/app/components/AtriumModal/AtriumModal';
import { resetDelivery } from 'web/client/app/modules/deliverylocation/sagas';
import { resetSmsDetails } from 'web/client/app/modules/smsnotification/sagas';
import { resetNameDetails } from 'web/client/app/modules/namecapture/sagas';
import { resetAtrium, authAtriumPayment, atriumRemovePayment } from 'web/client/app/modules/atrium/sagas';

export const ConnectedCart = connect((state, props) => ({
  ...state.cart,
  tipAmount: state.tip.tipAmount,
  ...state.payments,
  cboConfig: state.app.config,
  loginMode: state.profile.loginMode,
  loyaltyInfo: state.loyalty,
  ondToken: state.profile.ondToken,
  continueWithPay: state.profile.continueWithPay,
  continueLoyaltyCheckout: state.profile.continueLoyaltyCheckout,
  scheduledTime: state.scheduleorder.scheduleOrderData.scheduleTime,
  scheduledDay: state.scheduleorder.scheduleOrderData.daysToAdd,
  currencyDetails: state.sites.currencyForPay,
  storesList: state.sites.list,
  fetchingTax: state.sites.fetchingTax,
  loyaltyLinkedAccounts: state.loyalty.loyaltyProcess.loyaltyLinkedAccounts,
  hostCompVoucherPayments: state.loyalty.hostCompVoucherPayments,
  remaining: state.paymentOptions.remaining,
  displayProfileId: state.sites.displayProfileId,
  cartDisplayProfileId: state.cart.displayProfileId,
  samlCookie: state.profile.samlCookie,
  _props: props
}),
(dispatch) => ({
  removeItem: (itemId, uniqueId) => {
    dispatch(modifyCartItem(itemId, 'REMOVE'));
  },
  incrementItemCount: (itemId, uniqueId) => {
    dispatch(incrementItemCount(itemId, uniqueId));
  },
  decrementItemCount: (itemId, uniqueId) => {
    dispatch(decrementItemCount(itemId, uniqueId));
  },
  cancelCart: () => {
    dispatch(cancelCart());
  },
  lastCartLocation: (path) => {
    dispatch(lastCartLocation(path));
  },
  closeCart: (data) => dispatch(closeCart(data)),
  setAppError: (data) => dispatch(setAppError(data)),
  toggleCart: (flag) => dispatch(toggleCart(flag)),
  showLoginPopup: (flag) => dispatch(showLoginPopup(flag)),
  resetTipData: () => dispatch(resetTipData()),
  setOrderConfig: (orderConfig) => dispatch(setOrderConfig(orderConfig)),
  setCartLoyaltyInfo: (siteId, displayProfileId, cartLoyaltyInfo, clearLoyaltyAccount) => dispatch(setCartLoyaltyInfo(siteId, displayProfileId, cartLoyaltyInfo, clearLoyaltyAccount)), // eslint-disable-line max-len
  clearGAState: () => dispatch(clearGAState()),
  resetRemaining: () => dispatch(resetRemaining()),
  removeCCPaymentCard: () => dispatch(removeCCPaymentCard()),
  checkModifyOrder: () => dispatch(checkModifyOrder()), // eslint-disable-line max-len
  clearLoyaltyState: () => dispatch(clearLoyaltyState()),
  removeAllMultiPayments: (cartItem, actionType) => dispatch(removeAllMultiPayments(cartItem, actionType)),
  loadLoyaltyPage: (site, displayProfileId, isLoyaltyEnabled, loyaltyDetails, checkoutFlag) =>
    dispatch(loadLoyaltyPage(site, displayProfileId, isLoyaltyEnabled, loyaltyDetails, checkoutFlag)),
  resetAtrium: () => dispatch(resetAtrium())
}))(Cart);

export const ConnectedCommunalCart = connect((state, props) => ({
  ...state.communalCart,
  cboConfig: state.app.config,
  loginMode: state.profile.loginMode,
  continueWithPay: state.profile.continueWithPay,
  currencyDetails: state.sites.currencyForPay,
  storesList: state.sites.list,
  fetchingTax: state.sites.fetchingTax,
  _props: props
}),
(dispatch) => ({
  removeItem: (item, uniqueId) => dispatch(modifyCommunalCartItem(item, 'REMOVE', uniqueId)),
  cancelCommunalCart: () => dispatch(cancelCommunalCart()),
  lastCommunalCartLocation: (path) => dispatch(lastCommunalCartLocation(path)),
  closeCommunalCart: (data) => dispatch(closeCommunalCart(data)),
  setAppError: (data) => dispatch(setAppError(data)),
  toggleCommunalCart: (flag) => dispatch(toggleCommunalCart(flag)),
  processAndUpadateCommunalCart: (cartItems) => dispatch(processAndUpadateCommunalCart(cartItems)),
  fetchingCommunalCartByOrderGuid: () => dispatch(fetchingCommunalCartByOrderGuid())
}))(CommunalCart);

export const ConnectedCartNotification = connect((state, props) => ({
  ...state.cart,
  _props: props
}),
(dispatch) => ({
  removeItem: (itemId) => {
    dispatch(modifyCartItem(itemId, 'REMOVE'));
  },
  closeCart: (data) => dispatch(closeCart(data)),
  closeCartNotification: (data) => dispatch(closeCartNotification(data))
}))(CartNotification);

export const ConnectedCommunalCartNotification = connect((state, props) => ({
  ...state.communalCart,
  _props: props
}),
(dispatch) => ({
  removeItem: (itemId, uniqueId) => {
    dispatch(modifyCommunalCartItem(itemId, 'REMOVE', uniqueId));
  },
  closeCart: (data) => dispatch(closeCommunalCart(data)),
  closeCartNotification: (data) => dispatch(closeCommunalCartNotification(data))
}))(CartNotification);

export const ConnectedNav = connect((state, props) => {
  return {
    ...state.app,
    ...state.cart,
    siteFetch: state.sites.fetching,
    digitalMenuId: state.app.digitalMenuId,
    cboConfig: state.app.config,
    cartItems: state.cart.items,
    communalCartItems: state.communalCart.items,
    communalCartOpen: state.communalCart.cartOpen,
    lastItemAddedCommunalCart: state.communalCart.lastItemAdded,
    menu: state.menu,
    conceptList: state.concept.list,
    showLoginPopup: state.profile.showLoginPopup,
    ondToken: state.profile.ondToken,
    loginMode: state.profile.loginMode,
    selectedId: state.sites.selectedId,
    displayProfileId: state.sites.displayProfileId,
    isScheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
    isLoyaltyEnabled: state.sites.isLoyaltyEnabled,
    hideScheduleTime: state.scheduleorder.hideScheduleTime,
    continueWithPay: state.profile.continueWithPay,
    samlCookie: state.profile.samlCookie,
    skipSitesPage: state.sites.skipSitesPage,
    multiPassEnabled: state.app.multiPassEnabled,
    _props: props
  };
},
(dispatch) => ({
  toggleCart: (flag) => dispatch(toggleCart(flag)),
  toggleCommunalCart: (flag) => dispatch(toggleCommunalCart(flag)),
  showLoginPopup: (flag) => dispatch(showLoginPopup(flag)),
  setHideScheduleTime: (value) => dispatch(setHideScheduleTime(value)),
  setTimeoutFlag: () => dispatch(setTimeoutFlag()),
  resetSites: () => dispatch(resetSites()),
  samlLogout: () => dispatch(samlLogout())
}))(NavigationMenu);

export const ConnectedContextBar = connect((state, props) => ({
  ...state.app.config,
  ...state.scheduleorder,
  digitalMenuId: state.app.digitalMenuId,
  sites: state.sites,
  menu: state.menu,
  item: state.itemdetails,
  conceptList: state.concept.list,
  conceptOptions: state.concept.conceptOptions,
  hideScheduleTime: state.scheduleorder.hideScheduleTime,
  isScheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
  _props: props
}),
(dispatch) => ({
  cancelCart: () => {
    dispatch(cancelCart());
  },
  cancelCommunalCart: () => dispatch(cancelCommunalCart())
}))(ContextBar);

export const ConnectedBackLink = connect((state, props) => ({
  ...state.cart,
  digitalMenuId: state.app.digitalMenuId,
  siteFetch: state.sites.fetching,
  sites: state.sites,
  menu: state.menu,
  item: state.itemdetails,
  conceptList: state.concept.list,
  isSmsEnabled: get(state.sites.orderConfig, 'sms.isSmsEnabled', false),
  deliveryLocation: getDeliveryEnabled(state.sites.orderConfig),
  tipCapture: get(state.sites.orderConfig, 'tip.acceptTips', false),
  nameCapture: get(state.sites.orderConfig, 'nameCapture.featureEnabled', false),
  isScheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
  isLoyaltyEnabled: state.sites.isLoyaltyEnabled,
  hideScheduleTime: state.scheduleorder.hideScheduleTime,
  multiPassEnabled: state.app.multiPassEnabled,
  _props: props
}),
(dispatch) => ({
  setHideScheduleTime: (value) => dispatch(setHideScheduleTime(value))
}))(BackLink);

export const ConnectedPayment = connect((state, props) => ({
  ...state.payments,
  ...state.cart,
  ...state.paymentOptions,
  tipAmount: state.tip.tipAmount,
  multiPaymentEnabled: state.sites.orderConfig && state.sites.orderConfig.multiPaymentEnabled,
  showCapacityWindow: state.scheduleorder.showCapacityWindow,
  capacityFail: state.scheduleorder.capacityFail,
  paymentType: state.scheduleorder.paymentType,
  paymentsEnabled: get(state.sites.orderConfig, 'pay.paymentsEnabled', false),
  orderThrottling: get(state.sites.orderConfig, 'orderThrottling'),
  payOptions: get(state.sites.orderConfig, 'pay.payOptions'),
  iFrameApi: getIframeAuthValue(state, 'iFrameApi'),
  payTenantId: getIframeAuthValue(state, 'iFrameTenantID'),
  clientId: getIframeAuthValue(state, 'clientId'),
  currencyDetails: state.sites.currencyForPay,
  remaining: state.paymentOptions.remaining,
  totalWithTip: state.cart.total + parseFloat(state.tip.tipAmount),
  storesList: state.sites.list,
  configFetching: state.app.fetching,
  siteFetching: state.sites.fetching,
  userId: state.profile.userId,
  cboConfig: state.app.config,
  _props: props
}),
(dispatch) => ({
  getToken: () => {
    dispatch(fetchingToken());
  },
  getAutoToken: () => {
    dispatch(autoFetchingToken());
  },
  setTokenizedData: (data) => dispatch(setTokenizedData(data)),
  setAppError: (data) => dispatch(setAppError(data)),
  getSites: () => dispatch(getSites()),
  setHideScheduleTime: (value) => dispatch(setHideScheduleTime(value)),
  setOrderConfig: (orderConfig) => dispatch(setOrderConfig(orderConfig)),
  setShowCapacityWindow: (flag) => dispatch(setShowCapacityWindow(flag)),
  setPaymentsAmount: (amount, total, oldAmount) => dispatch(setPaymentsAmount(amount, total, oldAmount)),
  setCCPaymentCard: (obj) => dispatch(setCCPaymentCard(obj))
}))(Payment);

export const ConnectedPaySuccess = connect((state, props) => ({
  ...state.communication,
  ...state.cart,
  sites: state.sites,
  configFetching: state.app.fetching,
  loyaltyAccountFetching: state.loyalty.fetching,
  cartLoyaltyInfo: state.loyalty.cartLoyaltyInfo,
  isPointAccrued: state.loyalty.loyaltyProcess.isPointAccrued,
  loyaltyAccrue: state.loyalty.loyaltyProcess.processAccrue,
  platformGuestProfile: state.platformGuestProfile.profile,
  _props: props

}),
(dispatch) => ({
  getSites: () => dispatch(getSites()),
  cancelCart: () => dispatch(cancelCart()),
  cancelCommunalCart: () => dispatch(cancelCommunalCart()),
  sendReceiptEmail: (data) => dispatch(sendReceiptEmail(data)),
  getPrintData: () => dispatch(getPrintData()),
  sendCustomerEmail: (address) => dispatch(sendCustomerEmail(address)),
  sendReceiptSMS: (data) => dispatch(sendReceiptSMS(data)),
  clearReadyTime: () => dispatch(clearReadyTime()),
  setAppError: (data) => dispatch(setAppError(data)),
  resetSites: () => dispatch(resetSites())
}))(PaymentSuccess);

export const ConnectedLoader = connect((state, props) => ({
  loading: (state.app.fetching ||
            state.concept.fetching ||
            state.menu.fetching ||
            state.sites.fetching ||
            state.itemdetails.fetching ||
            state.communication.fetching),
  _props: props
}))(({ loading, Comp }) => (loading
  ? <Loader />
  : Comp()));

export const ConnectedLoyaltyProcess = connect((state, props) => ({
  ...state.loyalty,
  loyaltyPaymentConfiguration: state.cart.orderConfig.pay.payOptions.find(payOption => payOption.type === 'loyalty'),
  loyaltyDetails: get(state.cart.orderConfig, 'loyaltyDetails', state.loyalty.loyaltyDetails),
  _props: props
}),
(dispatch) => ({
  sendLoyaltyInquiry: (loyaltyInfo, selectedOption, siteId, displayProfileId, clearLoyaltyAccount) =>
    dispatch(sendLoyaltyInquiry(loyaltyInfo, selectedOption, siteId, displayProfileId, clearLoyaltyAccount)),
  sendLoyaltyInfo: (siteId, displayProfileId, isDelayAccount, clearLoyaltyAccount) =>
    dispatch(sendLoyaltyInfo(siteId, displayProfileId, isDelayAccount, clearLoyaltyAccount)),
  sendLoyaltyAccrue: (loyaltyAccrueInfo) => dispatch(processLoyaltyAccrue(loyaltyAccrueInfo)),
  cancelLoyaltyInfo: () => dispatch(cancelLoyaltyInfo()),
  setCartLoyaltyInfo: (siteId, displayProfileId, cartLoyaltyInfo) => dispatch(setCartLoyaltyInfo(siteId, displayProfileId, cartLoyaltyInfo))
}))(LoyaltyProcess);

export const ConnectedGAPayment = connect((state, props) => ({
  ...state.gaPayment,
  ...state.payments,
  totalWithTip: state.cart.total + parseFloat(state.tip.tipAmount),
  currencyDetails: state.sites.currencyForPay,
  idleFlag: state.error.idleFlag,
  appError: state.error.showError,
  remaining: state.paymentOptions.remaining,
  gaAccountConfig: get(state.sites.orderConfig, 'gaAccountConfig', {}),
  gaPaymentConfig: get(state.sites.orderConfig, 'pay.payOptions', []).find(payOption =>
    payOption.type === 'genericAuthorization') || {},
  _props: props
}),
(dispatch) => ({
  getGAAccountInfo: (accountNumber, secondaryVerificationType, secondaryVerificationValue) =>
    dispatch(getGAAccountInfo(accountNumber, secondaryVerificationType, secondaryVerificationValue)),
  getGAAccountInquiryInfo: (indexOfSelectedGAPaymentType) =>
    dispatch(getGAAccountInquiryInfo(indexOfSelectedGAPaymentType)),
  authorizeGAPayment: () => dispatch(authorizeGAPayment()),
  clearGAState: () => dispatch(clearGAState()),
  clearGAErrors: () => dispatch(clearGAErrors()),
  selectedAccount: (account) => dispatch(selectedAccount(account)),
  resetSelectedAccount: (account) => dispatch(resetSelectedAccount()),
  setSelectedIndexWithoutInquiry: (index) => dispatch(setSelectedIndexWithoutInquiry(index)),
  authorizeGaSplitPayment: (account, amount, isAmountModified, isLastPayment) => dispatch(authorizeGaSplitPayment(account, amount, isAmountModified, isLastPayment)), // eslint-disable-line max-len
  removeAmountAgainstGA: (account) => dispatch(removeAmountAgainstGA(account)),
  setPaymentsAmount: (amount, total, oldAmount) => dispatch(setPaymentsAmount(amount, total, oldAmount)),
  removePaymentsAmount: (amount, total) => dispatch(removePaymentsAmount(amount, total)),
  removeGaSplitPayment: (selectedAccount) => dispatch(removeGaSplitPayment(selectedAccount))
}))(GAPayment);

export const ConnectedCapacityWindow = connect((state, props) => ({
  ...state.scheduleorder,
  _props: props
}),
(dispatch) => ({
  setScheduleOrderData: (scheduleOrder) => dispatch(setScheduleOrderData(scheduleOrder)),
  setShowCapacityWindow: (flag) => dispatch(setShowCapacityWindow(flag)),
  acceptCapacityTime: (scheduledOrderCompletionTime) => dispatch(acceptCapacityTime(scheduledOrderCompletionTime)),
  setHideScheduleTime: (value) => dispatch(setHideScheduleTime(value)),
  resetScheduleOrderData: () => dispatch(resetScheduleOrderData()),
  clearGAState: () => dispatch(clearGAState()),
  resetDelivery: () => dispatch(resetDelivery()),
  resetSmsDetails: () => dispatch(resetSmsDetails()),
  resetTipData: () => dispatch(resetTipData()),
  resetNameDetails: () => dispatch(resetNameDetails()),
  resetRemaining: () => dispatch(resetRemaining()),
  cancelCart: () => dispatch(cancelCart()),
  resetAtrium: () => dispatch(resetAtrium()),
  removeCCPaymentCard: () => dispatch(removeCCPaymentCard()),
  clearLoyaltyState: () => dispatch(clearLoyaltyState())
}))(ThrottleCapacityWindow);

export const ConnectedGuestDetails = connect((state, props) => ({
  ...state.profile,
  siteAuth: state.app.config.siteAuth,
  _props: props
}),
(dispatch) => ({
  showSavedCardsPopup: (flag) => dispatch(showSavedCardsPopup(flag)),
  fetchUserInfo: (loginMode) => dispatch(fetchUserInfo(loginMode))
}))(GuestDetails);

export const ConnectedRoomCharge = connect((state, props) => ({
  cartItems: state.cart.items,
  contextId: state.roomCharge.contextId,
  fetchingRoomCharge: state.roomCharge.fetchingRoomCharge,
  roomChargeDetails: state.roomCharge.roomChargeDetails,
  roomChargeError: state.roomCharge.roomChargeError,
  inquiryError: state.roomCharge.inquiryError,
  roomChargeInquiry: state.roomCharge.roomChargeInquiry,
  disableProcess: state.roomCharge.disableProcess,
  roomChargeCapture: state.roomCharge.roomChargeCapture,
  _props: props
}),
(dispatch) => ({
  fetchRoomChargeBySiteId: (siteId, displayProfileId) => dispatch(fetchRoomChargeBySiteId(siteId, displayProfileId)),
  processRoomCharge: (roomChargePayload) => dispatch(processRoomCharge(roomChargePayload))
}))(RoomCharge);

export const ConnectedMemberCharge = connect((state, props) => ({
  cartItems: state.cart.items,
  contextId: state.memberCharge.contextId,
  tenderId: state.memberCharge.tenderId,
  inquiryError: state.memberCharge.inquiryError,
  memberChargeError: state.memberCharge.memberChargeError,
  memberChargeCapture: state.memberCharge.memberChargeCapture,
  disableProcess: state.memberCharge.disableProcess,
  _props: props
}),
(dispatch) => ({
  fetchMemberChargeBySiteId: (siteId, displayProfileId) => dispatch(fetchMemberChargeBySiteId(siteId, displayProfileId)),
  processMemberCharge: (memberChargePayload) => dispatch(processMemberCharge(memberChargePayload))
}))(MemberCharge);

export const ConnectedLoyaltyVoucherModal = connect((state, props) => ({
  processingLoyaltyTransaction: state.loyalty.processingLoyaltyTransaction,
  loyaltyPaymentConfiguration: state.sites.orderConfig.pay.payOptions.find(payOption => payOption.type === 'loyalty'),
  totalWithTip: state.cart.total + parseFloat(state.tip.tipAmount),
  currencyDetails: state.sites.currencyForPay,
  loyaltyPaymentError: state.loyalty.loyaltyPaymentError,
  _props: props
}),
(dispatch) => ({
  removeLoyaltyPayments: (payments) => dispatch(removeLoyaltyPayments(payments)),
  captureLoyaltyPayment: (voucher, paymentType) => dispatch(captureLoyaltyPayment(voucher, paymentType)),
  processSplitLoyaltyVoucherPayment: (vouchers, amountToCharge, isAmountModified, isLastPayment) => dispatch(processSplitLoyaltyVoucherPayment(vouchers, amountToCharge, isAmountModified, isLastPayment)),
  removeAndProcessLoyaltyVoucherPayments: (voidPayments, capturePayments, amountToCharge, isAmountModified, isLastPayment) => dispatch(removeAndProcessLoyaltyVoucherPayments(voidPayments, capturePayments, amountToCharge, isAmountModified, isLastPayment)),
  clearLoyaltyError: () => dispatch(clearLoyaltyError())
}))(LoyaltyVouchersModal);

export const ConnectedLoyaltyPointsModal = connect((state, props) => ({
  processingLoyaltyTransaction: state.loyalty.processingLoyaltyTransaction,
  processingMultipleActions: state.loyalty.processingMultipleActions,
  loyaltyPaymentConfiguration: state.sites.orderConfig.pay.payOptions.find(payOption => payOption.type === 'loyalty'),
  totalWithTip: state.cart.total + parseFloat(state.tip.tipAmount),
  currencyDetails: state.sites.currencyForPay,
  loyaltyPaymentError: state.loyalty.loyaltyPaymentError,
  _props: props
}),
(dispatch) => ({
  captureLoyaltyPayment: (loyaltyPointsAccount, paymentType) => dispatch(captureLoyaltyPayment(loyaltyPointsAccount, paymentType)),
  processSplitLoyaltyPointsPayment: (pointsAccount, amountToCharge, isAmountModified, isLastPayment) => dispatch(processSplitLoyaltyPointsPayment(pointsAccount, amountToCharge, isAmountModified, isLastPayment)),
  removeLoyaltyPayments: (payments) => dispatch(removeLoyaltyPayments(payments)),
  clearLoyaltyError: () => dispatch(clearLoyaltyError())
}))(LoyaltyPointsModal);

export const ConnectedLoyaltyHostCompVoucherModal = connect((state, props) => ({
  processingLoyaltyTransaction: state.loyalty.processingLoyaltyTransaction,
  loyaltyPaymentConfiguration: state.sites.orderConfig.pay.payOptions.find(payOption => payOption.type === 'loyalty'),
  totalWithTip: state.cart.total + parseFloat(state.tip.tipAmount),
  currencyDetails: state.sites.currencyForPay,
  loyaltyPaymentError: state.loyalty.loyaltyPaymentError,
  _props: props
}),
(dispatch) => ({
  captureLoyaltyPayment: (voucher, paymentType) => dispatch(captureLoyaltyPayment(voucher, paymentType)),
  clearLoyaltyError: () => dispatch(clearLoyaltyError()),
  removeLoyaltyPayments: (payments) => dispatch(removeLoyaltyPayments(payments)),
  processSplitLoyaltyHostCompVoucherPayment: (voucher, amountToCharge, isAmountModified, isLastPayment) => dispatch(processSplitLoyaltyHostCompVoucherPayment(voucher, amountToCharge, isAmountModified, isLastPayment))
}))(LoyaltyHostCompVoucherModal);

export const ConnectedAtriumModal = connect((state, props) => ({
  _props: props,
  processingAtriumAccount: state.atrium.proccessAtriumAccount
}),
(dispatch) => ({
  authAtriumPayment: (account, amountToCharge, isAutoDetect, isMealCountModified) => dispatch(authAtriumPayment(account, amountToCharge, isAutoDetect, isMealCountModified)), // eslint-disable-line max-len
  atriumRemovePayment: (atriumAccount) => dispatch(atriumRemovePayment(atriumAccount))
}))(AtriumModal);
export const ConnectedOrderGuidModal = connect((state, props) => ({
  invalidScreen: state.sites.list.length === 1 && state.sites.list[0].invalidScreen,
  _props: props
}),
(dispatch) => ({}))(InvalidOrderGuidModal);
