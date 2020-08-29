// Copyright © 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import { call, select } from 'redux-saga/effects';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';
import { getUtcDateTimeFromTimeString, getConceptIGSettings } from 'web/client/app/utils/common';
import { getDeliveryProperties } from 'web/client/app/modules/deliverylocation/sagas';

export const getCurrentStore = (contextId, displayProfileId) => (store) => store.sites.list.find(site => site.id === contextId && site.displayProfileId === displayProfileId);
export const getOrder = (store) => store.cart.order;
export const getCurrencyDetails = (store) => store.sites.currencyForPay;
export const getTenantId = (store) => store.app.config.tenantId;
export const getRemainingTipAmount = (store) => store.paymentOptions.remainingTipAmount;
export const getTipAmount = (store) => store.tip.tipAmount;
export const getCartProfitCenterId = (store) => store.cart.profitCenterId;
export const getCartDisplayProfileId = (store) => store.cart.displayProfileId;
export const getCartConceptId = (store) => store.cart.items[0].conceptId;
export const getCartTotalAmount = (store) => store.cart.total;
export const getRemainingAmount = (store) => store.paymentOptions.remaining;
export const getTotalOrderAmount = (store) => store.cart.total + parseFloat(store.tip.tipAmount);
const getMobileNumber = (store) => store.sites.orderConfig.sms.isSmsEnabled && store.smsnotification.mobileNumber;
const checkCapacitySuggested = (store) => store.scheduleorder.isCapacitySuggested;
const getScheduleOrderData = (store) => store.scheduleorder.scheduleOrderData;
const getCartConceptPosConfig = (store) => store.cart.conceptConfig;

export function * getCloseOrderPayload (isCapacitySuggested, scheduledOrderCompletionTime) {
  try {
    const order = yield select(getOrder);
    const tenantId = yield select(getTenantId);
    const currencyDetails = yield select(getCurrencyDetails);
    const displayProfileId = yield select(getCartDisplayProfileId);
    const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
    const profitCenterId = yield select(getCartProfitCenterId);
    const scheduledOrderTime = yield call(getScheduleTime);
    const capacitySuggestionPerformed = isCapacitySuggested || (yield select(checkCapacitySuggested));
    const conceptIgPosConfig = yield select(getCartConceptPosConfig);
    const selectNumber = yield select(getMobileNumber);
    const igSettings = getConceptIGSettings(currentStore.displayOptions, conceptIgPosConfig,
      currentStore.conceptLevelIgPosConfig);
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
    const payload = {
      contextId: order.contextId,
      tenantId,
      profitCenterId,
      order,
      currencyDetails,
      displayProfileId,
      currencyUnit: currencyDetails.currencyCode,
      igSettings,
      mobileNumber,
      deliveryProperties,
      capacitySuggestionPerformed,
      scheduledOrderTime
    };
    return payload;
  } catch (error) {
    throw error;
  }
}
