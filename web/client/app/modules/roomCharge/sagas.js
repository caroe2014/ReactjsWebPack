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
import i18n from 'web/client/i18n';
import { getCurrentStore,
  getTenantId,
  getCartDisplayProfileId,
  getRemainingAmount,
  getOrder,
  getCartTotalAmount,
  getTipAmount,
  getRemainingTipAmount,
  getCloseOrderPayload } from 'web/client/app/utils/StateSelector';
import { buildReceiptInfoPayload } from 'web/client/app/modules/communication/sagas';
import get from 'lodash.get';
export const PROCESS_ROOM_CHARGE = 'PROCESS_ROOM_CHARGE';
export const ROOM_CHARGE_INQUIRY = 'ROOM_CHARGE_INQUIRY';
export const ROOM_CHARGE_INQUIRY_SUCCESS = 'ROOM_CHARGE_INQUIRY_SUCCESS';
export const ROOM_CHARGE_INQUIRY_FAILURE = 'ROOM_CHARGE_INQUIRY_FAILURE';
export const UPDATE_ROOM_CHARGE_DETAILS = 'UPDATE_ROOM_CHARGE_DETAILS';
export const GET_ROOM_CHARGE_DETAILS = 'GET_ROOM_CHARGE_DETAILS';
export const GET_ROOM_CHARGE_FAILED = 'GET_ROOM_CHARGE_FAILED';
export const FETCH_ROOM_CHARGE = 'FETCH_ROOM_CHARGE';
export const CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER = 'CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER';
export const CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER_SUCCESS = 'CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER_SUCCESS'; // eslint-disable-line max-len
export const CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE = 'CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE'; // eslint-disable-line max-len
export const ROOM_CHARGE_INQUIRY_DISABLE = 'ROOM_CHARGE_INQUIRY_DISABLE';
export const ROOM_CHARGE_INQUIRY_ENABLE = 'ROOM_CHARGE_INQUIRY_ENABLE';
export const RESET_ROOM_CHARGE = 'RESET_ROOM_CHARGE';
export const REMOVE_ROOM_CHARGE_ACCOUNT_INFO = 'REMOVE_ROOM_CHARGE_ACCOUNT_INFO';
export const CLEAR_ROOM_CHARGE_ERROR = 'CLEAR_ROOM_CHARGE_ERROR';
export const SET_APP_ERROR = 'SET_APP_ERROR';

const getSiteId = (store) => store.cart.order.contextId;
const getRoomChargeInfo = (store) => store.roomCharge;
const getRetryCount = (store) => store.roomCharge.retryCount;
const getDisableProcess = (store) => store.roomCharge.disableProcess;
const getDisableTimeStamp = (store) => store.roomCharge.disableTimeStamp;
const getRoomChargeConfig = (store) => store.sites.orderConfig && store.sites.orderConfig.roomChargeConfiguration;
const getMultiPaymentFlag = (store) => store.sites.orderConfig && store.sites.orderConfig.multiPaymentEnabled;
const getMealPeriodId = (store) => store.cart.mealPeriodId;
const shouldPostCreditCardsAsExternalPayments = (store) => store.sites.shouldPostCreditCardsAsExternalPayments; // To be removed OND-294
const getCartConceptPosConfig = (store) => store.cart.conceptConfig;
const getRoomChargeTenderConfig = (store) => store.sites.orderConfig && store.sites.orderConfig.roomChargeTenderConfig;

export const processRoomCharge = (roomChargePayload) => ({
  type: PROCESS_ROOM_CHARGE,
  lastName: roomChargePayload.lastName,
  roomNumber: roomChargePayload.roomNumber,
  hotelName: roomChargePayload.hotel.label,
  wingPrefix: roomChargePayload.wing && roomChargePayload.wing.value.toUpperCase(),
  tenderId: roomChargePayload.tenderId,
  coverCount: roomChargePayload.coverCount,
  pmsAdapterId: roomChargePayload.pmsAdapterId,
  verificationCodeId: roomChargePayload.verificationCodeId
});

export const fetchRoomChargeBySiteId = (siteId, displayProfileId) => ({
  type: FETCH_ROOM_CHARGE,
  siteId,
  displayProfileId
});

export const getRoomChargeDetails = () => ({
  type: GET_ROOM_CHARGE_DETAILS
});
export const updateRoomChargeDetails = (roomChargeDetails) => ({
  type: UPDATE_ROOM_CHARGE_DETAILS,
  roomChargeDetails
});
export const getRoomChargeFailed = (error) => ({
  type: GET_ROOM_CHARGE_FAILED,
  error
});

