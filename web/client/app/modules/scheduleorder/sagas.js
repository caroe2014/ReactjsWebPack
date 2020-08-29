// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
/* istanbul ignore file */
import { select, call, put } from 'redux-saga/effects';
import { scheduleOrderConfig, scheduleType, paymentTypes } from 'web/client/app/utils/constants';
import axios from 'axios';
import { replace } from 'connected-react-router';
import config from 'app.config';
import i18n from 'web/client/i18n';
import { setTokenizedToken, saleTransactionInititate } from 'web/client/app/modules/iFrame/sagas';
import { resetOrder } from 'web/client/app/modules/cart/sagas';
import { checkScheduledTimeIsValid } from 'web/client/app/utils/common';
import { setStripeToken } from 'web/client/app/modules/stripepay/sagas';
import { fetchAndProcessMultiPayments, processMultiPaymentFailed } from 'web/client/app/modules/payOptions/sagas';
import get from 'lodash.get';
import { toggleFetchAuthResponse, authorizeGAPaymentAsync,
  authorizeGaSplitPaymentAsync } from 'web/client/app/modules/gaPayment/sagas';
import { resetSites } from 'web/client/app/modules/site/sagas';
import { captureRoomChargePaymentAndCloseOrderAsync } from 'web/client/app/modules/roomCharge/sagas';
import { captureMemberChargePaymentAndCloseOrderAsync } from 'web/client/app/modules/memberCharge/sagas';
import { captureLoyaltyVoucherSplitPaymentAsync, captureLoyaltyPointsSplitPaymentAsync,
  captureLoyaltyHostCompVoucherSplitPaymentAsync,
  captureLoyaltyPaymentAsync } from 'web/client/app/modules/loyalty/sagas';
import { updateAtriumAuthResponseAsync, setAtriumPaymentProcessing } from 'web/client/app/modules/atrium/sagas';
import { getCurrentStore } from 'web/client/app/utils/StateSelector';

export const SCHEDULE_ORDER_DATA = 'SCHEDULE_ORDER_DATA';
export const SCHEDULE_STORE_CONFIG = 'SCHEDULE_STORE_CONFIG';
export const RESET_SCHEDULE_ORDER = 'RESET_SCHEDULE_ORDER';
export const RESET_SCHEDULE_ORDER_DATA = 'RESET_SCHEDULE_ORDER_DATA';
export const SET_HIDE_SCHEDULE_TIME = 'SET_HIDE_SCHEDULE_TIME';
export const FETCHING_CAPACITY_CHECK = 'FETCHING_CAPACITY_CHECK';
export const CAPACITY_CHECK_SUCCESS = 'CAPACITY_CHECK_SUCCESS';
export const CAPACITY_CHECK_FAILED = 'CAPACITY_CHECK_FAILED';
export const SHOW_CAPACITY_WINDOW = 'SHOW_CAPACITY_WINDOW';
export const ACCEPT_CAPACITY_TIME = 'ACCEPT_CAPACITY_TIME';
export const SET_MULTI_PAYMENT_DATA = 'SET_MULTI_PAYMENT_DATA';
export const SET_APP_ERROR = 'SET_APP_ERROR';

const getScheduleOrderEnabled = (store) => store.scheduleorder.isScheduleOrderEnabled;
const getScheduleOrderData = (store) => store.scheduleorder.scheduleOrderData;
const getPaymentType = (store) => store.scheduleorder.paymentType;
const getOrder = (store) => store.cart.order;
const getAppConfig = (store) => store.app.config;
const getAllSchedules = (store) => store.scheduleorder.scheduledStoreConfigList;
const getDisplayProfileId = (store) => store.cart.displayProfileId;

export const setScheduledStoreConfig = (data) => ({
  type: SCHEDULE_STORE_CONFIG,
  scheduledStoreConfig: data.scheduledStoreConfig,
  scheduledStoreConfigList: data.scheduledStoreConfigList,
  enabled: data.enabled,
  asapOrderDisabled: data.asapOrderDisabled
});

export const setScheduleOrderData = (scheduleOrderData) => ({
  type: SCHEDULE_ORDER_DATA,
  scheduleOrderData
});

export const resetScheduleOrderData = () => ({
  type: RESET_SCHEDULE_ORDER_DATA
});

