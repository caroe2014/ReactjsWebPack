// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { resetDelivery } from 'web/client/app/modules/deliverylocation/sagas';
import { resetTipData } from 'web/client/app/modules/tip/sagas';
import { resetSmsDetails } from 'web/client/app/modules/smsnotification/sagas';
import { resetNameDetails } from 'web/client/app/modules/namecapture/sagas';
import { getScheduleTime, resetScheduleOrderData } from 'web/client/app/modules/scheduleorder/sagas';
import { resetLoyaltyMap } from 'web/client/app/modules/loyalty/sagas';
import { resetDeliveryInfo } from 'web/client/app/utils/SeatNumber';
import { clearGAState } from 'web/client/app/modules/gaPayment/sagas';
import { resetSaleData, removeCCPaymentCard } from 'web/client/app/modules/iFrame/sagas';
import { resetRemaining, toggleMultiPayFetching } from 'web/client/app/modules/payOptions/sagas';
import { resetStripe } from 'web/client/app/modules/stripepay/sagas';
import { resetRoomCharge } from 'web/client/app/modules/roomCharge/sagas';
import { resetMemberCharge } from 'web/client/app/modules/memberCharge/sagas';
import { getSiteTaxRuleData } from 'web/client/app/modules/site/sagas';
import { resetAtrium } from 'web/client/app/modules/atrium/sagas';
import { getPlatformProfile, updatePlatformProfileCC } from 'web/client/app/modules/platformGuestProfile/sagas';
import moment from 'moment-timezone';

export const MODIFY_CART_ITEM = 'MODIFY_CART_ITEM';
export const INCREMENT_CART_ITEM = 'INCREMENT_CART_ITEM';
export const DECREMENT_CART_ITEM = 'DECREMENT_CART_ITEM';
export const SET_CART_TAX = 'SET_CART_TAX';
export const CANCEL_CART = 'CANCEL_CART';
export const GET_CART_READY_TIME = 'GET_CART_READY_TIME';
export const GET_CART_READY_TIME_FAILED = 'GET_CART_READY_TIME_FAILED';
export const GET_CART_READY_TIME_SUCCEEDED = 'GET_CART_READY_TIME_SUCCEEDED';
export const CLEAR_READY_TIME = 'CLEAR_READY_TIME';
export const CLOSE_CART = 'CLOSE_CART';
export const CLOSE_CART_NOTIFICATION = 'CLOSE_CART_NOTIFICATION';
export const TOGGLE_CART = 'TOGGLE_CART';
export const EMAIL_RECEIPT_SUCCESS = 'EMAIL_RECEIPT_SUCCESS';
export const SMS_RECEIPT_SUCCESS = 'SMS_RECEIPT_SUCCESS';
export const SET_CART_DELIVERY_CONFIRM_TEXT = 'SET_CART_DELIVERY_CONFIRM_TEXT';

export const LAST_CART_LOCATION = 'LAST_CART_LOCATION';
export const SET_DELIVERY_DETAILS = 'SET_DELIVERY_DETAILS';

export const MODIFYING_ORDER = 'MODIFYING_ORDER';
export const MODIFYING_ORDER_FAILED = 'MODIFYING_ORDER_FAILED';
export const MODIFYING_ORDER_SUCCEEDED = 'MODIFYING_ORDER_SUCCEEDED';
export const MODIFYING_ORDER_RESOLVED = 'MODIFYING_ORDER_RESOLVED';
export const MODIFYING_ADD_UNDO = 'MODIFYING_ADD_UNDO';
export const MODIFYING_CLEAR_UNDO = 'MODIFYING_CLEAR_UNDO';
export const CLOSE_ORDER = 'CLOSE_ORDER';
export const CLEAR_CLOSED_ORDER = 'CLEAR_CLOSED_ORDER';
export const CART_UPDATE_ON_ADD_ITEM_FAILURE = 'CART_UPDATE_ON_ADD_ITEM_FAILURE';
export const CART_UPDATE_ON_REMOVE_ITEM_FAILURE = 'CART_UPDATE_ON_REMOVE_ITEM_FAILURE';
export const DELIVERY_CREATE_ORDER = 'DELIVERY_CREATE_ORDER';
export const RESET_CART = 'RESET_CART';
export const CHECK_MODIFY_ORDER = 'CHECK_MODIFY_ORDER';
export const SET_MODIFY_ORDER_FLAG = 'SET_MODIFY_ORDER_FLAG';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const SET_CART_CONCEPT_OPTIONS = 'SET_CART_CONCEPT_OPTIONS';
export const UPDATE_CART_ON_PAYMENTS = 'UPDATE_CART_ON_PAYMENTS';
export const PROCESS_REMOVE_PAYMENTS = 'PROCESS_REMOVE_PAYMENTS';
export const RESOLVE_REMOVE_PAYMENTS = 'RESOLVE_REMOVE_PAYMENTS';

