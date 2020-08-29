// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import config from 'app.config';
import moment from 'moment-timezone';
import { saleTransactionSucceeded, fetchEtfData } from 'web/client/app/modules/iFrame/sagas';
import { sendLoyaltyInfo } from 'web/client/app/modules/loyalty/sagas';
import { calculatePayableAmountWithTip, getConceptIGSettings }
  from 'web/client/app/utils/common';
import { resetOrder } from 'web/client/app/modules/cart/sagas';
import { resetSites } from 'web/client/app/modules/site/sagas';
import { replace } from 'connected-react-router';
import { getCurrentStore,
  getTenantId,
  getRemainingAmount,
  getOrder,
  getCartTotalAmount,
  getTipAmount,
  getRemainingTipAmount,
  getCloseOrderPayload,
  getCartDisplayProfileId } from 'web/client/app/utils/StateSelector';
import { buildReceiptInfoPayload } from 'web/client/app/modules/communication/sagas';
import get from 'lodash.get';

export const PROCESS_MEMBER_CHARGE = 'PROCESS_MEMBER_CHARGE';
export const MEMBER_CHARGE_INQUIRY = 'MEMBER_CHARGE_INQUIRY';
export const MEMBER_CHARGE_INQUIRY_SUCCESS = 'MEMBER_CHARGE_INQUIRY_SUCCESS';
export const MEMBER_CHARGE_INQUIRY_FAILURE = 'MEMBER_CHARGE_INQUIRY_FAILURE';
export const UPDATE_MEMBER_CHARGE_DETAILS = 'UPDATE_MEMBER_CHARGE_DETAILS';
export const GET_MEMBER_CHARGE_DETAILS = 'GET_MEMBER_CHARGE_DETAILS';
export const GET_MEMBER_CHARGE_FAILED = 'GET_MEMBER_CHARGE_FAILED';
export const FETCH_MEMBER_CHARGE = 'FETCH_MEMBER_CHARGE';
export const CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER = 'CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER';
export const CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER_SUCCESS = 'CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER_SUCCESS'; // eslint-disable-line max-len
export const CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE = 'CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE'; // eslint-disable-line max-len
export const RESET_MEMBER_CHARGE = 'RESET_MEMBER_CHARGE';
export const CLEAR_MEMBER_CHARGE_ERROR = 'CLEAR_MEMBER_CHARGE_ERROR';
export const REMOVE_MEMBER_CHARGE_ACCOUNT_INFO = 'REMOVE_MEMBER_CHARGE_ACCOUNT_INFO';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const MEMBER_CHARGE_INQUIRY_DISABLE = 'MEMBER_CHARGE_INQUIRY_DISABLE';
export const MEMBER_CHARGE_INQUIRY_ENABLE = 'MEMBER_CHARGE_INQUIRY_ENABLE';

const getSiteId = (store) => store.cart.order.contextId;
const getMemberChargeInfo = (store) => store.memberCharge;
const getRetryCount = (store) => store.memberCharge.retryCount;
const getDisableProcess = (store) => store.memberCharge.disableProcess;
const getDisableTimeStamp = (store) => store.memberCharge.disableTimeStamp;
const getMemberChargeConfig = (store) => store.sites.orderConfig && store.sites.orderConfig.memberChargeConfiguration;
const getMultiPaymentFlag = (store) => store.sites.orderConfig && store.sites.orderConfig.multiPaymentEnabled;
const getMealPeriodId = (store) => store.cart.mealPeriodId;
const shouldPostCreditCardsAsExternalPayments = (store) => store.sites.shouldPostCreditCardsAsExternalPayments; // To be removed OND-294
const getCartConceptPosConfig = (store) => store.cart.conceptConfig;
const getMemberChargeTenderConfig = (store) => store.sites.orderConfig &&
 store.sites.orderConfig.memberChargeTenderConfig;

export const processMemberCharge = (memberChargePayload) => ({
  type: PROCESS_MEMBER_CHARGE,
  lastName: memberChargePayload.lastName,
  memberNumber: memberChargePayload.memberNumber,
  tenderId: memberChargePayload.tenderId,
  coverCount: memberChargePayload.coverCount,
  pmsAdapterId: memberChargePayload.pmsAdapterId
});

