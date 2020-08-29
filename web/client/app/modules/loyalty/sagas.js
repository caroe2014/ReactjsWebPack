/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import { call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import config from 'app.config';
import moment from 'moment-timezone';
import get from 'lodash.get';
import i18n from 'web/client/i18n';
import { loyaltyConfig, loyaltyTenderMappings } from 'web/client/app/utils/constants';
import { getHighValueVoucher, sortByExpiry } from 'web/client/app/utils/PaymentUtils';
import { fetchProfitCenterIfNeeded } from 'web/client/app/modules/site/sagas';
import { buildReceiptInfoPayload } from 'web/client/app/modules/communication/sagas';
import {
  setPaymentsAmount, removePaymentsAmount, setRemainingTipAmount, updateShowTaxableTendersOnly
} from 'web/client/app/modules/payOptions/sagas';
import { saleTransactionSucceeded, fetchEtfData } from 'web/client/app/modules/iFrame/sagas';
import { calculatePayableAmountWithTip } from 'web/client/app/utils/common';
import { updateCartOnPayments } from 'web/client/app/modules/cart/sagas';
import { getCurrentStore,
  getCloseOrderPayload,
  getCartProfitCenterId,
  getCurrencyDetails,
  getOrder,
  getTenantId,
  getTipAmount,
  getCartTotalAmount,
  getRemainingTipAmount,
  getRemainingAmount,
  getCartDisplayProfileId,
  getTotalOrderAmount } from 'web/client/app/utils/StateSelector';

export const SKIP_LOYALTY_REWARDS = 'SKIP_LOYALTY_REWARDS';
export const SEND_LOYALTY_INFO = 'SEND_LOYALTY_INFO';
export const CANCEL_LOYALTY_INFO = 'CANCEL_LOYALTY_INFO';
export const LOYALTY_INFO_SUCCESS = 'LOYALTY_INFO_SUCCESS';
export const LOYALTY_INFO_FAILED = 'LOYALTY_INFO_FAILED';
export const LOYALTY_INFO_SENT = 'LOYALTY_INFO_SENT';
export const RESET_LOYALTY_REWARDS = 'RESET_LOYALTY_REWARDS';
export const LOAD_LOYALTY_PAGE = 'LOAD_LOYALTY_PAGE';
export const GET_LOYALTY = 'GET_LOYALTY';
export const UPDATE_LOYALTY_MAP = 'UPDATE_LOYALTY_MAP';
export const PROCESS_LOYALTY_ACCRUE = 'PROCESS_LOYALTY_ACCRUE';
export const LOYALTY_ACCRUE_SUCCESS = 'LOYALTY_ACCRUE_SUCCESS';
export const LOYALTY_ACCRUE_FAILED = 'LOYALTY_ACCRUE_FAILED';
export const CART_LOYALTY_INFO = 'CART_LOYALTY_INFO';
export const RESET_LOYALTY_MAP = 'RESET_LOYALTY_MAP';
export const SEND_LOYALTY_INQUIRY = 'SEND_LOYALTY_INQUIRY';
export const SENT_LOYALTY_INQUIRY = 'SENT_LOYALTY_INQUIRY';
export const LOYALTY_INQUIRY_SUCCESS = 'LOYALTY_INQUIRY_SUCCESS';
export const LOYALTY_INQUIRY_FAILED = 'LOYALTY_INQUIRY_FAILED';
export const SHOW_LOYALTY_MODAL = 'SHOW_LOYALTY_MODAL';
export const GET_LOYALTY_INQUIRY = 'GET_LOYALTY_INQUIRY';
export const CAPTURE_LOYALTY_PAYMENT = 'CAPTURE_LOYALTY_PAYMENT';
export const CAPTURE_LOYALTY_PAYMENT_FAILED = 'CAPTURE_LOYALTY_PAYMENT_FAILED';
export const REMOVE_LOYALTY_PAYMENTS = 'REMOVE_LOYALTY_PAYMENTS';
export const REMOVE_LOYALTY_PAYMENTS_SUCCESS = 'REMOVE_LOYALTY_PAYMENTS_SUCCESS';
export const REMOVE_LOYALTY_PAYMENTS_FAILED = 'REMOVE_LOYALTY_PAYMENTS_FAILED';
export const CAPTURE_LOYALTY_POINTS_SPLIT_PAYMENT = 'CAPTURE_LOYALTY_POINTS_SPLIT_PAYMENT';
export const CAPTURE_LOYALTY_POINTS_PAYMENT_SUCCESS = 'CAPTURE_LOYALTY_POINTS_PAYMENT_SUCCESS';
export const CAPTURE_LOYALTY_POINTS_PAYMENT_FAILURE = 'CAPTURE_LOYALTY_POINTS_PAYMENT_FAILURE';
export const CAPTURE_LOYALTY_VOUCHER_SPLIT_PAYMENT = 'CAPTURE_LOYALTY_VOUCHER_SPLIT_PAYMENT';
export const CAPTURE_LOYALTY_VOUCHER_PAYMENT_SUCCESS = 'CAPTURE_LOYALTY_VOUCHER_PAYMENT_SUCCESS';
export const CAPTURE_LOYALTY_VOUCHER_PAYMENT_FAILURE = 'CAPTURE_LOYALTY_VOUCHER_PAYMENT_FAILURE';
export const CAPTURE_LOYALTY_HOST_COMP_VOUCHER_SPLIT_PAYMENT = 'CAPTURE_LOYALTY_HOST_COMP_VOUCHER_SPLIT_PAYMENT';
export const CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_SUCCESS = 'CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_SUCCESS';
export const CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_FAILURE = 'CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_FAILURE';
export const CLEAR_LOYALTY_STATE = 'CLEAR_LOYALTY_STATE';
export const CLEAR_LOYALTY_ERROR = 'CLEAR_LOYALTY_ERROR';
export const REMOVE_AND_PROCESS_LOYALTY_VOUCHER_PAYMENTS = 'REMOVE_AND_PROCESS_LOYALTY_VOUCHER_PAYMENTS';
export const PROCESS_MULTIPLE_ACTIONS = 'PROCESS_MULTIPLE_ACTIONS';
export const LOYALTY_INQUIRY_DISABLE = 'LOYALTY_INQUIRY_DISABLE';
export const LOYALTY_INQUIRY_ENABLE = 'LOYALTY_INQUIRY_ENABLE';
export const LOYALTY_PARTIAL_PAYMENT = 'LOYALTY_PARTIAL_PAYMENT';
export const LOYALTY_INFO_MODIFIED = 'LOYALTY_INFO_MODIFIED';
export const SHOULD_CLEAR_LOYALTY_ACCOUNT = 'SHOULD_CLEAR_LOYALTY_ACCOUNT';
export const PROCESS_LOYALTY_REMOVE_PAYMENT = 'PROCESS_LOYALTY_REMOVE_PAYMENT';
export const LOYALTY_TENDERS_INFO_LIST = 'LOYALTY_TENDERS_INFO_LIST';

const getLoyaltyInfo = (siteId = null) => (store) => store.loyalty.loyaltyInfo || store.loyalty.loyaltyInfoMap[siteId];
const getSiteId = (store) => store.loyalty.siteId;
const getDisplayProfileId = (store) => store.loyalty.displayProfileId;
const getLoyaltyInfoMap = (store) => store.loyalty.loyaltyInfoMap;
const getClosedOrder = (store) => store.cart.closedOrder;
const getCartLoyaltyInfo = (store) => store.loyalty.cartLoyaltyInfo;
const getLoyaltyPaymentConfiguration = (store) => store.sites.orderConfig.pay.payOptions.find(payment => payment.type === 'loyalty');
const getLoyaltyAccounts = (store) => store.loyalty.loyaltyProcess.loyaltyLinkedAccounts;
const getLoyaltyInquiryCallbackId = (contextId) => (store) => store.loyalty.loyaltyInfo && store.loyalty.loyaltyInfo.siteId === contextId && store.loyalty.loyaltyInfo.inquiryId;
const getRetryCount = (store) => store.loyalty.loyaltyInquiryRetryCount;
const getDisplayOptions = (store) => store.sites.orderConfig.displayOptions;
const getLoyaltyInquiryDisableTimestamp = (store) => store.loyalty.disableLoyaltyInquiryTimestamp;
const getDisableLoyaltyInquiry = (store) => store.loyalty.disableLoyaltyInquiry;
const getLoyaltyData = (store) => store.loyalty;
const getLoyaltyTendersInfoFromPaymentList = (store) => store.loyalty.loyaltyTendersInfo;
const getAccountsInfoList = (store) => store.gaPayment.gaAccountsInfoList;
const getClosedOrderDisplayProfileId = (store) => store.cart.orderConfig.displayProfileId;

const loyaltyAccountMap = {
  phone: 'PHONE_NUMBER',
  account: 'ACCOUNT_NUMBER',
  card: 'CARD_NUMBER'
};

export const sendLoyaltyInquiry = (loyaltyInquiryInfo, selectedOption, siteId = null, displayProfileId = null, clearLoyaltyAccount = false) => ({
  type: SEND_LOYALTY_INQUIRY,
  loyaltyInquiryInfo,
  selectedOption,
  siteId,
  displayProfileId,
  clearLoyaltyAccount
});

export const sentLoyaltyInquiry = () => ({
  type: SENT_LOYALTY_INQUIRY
});

export const loyaltyInquirySuccess = () => ({
  type: LOYALTY_INQUIRY_SUCCESS
});

export const loyaltyInquiryFailed = (loyaltyInquiryError) => ({
  type: LOYALTY_INQUIRY_FAILED,
  loyaltyInquiryError
});

export const sendLoyaltyInfo = (siteId, displayProfileId, isDelayAccount, clearLoyaltyAccount = false) => ({
  type: SEND_LOYALTY_INFO,
  siteId,
  displayProfileId,
  isDelayAccount,
  clearLoyaltyAccount
});

export const cancelLoyaltyInfo = () => ({
  type: CANCEL_LOYALTY_INFO
});

export const loyaltyInfoSent = () => ({
  type: LOYALTY_INFO_SENT
});

export const loyaltyInfoSuccess = (accountDetails, siteId) => ({
  type: LOYALTY_INFO_SUCCESS,
  accountDetails,
  siteId
});

export const loyaltyInfoFailed = (loyaltyInquiryError) => ({
  type: LOYALTY_INFO_FAILED,
  loyaltyInquiryError
});

export const skipLoyaltyRewards = (siteId = '', displayProfileId = '') => ({
  type: SKIP_LOYALTY_REWARDS,
  loyaltyInfo: undefined,
  siteId,
  displayProfileId
});

export const updateLoyaltyMap = (loyaltyInfoMap) => ({
  type: UPDATE_LOYALTY_MAP,
  loyaltyInfoMap
});

export const resetLoyaltyMap = (shouldClearAccount = false) => ({
  type: RESET_LOYALTY_MAP,
  shouldClearAccount
});

export const shouldClearLoyaltyAccount = () => ({
  type: SHOULD_CLEAR_LOYALTY_ACCOUNT
});

export const setCartLoyaltyInfo = (siteId, displayProfileId, cartLoyaltyInfo = null, clearLoyaltyAccount = false) => ({
  type: CART_LOYALTY_INFO,
  siteId,
  cartLoyaltyInfo,
  clearLoyaltyAccount
});

export const loadLoyaltyPage = (siteId, displayProfileId, isLoyaltyEnabled, loyaltyDetails = undefined, checkoutFlag = false, loyaltySite = undefined) => ({
  type: LOAD_LOYALTY_PAGE,
  siteId,
  displayProfileId,
  isLoyaltyEnabled,
  loyaltyDetails,
  checkoutFlag,
  loyaltySite
});

export const showLoyaltyPage = (flag) => ({
  type: SHOW_LOYALTY_MODAL,
  showModal: flag
});

export const getLoyalty = (siteId, displayProfileId) => ({
  type: GET_LOYALTY,
  siteId,
  displayProfileId
});

export const processLoyaltyAccrue = (loyaltyAccrueInfo) => ({
  type: PROCESS_LOYALTY_ACCRUE,
  loyaltyAccrueInfo
});

export const loyaltyAccrueSuccess = (data) => ({
  type: LOYALTY_ACCRUE_SUCCESS,
  accrualData: data
});

export const loyaltyAccrueFailed = () => ({
  type: LOYALTY_ACCRUE_FAILED
});

export const getLoyaltyInquiry = () => ({
  type: GET_LOYALTY_INQUIRY
});

export const clearLoyaltyState = () => ({
  type: CLEAR_LOYALTY_STATE
});

export const processSplitLoyaltyPointsPayment = (account, amount, isAmountModified = false, isLastPayment = false) => ({
  type: CAPTURE_LOYALTY_POINTS_SPLIT_PAYMENT,
  account,
  amount,
  isAmountModified,
  isLastPayment
});

export const captureLoyaltyPointsPaymentSuccess = (paymentResponse, loyaltyPointsAccount, amount) => ({
  type: CAPTURE_LOYALTY_POINTS_PAYMENT_SUCCESS,
  paymentResponse,
  loyaltyPointsAccount,
  amount
});

export const captureLoyaltyPointsPaymentFailed = (error) => ({
  type: CAPTURE_LOYALTY_POINTS_PAYMENT_FAILURE,
  error
});

export const updateLoyaltyTendersInfoList = (loyaltyTendersInfo) => ({
  type: LOYALTY_TENDERS_INFO_LIST,
  loyaltyTendersInfo
});

export const processSplitLoyaltyVoucherPayment = (vouchers, amount, isAmountModified = false, isLastPayment = false) => ({
  type: CAPTURE_LOYALTY_VOUCHER_SPLIT_PAYMENT,
  vouchers,
  amount,
  isAmountModified,
  isLastPayment
});

export const captureLoyaltyVoucherPaymentSuccess = (paymentResponse, vouchersProcessed, amountCharged) => ({
  type: CAPTURE_LOYALTY_VOUCHER_PAYMENT_SUCCESS,
  paymentResponse,
  vouchersProcessed,
  amountCharged
});

export const captureLoyaltyVoucherPaymentFailed = (error) => ({
  type: CAPTURE_LOYALTY_VOUCHER_PAYMENT_FAILURE,
  error
});

export const processSplitLoyaltyHostCompVoucherPayment = (voucher, amount, isAmountModified = false, isLastPayment = false) => ({
  type: CAPTURE_LOYALTY_HOST_COMP_VOUCHER_SPLIT_PAYMENT,
  voucher,
  amount,
  isAmountModified,
  isLastPayment
});

export const captureLoyaltyHostCompVoucherPaymentSuccess = (paymentResponse, voucherProcessed, amountCharged) => ({
  type: CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_SUCCESS,
  paymentResponse,
  voucherProcessed,
  amountCharged
});

export const captureLoyaltyHostCompVoucherPaymentFailed = (error) => ({
  type: CAPTURE_LOYALTY_HOST_COMP_VOUCHER_PAYMENT_FAILURE,
  error
});

export const captureLoyaltyPayment = (loyaltyTenderInfo, loyaltyPaymentType) => ({
  type: CAPTURE_LOYALTY_PAYMENT,
  loyaltyTenderInfo,
  loyaltyPaymentType
});

export const captureLoyaltyPaymentFailed = (error) => ({
  type: CAPTURE_LOYALTY_PAYMENT_FAILED,
  error
});

export const removeLoyaltyPayments = (loyaltyPayments, removeAll = false) => ({
  type: REMOVE_LOYALTY_PAYMENTS,
  loyaltyPayments,
  removeAll
});

export const removeLoyaltyPaymentsSuccess = (loyaltyPayments, removeLoyaltyPaymentsResponse, isAmountModified, processingMultipleActions = undefined, removeAll = false) => ({ // eslint-disable-line max-len
  type: REMOVE_LOYALTY_PAYMENTS_SUCCESS,
  loyaltyPayments,
  removeLoyaltyPaymentsResponse,
  isAmountModified,
  processingMultipleActions,
  removeAll
});

export const removeLoyaltyPaymentsFailed = (error) => ({
  type: REMOVE_LOYALTY_PAYMENTS_FAILED,
  error
});

export const loyaltyInquiryDisable = (disableTimeStamp, loyaltyInquiryError) => ({
  type: LOYALTY_INQUIRY_DISABLE,
  disableTimeStamp,
  loyaltyInquiryError
});

export const loyaltyInquiryEnable = () => ({
  type: LOYALTY_INQUIRY_ENABLE
});

export const clearLoyaltyError = () => ({
  type: CLEAR_LOYALTY_ERROR
});

export const onLoyaltyInfoModified = () => ({
  type: LOYALTY_INFO_MODIFIED
});

export const processMultipleActions = () => ({
  type: PROCESS_MULTIPLE_ACTIONS
});

export const processLoyaltyRemovePayment = () => ({
  type: PROCESS_LOYALTY_REMOVE_PAYMENT
});

export const removeAndProcessLoyaltyVoucherPayments = (voidPayments, capturePayments, amountCharged, isAmountModified, isLastPayment) => ({
  type: REMOVE_AND_PROCESS_LOYALTY_VOUCHER_PAYMENTS,
  voidPayments,
  capturePayments,
  amountCharged,
  isAmountModified,
  isLastPayment
});

export const captureLoyaltyPaymentAndAddToOrder = (obj) => axios.post(`${config.webPaths.api}loyalty/capturePaymentAndAddToOrder`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const captureLoyaltyPaymentAndCloseOrder = (obj) => axios.post(`${config.webPaths.api}loyalty/capturePaymentAndCloseOrder`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const fetchPaymentTypesList = (obj) => axios.post(`${config.webPaths.api}loyalty/getLoyaltyTendersFromPaymentTypeList`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const accountInquiry = (obj) => axios.post(`${config.webPaths.api}loyalty/accountInquiry`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const accountInfo = (params) => axios.get(`${config.webPaths.api}loyalty/accountInquiry/${params.contextId}/${params.inquiryId}`)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const pointAccrual = (contextId, orderId, obj) =>
  axios.post(`${config.webPaths.api}loyalty/pointsAccrual/${contextId}/${orderId}`, obj)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export const voidLoyaltyPayment = (obj) => axios.post(`${config.webPaths.api}loyalty/payment/void`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export function * getLoyaltyInquiryIfNeeded () {
  const loyaltyAccounts = yield select(getLoyaltyAccounts);
  if (loyaltyAccounts.length !== 0) {
    return;
  }

  const contextId = yield select(getSiteId);
  const displayProfileId = yield select(getDisplayProfileId);
  const currentStore = yield select(getCurrentStore(contextId, displayProfileId));
  if (currentStore) {
    const loyaltyDetails = currentStore.loyaltyDetails;
    const loyaltyPaymentConfiguration = yield select(getLoyaltyPaymentConfiguration);
    const inquiryId = yield select(getLoyaltyInquiryCallbackId(contextId));

    if (!inquiryId) {
      return;
    }
    if (loyaltyPaymentConfiguration && loyaltyPaymentConfiguration.paymentEnabled) {
      try {
        yield put(loyaltyInfoSent());
        const accountInfoResult = yield call(getAccountInfo, contextId, displayProfileId, inquiryId, false);
        yield put(loyaltyInfoSuccess(accountInfoResult ? accountInfoResult.loyaltyAccountTierData : [], contextId));
      } catch (error) {
        yield put(loyaltyInfoFailed(loyaltyDetails.accountInquiryFailureText));
      }
    }
  }
}

export function * getAccountInfo (contextId, displayProfileId, inquiryId, isDelayAccount = false) {
  const currentStore = yield select(getCurrentStore(contextId, displayProfileId));
  const loyaltyDetails = currentStore.loyaltyDetails;
  const retryCount = get(loyaltyDetails, 'retryCount', loyaltyConfig.retryCount);
  const waitTime = get(loyaltyDetails, 'loyaltyAccrualWaitTime', loyaltyConfig.defaultLoyaltyWaitTime) * 1000;
  if (isDelayAccount) {
    yield call(delay, waitTime);
  }
  const requestPayload = {
    contextId,
    inquiryId
  };
  for (let i = 0; i < retryCount; i++) {
    const accountResponse = yield call(accountInfo, requestPayload);
    if (accountResponse.loyaltyAccountTierData) {
      return accountResponse;
    }
    if ((i + 1) !== retryCount) { yield call(delay, waitTime); }
  }
  throw new Error('Failed to get account information');
};

export function * getLoyaltyInquiryId (selectedSite, selectedDisplayProfileId, clearAccount = false) {
  const loyaltyInfo = yield select(getLoyaltyInfo());
  const siteId = selectedSite || (yield select(getSiteId));
  const displayProfileId = selectedDisplayProfileId || (yield select(getDisplayProfileId));
  let loyaltyInfoMap = yield select(getLoyaltyInfoMap);
  const currentStore = yield select(getCurrentStore(siteId, displayProfileId));
  const loyaltyDetails = currentStore.loyaltyDetails;
  const tenantId = yield select(getTenantId);

  // inquiry can happen before cart has a profitCenterId
  const cartProfitCenterId = yield select(getCartProfitCenterId);
  const profitCenterId = cartProfitCenterId || currentStore.profitCenterId;
  try {
    yield put(sentLoyaltyInquiry());
    const profitCenterDetails = yield call(fetchProfitCenterIfNeeded, siteId, displayProfileId, profitCenterId);
    const inquiryObject = {
      tenantId: tenantId,
      contextId: siteId,
      pin: loyaltyInfo.pin,
      accountIdentifier: {
        type: loyaltyAccountMap[loyaltyInfo.selectedOption],
        value: loyaltyInfo.formatNumber.replace(/[-\s]+/g, '')
      },
      cardSource: loyaltyConfig.cardSource,
      properties: {
        ...loyaltyDetails.loyaltyProperties,
        loyaltyProviderId: loyaltyDetails.loyaltyProviderId,
        siteId: loyaltyDetails.siteId,
        profitCenterName: profitCenterDetails,
        profitCenterId
      }
    };
    const inquiryId = yield call(accountInquiry, inquiryObject);
    loyaltyInfo.inquiryId = inquiryId;
    if (selectedSite) {
      yield put(setCartLoyaltyInfo(siteId, displayProfileId, loyaltyInfo, clearAccount));
    } else {
      loyaltyInfoMap[`${siteId}-${displayProfileId}`] = loyaltyInfo;
      yield put(updateLoyaltyMap(loyaltyInfoMap));
    }
    yield put(loyaltyInquirySuccess(inquiryId));
    if (selectedSite) {
      yield call(sendLoyaltyRewardsInfo, siteId, displayProfileId, true);
    }
  } catch (error) {
    console.log(error);
    if (!selectedSite) {
      loyaltyInfoMap[siteId] = loyaltyInfo;
      yield put(updateLoyaltyMap(loyaltyInfoMap));
    }
    yield put(loyaltyInquiryFailed(loyaltyDetails.accountInquiryFailureText));
  }
}

export function * sendLoyaltyRewardsInfo (siteId, displayProfileId, isDelayAccount) {
  const cartLoyaltyInfo = yield select(getCartLoyaltyInfo);
  const currentStore = yield select(getCurrentStore(siteId, displayProfileId));
  const loyaltyDetails = currentStore.loyaltyDetails;

  try {
    if (cartLoyaltyInfo && cartLoyaltyInfo.inquiryId) {
      yield put(loyaltyInfoSent());
      const accountInfo = yield call(getAccountInfo, siteId, displayProfileId, cartLoyaltyInfo.inquiryId, isDelayAccount);
      yield put(loyaltyInfoSuccess(accountInfo ? accountInfo.loyaltyAccountTierData : [], siteId));
    }
  } catch (error) {
    yield put(loyaltyInfoFailed(loyaltyDetails.accountInquiryFailureText));
    yield call(delay, 5000);
    yield put(clearLoyaltyError());
  }
}

export function * getLoyaltyAccrue (accountNumber) {
  const closedOrder = yield select(getClosedOrder);
  const displayProfileId = yield select(getClosedOrderDisplayProfileId);
  const currentStore = yield select(getCurrentStore(closedOrder.order.contextId, displayProfileId));
  const accrualObject = {
    accountEntryMethod: loyaltyConfig.cardSource,
    accountId: accountNumber,
    orderNumber: closedOrder.order.orderNumber,
    cardType: loyaltyAccountMap.account,
    properties: {
      employeeId: get(currentStore, 'displayOptions.onDemandEmployeeId'),
      terminalId: get(currentStore, 'displayOptions.onDemandTerminalId')
    }
  };
  try {
    const pointAccrualData = yield call(pointAccrual, closedOrder.order.contextId, closedOrder.order.orderId, accrualObject); // eslint-disable-line max-len
    yield put(loyaltyAccrueSuccess(pointAccrualData));
  } catch (error) {
    yield put(loyaltyAccrueFailed());
  }
}

export function * captureLoyaltyPaymentAsync (scheduledOrderCompletionTime, isCapacitySuggested = false, loyaltyPaymentInfo, paymentType) {
  const payload = yield call(getCloseOrderPayload, isCapacitySuggested, scheduledOrderCompletionTime);
  const tipAmount = yield select(getTipAmount);
  const totalOrderAmount = yield select(getTotalOrderAmount);
  let loyaltyPaymentPayload;
  if (paymentType === 'points') {
    loyaltyPaymentPayload = yield call(buildLoyaltyPointsPaymentPayload, loyaltyPaymentInfo, totalOrderAmount, payload.currencyDetails.currencyCode);
  } else {
    loyaltyPaymentPayload = yield call(buildLoyaltyVoucherPaymentPayload, loyaltyPaymentInfo, totalOrderAmount, payload.currencyDetails.currencyCode, 'voucher');
  }

  // Appending extra order details that are needed for order close
  payload.subtotal = payload.order.taxIncludedTotalAmount.amount;
  payload.tipAmount = tipAmount;
  payload.loyaltyPaymentPayload = loyaltyPaymentPayload;

  try {
    yield put(fetchEtfData());
    const receiptInfo = yield call(buildReceiptInfoPayload, payload);
    payload.receiptInfo = receiptInfo;
    const closedOrder = yield call(captureLoyaltyPaymentAndCloseOrder, payload);
    yield put(saleTransactionSucceeded(closedOrder));
  } catch (error) {
    yield put(captureLoyaltyPaymentFailed(error));
  }
}

export function * captureLoyaltyHostCompVoucherSplitPaymentAsync (voucher, amountToCharge, isAmountModified) {
  const currencyDetails = yield select(getCurrencyDetails);
  const displayOptions = yield select(getDisplayOptions);
  const loyaltyHostCompVoucherPaymentPayload = yield call(buildLoyaltyVoucherPaymentPayload, voucher, amountToCharge, currencyDetails.currencyCode);
  try {
    const capturePaymentResponse = yield call(captureLoyaltyPaymentAndAddToOrder, loyaltyHostCompVoucherPaymentPayload);
    yield put(captureLoyaltyHostCompVoucherPaymentSuccess(capturePaymentResponse.loyaltyCaptureResponse, voucher, amountToCharge));
    const loyaltyTendersInfo = yield select(getLoyaltyTendersInfoFromPaymentList);
    const autoRemoveTax = loyaltyTendersInfo[displayOptions[loyaltyTenderMappings[`voucher/HOSTCOMP`].tenderIdKey]].autoRemoveTax;
    loyaltyHostCompVoucherPaymentPayload.remainingTipAmount >= 0 && (yield put(setRemainingTipAmount(loyaltyHostCompVoucherPaymentPayload.remainingTipAmount)));
    yield call(updateAddPaymentAmounts, capturePaymentResponse.orderData, amountToCharge, autoRemoveTax);
  } catch (error) {
    yield put(captureLoyaltyHostCompVoucherPaymentFailed(error));
  }
}

export function * captureLoyaltyPointsSplitPaymentAsync (loyaltyPointsAccount, amountToBeCharged, isAmountModified) {
  if (isAmountModified) {
    yield put(processMultipleActions());
    const voidLoyaltyPaymentResponse = yield call(removeLoyaltyPaymentsAsync, [loyaltyPointsAccount]);
    if (!voidLoyaltyPaymentResponse) {
      return;
    }
  }

  try {
    const currencyDetails = yield select(getCurrencyDetails);
    const displayOptions = yield select(getDisplayOptions);

    const loyaltyPointsPaymentPayload = yield call(buildLoyaltyPointsPaymentPayload, loyaltyPointsAccount, amountToBeCharged, currencyDetails.currencyCode);
    const capturePaymentResponse = yield call(captureLoyaltyPaymentAndAddToOrder, loyaltyPointsPaymentPayload);
    const loyaltyTendersInfo = yield select(getLoyaltyTendersInfoFromPaymentList);
    yield put(captureLoyaltyPointsPaymentSuccess(capturePaymentResponse.loyaltyCaptureResponse, loyaltyPointsAccount, amountToBeCharged));
    const autoRemoveTax = loyaltyTendersInfo[displayOptions[loyaltyTenderMappings[`points/${loyaltyPointsAccount.instrumentType}`].tenderIdKey]].autoRemoveTax;
    loyaltyPointsPaymentPayload.remainingTipAmount >= 0 && (yield put(setRemainingTipAmount(loyaltyPointsPaymentPayload.remainingTipAmount)));
    yield call(updateAddPaymentAmounts, capturePaymentResponse.orderData, amountToBeCharged, autoRemoveTax);
  } catch (error) {
    yield put(captureLoyaltyPointsPaymentFailed(error));
  }
}

export function * captureLoyaltyVoucherSplitPaymentAsync (vouchers, amountToBeCharged, isAmountModified) {

  try {
    const displayOptions = yield select(getDisplayOptions);
    const currencyDetails = yield select(getCurrencyDetails);
    const genericLoyaltyPaymentPayload = yield call(generateCaptureLoyaltyPaymentPayload, displayOptions[loyaltyTenderMappings[`voucher/${vouchers[0].instrumentType}`].tenderIdKey]);
    const loyaltyTendersInfo = yield select(getLoyaltyTendersInfoFromPaymentList);
    const autoRemoveTax = loyaltyTendersInfo[displayOptions[loyaltyTenderMappings[`voucher/${vouchers[0].instrumentType}`].tenderIdKey]].autoRemoveTax;
    amountToBeCharged = yield call(getAmountToCharge, amountToBeCharged, autoRemoveTax);
    let remainingTipAmountBeforePayment = yield select(getRemainingTipAmount);
    let voucherPaymentInfoArray = getVoucherPaymentInfoArray(vouchers, amountToBeCharged, remainingTipAmountBeforePayment, currencyDetails, displayOptions);
    const loyaltyVoucherPaymentPayload = {
      voucherPaymentInfoArray,
      redeemType: 'VOUCHER',
      ...genericLoyaltyPaymentPayload
    };

    const capturePaymentResponse = yield call(captureLoyaltyPaymentAndAddToOrder, loyaltyVoucherPaymentPayload);
    yield put(captureLoyaltyVoucherPaymentSuccess(capturePaymentResponse.loyaltyCaptureResponse, voucherPaymentInfoArray, amountToBeCharged));
    remainingTipAmountBeforePayment >= 0 && (yield put(setRemainingTipAmount(remainingTipAmountBeforePayment)));
    yield call(updateAddPaymentAmounts, capturePaymentResponse.orderData, amountToBeCharged, autoRemoveTax);
  } catch (error) {
    yield put(captureLoyaltyPointsPaymentFailed(error));
  }
}

export function * removeLoyaltyPaymentsAsync (loyaltyPayments, processingMultipleActions = undefined, throwError = false, removeAllPayments = false) {
  const order = yield select(getOrder);
  const tipAmount = yield select(getTipAmount);

  try {

    const payload = loyaltyPayments.map(voucher => {
      return {
        paymentResponse: voucher.paymentResponse,
        orderId: order.orderId,
        contextId: order.contextId
      };
    });

    const removeLoyaltyPaymentsResponse = yield call(voidLoyaltyPayment, payload);
    let tipAmountAgainstPayment = 0;
    if (tipAmount && tipAmount > 0) {
      loyaltyPayments.map(voucher => {
        tipAmountAgainstPayment += parseFloat(voucher.paymentResponse.paymentData.paymentRequest.transactionData.loyaltyPaymentRequest.tipAmount.amount); // eslint-disable-line max-len
      });
    }
    if (tipAmountAgainstPayment > 0) {
      const remainingTipAmount = yield select(getRemainingTipAmount);
      const payableRemainingTipAMount = parseFloat(tipAmountAgainstPayment) + parseFloat(remainingTipAmount);
      yield put(setRemainingTipAmount(payableRemainingTipAMount));
    }

    yield call(updateRemoveLoyaltyPaymentResponse, loyaltyPayments, removeLoyaltyPaymentsResponse.order, processingMultipleActions, removeAllPayments);
    return removeLoyaltyPaymentsResponse;
  } catch (error) {
    yield put(removeLoyaltyPaymentsFailed(error)); // eslint-disable-line max-len
  }
}

export function * checkLoyaltyTimerIfNeeded () {
  try {
    let disableLoyaltyInquiry = yield select(getDisableLoyaltyInquiry);
    if (disableLoyaltyInquiry) {
      let disableLoyaltyInquiryTimestamp = yield select(getLoyaltyInquiryDisableTimestamp);
      if (moment().isBefore(moment(disableLoyaltyInquiryTimestamp, 'YYYY-MM-DD HH:mm:ss Z'))) {
        const diff = moment(disableLoyaltyInquiryTimestamp, 'YYYY-MM-DD HH:mm:ss Z') - moment();
        yield call(delay, diff);
      }
      yield put(loyaltyInquiryEnable());
    }

  } catch (er) {
    console.log(er);
  }
}

export function * checkLoyaltyInquiryCount () {
  const loyaltyPaymentConfig = yield select(getLoyaltyPaymentConfiguration);
  const { maxAttempts, maxAttemptsReachedMessage, resetMinutes } = loyaltyPaymentConfig.accountEntry;

  const resetWindow = ((loyaltyPaymentConfig && resetMinutes) || 2) * 60 * 1000;
  const retryLimit = (loyaltyPaymentConfig && maxAttempts) || 3;
  const retryCount = yield select(getRetryCount);
  const loyaltyInquiryMaxAttemptsMessage = maxAttemptsReachedMessage || i18n.t('LOYALTY_INQUIRY_MAX_ATTEMPTS_ERROR');

  if (retryCount >= retryLimit) {
    const inquiryDisabledTime =
      moment().add(((loyaltyPaymentConfig && resetMinutes) || 2),
        'minutes').format('YYYY-MM-DD HH:mm:ss Z');
    yield put(loyaltyInquiryDisable(inquiryDisabledTime, loyaltyInquiryMaxAttemptsMessage));
    yield call(delay, resetWindow);
    yield put(loyaltyInquiryEnable());
  }
}

function * generateCaptureLoyaltyPaymentPayload (tenderId) {
  const order = yield select(getOrder); // needed to get total
  const tenantId = yield select(getTenantId);
  const loyaltyInfo = yield select(getLoyaltyInfo(order.contextId));
  const loyaltyTendersInfo = yield select(getLoyaltyTendersInfoFromPaymentList);
  const profitCenterId = yield select(getCartProfitCenterId);
  const displayProfileId = yield select(getCartDisplayProfileId);
  const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
  const loyaltyDetails = currentStore.loyaltyDetails;

  const payload = {
    'businessContext': order.contextId,
    'loyaltyTenderMappings': loyaltyTenderMappings
  };
  let loyaltyTendersDetails = loyaltyTendersInfo;
  if (!loyaltyTendersInfo) {
    loyaltyTendersDetails = yield call(fetchPaymentTypesList, payload);
    yield put(updateLoyaltyTendersInfoList(loyaltyTendersDetails));
  }

  try {
    // TODO: detemine where we get enterPriseId, divisonId, storeId from
    const profitCenterDetails = yield call(fetchProfitCenterIfNeeded, order.contextId, displayProfileId, profitCenterId);
    const retryTime = loyaltyDetails.paymentRetryTime || 3000;
    const retryMax = loyaltyDetails.paymentRetryMax || 3;

    const payload = {
      tenantId,
      contextId: order.contextId,
      orderNumber: order.orderNumber,
      pin: loyaltyInfo.pin, // TODO: retrieve actual pin
      properties: {
        ...loyaltyDetails.loyaltyProperties,
        loyaltyProviderId: loyaltyDetails.loyaltyProviderId,
        siteId: loyaltyDetails.siteId,
        profitCenterName: profitCenterDetails,
        rguest_buy_order_tenantId: tenantId,
        rguest_buy_order_contextId: order.contextId,
        rguest_buy_order_orderId: order.orderId,
        igVerificationCodeId: loyaltyTendersDetails[tenderId].verificationCodeId,
        profitCenterId
      },
      // non-capture fields
      orderId: order.orderId,
      retryTime,
      retryMax
    };

    return payload;
  } catch (error) {
    yield put(captureLoyaltyPaymentFailed(error));
  }
}

function getLoyaltyPaymentAmounts (amountToCharge, remainingTipAmount, isTipExempt) {
  let amount = amountToCharge;
  let tipAmount = '0.00';
  let payableAmountWithTip = {
    remainingTip: remainingTipAmount
  };

  if (remainingTipAmount > 0 && !isTipExempt) {
    payableAmountWithTip = calculatePayableAmountWithTip(amount, remainingTipAmount);
    amount = payableAmountWithTip.amount;
    tipAmount = payableAmountWithTip.tipAmount;
  }

  return {
    amount,
    tipAmount,
    remainingTipAmount: payableAmountWithTip.remainingTip
  };
}

function getVoucherObjectForPayment (voucher, totalVoucherAmountToCharge, remainingTipAmountBeforePayment, currencyDetails, displayOptions) {
  let voucherAmountToCharge;
  const isTipExempt = displayOptions['LOYALTY/isTipExempted'] === 'true';
  if (totalVoucherAmountToCharge > parseFloat(voucher.currencyAmount)) {
    voucherAmountToCharge = voucher.currencyAmount;
    totalVoucherAmountToCharge -= voucherAmountToCharge;
  } else {
    voucherAmountToCharge = parseFloat(totalVoucherAmountToCharge.toFixed(2));
    totalVoucherAmountToCharge = 0;
  }
  const { amount, tipAmount, remainingTipAmount } = getLoyaltyPaymentAmounts(voucherAmountToCharge, parseFloat(remainingTipAmountBeforePayment), isTipExempt);
  remainingTipAmountBeforePayment = remainingTipAmount;
  return {
    voucherObject: {
      voucherId: voucher.voucherId,
      primaryAccountId: voucher.primaryAccountId,
      voucherType: voucher.instrumentType,
      tenderName: voucher.name,
      amount: parseFloat(amount),
      tipAmount,
      remainingTipAmount,
      currencyUnit: currencyDetails.currencyCode,
      tenderId: displayOptions[loyaltyTenderMappings[`voucher/${voucher.instrumentType}`].tenderIdKey]
    },
    totalVoucherAmountToChargeModified: totalVoucherAmountToCharge
  };
}

function getVoucherPaymentInfoArray (vouchers, amountToCharge, remainingTipAmountBeforePayment, currencyDetails, displayOptions) {
  let voucherPaymentInfoArray = [];
  let highValueVoucher = getHighValueVoucher(vouchers, amountToCharge);
  if (highValueVoucher) {
    let totalVoucherAmountToCharge = parseFloat(amountToCharge);
    const {voucherObject, totalVoucherAmountToChargeModified} = getVoucherObjectForPayment(highValueVoucher, totalVoucherAmountToCharge, remainingTipAmountBeforePayment, currencyDetails, displayOptions);
    totalVoucherAmountToCharge = totalVoucherAmountToChargeModified;
    voucherPaymentInfoArray.push(voucherObject);
  } else {
    let sortVoucherByExipiring = sortByExpiry(vouchers);
    let totalVoucherAmountToCharge = parseFloat(amountToCharge);
    voucherPaymentInfoArray = sortVoucherByExipiring.map(voucher => {
      const {voucherObject, totalVoucherAmountToChargeModified} = getVoucherObjectForPayment(voucher, totalVoucherAmountToCharge, remainingTipAmountBeforePayment, currencyDetails, displayOptions);
      totalVoucherAmountToCharge = totalVoucherAmountToChargeModified;
      return voucherObject;
    });
  }
  return voucherPaymentInfoArray.filter(voucher => voucher.amount > 0);
}

function * buildLoyaltyPointsPaymentPayload (loyaltyPaymentInfo, amountToCharge, currencyUnit) {
  const displayOptions = yield select(getDisplayOptions);
  const genericLoyaltyPaymentPayload = yield call(generateCaptureLoyaltyPaymentPayload, displayOptions[loyaltyTenderMappings[`points/${loyaltyPaymentInfo.instrumentType}`].tenderIdKey]);
  const loyaltyTendersInfo = yield select(getLoyaltyTendersInfoFromPaymentList);
  const remainingTipAmountBeforePayment = yield select(getRemainingTipAmount);
  const isTipExempt = displayOptions['LOYALTY/isTipExempted'] === 'true';
  const autoRemoveTax = loyaltyTendersInfo[displayOptions[loyaltyTenderMappings[`points/${loyaltyPaymentInfo.instrumentType}`].tenderIdKey]].autoRemoveTax;
  amountToCharge = yield call(getAmountToCharge, amountToCharge, autoRemoveTax);

  const { amount, tipAmount, remainingTipAmount } = getLoyaltyPaymentAmounts(amountToCharge, parseFloat(remainingTipAmountBeforePayment), isTipExempt);

  const loyaltyPointsPaymentPayload = {
    redeemType: 'POINTS',
    amount: {
      currencyUnit,
      amount
    },
    tipAmount: {
      currencyUnit,
      amount: tipAmount
    },
    loyaltyPointsAccountIdentifierData: {
      primaryAccountId: loyaltyPaymentInfo.primaryAccountId,
      pointsType: loyaltyPaymentInfo.instrumentType
    },
    displayLabel: loyaltyPaymentInfo.displayLabel,
    remainingTipAmount,
    ...genericLoyaltyPaymentPayload
  };

  loyaltyPointsPaymentPayload.properties.tenderId = displayOptions[loyaltyTenderMappings[`points/${loyaltyPaymentInfo.instrumentType}`].tenderIdKey];

  return loyaltyPointsPaymentPayload;
}

function * buildLoyaltyVoucherPaymentPayload (vouchers, amountToCharge, currencyUnit, paymentType) {
  const displayOptions = yield select(getDisplayOptions);
  const currencyDetails = yield select(getCurrencyDetails);
  const isTipExempt = displayOptions['LOYALTY/isTipExempted'] === 'true';

  let loyaltyVoucherPaymentPayload;
  if (paymentType === 'voucher' && !vouchers.isHostComp) {
    const genericLoyaltyPaymentPayload = yield call(generateCaptureLoyaltyPaymentPayload, displayOptions[loyaltyTenderMappings[`voucher/${vouchers[0].instrumentType}`].tenderIdKey]);
    const loyaltyTendersInfo = yield select(getLoyaltyTendersInfoFromPaymentList);
    const autoRemoveTax = loyaltyTendersInfo[displayOptions[loyaltyTenderMappings[`voucher/${vouchers[0].instrumentType}`].tenderIdKey]].autoRemoveTax;
    let remainingTipAmountBeforePayment = yield select(getRemainingTipAmount);
    amountToCharge = yield call(getAmountToCharge, amountToCharge, autoRemoveTax);
    let voucherPaymentInfoArray = getVoucherPaymentInfoArray(vouchers, amountToCharge, remainingTipAmountBeforePayment, currencyDetails, displayOptions);
    loyaltyVoucherPaymentPayload = {
      voucherPaymentInfoArray,
      redeemType: 'VOUCHER',
      ...genericLoyaltyPaymentPayload
    };
  } else {
    const genericLoyaltyPaymentPayload = yield call(generateCaptureLoyaltyPaymentPayload, displayOptions[loyaltyTenderMappings[`voucher/HOSTCOMP`].tenderIdKey]);
    const loyaltyTendersInfo = yield select(getLoyaltyTendersInfoFromPaymentList);
    let remainingTipAmountBeforePayment = yield select(getRemainingTipAmount);
    const autoRemoveTax = loyaltyTendersInfo[displayOptions[loyaltyTenderMappings[`voucher/HOSTCOMP`].tenderIdKey]].autoRemoveTax;
    amountToCharge = yield call(getAmountToCharge, amountToCharge, autoRemoveTax);

    const { amount, tipAmount, remainingTipAmount } = getLoyaltyPaymentAmounts(amountToCharge, parseFloat(remainingTipAmountBeforePayment), isTipExempt);

    loyaltyVoucherPaymentPayload = {
      redeemType: 'VOUCHER',
      amount: {
        currencyUnit,
        amount: amount
      },
      tipAmount: {
        currencyUnit,
        amount: tipAmount
      },
      loyaltyVoucherAccountIdentifierData: vouchers,
      displayLabel: vouchers.displayLabel,
      isHostComp: vouchers.isHostComp || false,
      remainingTipAmount,
      ...genericLoyaltyPaymentPayload
    };
    loyaltyVoucherPaymentPayload.properties.tenderId = displayOptions[loyaltyTenderMappings[`voucher/HOSTCOMP`].tenderIdKey];
  }

  return loyaltyVoucherPaymentPayload;
}

export function * removeAndAddLoyaltyVoucherPaymentsAsync (paymentsToRemove, paymentsToCapture, amountToCharge, isLastPayment) {
  try {
    const removeLoyaltyPaymentsAsyncResponse = yield call(removeLoyaltyPaymentsAsync, paymentsToRemove, true);
    if (removeLoyaltyPaymentsAsyncResponse) {
      yield put(processSplitLoyaltyVoucherPayment(paymentsToCapture, amountToCharge, isLastPayment));
    }
  } catch (error) {
    yield put(captureLoyaltyPaymentFailed(error));
  }
}

export function * getLoyaltyPaymentList () {
  const loyaltyData = yield select(getLoyaltyData);
  let loyaltyPayment = [];
  const hostCompVoucherList = loyaltyData.hostCompVoucherPayments && loyaltyData.hostCompVoucherPayments.length > 0 ? loyaltyData.hostCompVoucherPayments : []; // eslint-disable-line max-len
  if (hostCompVoucherList.length > 0) {
    hostCompVoucherList.map(hostCompVoucher => {
      hostCompVoucher.isHostComp = true;
      loyaltyPayment.push(hostCompVoucher);
    });
  }
  const loyaltyAccounts = loyaltyData.loyaltyProcess.loyaltyLinkedAccounts;
  if (loyaltyAccounts && loyaltyAccounts.length > 0) {
    loyaltyAccounts.forEach(loyaltyAccount => {
      loyaltyAccount.loyaltyAccountTiers.forEach(loyaltyAccountTier => {
        loyaltyAccountTier.voucherSummaries && loyaltyAccountTier.voucherSummaries.map(voucherSummarie => {
          voucherSummarie.paymentResponse && loyaltyPayment.push(voucherSummarie);
        });
        loyaltyAccountTier.pointsSummaries && loyaltyAccountTier.pointsSummaries.find(pointsSummarie => {
          pointsSummarie.paymentResponse && loyaltyPayment.push(pointsSummarie);
        });
      });
    });
  }
  return loyaltyPayment;
};

function * updateRemoveLoyaltyPaymentResponse (loyaltyPayments, removeLoyaltyPaymentsResponse, processingMultipleActions, removeAllPayments) {
  try {
    let totalAmountToBeCharged = 0;
    loyaltyPayments.forEach(payment => {
      totalAmountToBeCharged += parseFloat(payment.amountToBeCharged);
    });

    yield call(updateRemovePaymentAmounts, removeLoyaltyPaymentsResponse, totalAmountToBeCharged);
    yield put(removeLoyaltyPaymentsSuccess(loyaltyPayments, removeLoyaltyPaymentsResponse, false, processingMultipleActions, removeAllPayments));
  } catch (error) {
    throw error;
  }
}

export function * updateRemovePaymentAmounts (paymentsUpdatedOrder, amountToBeCharged) {
  const cartTotalAmount = yield select(getCartTotalAmount);
  const updatedTotalAmount = parseFloat(paymentsUpdatedOrder.taxIncludedTotalAmount.amount);
  const tipAmount = yield select(getTipAmount);
  const updatedTotalAmountWithTip = (updatedTotalAmount + parseFloat(tipAmount)).toFixed(2);
  if (updatedTotalAmount > cartTotalAmount) {
    const amountModifiedDifference = (updatedTotalAmount - cartTotalAmount).toFixed(2);
    yield put(removePaymentsAmount((parseFloat(amountToBeCharged) + parseFloat(amountModifiedDifference)).toFixed(2), updatedTotalAmountWithTip));
  } else {
    const amountModifiedDifference = (cartTotalAmount - updatedTotalAmount).toFixed(2);
    yield put(removePaymentsAmount(parseFloat(amountToBeCharged) - amountModifiedDifference, updatedTotalAmountWithTip));
  }
  yield put(updateCartOnPayments(paymentsUpdatedOrder));
  yield put(updateShowTaxableTendersOnly((paymentsUpdatedOrder.payments2.length === 0) ? null : checkTaxableTender(paymentsUpdatedOrder.payments2)));
}

function checkTaxableTender (payments) {
  return payments.some(payment => payment.paymentData.paymentResponse.paymentSupport.paymentForm === 'GENERIC_AUTHORIZATION');
}

export function * updateAddPaymentAmounts (paymentsUpdatedOrder, amountToBeCharged) {
  const cartTotalAmount = yield select(getCartTotalAmount);
  const updatedTotalAmount = parseFloat(paymentsUpdatedOrder.taxIncludedTotalAmount.amount);
  const tipAmount = yield select(getTipAmount);
  const updatedTotalAmountWithTip = (updatedTotalAmount + parseFloat(tipAmount)).toFixed(2);
  const remainingTipAmount = yield select(getRemainingTipAmount);
  const remainingToPaid = yield select(getRemainingAmount);
  const totalOrderAmount = yield select(getTotalOrderAmount);
  yield put(updateShowTaxableTendersOnly(checkTaxableTender(paymentsUpdatedOrder.payments2)));
  if ((parseFloat(paymentsUpdatedOrder.totalDueAmount.amount) === 0) && (!remainingTipAmount || remainingTipAmount === 0)) {
    yield put(setPaymentsAmount(remainingToPaid || totalOrderAmount, totalOrderAmount, 0));
    yield put(updateCartOnPayments(paymentsUpdatedOrder));
    return;
  }
  let updatedAmountCharge;
  if (updatedTotalAmount > cartTotalAmount) {
    const amountModifiedDifference = (updatedTotalAmount - cartTotalAmount).toFixed(2);
    updatedAmountCharge = remainingToPaid ? parseFloat(amountToBeCharged) - parseFloat(amountModifiedDifference) : parseFloat(amountToBeCharged);
  } else {
    const amountModifiedDifference = (cartTotalAmount - updatedTotalAmount).toFixed(2);
    updatedAmountCharge = remainingToPaid ? parseFloat(amountToBeCharged) + parseFloat(amountModifiedDifference) : parseFloat(amountToBeCharged);
  }
  yield put(setPaymentsAmount(updatedAmountCharge, updatedTotalAmountWithTip, 0));
  yield put(updateCartOnPayments(paymentsUpdatedOrder));
}

function * getAmountToCharge (amountToCharge, autoRemoveTax) {
  const gaAccountsInfoList = yield select(getAccountsInfoList);
  let totalGaPaymentAmount = 0;
  gaAccountsInfoList.map(account => {
    if (account.amountToBeCharged && account.amountToBeCharged !== 0) {
      totalGaPaymentAmount += parseFloat(account.amountToBeCharged);
    }
  }); // eslint-disable-line max-len
  const tipAmount = yield select(getTipAmount);
  // (if no GA payments have been made or total GA payment OR total GAPayment less than tip amount) AND tax-free
  if ((totalGaPaymentAmount === 0 || totalGaPaymentAmount <= parseFloat(tipAmount)) && autoRemoveTax) {
    const order = yield select(getOrder);
    const remaining = yield select(getRemainingAmount);
    if (remaining === null) {
      const taxExcludedTotalPlusTip = parseFloat(order.taxExcludedTotalAmount.amount) + parseFloat(tipAmount);
      if (parseFloat(amountToCharge) > taxExcludedTotalPlusTip) {
        amountToCharge = taxExcludedTotalPlusTip;
      }
      return amountToCharge;
    } else if (remaining != null && parseFloat(order.taxTotalAmount.amount) > 0) {
      const paidAmount = parseFloat(order.taxIncludedTotalAmount.amount) - parseFloat(remaining);
      if ((parseFloat(amountToCharge) + paidAmount) >= parseFloat(order.taxIncludedTotalAmount.amount)) {
        amountToCharge = parseFloat(amountToCharge) - parseFloat(order.taxTotalAmount.amount);
      }
      return amountToCharge;
    }
  }
  return amountToCharge;
}