const getGAPaymentInfo = (store) => store.gaPayment;
const getTenantId = (store) => store.app.config.tenantId;
const getSelectedSiteId = (store) => store.sites.selectedId;
const getDisplayProfileId = (store) => store.sites.displayProfileId;
const getSelectedConceptPosConfig = (store) => store.concept.igPosConfig;
const getSites = (store) => store.sites.list;
const getReadyTime = (store) => store.cart.readyTime;
const getTipAmount = (store) => store.tip.tipAmount;
const getOrder = (store) => store.cart.order;
const getCartItems = (store) => store.cart.items;
const getClosedOrderItems = (store) => store.cart.closedOrder.items;
const getCartOpen = (store) => store.cart.cartOpen;
const getUndoItem = (store) => store.cart.undoItem;
const getCurrencyDetails = (store) => store.sites.currencyForPay;
const getSelectedSMSCountry = (store) => store.smsnotification.selectedCountry;
const getScheduledDay = (store) => store.scheduleorder.scheduleOrderData && store.scheduleorder.scheduleOrderData.daysToAdd; // eslint-disable-line max-len
const getCurrentSchedule = (store) => store.concept.list.filter(concept => concept.id === store.concept.conceptId)[0].schedule; // eslint-disable-line max-len
const getProfitCenterId = (contextId, displayProfileId) => (store) => {
  const currentStore = store.sites.list.find(site => site.id === contextId && site.displayProfileId === displayProfileId); // eslint-disable-line max-len
  const siteProfitCenterId = currentStore.profitCenterId;
  const conceptProfitCenterId = store.cart.conceptOptions && store.cart.conceptOptions.profitCenterId;
  if (currentStore.profitCenter) {
    const { useProfitCenterByConcept } = currentStore.profitCenter;
    if (useProfitCenterByConcept && conceptProfitCenterId) {
      return conceptProfitCenterId;
    }
  }

  return siteProfitCenterId;
};
const getOrderConfig = (store) => store.sites.orderConfig;
const getPaymentSaleData = (store) => store.payments.paymentSaleData;
const getStripePaymentSaleData = (store) => store.stripepayments.saleData;
const getStripeSaleChargeData = (store) => store.stripepayments.stripeChargeData;
const getSaleTime = (store) => store.payments.saleTime;
const getProfile = (store) => store.profile;
const getGAAccountNumber = (store) => store.gaPayment.accountNumber;
const getCurrentProfile = (store) => store.platformGuestProfile.profile;
const getPlatformGuestProfileConfig = (store) => store.sites.orderConfig.platformGuestProfileConfig;
const getShouldOptIn = (store) => store.platformGuestProfile.shouldOptIn;
const getIsSearchingProfileFlag = (store) => store.platformGuestProfile.isSearchingProfile;

export const incrementItemCount = (itemId, uniqueId) => ({
  type: INCREMENT_CART_ITEM,
  itemId,
  uniqueId
});

export const decrementItemCount = (itemId, uniqueId) => ({
  type: DECREMENT_CART_ITEM,
  itemId,
  uniqueId
});

const _getModifierTotals = (modifiers) => {
  let total = 0;
  if (modifiers) {
    modifiers.forEach((option) => {
      if (option.amount) {
        total += Number.parseFloat(option.amount);
      }
    });
  }
  return total;
};
const _generateUniqueId = (itemId) => itemId + '-' + new Date().getTime();

export const getProfitCenterIdFromStore = (tenantId, siteId) =>
  axios.get(`${config.webPaths.api}sites/${tenantId}/${siteId}/profitCenter/getProfitCenterId`)
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

export const modifyCartItem = (item, action, displayProfileId = undefined) => {
  if (action === 'ADD') {
    item = {
      ...item,
      count: item.count || 1,
      modifierTotal: _getModifierTotals(item.selectedModifiers),
      mealPeriodId: null,
      uniqueId: _generateUniqueId()
    };
  }
  return {
    type: MODIFY_CART_ITEM,
    item,
    action,
    displayProfileId
  };
};

