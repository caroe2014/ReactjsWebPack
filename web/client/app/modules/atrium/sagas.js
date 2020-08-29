// Copyright © 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { atriumAccountTypes } from 'web/client/app/utils/constants';
import { getCurrentStore,
  getTenantId,
  getCartDisplayProfileId,
  getRemainingAmount,
  getCurrencyDetails,
  getTotalOrderAmount,
  getOrder } from 'web/client/app/utils/StateSelector';
import {
  setPaymentsAmount, removePaymentsAmount
} from 'web/client/app/modules/payOptions/sagas';
import { getPaymentTenderInfoRequest } from 'web/client/app/modules/cart/sagas';

export const ATRIUM_INQUIRY = 'ATRIUM_INQUIRY';
export const ATRIUM_INQUIRY_SUCCESS = 'ATRIUM_INQUIRY_SUCCESS';
export const ATRIUM_INQUIRY_FAILURE = 'ATRIUM_INQUIRY_FAILURE';
export const AUTH_ATRIUM_PAYMENT = 'AUTH_ATRIUM_PAYMENT';
export const AUTH_ATRIUM_PAYMENT_SUCCESS = 'AUTH_ATRIUM_PAYMENT_SUCCESS';
export const AUTH_ATRIUM_PAYMENT_FAILURE = 'AUTH_ATRIUM_PAYMENT_FAILURE';
export const ATRIUM_REMOVE_PAYMENT = 'ATRIUM_REMOVE_PAYMENT';
export const ATRIUM_REMOVE_PAYMENT_SUCCESS = 'ATRIUM_REMOVE_PAYMENT_SUCCESS';
export const ATRIUM_REMOVE_PAYMENT_FAILURE = 'ATRIUM_REMOVE_PAYMENT_FAILURE';
export const ATRIUM_PAYMENT_PROCESSING = 'ATRIUM_PAYMENT_PROCESSING';
export const UPDATE_ATRIUM_AUTH_INFO = 'UPDATE_ATRIUM_AUTH_INFO';
export const PROCESS_ATRIUM_LASTPAYMENT = 'PROCESS_ATRIUM_LASTPAYMENT';
export const RESET_ATRIUM = 'RESET_ATRIUM';
export const CLEAR_ATRIUM_ERROR = 'CLEAR_ATRIUM_ERROR';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const SET_PAYMENT_TENDER_INFO = 'SET_PAYMENT_TENDER_INFO';

const getSiteId = (store) => store.cart.order.contextId;
const getMultiPaymentFlag = (store) => store.sites.orderConfig && store.sites.orderConfig.multiPaymentEnabled;
const getAtriumAccountInfo = (store) => store.atrium.accountInfo;
const getUserId = (store) => store.profile.userId;
const getPaymentTenderInfo = (store) => store.atrium.paymentTenderInfo;
const getTerminalCredentialKey = (store) => store.app.config.siteAuth.config.atriumKey;
const getAtriumUrl = (store) => store.app.config.siteAuth.config.atriumUrl;

export const atriumInquiry = () => ({
  type: ATRIUM_INQUIRY
});

export const atriumInquirySuccess = (atriumAccountInfo) => ({
  type: ATRIUM_INQUIRY_SUCCESS,
  atriumAccountInfo
});

export const atriumInquiryFailure = (error) => ({
  type: ATRIUM_INQUIRY_FAILURE,
  error
});

export const atriumRemovePayment = (atriumAccount) => ({
  type: ATRIUM_REMOVE_PAYMENT,
  atriumAccount
});

export const atriumRemovePaymentSuccess = (atriumAccount = undefined) => ({
  type: ATRIUM_REMOVE_PAYMENT_SUCCESS,
  atriumAccount
});

export const atriumRemovePaymentFailure = (error) => ({
  type: ATRIUM_REMOVE_PAYMENT_FAILURE,
  error
});

export const authAtriumPayment = (account, amountToCharge, isAutoDetect = false, isMealCountModified = false) => ({
  type: AUTH_ATRIUM_PAYMENT,
  account,
  amountToCharge,
  isAutoDetect,
  isMealCountModified
});