export const roomChargeInquiryDisable = (disableTimeStamp) => ({
  type: ROOM_CHARGE_INQUIRY_DISABLE,
  disableTimeStamp
});

export const roomChargeInquiryEnable = () => ({
  type: ROOM_CHARGE_INQUIRY_ENABLE
});

export const roomChargeInquiry = (lastName, roomNumber) => ({
  type: ROOM_CHARGE_INQUIRY,
  lastName,
  roomNumber
});

export const roomChargeInquirySuccess = (roomChargeAccountInfo) => ({
  type: ROOM_CHARGE_INQUIRY_SUCCESS,
  roomChargeAccountInfo
});

export const roomChargeInquiryFailure = (error) => ({
  type: ROOM_CHARGE_INQUIRY_FAILURE,
  error
});

export const captureRoomChargePaymentAndCloseOrder = () => ({
  type: CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER
});

export const captureRoomChargePaymentAndCloseOrderSuccess = (payload) => ({
  type: CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER_SUCCESS,
  payload
});

export const captureRoomChargePaymentAndCloseOrderFailure = (error) => ({
  type: CAPTURE_ROOM_CHARGE_PAYMENT_AND_CLOSE_ORDER_FAILURE,
  error
});

export const removeRoomChargeAccountInfo = () => ({
  type: REMOVE_ROOM_CHARGE_ACCOUNT_INFO
});

export const clearRoomChargeError = () => ({
  type: CLEAR_ROOM_CHARGE_ERROR
});

export const resetRoomCharge = () => ({
  type: RESET_ROOM_CHARGE
});

export const setAppError = (error, key, dynamicKey, sessionExpired = undefined) => ({
  type: SET_APP_ERROR,
  error,
  key,
  dynamicKey,
  sessionExpired
});