export const setConceptOptions = (conceptOptions, conceptConfig) => ({
  type: SET_CART_CONCEPT_OPTIONS,
  conceptOptions,
  conceptConfig
});

export const closeCart = (data) => ({
  type: CLOSE_CART,
  cartClose: data
});

export const closeCartNotification = (data) => ({
  type: CLOSE_CART_NOTIFICATION,
  cartCloseNotification: data
});

export const setCartTax = (tax) => ({
  type: SET_CART_TAX,
  tax
});
export const cancelCart = () => ({
  type: CANCEL_CART
});
export const getCartReadyTime = () => ({
  type: GET_CART_READY_TIME
});
export const getCartReadyTimeFailed = (error) => ({
  type: GET_CART_READY_TIME_FAILED,
  error
});
export const getCartReadyTimeSucceeded = (readyTime) => ({
  type: GET_CART_READY_TIME_SUCCEEDED,
  readyTime
});
export const clearReadyTime = () => ({
  type: CLEAR_READY_TIME
});

export const updateCartOnAddItemFailure = (item) => ({
  type: CART_UPDATE_ON_ADD_ITEM_FAILURE,
  item
});

export const updateCartOnRemoveItemFailure = (item) => ({
  type: CART_UPDATE_ON_REMOVE_ITEM_FAILURE,
  item
});

export const modifingOrder = () => ({
  type: MODIFYING_ORDER
});

export const modifingOrderFailed = (error) => ({
  type: MODIFYING_ORDER_FAILED,
  error
});
export const modifingOrderSucceeded = (order, profitCenterId) => ({
  type: MODIFYING_ORDER_SUCCEEDED,
  order,
  profitCenterId
});
export const modifingOrderResolved = (msg) => ({
  type: MODIFYING_ORDER_RESOLVED,
  msg
});
export const modifingAddUndo = (uniqueId, lineItemId) => ({
  type: MODIFYING_ADD_UNDO,
  uniqueId,
  lineItemId
});
export const modifingClearUndo = () => ({
  type: MODIFYING_CLEAR_UNDO
});
export const updateCartOnPayments = (order) => ({
  type: UPDATE_CART_ON_PAYMENTS,
  order
});
export const closeOrder = (saleData, readyTime) => ({
  type: CLOSE_ORDER,
  saleData: saleData,
  readyTime: readyTime
});

export const clearClosedOrder = () => ({
  type: CLEAR_CLOSED_ORDER
});

export const toggleCart = (flag) => ({
  type: TOGGLE_CART,
  flag
});

export const emailReceiptSucceeded = (flag) => ({
  type: EMAIL_RECEIPT_SUCCESS,
  flag
});

export const smsReceiptSucceeded = (flag) => ({
  type: SMS_RECEIPT_SUCCESS,
  flag
});

export const setDeliveryConfirmationTextInCart = (text) => ({
  type: SET_CART_DELIVERY_CONFIRM_TEXT,
  text
});

export const lastCartLocation = (path) => ({
  type: LAST_CART_LOCATION,
  path: path
});

export const deliveryCreateOrder = (order, addedItems, mealPeriodId) => ({
  type: DELIVERY_CREATE_ORDER,
  order,
  addedItems,
  mealPeriodId
});

export const resetCart = () => ({
  type: RESET_CART
});

export const checkModifyOrder = () => ({
  type: CHECK_MODIFY_ORDER
});

export const setCartModifyOrderFlag = (flag = false) => ({
  type: SET_MODIFY_ORDER_FLAG,
  flag
});

export const processRemovePayments = () => ({
  type: PROCESS_REMOVE_PAYMENTS
});

export const resolveRemovePayments = () => ({
  type: RESOLVE_REMOVE_PAYMENTS
});