export const authAtriumPaymentSuccess = (payload) => ({
  type: AUTH_ATRIUM_PAYMENT_SUCCESS,
  payload
});

export const authAtriumPaymentFailure = (error) => ({
  type: AUTH_ATRIUM_PAYMENT_FAILURE,
  error
});

export const setAtriumPaymentProcessing = (accountInfo = undefined) => ({
  type: ATRIUM_PAYMENT_PROCESSING,
  accountInfo
});

export const updateAtriumAuthInfo = (accountInfo) => ({
  type: UPDATE_ATRIUM_AUTH_INFO,
  accountInfo
});

export const processAtriumLastPayment = (accountInfo, completePayment = false) => ({
  type: PROCESS_ATRIUM_LASTPAYMENT,
  accountInfo,
  completePayment
});

export const setPaymentTenderInfo = (paymentTenderInfo) => ({
  type: SET_PAYMENT_TENDER_INFO,
  paymentTenderInfo
});

export const resetAtrium = () => ({
  type: RESET_ATRIUM
});

export const clearAtriumError = () => ({
  type: CLEAR_ATRIUM_ERROR
});

export const setAppError = (error, key, dynamicKey, sessionExpired = undefined) => ({
  type: SET_APP_ERROR,
  error,
  key,
  dynamicKey,
  sessionExpired
});