export const resetScheduleOrder = () => ({
  type: RESET_SCHEDULE_ORDER
});
export const setHideScheduleTime = (value) => ({
  type: SET_HIDE_SCHEDULE_TIME,
  value
});
export const fetchCapacityCheck = (paymentType) => ({
  type: FETCHING_CAPACITY_CHECK,
  paymentType
});
export const capacityCheckSuccess = (capacityData, paymentType, multiPaymentData) => ({
  type: CAPACITY_CHECK_SUCCESS,
  capacityData,
  paymentType,
  multiPaymentData
});
export const capacityCheckFailed = (error) => ({
  type: CAPACITY_CHECK_FAILED,
  error
});
export const setShowCapacityWindow = (flag = false) => ({
  type: SHOW_CAPACITY_WINDOW,
  flag
});
export const acceptCapacityTime = (scheduledOrderCompletionTime = undefined) => ({
  type: ACCEPT_CAPACITY_TIME,
  scheduledOrderCompletionTime
});
export const setMultipaymentData = (multiPaymentData) => ({
  type: SET_MULTI_PAYMENT_DATA,
  multiPaymentData
});
export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export const capacityCheck = (capacityPayload) => axios.put(`${config.webPaths.api}order/capacityCheck`, capacityPayload) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export function * getScheduleTime () {
  let scheduleTime;
  const isScheduleOrderEnabled = yield select(getScheduleOrderEnabled);
  const scheduleOrderData = yield select(getScheduleOrderData);
  if (isScheduleOrderEnabled && scheduleType.asap !== scheduleOrderData.scheduleType &&
    scheduleOrderData.scheduleTime) {
    const [startTime, endTime] = scheduleOrderData.scheduleTime.split('-');
    scheduleTime = {
      startTime: startTime.trim(),
      endTime: endTime.trim()
    };
  }
  return scheduleTime;
}