export const roomChargeInquiryRequest = (payload) =>
  axios.post(`${config.webPaths.api}roomCharge/accountInquiry`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export const captureRoomChargePaymentAndCloseOrderRequest = (payload) =>
  axios.post(`${config.webPaths.api}roomCharge/capturePaymentAndCloseOrder`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
export const fetchPaymentTypes = (tenantId, siteId, roomChargeIds) =>
  axios.post(`${config.webPaths.api}sites/${tenantId}/${siteId}/getRoomChargeDetails`, { roomChargeIds }) // eslint-disable-line max-len
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

export function * fetchRoomChargeIfNeeded (siteId, displayProfileId) {
  const currentStore = yield select(getCurrentStore(siteId, displayProfileId));
  const tenantId = yield select(getTenantId);
  try {
    const isRoomChargeEnabled = currentStore.pay.payOptions.find(data => data.type === 'roomCharge' && data.paymentEnabled); // eslint-disable-line max-len
    if (isRoomChargeEnabled && currentStore.roomChargeIds && currentStore.roomChargeIds.length > 0) {
      yield put(getRoomChargeDetails());
      const roomChargeDetails = yield call(fetchPaymentTypes, tenantId, siteId, currentStore.roomChargeIds);
      yield put(updateRoomChargeDetails(roomChargeDetails));
    }
  } catch (error) {
    yield put(getRoomChargeFailed(error.message));
  }
}

export function * captureRoomChargePaymentAndCloseOrderAsync (scheduledOrderCompletionTime,
  isCapacitySuggested = false) {
  const roomChargeData = yield call(getRoomChargePaymentData);
  if (roomChargeData) {
    yield put(captureRoomChargePaymentAndCloseOrder());
    const payload = yield call(getCloseOrderPayload, isCapacitySuggested, scheduledOrderCompletionTime);
    const mealPeriodId = yield select(getMealPeriodId);

    const processPaymentAsExternalPayment = yield select(shouldPostCreditCardsAsExternalPayments);
    try {

      payload.roomChargeData = roomChargeData;
      payload.terminalId = payload.igSettings.onDemandTerminalId;
      payload.processPaymentAsExternalPayment = processPaymentAsExternalPayment;
      payload.mealPeriodId = mealPeriodId;

      yield put(sendLoyaltyInfo(payload.order.contextId, payload.displayProfileId));
      yield put(fetchEtfData());
      const receiptInfo = yield call(buildReceiptInfoPayload, payload);
      payload.receiptInfo = receiptInfo;
      const closedOrder = yield call(captureRoomChargePaymentAndCloseOrderRequest, payload);
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
      yield put(setAppError(new Error('Failed to pay through room charge. Please try again.'), 'ERROR_ROOM_CHARGE_PAYMENT_FAILED')); // eslint-disable-line max-len
      yield put(captureRoomChargePaymentAndCloseOrderFailure(ex));
    }
  } else {
    yield put(setAppError(new Error('Failed to pay through room charge. Please try again.'), 'ERROR_ROOM_CHARGE_PAYMENT_FAILED')); // eslint-disable-line max-len
    yield put(captureRoomChargePaymentAndCloseOrderFailure('Transaction Failed'));
  }
}

export function * checkRoomInquiryCount () {
  const roomChargeConfig = yield select(getRoomChargeConfig);
  const resetWindow = ((roomChargeConfig && roomChargeConfig.resetTime) || 2) * 60 * 1000;
  const retryLimit = (roomChargeConfig && roomChargeConfig.maxAttempts) || 3;
  const retryCount = yield select(getRetryCount);
  if (retryCount >= retryLimit) {
    const inquiryDisabledTime =
      moment().add(((roomChargeConfig && roomChargeConfig.resetTime) || 2), 'minutes').format('YYYY-MM-DD HH:mm:ss Z');
    yield put(roomChargeInquiryDisable(inquiryDisabledTime));
    yield call(delay, resetWindow);
    yield put(roomChargeInquiryEnable());
  }
}

export function * checkRoomChargeTimerIfNeeded () {
  try {
    let disableProcess = yield select(getDisableProcess);
    if (disableProcess) {
      const roomChargeConfig = yield select(getRoomChargeConfig);
      let disableTimeStamp = yield select(getDisableTimeStamp);
      if (moment().isBefore(moment(disableTimeStamp, 'YYYY-MM-DD HH:mm:ss Z'))) {
        const diff = moment(disableTimeStamp, 'YYYY-MM-DD HH:mm:ss Z') - moment();
        if (diff < ((roomChargeConfig && roomChargeConfig.resetTime) || 2) * 60 * 1000) {
          yield call(delay, diff);
        }
      }
      yield put(roomChargeInquiryEnable());
    }

  } catch (er) {
    console.log(er);
  }
}

export function * processRoomChargeAsync () {
  const tenantId = yield select(getTenantId);
  const contextId = yield select(getSiteId);
  const roomChargeInfo = yield select(getRoomChargeInfo);
  const order = yield select(getOrder);
  const displayProfileId = yield select(getCartDisplayProfileId);
  const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
  const conceptIgPosConfig = yield select(getCartConceptPosConfig);
  const igSettings = getConceptIGSettings(currentStore.displayOptions, conceptIgPosConfig,
    currentStore.conceptLevelIgPosConfig);
  const roomChargeTenderConfig = yield select(getRoomChargeTenderConfig);
  const operaOnqPmsList = get(roomChargeTenderConfig, 'operaOnQPms', []);

  const roomChargeInquiryPayload = {
    tenantId,
    contextId,
    guestName: roomChargeInfo.lastName,
    roomNumber: `${roomChargeInfo.wingPrefix}${roomChargeInfo.roomNumber}`,
    properties: {
      tenderId: roomChargeInfo.tenderId,
      coverCount: roomChargeInfo.coverCount,
      pmsAdapterId: roomChargeInfo.pmsAdapterId,
      sourcePropertyId: igSettings.sourcePropertyId,
      destinationPropertyId: igSettings.destinationPropertyId,
      operaOnQPms: operaOnqPmsList && operaOnqPmsList.length > 0 &&
        operaOnqPmsList.indexOf(roomChargeInfo.tenderId) >= 0
    }
  };

  try {
    const roomChargeInquiryResponse = yield call(roomChargeInquiryRequest, roomChargeInquiryPayload);
    yield put(roomChargeInquirySuccess(roomChargeInquiryResponse));
  } catch (error) {
    yield put(roomChargeInquiryFailure(error));
  }
}

export function * getRoomChargePaymentData () {
  const roomChargeInfo = yield select(getRoomChargeInfo);
  const roomChargeAccountInfo = roomChargeInfo.roomChargeAccountInfo;
  if (roomChargeAccountInfo) {
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
      guestName: roomChargeInfo.lastName,
      roomNumber: `${roomChargeInfo.wingPrefix}${roomChargeInfo.roomNumber}`,
      tenderName: `${roomChargeInfo.hotelName} ${i18n.t('ROOM_CHARGE_LABEL')}`,
      pmsAdapterId: roomChargeInfo.pmsAdapterId,
      roomChargeAccountInfo: roomChargeInfo.roomChargeAccountInfo,
      tenderId: roomChargeInfo.tenderId,
      verificationCodeId: roomChargeInfo.verificationCodeId,
      paymentAmount: {
        amount,
        tipAmount
      }
    };
  }
}