export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export const getPaymentTenderInfoRequest = (payload) =>
  axios.post(`${config.webPaths.api}order/getPaymentTenderInfo`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

export function * fetchCartReadyTimesForOpenCart () {
  const isCartOpen = yield select(getCartOpen);
  const cartItems = yield select(getCartItems);
  const scheduledOrderTime = yield call(getScheduleTime);
  if (cartItems.length > 0) {
    if (isCartOpen && !scheduledOrderTime) {
      yield call(fetchCartReadyTimeSaga, cartItems);
    }
  }
}

export function * fetchCartReadyTimesForClosingOrder () {
  const cartItems = yield select(getCartItems);
  const scheduledOrderTime = yield call(getScheduleTime);
  if (cartItems.length > 0 && !scheduledOrderTime) {
    yield call(fetchCartReadyTimeSaga, cartItems);
  }
}

export function * fetchCartReadyTimesForClosedOrder () {
  const items = yield select(getClosedOrderItems);
  yield call(fetchCartReadyTimeSaga, items);
}

export const fetchCartReadyTime = (tenantId, siteId, cartItems) => {
  return axios.post(`${config.webPaths.api}order/${tenantId}/${siteId}/getWaitTimeForItems`, cartItems)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export function * fetchCartReadyTimeSaga (cartItems) {
  const tenantId = yield select(getTenantId);
  const sitesList = yield select(getSites);
  const displayProfileId = yield select(getDisplayProfileId);
  if (cartItems.length < 1) {
    return;
  };

  const etf = sitesList.filter(list => list.id === cartItems[0].contextId && list.displayProfileId === displayProfileId)[0].etf; // eslint-disable-line max-len

  if (!tenantId) {
    yield put(getCartReadyTimeFailed('Missing Tenant ID'));
  } else if (etf && etf.etfEnabled) {
    try {
      const cartObj = {
        cartItems,
        varianceEnabled: etf.varianceEnabled,
        variancePercentage: etf.variancePercentage
      };
      const readyTime = yield call(fetchCartReadyTime, tenantId, cartItems[0].contextId, cartObj);
      yield put(getCartReadyTimeSucceeded(readyTime));
    } catch (ex) {
      yield put(getCartReadyTimeFailed(ex));
    }
  }
}

export const _addItemToNewOrder = async (tenantId, siteId, item, currencyDetails, schedule, orderTimeZone, scheduleTime, storePriceLevel, scheduledDay, useIgOrderApi, onDemandTerminalId, properties) => { // eslint-disable-line max-len

  let order = {
    item,
    currencyDetails,
    schedule,
    orderTimeZone,
    scheduleTime,
    storePriceLevel,
    scheduledDay,
    useIgOrderApi,
    onDemandTerminalId,
    properties
  };

  return axios.post(`${config.webPaths.api}order/${tenantId}/${siteId}/orders`, order)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const _addItemToExistingOrder = async (tenantId, siteId, item, orderId, currencyDetails, schedule, scheduleTime, storePriceLevel, scheduledDay) => { // eslint-disable-line max-len
  let order = {
    item,
    currencyDetails,
    schedule,
    scheduleTime,
    storePriceLevel,
    scheduledDay
  };
  return axios.put(`${config.webPaths.api}order/${tenantId}/${siteId}/orders/${orderId}`, order)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const _removeItemFromOrder = async (tenantId, siteId, lineItemId, orderId) => {
  return axios.delete(`${config.webPaths.api}order/${tenantId}/${siteId}/orders/${orderId}/${lineItemId}`)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export function * completeOrder (saleData) {
  const readyTime = yield select(getReadyTime);
  const sites = yield select(getSites);
  const orderConfig = yield select(getOrderConfig);
  const currencyDetails = yield select(getCurrencyDetails);
  const tipAmount = yield select(getTipAmount);
  const scheduledTime = yield call(getScheduleTime);
  const scheduledDay = yield select(getScheduledDay);
  const gaPaymentInfo = yield select(getGAPaymentInfo);
  const paymentSaleData = yield select(getPaymentSaleData);
  const stripePaymentSaleData = yield select(getStripePaymentSaleData);
  const stripeSaleChargeData = yield select(getStripeSaleChargeData);
  const profile = yield select(getProfile);
  const saleTime = yield select(getSaleTime);
  const selectedSMSCountry = yield select(getSelectedSMSCountry);
  saleData.saleData.sites = sites;
  saleData.saleData.orderConfig = orderConfig;
  saleData.saleData.currencyDetails = currencyDetails;
  saleData.saleData.paymentSaleData = paymentSaleData;
  saleData.saleData.stripePaymentSaleData = stripePaymentSaleData;
  saleData.saleData.stripeSaleChargeData = stripeSaleChargeData;
  saleData.saleData.saleTime = saleTime;
  saleData.saleData.profile = profile;
  if (saleData.saleData && saleData.saleData.closedOrder) {
    saleData.saleData.closedOrder.selectedSMSCountry = selectedSMSCountry;
    saleData.saleData.closedOrder.tipAmount = tipAmount;
    saleData.saleData.closedOrder.scheduledTime = scheduledTime;
    if (scheduledDay > 0) {
      saleData.saleData.closedOrder.scheduledDay = moment().add(scheduledDay, 'days').format('dddd, MMMM D');
    }
    if (gaPaymentInfo) {
      saleData.saleData.closedOrder.gaPayment = {
        gaAccountInfoList: gaPaymentInfo.gaAccountsInfoList
      };
    }
  }
  yield put(closeOrder(saleData.saleData, readyTime));

  const activeProfile = yield select(getCurrentProfile);
  const shouldOptIn = yield select(getShouldOptIn);
  const isSearchingProfile = yield select(getIsSearchingProfileFlag);
  let platformGuestProfileConfig = yield select(getPlatformGuestProfileConfig);
  if (platformGuestProfileConfig && platformGuestProfileConfig.enabled) {
    let paymentInfoList = saleData.saleData.closedOrder.paymentInfoList;
    let lastPayment = paymentInfoList[paymentInfoList.length - 1];
    if (Object.keys(activeProfile).length !== 0) {
      if (shouldOptIn) {
        if (lastPayment.buyPaymentForm === 'CREDIT_CARD') {
          const correlationId = lastPayment.cardInfo.correlationId;
          let isCorrelationIdExist = activeProfile.correlationIds.some(id => id === correlationId);
          if (!isCorrelationIdExist) {
            yield put(updatePlatformProfileCC(correlationId));
          }
        }
      }
    } else if (!isSearchingProfile) {
      if (lastPayment.buyPaymentForm === 'CREDIT_CARD') {
        const correlationId = lastPayment.cardInfo.correlationId;
        yield put(getPlatformProfile('credit', correlationId, platformGuestProfileConfig));
      } else if (lastPayment.buyPaymentForm === 'GENERIC_AUTHORIZATION') {
        const gaAccountNumber = yield select(getGAAccountNumber);
        yield put(getPlatformProfile('GA', gaAccountNumber, platformGuestProfileConfig));
      }
    }
  }

  yield put(resetDelivery());
  yield put(resetSmsDetails());
  yield put(resetTipData());
  yield put(resetScheduleOrderData());
  yield put(resetNameDetails());
  yield put(resetLoyaltyMap(true));
  // yield put(resetLoyaltyRewards());
  yield put(clearGAState());
  // yield put(clearLoyaltyState());
  yield put(resetRemaining());
  yield put(removeCCPaymentCard());
  yield put(resetStripe());
  yield put(resetRoomCharge());
  yield put(resetMemberCharge());
  yield put(resetAtrium());
  // yield put(resetPlatformProfile());
  resetDeliveryInfo();
}

export function * resetOrder () {
  yield put(resetCart());
  yield put(resetDelivery());
  yield put(resetSmsDetails());
  yield put(resetTipData());
  yield put(resetScheduleOrderData());
  yield put(resetNameDetails());
  yield put(resetLoyaltyMap(true));
  // yield put(resetLoyaltyRewards());
  yield put(resetSaleData());
  yield put(clearGAState());
  // yield put(clearLoyaltyState());
  yield put(resetRemaining());
  yield put(removeCCPaymentCard());
  yield put(resetStripe());
  yield put(resetRoomCharge());
  yield put(resetMemberCharge());
  resetDeliveryInfo();
  yield put(toggleMultiPayFetching());
  yield put(resetAtrium());
}

export function * removeItemFromOrder (item) {
  const existingOrder = yield select(getOrder);
  const tenantId = yield select(getTenantId);
  if (!tenantId) {
    yield put(modifingOrderFailed('REMOVE :: Missing Tenant ID'));
  } else if (!existingOrder.orderId) {
    yield put(modifingOrderFailed('REMOVE :: No order to delete items from'));
  } else if (item) {
    let lineItemId = item.lineItemId;
    if (!lineItemId) {
      const undoItem = yield select(getUndoItem);
      lineItemId = undoItem.uniqueId === item.uniqueId && undoItem.lineItemId;
      yield put(modifingClearUndo());
    }
    if (lineItemId) {
      yield put(modifingOrder());
      try {
        let newOrder;
        newOrder = yield call(
          _removeItemFromOrder,
          tenantId, item.contextId,
          lineItemId,
          existingOrder.orderId
        );
        yield put(modifingOrderSucceeded(newOrder));
      } catch (ex) {
        yield put(updateCartOnRemoveItemFailure(item));
        yield put(setAppError(new Error('Failed to delete item from the cart , please try again'), 'ERROR_CART_DELETE')); // eslint-disable-line max-len
        yield put(modifingOrderFailed(ex));
      }
      yield put(modifingOrderResolved('REMOVE'));
    } else {
      yield put(modifingOrderFailed('REMOVE :: Item Not In Order'));
    }
  } else {
    yield put(modifingOrderFailed('REMOVE :: Item Not In Order'));
  }
}

export function * addItemToOrder (item) {
  const existingOrder = yield select(getOrder);
  const tenantId = yield select(getTenantId);
  const selectedSiteId = yield select(getSelectedSiteId);
  const displayProfileId = yield select(getDisplayProfileId);
  const sitesList = yield select(getSites);
  const currentCartItems = yield select(getCartItems);
  let profitCenterId = yield select(getProfitCenterId(selectedSiteId, displayProfileId));
  const site = sitesList.filter(list => list.id === item.contextId)[0];
  const orderTimeZone = site.timeZone;
  const storePriceLevel = site.storePriceLevel;
  const useIgOrderApi = site.useIgOrderApi;
  const conceptLevelIgPosConfig = site.conceptLevelIgPosConfig;
  let onDemandTerminalId = site.displayOptions.onDemandTerminalId;
  let employeeId = site.displayOptions.onDemandEmployeeId;

  const conceptIgPosConfig = yield select(getSelectedConceptPosConfig);
  if (conceptLevelIgPosConfig && conceptIgPosConfig) {
    onDemandTerminalId = conceptIgPosConfig.terminalId;
    employeeId = conceptIgPosConfig.employeeId;
  }
  const orderNumberNameSpace = site.displayOptions &&
    site.displayOptions.orderNumberNameSpace ? site.displayOptions.orderNumberNameSpace : onDemandTerminalId;
  const orderNumberSequenceLength = site.displayOptions &&
    site.displayOptions.orderNumberSequenceLength ? site.displayOptions.orderNumberSequenceLength : 4;
  const properties = {
    checkTypeId: site.checkTypeId,
    employeeId: employeeId,
    profitCenterId,
    orderSourceSystem: 'onDemand',
    orderNumberSequenceLength,
    orderNumberNameSpace
  };
  if (!tenantId) {
    yield put(modifingOrderFailed('ADD :: Missing Tenant ID'));
  } else if (selectedSiteId < 0) {
    yield put(modifingOrderFailed('ADD :: Missing Site ID'));
  } else if (!currentCartItems.find(i => i.uniqueId === item.uniqueId)) {
    yield put(modifingOrderFailed(`ADD :: Item Not In Cart`));
  } else {
    yield put(modifingOrder());
    try {
      let newOrder;
      const schedule = yield select(getCurrentSchedule);
      const scheduleTime = yield call(getScheduleTime);
      const scheduledDay = yield select(getScheduledDay);
      const currencyDetails = yield select(getCurrencyDetails);
      delete item.modifiers;
      delete item.childGroups;

      if (existingOrder.orderId) {
        newOrder = yield call(_addItemToExistingOrder, tenantId, selectedSiteId, item, existingOrder.orderId, currencyDetails, schedule, scheduleTime, storePriceLevel, scheduledDay); // eslint-disable-line max-len
      }

      if (!existingOrder.orderId) {
        if (!profitCenterId || profitCenterId === null) {
          profitCenterId = yield call(getProfitCenterIdFromStore, tenantId, selectedSiteId);
        }
        yield put(clearClosedOrder());
        newOrder = yield call(_addItemToNewOrder, tenantId, selectedSiteId, item, currencyDetails, schedule, orderTimeZone, scheduleTime, storePriceLevel, scheduledDay, useIgOrderApi, onDemandTerminalId, properties); // eslint-disable-line max-len
      }
      const latestCartItems = yield select(getCartItems);
      if (latestCartItems.find(i => i.uniqueId === item.uniqueId)) {
        yield put(modifingOrderSucceeded(newOrder, profitCenterId));
      } else {
        yield put(modifingAddUndo(newOrder.addedItem.uniqueId, newOrder.addedItem.lineItemId));
        yield put(modifingOrderFailed('ADD :: Item No Longer In Cart'));
      }
      yield put(getSiteTaxRuleData(item.contextId, displayProfileId, true));
    } catch (ex) {
      yield put(updateCartOnAddItemFailure(item));
      yield put(setAppError(new Error('Failed to add item to the cart , please try again'), 'ERROR_CART_ADD')); // eslint-disable-line max-len
      yield put(modifingOrderFailed(ex));
    }
    yield put(modifingOrderResolved('ADD'));
  }
}