export function * throttlingCapacityCheck (paymentType, multiPaymentData) {
  const selectPaymentType = paymentType || (yield select(getPaymentType));
  const scheduleTime = yield call(getScheduleTime);
  const order = yield select(getOrder);
  const availableSchedules = yield select(getAllSchedules);
  const scheduleOrderData = yield select(getScheduleOrderData);
  const displayProfileId = yield select(getDisplayProfileId);
  const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
  const timezone = currentStore.timeZone;
  let capacityResponse;
  try {
    if (scheduleTime && scheduleOrderData.daysToAdd === 0 && checkScheduledTimeIsValid(scheduleTime.endTime, timezone)) {
      yield put(setAppError(new Error(i18n.t('TIME_GREATER'))));
      yield put(replace('/'));
      yield call(resetOrder);
      yield put(resetSites());
    } else {
      if (scheduleTime) {
        const appConfig = yield select(getAppConfig);
        let bufferTime = scheduleOrderConfig.bufferTime;
        const domainScheduleConfig = get(appConfig, 'properties.scheduledOrdering', {});
        if (domainScheduleConfig.bufferTime || domainScheduleConfig.bufferTime === 0) {
          bufferTime = domainScheduleConfig.bufferTime;
        }
        const intervalTime = domainScheduleConfig.intervalTime || scheduleOrderConfig.intervalTime;
        const capacityPayload = {
          scheduleTime: `${scheduleTime.startTime}-${scheduleTime.endTime}`,
          daysToAdd: scheduleOrderData.daysToAdd,
          orderId: order.orderId,
          storeConfig: {
            bufferTime,
            intervalTime,
            storeTimeZone: currentStore.timeZone,
            openWindowFrames: availableSchedules.find(availability => availability.day === scheduleOrderData.daysToAdd).openWindowTimeFrames
          },
          contextId: currentStore.id,
          scheduleOrderData
        };
        yield put(fetchCapacityCheck(paymentType));
        capacityResponse = yield call(capacityCheck, capacityPayload);
        if (multiPaymentData) {
          const isCapacitySuggested = !!get(capacityResponse, 'scheduledOrderCompletionTime', undefined);
          const scheduledOrderCompletionTime = isCapacitySuggested ? capacityResponse.scheduledOrderCompletionTime : undefined; // eslint-disable-line max-len
          multiPaymentData.isCapacitySuggested = isCapacitySuggested;
          multiPaymentData.scheduledOrderCompletionTime = scheduledOrderCompletionTime;
        }
        yield put(capacityCheckSuccess(capacityResponse, paymentType, multiPaymentData));
      }
      if (!scheduleTime || (capacityResponse && !capacityResponse.isToSuggest)) {
        const isCapacitySuggested = !!get(capacityResponse, 'scheduledOrderCompletionTime', undefined);
        const scheduledOrderCompletionTime = isCapacitySuggested ? capacityResponse.scheduledOrderCompletionTime : undefined; // eslint-disable-line max-len

        switch (selectPaymentType) {
          case paymentTypes.IFRAME:
            yield put(saleTransactionInititate());
            yield call(setTokenizedToken, scheduledOrderCompletionTime, isCapacitySuggested);
            return;
          case paymentTypes.STRIPE:
            yield call(setStripeToken, scheduledOrderCompletionTime, isCapacitySuggested);
            return;
          case paymentTypes.GA:
            yield call(authorizeGAPaymentAsync, scheduledOrderCompletionTime, isCapacitySuggested);
            return;
          case paymentTypes.MULTIPAYMENT:
            yield call(fetchAndProcessMultiPayments, scheduledOrderCompletionTime, isCapacitySuggested);
            return;
          case paymentTypes.GA_LASTMULTIPAYMENT:
            let { account, amount, isAmountModified } = multiPaymentData;
            yield call(authorizeGaSplitPaymentAsync, account, amount, isAmountModified);
            return;
          case paymentTypes.LOYALTY:
            yield call(captureLoyaltyPaymentAsync, scheduledOrderCompletionTime, isCapacitySuggested, multiPaymentData.loyaltyPaymentInfo, multiPaymentData.loyaltyPaymentType); // eslint-disable-line max-len
            return;
          case paymentTypes.LOYALTY_POINTS_LASTMULTIPAYMENT:
            yield call(captureLoyaltyPointsSplitPaymentAsync, multiPaymentData.account, multiPaymentData.amount, multiPaymentData.isAmountModified); // eslint-disable-line max-len
            return;
          case paymentTypes.LOYALTY_VOUCHER_LASTMULTIPAYMENT:
            yield call(captureLoyaltyVoucherSplitPaymentAsync, multiPaymentData.vouchers, multiPaymentData.amount, multiPaymentData.isAmountModified); // eslint-disable-line max-len
            return;
          case paymentTypes.LOYALTY_HOSTCOMPVOUCHER_LASTMULTIPAYMENT:
            yield call(captureLoyaltyHostCompVoucherSplitPaymentAsync, multiPaymentData.voucher, multiPaymentData.amount, multiPaymentData.isAmountModified); // eslint-disable-line max-len
            return;
          case paymentTypes.ROOM_CHARGE:
            yield call(captureRoomChargePaymentAndCloseOrderAsync, scheduledOrderCompletionTime, isCapacitySuggested);
            return;
          case paymentTypes.MEMBER_CHARGE:
            yield call(captureMemberChargePaymentAndCloseOrderAsync, scheduledOrderCompletionTime, isCapacitySuggested);
            return;
          case paymentTypes.ATRIUM_LASTPAYMENT:
            yield call(updateAtriumAuthResponseAsync, multiPaymentData.account, multiPaymentData.completePayment);
            return;
        }
      } else {
        if (selectPaymentType === paymentTypes.MULTIPAYMENT ||
        selectPaymentType === paymentTypes.GA_LASTMULTIPAYMENT) {
          yield put(processMultiPaymentFailed());
        } else if (selectPaymentType === paymentTypes.ATRIUM_LASTPAYMENT) {
          yield put(setAtriumPaymentProcessing());
        }
      }
    }
  } catch (error) {
    yield put(setAppError(new Error(i18n.t('PAYMENT_PAGE_ERROR_TRANSACTION'))));
    yield put(capacityCheckFailed(error.message));
    if (selectPaymentType === paymentTypes.MULTIPAYMENT || paymentTypes.GA_LASTMULTIPAYMENT ||
      selectPaymentType === paymentTypes.GA) {
      yield put(processMultiPaymentFailed());
      yield put(toggleFetchAuthResponse());
    } else if (selectPaymentType === paymentTypes.ATRIUM_LASTPAYMENT) {
      yield put(setAtriumPaymentProcessing());
    }
  }
}
