// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { stripeCheckoutSucceeded, fetchEtfData } from 'web/client/app/modules/iFrame/sagas';
import { getUtcDateTimeFromTimeString, getConceptIGSettings } from 'web/client/app/utils/common';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';
import { sendLoyaltyInfo } from 'web/client/app/modules/loyalty/sagas';
import { resetOrder } from 'web/client/app/modules/cart/sagas';
import { replace } from 'connected-react-router';
import { getDeliveryProperties } from 'web/client/app/modules/deliverylocation/sagas';
import { resetSites } from 'web/client/app/modules/site/sagas';
import { getCurrentStore } from 'web/client/app/utils/StateSelector';
import { buildReceiptInfoPayload } from 'web/client/app/modules/communication/sagas';

export const MAKE_CHARGE = 'MAKE_CHARGE';
export const MAKE_CHARGE_SUCCEEDED = 'MAKE_CHARGE_SUCCEEDED';
export const MAKE_CHARGE_FAILED = 'MAKE_CHARGE_FAILED';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const RESET_STRIPE = 'RESET_STRIPE';
const getOrder = (store) => store.cart.order;
const getCurrencyDetails = (store) => store.sites.currencyForPay;
const getStripeChargeData = (store) => store.stripepayments.stripeChargeData;
const getTipAmount = (store) => store.tip.tipAmount;
const getMobileNumber = (store) => store.sites.orderConfig.sms.isSmsEnabled && store.smsnotification.mobileNumber;
const checkCapacitySuggested = (store) => store.scheduleorder.isCapacitySuggested;
const getProfitCenterId = (store) => store.cart.profitCenterId;
const getDisplayProfileId = (store) => store.cart.displayProfileId;
const getScheduleOrderData = (store) => store.scheduleorder.scheduleOrderData;
const getCartConceptPosConfig = (store) => store.cart.conceptConfig;

export const makeCharge = (data) => ({
  type: MAKE_CHARGE,
  stripeChargeData: data
});
export const makeChargeSucceeded = (data) => ({
  type: MAKE_CHARGE_SUCCEEDED,
  saleData: data
});
export const makeChargeFailed = (error) => ({
  type: MAKE_CHARGE_FAILED,
  chargeError: MAKE_CHARGE_FAILED,
  error
});
export const setAppError = (error, key, dynamicKey) => ({
  type: SET_APP_ERROR,
  error,
  key,
  dynamicKey
});
export const resetStripe = () => ({
  type: RESET_STRIPE
});

export const createClosedOrder = (obj) => axios.post(`${config.webPaths.api}order/createClosedOrderWallets`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });
export function * setStripeToken (scheduledOrderCompletionTime, isCapacitySuggested = false) {
  const order = yield select(getOrder);
  const chargeData = yield select(getStripeChargeData);
  const currencyDetails = yield select(getCurrencyDetails);
  const displayProfileId = yield select(getDisplayProfileId);
  const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
  const selectNumber = yield select(getMobileNumber);
  const tipAmount = yield select(getTipAmount);
  const profitCenterId = yield select(getProfitCenterId);
  const capacitySuggestionPerformed = isCapacitySuggested || (yield select(checkCapacitySuggested));
  const conceptIgPosConfig = yield select(getCartConceptPosConfig);
  const igSettings = getConceptIGSettings(currentStore.displayOptions, conceptIgPosConfig,
    currentStore.conceptLevelIgPosConfig);
  if (chargeData) {
    try {
      const scheduledOrderTime = yield call(getScheduleTime);
      if (scheduledOrderTime) {
        const scheduleOrderData = yield select(getScheduleOrderData);
        const pickupTimeStamp = getUtcDateTimeFromTimeString(scheduledOrderCompletionTime || scheduledOrderTime.endTime, scheduleOrderData.daysToAdd); // eslint-disable-line max-len
        order.scheduledOrderCompletionTimeStamp = pickupTimeStamp;
        order.scheduledOrderTime = `${scheduledOrderTime.startTime}-${scheduledOrderTime.endTime}`;
      }
      let mobileNumber;
      if (selectNumber && selectNumber.length > 0) {
        mobileNumber = selectNumber; // Need to change the hard code country code
      }
      const deliveryProperties = yield call(getDeliveryProperties);

      yield put(sendLoyaltyInfo(order.contextId, displayProfileId));
      const paymentObj = {
        processPaymentAsExternalPayment: true,
        authorizedAmount: order.taxIncludedTotalAmount.amount,
        siteId: order.contextId,
        order,
        subtotal: order.taxIncludedTotalAmount.amount,
        tipAmount,
        currencyDetails,
        igSettings,
        mobileNumber,
        deliveryProperties,
        profitCenterId,
        chargeData,
        profileId: displayProfileId,
        capacitySuggestionPerformed,
        scheduledOrderTime
      };
      yield put(fetchEtfData());
      const receiptInfo = yield call(buildReceiptInfoPayload, paymentObj);
      paymentObj.receiptInfo = receiptInfo;
      const closedOrder = yield call(createClosedOrder, paymentObj);
      yield put(stripeCheckoutSucceeded(closedOrder));
      yield put(makeChargeSucceeded(closedOrder));
    } catch (ex) {
      let isResetOrder = false;
      if (ex.response && ex.response.data.message === 'REFUND_SUCCESS_AND_CLOSED_ASAP') {
        yield put(setAppError(new Error('High demand - Try ordering for later! and Payment failed with transaction id {{transactionId}}'), 'REFUND_SUCCESS_AND_CLOSED_ASAP', { transactionId: order.orderNumber })); // eslint-disable-line max-len
        isResetOrder = true;
      } else if (ex.response && ex.response.data.message === 'REFUND_SUCCESS_AND_CLOSED_ASAP') {
        yield put(setAppError(new Error('High demand - Try ordering for later! and Order failed and refund initiated. Please place a new order.'), 'REFUND_SUCCESS_AND_CLOSED_ASAP')); // eslint-disable-line max-len
        isResetOrder = true;
      } else if (ex.response && ex.response.data.message === 'STRIPE_REFUND_FAILED') {
        yield put(setAppError(new Error('Payment failed with transaction id {{transactionId}}'), 'ERROR_REFUND', { transactionId: order.orderNumber })); // eslint-disable-line max-len
        isResetOrder = true;
      } else if (ex.response && ex.response.data.message === 'STRIPE_REFUND_SUCCESS') {
        yield put(setAppError(new Error('Order failed and refund initiated. Please place a new order.'), 'ERROR_ORDER_FAILED')); // eslint-disable-line max-len
        isResetOrder = true;
      } else if (ex.response && ex.response.data.message === 'STRIPE_TRANSACTION_FAILED') {
        yield put(setAppError(new Error('Payment failed. Please try again.'), 'ERROR_FAILED_STRIPE'));
      } else {
        yield put(setAppError(new Error('Payment failed. Please try again.'), 'ERROR_FAILED_STRIPE'));
      }
      if (isResetOrder) {
        yield put(replace('/'));
        yield call(resetOrder);
        yield put(resetSites());
      }
      yield put(makeChargeFailed(ex.response));
    }
  } else {
    yield put(makeChargeFailed('Stripe Transaction Failed'));
    yield put(setAppError(new Error('Payment failed. Please try again.'), 'ERROR_FAILED_STRIPE'));
  }
}