export const fetchMemberChargeBySiteId = (siteId, displayProfileId) => ({
  type: FETCH_MEMBER_CHARGE,
  siteId,
  displayProfileId
});

export const getMemberChargeDetails = () => ({
  type: GET_MEMBER_CHARGE_DETAILS
});
export const updateMemberChargeDetails = (tenderId, verificationCodeId) => ({
  type: UPDATE_MEMBER_CHARGE_DETAILS,
  tenderId,
  verificationCodeId
});
export const getMemberChargeFailed = (error) => ({
  type: GET_MEMBER_CHARGE_FAILED,
  error
});

export const memberChargeInquiry = (lastName, memberNumber) => ({
  type: MEMBER_CHARGE_INQUIRY,
  lastName,
  memberNumber
});

export const memberChargeInquirySuccess = (memberChargeAccountInfo) => ({
  type: MEMBER_CHARGE_INQUIRY_SUCCESS,
  memberChargeAccountInfo
});

export const memberChargeInquiryFailure = (error) => ({
  type: MEMBER_CHARGE_INQUIRY_FAILURE,
  error
});

export const captureMemberChargePaymentAndCloseOrder = () => ({
  type: CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER
});

export const captureMemberChargePaymentAndCloseOrderSuccess = (payload) => ({
  type: CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER_SUCCESS,
  payload
});

export const captureMemberChargePaymentAndCloseOrderFailure = (error) => ({
  type: CAPTURE_MEMBER_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE,
  error
});

export const removeMemberChargeAccountInfo = () => ({
  type: REMOVE_MEMBER_CHARGE_ACCOUNT_INFO
});

export const resetMemberCharge = () => ({
  type: RESET_MEMBER_CHARGE
});

export const clearMemberChargeError = () => ({
  type: CLEAR_MEMBER_CHARGE_ERROR
});

export const memberChargeInquiryDisable = (disableTimeStamp) => ({
  type: MEMBER_CHARGE_INQUIRY_DISABLE,
  disableTimeStamp
});

export const memberChargeInquiryEnable = () => ({
  type: MEMBER_CHARGE_INQUIRY_ENABLE
});

export const setAppError = (error, key, dynamicKey, sessionExpired = undefined) => ({
  type: SET_APP_ERROR,
  error,
  key,
  dynamicKey,
  sessionExpired
});