export const atriumInquiryRequest = (payload) =>
  axios.post(`${config.webPaths.api}atrium/accountInquiry`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export const authAtriumPaymentRequest = (payload) =>
  axios.post(`${config.webPaths.api}atrium/authAtriumPayment`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export const captureAtriumPaymentRequest = (payload) =>
  axios.post(`${config.webPaths.api}atrium/captureAtriumPayment`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export const authAtriumAutoDetectPaymentRequest = (payload) =>
  axios.post(`${config.webPaths.api}atrium/authAtriumAutoDetectPayment`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export const captureAtriumAutoDetectPaymentRequest = (payload) =>
  axios.post(`${config.webPaths.api}atrium/captureAtriumAutoDetectPayment`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export function * fetchAtriumInquiryIfNeeded () {
  try {
    const orderContextId = yield select(getSiteId);
    const displayProfileId = yield select(getCartDisplayProfileId);
    const currentStore = yield select(getCurrentStore(orderContextId, displayProfileId));
    const tenantId = yield select(getTenantId);
    const userId = yield select(getUserId);
    const terminalCredentialKey = yield select(getTerminalCredentialKey);
    const atriumUrl = yield select(getAtriumUrl);
    const payload = [];
    const atriumPayConfig = currentStore.pay.payOptions.find(data => data.type === 'atrium');
    if (currentStore.atriumConfig && currentStore.atriumConfig.tenders) {
      Object.keys(currentStore.atriumConfig.tenders).map(key => {
        const data = currentStore.atriumConfig.tenders[key];
        if (!atriumPayConfig.autoDeduct.isEnabled || (atriumPayConfig.autoDeduct.isEnabled && data.isDefault)) {
          payload.push({
            tenderId: key,
            data: {
              tenantId,
              contextId: orderContextId,
              tenderId: data.atriumTenderId,
              atriumUrl: atriumUrl,
              atriumTerminal: {
                terminalId: currentStore.atriumConfig.terminalId,
                terminalCredentialKey: terminalCredentialKey
              },
              customer: {
                customerType: 'campusid',
                id: userId
              }
            }
          });
        }
      });
      const atriumAccountInfo = yield call(atriumInquiryRequest, payload);
      const atriumAccountList = [];
      if (atriumAccountInfo && atriumAccountInfo.length > 0) {
        atriumAccountInfo.map(accountData => {
          const tenderConfig = accountData && currentStore.atriumConfig.tenders[accountData.tenderId];
          if (tenderConfig) {
            accountData.displayName = tenderConfig.displayName;
            accountData.atriumTenderId = tenderConfig.atriumTenderId;
            accountData.limitOnAccount = tenderConfig.limitOnAccount;
            accountData.tenderType = tenderConfig.tenderType;
            accountData.isDefault = tenderConfig.isDefault;
            accountData.taxExemptTenderId = tenderConfig.taxExemptTenderId;
            accountData.taxableTenderId = tenderConfig.taxableTenderId;
            accountData.isAuthUsingTaxableTenderId = tenderConfig.isAuthUsingTaxableTenderId === undefined || tenderConfig.isAuthUsingTaxableTenderId; // eslint-disable-line max-len
            if (tenderConfig.tenderType === atriumAccountTypes.MEAL_COUNT) {
              accountData.image = atriumPayConfig.manualDeduct.mealCountImage;
            } else if (tenderConfig.tenderType === atriumAccountTypes.CASH_EQUIVALENT) {
              accountData.image = atriumPayConfig.manualDeduct.cashEquivalencyImage;
            } else if (tenderConfig.tenderType === atriumAccountTypes.OTHER_FUNDS) {
              accountData.image = atriumPayConfig.manualDeduct.otherFundsImage;
            }
            atriumAccountList.push(accountData);
          }
        });
      }
      yield put(atriumInquirySuccess(atriumAccountList)); // eslint-disable-line max-len
    }

  } catch (error) {
    yield put(atriumInquiryFailure(error));
    yield put(setAppError(new Error('Atrium inquiry failed'), 'ATRIUM_INQUIRY_FAILURE')); // eslint-disable-line max-len
  }
}

export function * authAtriumPaymentAsync (atriumAccount, amountToCharge, isAutoDetect) {
  try {
    yield put(setAtriumPaymentProcessing(isAutoDetect ? 'autoDetect' : {tenderId: atriumAccount.tenderId}));
    const order = yield select(getOrder);
    const displayProfileId = yield select(getCartDisplayProfileId);
    const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
    const tenantId = yield select(getTenantId);
    const userId = yield select(getUserId);
    const remainingAmount = yield select(getRemainingAmount);
    const totalOrderAmount = yield select(getTotalOrderAmount);
    const totalTaxAmount = parseFloat(order.taxTotalAmount.amount);
    const currencyDetails = yield select(getCurrencyDetails);
    let remainingToPaid = remainingAmount || totalOrderAmount;
    const multiPaymentEnabled = yield select(getMultiPaymentFlag);
    const atriumUrl = yield select(getAtriumUrl);
    const atriumAccounts = yield select(getAtriumAccountInfo);
    const terminalCredentialKey = yield select(getTerminalCredentialKey);
    const isAllTaxExempt = atriumAccounts.every(account => {
      return !account.authResponse || parseFloat(account.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentRequest.atriumCurrency.tax) === 0; // eslint-disable-line max-len
    });
    let paymentTenderInfo = yield select(getPaymentTenderInfo);
    if (!paymentTenderInfo) {
      const tenderPayload = {
        contextId: order.contextId,
        tenderList: []
      };
      atriumAccounts.map(data => {
        tenderPayload.tenderList.push(data.taxableTenderId);
        data.taxExemptTenderId && tenderPayload.tenderList.push(data.taxExemptTenderId);
      });
      paymentTenderInfo = yield call(getPaymentTenderInfoRequest, tenderPayload);
      yield put(setPaymentTenderInfo(paymentTenderInfo));
    }
    const currency = atriumAccount.limitOnAccount ? atriumAccount.amount.currency : 'USD'; // eslint-disable-line max-len
    const payload = {
      atriumAccount,
      amountToCharge,
      totalTaxAmount,
      tenantId,
      contextId: order.contextId,
      tenderId: atriumAccount.atriumTenderId,
      terminalId: currentStore.atriumConfig.terminalId,
      onDemandIgVerificationCodeId: currentStore.displayOptions.onDemandIgVerificationCodeId,
      id: userId,
      currencyDetails,
      multiPaymentEnabled,
      remainingToPaid,
      isAllTaxExempt,
      currency,
      paymentTenderInfo,
      terminalCredentialKey,
      atriumUrl
    };
    const authPaymentResponse = yield call(authAtriumPaymentRequest, payload);
    let amountCharged = parseFloat(authPaymentResponse.data.paymentData.paymentResponse.paymentSupport.amount.amount);
    atriumAccount.authResponse = authPaymentResponse.data;
    atriumAccount.isAllTaxExempt = authPaymentResponse.isAllTaxExempt;
    atriumAccount.amountToBeCharged = amountCharged;
    atriumAccount.taxExemptVerficationCode = atriumAccount.taxExemptTenderId ? paymentTenderInfo[atriumAccount.taxExemptTenderId].verificationCodeId : undefined; // eslint-disable-line max-len
    atriumAccount.taxableVerficationCode = atriumAccount.taxableTenderId ? paymentTenderInfo[atriumAccount.taxableTenderId].verificationCodeId : undefined; // eslint-disable-line max-len
    if (multiPaymentEnabled) {
      if (authPaymentResponse.completePayment) {
        yield put(processAtriumLastPayment(atriumAccount, true));
      } else {
        remainingToPaid = remainingToPaid - amountCharged;
        if (remainingToPaid > 0) {
          yield put(updateAtriumAuthInfo(atriumAccount));
          yield put(setPaymentsAmount(amountCharged, totalOrderAmount, 0));
          yield put(setAtriumPaymentProcessing());
        } else {
          yield put(processAtriumLastPayment(atriumAccount));
        }
      }
    } else {
      yield put(processAtriumLastPayment(atriumAccount));
      yield put(setAtriumPaymentProcessing());
    }
    yield put(authAtriumPaymentSuccess(authPaymentResponse));
  } catch (error) {
    if (error.message === 'ATRIUM_INSUFFICIENT_BALANCE') {
      yield put(setAppError(new Error('Atrium insufficent balance'), 'ATRIUM_INSUFFICIENT_BALANCE')); // eslint-disable-line max-len
    } else {
      yield put(setAppError(new Error('Atrium Auth failed'), 'ATRIUM_AUTH_FAILURE')); // eslint-disable-line max-len
    }
    yield put(authAtriumPaymentFailure(error));
    yield put(setAtriumPaymentProcessing());
  }
}

export function * updateAtriumAuthResponseAsync (atriumAccount, completePayment) {
  const totalOrderAmount = yield select(getTotalOrderAmount);
  const remainingAmount = yield select(getRemainingAmount);
  yield put(updateAtriumAuthInfo(atriumAccount));
  if (completePayment) {
    yield put(setPaymentsAmount(remainingAmount || totalOrderAmount, totalOrderAmount, 0));
  } else {
    yield put(setPaymentsAmount(atriumAccount.amountToBeCharged, totalOrderAmount, 0));
  }
  yield put(setAtriumPaymentProcessing());
}

export function * removeAtriumPaymentAsync (atriumAccount) {
  try {
    const totalOrderAmount = yield select(getTotalOrderAmount);
    let amountToBeCharged = 0;
    if (atriumAccount && atriumAccount.amountToBeCharged) {
      amountToBeCharged = parseFloat(atriumAccount.amountToBeCharged);
    } else {
      const atriumAccountInfo = yield select(getAtriumAccountInfo);
      atriumAccountInfo.map(account => {
        if (account.amountToBeCharged) {
          amountToBeCharged += parseFloat(account.amountToBeCharged);
        }
      });
    }
    yield put(removePaymentsAmount(amountToBeCharged, totalOrderAmount.toFixed(2)));
    yield put(atriumRemovePaymentSuccess(atriumAccount));
  } catch (error) {
    if (atriumAccount) {
      yield put(setAppError(new Error('Atrium remove payment failed'), 'ATRIUM_REMOVE_PAYMENT_FAILURE')); // eslint-disable-line max-len
    }
    yield put(atriumRemovePaymentFailure());
  }
}