export const memberChargeInquiryRequest = (payload) =>
  axios.post(`${config.webPaths.api}memberCharge/accountInquiry`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export const captureMemberChargePaymentAndCloseOrderRequest = (payload) =>
  axios.post(`${config.webPaths.api}memberCharge/capturePaymentAndCloseOrder`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
export const fetchPaymentTypes = (tenantId, siteId, memberChargeId) =>
  axios.post(`${config.webPaths.api}sites/${tenantId}/${siteId}/getMemberChargeDetails`, { memberChargeId }) // eslint-disable-line max-len
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

export function * fetchMemberChargeIfNeeded (siteId, displayProfileId) {
  const currentStore = yield select(getCurrentStore(siteId, displayProfileId));
  const tenantId = yield select(getTenantId);
  const isMemberChargeEnabled = currentStore && currentStore.pay.payOptions.find(data => data.type === 'memberCharge' && data.paymentEnabled); // eslint-disable-line max-len
  if (isMemberChargeEnabled && currentStore.memberChargeTenderId) {
    yield put(getMemberChargeDetails());
    const memberChargeDetails = yield call(fetchPaymentTypes, tenantId, siteId, currentStore.memberChargeTenderId);
    yield put(updateMemberChargeDetails(currentStore.memberChargeTenderId, memberChargeDetails.verificationCodeId)); // eslint-disable-line max-len
  }
}

export function * captureMemberChargePaymentAndCloseOrderAsync (scheduledOrderCompletionTime,
  isCapacitySuggested = false) {

  const memberChargeData = yield call(getMemberChargePaymentData);
  if (memberChargeData) {
    yield put(captureMemberChargePaymentAndCloseOrder());
    const payload = yield call(getCloseOrderPayload, isCapacitySuggested, scheduledOrderCompletionTime);
    const mealPeriodId = yield select(getMealPeriodId);
    const displayProfileId = yield select(getCartDisplayProfileId);
    const processPaymentAsExternalPayment = yield select(shouldPostCreditCardsAsExternalPayments);
    try {

      payload.memberChargeData = memberChargeData;
      payload.terminalId = payload.igSettings.onDemandTerminalId;
      payload.processPaymentAsExternalPayment = processPaymentAsExternalPayment;
      payload.mealPeriodId = mealPeriodId;

      yield put(sendLoyaltyInfo(payload.order.contextId, displayProfileId));
      yield put(fetchEtfData());
      const receiptInfo = yield call(buildReceiptInfoPayload, payload);
      payload.receiptInfo = receiptInfo;
      const closedOrder = yield call(captureMemberChargePaymentAndCloseOrderRequest, payload);
      yield put(saleTransactionSucceeded(closedOrder));
    } catch (ex) {
      const errorMessage = ex.response && ex.response.data.message;
      if (errorMessage) {
        switch (errorMessage) {
          case 'REFUND_FAILED':
            yield put(setAppError(new Error('Payment failed with transaction id {{transactionId}}'), 'ERROR_REFUND', { transactionId: payload.order.orderNumber })); // eslint-disable-line max-len
            yield put(replace('/'));
            yield call(resetOrder);
            yield put(resetSites());
            return;
          case 'REFUND_FAILED_AND_CLOSED_ASAP':
            yield put(setAppError(new Error('High demand - Try ordering for later!, Payment failed with transaction id {{transactionId}}'), 'REFUND_FAILED_AND_CLOSED_ASAP', { transactionId: payload.order.orderNumber })); // eslint-disable-line max-len
            yield put(replace('/'));
            yield call(resetOrder);
            yield put(resetSites());
            return;
          case 'REFUND_SUCCESS':
            yield put(setAppError(new Error('Order failed and refund initiated. Please place a new order.'), 'ERROR_ORDER_FAILED')); // eslint-disable-line max-len
            yield put(replace('/'));
            yield call(resetOrder);
            yield put(resetSites());
            return;
          case 'REFUND_SUCCESS_AND_CLOSED_ASAP':
            yield put(setAppError(new Error('High demand - Try ordering for later!, Refund has been initiated.'), 'REFUND_SUCCESS_AND_CLOSED_ASAP')); // eslint-disable-line max-len
            yield put(replace('/'));
            yield call(resetOrder);
            yield put(resetSites());
            return;
        }
      }
      yield put(setAppError(new Error('Failed to pay through member charge. Please try again.'), 'ERROR_MEMBER_CHARGE_PAYMENT_FAILED')); // eslint-disable-line max-len
      yield put(captureMemberChargePaymentAndCloseOrderFailure(ex));
    }
  } else {
    yield put(setAppError(new Error('Failed to pay through member charge. Please try again.'), 'ERROR_MEMBER_CHARGE_PAYMENT_FAILED')); // eslint-disable-line max-len
    yield put(captureMemberChargePaymentAndCloseOrderFailure('Transaction Failed'));
  }
}

export function * checkMemberInquiryCount () {
  const memberChargeConfig = yield select(getMemberChargeConfig);
  const resetWindow = ((memberChargeConfig && memberChargeConfig.resetTime) || 2) * 60 * 1000;
  const retryLimit = (memberChargeConfig && memberChargeConfig.maxAttempts) || 3;
  const retryCount = yield select(getRetryCount);
  if (retryCount >= retryLimit) {
    const inquiryDisabledTime =
      moment().add(((memberChargeConfig && memberChargeConfig.resetTime) || 2),
        'minutes').format('YYYY-MM-DD HH:mm:ss Z');
    yield put(memberChargeInquiryDisable(inquiryDisabledTime));
    yield call(delay, resetWindow);
    yield put(memberChargeInquiryEnable());
  }
}

export function * checkMemberChargeTimerIfNeeded () {
  try {
    let disableProcess = yield select(getDisableProcess);
    if (disableProcess) {
      const memberChargeConfig = yield select(getMemberChargeConfig);
      let disableTimeStamp = yield select(getDisableTimeStamp);
      if (moment().isBefore(moment(disableTimeStamp, 'YYYY-MM-DD HH:mm:ss Z'))) {
        const diff = moment(disableTimeStamp, 'YYYY-MM-DD HH:mm:ss Z') - moment();
        if (diff < ((memberChargeConfig && memberChargeConfig.resetTime) || 2) * 60 * 1000) {
          yield call(delay, diff);
        }
      }
      yield put(memberChargeInquiryEnable());
    }

  } catch (er) {
    console.log(er);
  }
}

export function * processMemberChargeAsync () {
  const tenantId = yield select(getTenantId);
  const contextId = yield select(getSiteId);
  const memberChargeInfo = yield select(getMemberChargeInfo);
  const order = yield select(getOrder);
  const displayProfileId = yield select(getCartDisplayProfileId);
  const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
  const conceptIgPosConfig = yield select(getCartConceptPosConfig);
  const igSettings = getConceptIGSettings(currentStore.displayOptions, conceptIgPosConfig,
    currentStore.conceptLevelIgPosConfig);
  const memberChargeTenderConfig = yield select(getMemberChargeTenderConfig);
  const operaOnqPmsList = get(memberChargeTenderConfig, 'operaOnQPms', []);

  const memberChargeInquiryPayload = {
    tenantId,
    contextId,
    guestName: memberChargeInfo.lastName,
    memberNumber: memberChargeInfo.memberNumber,
    properties: {
      tenderId: memberChargeInfo.tenderId,
      coverCount: memberChargeInfo.coverCount,
      pmsAdapterId: memberChargeInfo.pmsAdapterId,
      sourcePropertyId: igSettings.sourcePropertyId,
      destinationPropertyId: igSettings.destinationPropertyId,
      operaOnQPms: operaOnqPmsList && operaOnqPmsList.length > 0 &&
        operaOnqPmsList.indexOf(memberChargeInfo.tenderId) >= 0
    }
  };

  try {
    const memberChargeInquiryResponse = yield call(memberChargeInquiryRequest, memberChargeInquiryPayload);
    yield put(memberChargeInquirySuccess(memberChargeInquiryResponse));
  } catch (error) {
    yield put(memberChargeInquiryFailure(error));
  }
}

export function * getMemberChargePaymentData () {
  const memberChargeInfo = yield select(getMemberChargeInfo);
  const memberChargeAccountInfo = memberChargeInfo.memberChargeAccountInfo;
  if (memberChargeAccountInfo) {
    const remainingTipAmount = yield select(getRemainingTipAmount);
    let amount = yield select(getCartTotalAmount);
    let tipAmount = '0.00';
    const multiPaymentEnabled = yield select(getMultiPaymentFlag);
    if (multiPaymentEnabled) {
      const remainingAmount = yield select(getRemainingAmount);
      if (remainingTipAmount > 0) {
        const remainingAmountWithTip = remainingAmount !== null ? remainingAmount
          : (parseFloat(amount) + parseFloat(yield select(getTipAmount)));
        const payableAmount = calculatePayableAmountWithTip(remainingAmountWithTip, remainingTipAmount);
        amount = payableAmount.amount;
        tipAmount = payableAmount.tipAmount;
      } else {
        amount = remainingAmount !== null ? remainingAmount : amount;
      }
    } else {
      tipAmount = yield select(getTipAmount);
    }

    return {
      guestName: memberChargeInfo.lastName,
      memberNumber: memberChargeInfo.memberNumber,
      tenderName: memberChargeInfo.lastName,
      pmsAdapterId: memberChargeInfo.pmsAdapterId,
      memberChargeAccountInfo: memberChargeInfo.memberChargeAccountInfo,
      tenderId: memberChargeInfo.tenderId,
      verificationCodeId: memberChargeInfo.verificationCodeId,
      paymentAmount: {
        amount,
        tipAmount
      }
    };
  }
}
