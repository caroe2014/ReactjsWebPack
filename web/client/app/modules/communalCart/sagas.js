// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { getSiteTaxRuleData } from 'web/client/app/modules/site/sagas';
import { getCurrentCurrency } from 'web/client/app/utils/common';
import { MULTI_PASS_ORDER_GUID } from 'web/client/app/utils/constants';
import { setOrderGiudStatus } from 'web/client/app/modules/app/sagas';
import { getTenantId } from 'web/client/app/utils/StateSelector';
import get from 'lodash.get';

export const MODIFY_COMMUNAL_CART_ITEM = 'MODIFY_COMMUNAL_CART_ITEM';
export const CANCEL_CART = 'CANCEL_CART';
export const CLOSE_COMMUNAL_CART = 'CLOSE_COMMUNAL_CART';
export const CLOSE_COMMUNAL_CART_NOTIFICATION = 'CLOSE_COMMUNAL_CART_NOTIFICATION';
export const TOGGLE_COMMUNAL_CART = 'TOGGLE_COMMUNAL_CART';
export const LAST_CART_LOCATION = 'LAST_CART_LOCATION';
export const SET_DELIVERY_DETAILS = 'SET_DELIVERY_DETAILS';
export const MODIFYING_COMMUNAL_CART = 'MODIFYING_COMMUNAL_CART';
export const MODIFYING_COMMUNAL_CART_FAILED = 'MODIFYING_COMMUNAL_CART_FAILED';
export const MODIFYING_COMMUNAL_CART_SUCCEEDED = 'MODIFYING_COMMUNAL_CART_SUCCEEDED';
export const MODIFYING_COMMUNAL_CART_RESOLVED = 'MODIFYING_COMMUNAL_CART_RESOLVED';
export const RESET_COMMUNAL_CART = 'RESET_COMMUNAL_CART';
export const PROCESS_AND_UPDATE_COMMUNAL_CART = 'PROCESS_AND_UPDATE_COMMUNAL_CART';
export const PROCESS_COMMUNAL_CART_FAILED = 'PROCESS_COMMUNAL_CART_FAILED';
export const PROCESS_COMMUNAL_CART_SUCCESS = 'PROCESS_COMMUNAL_CART_SUCCESS';
export const FETCHING_COMMUNAL_CART_BY_ORDER_GUID = 'FETCHING_COMMUNAL_CART_BY_ORDER_GUID';
export const FETCHING_COMMUNAL_CART_BY_ORDER_GUID_FAILED = 'FETCHING_COMMUNAL_CART_BY_ORDER_GUID_FAILED';
export const FETCHING_COMMUNAL_CART_BY_ORDER_GUID_SUCCESS = 'FETCHING_COMMUNAL_CART_BY_ORDER_GUID_SUCCESS';
export const REFRESH_COMMUNAL_CART = 'REFRESH_COMMUNAL_CART';
export const SET_IG_ORDER_PROPERTIES = 'SET_IG_ORDER_PROPERTIES';
export const ORDER_GUID_CHANGED = 'ORDER_GUID_CHANGED';
export const COMMUNAL_CART_UPDATE_ON_ADD_ITEM_FAILURE = 'COMMUNAL_CART_UPDATE_ON_ADD_ITEM_FAILURE';
export const COMMUNAL_CART_UPDATE_ON_REMOVE_ITEM_FAILURE = 'COMMUNAL_CART_UPDATE_ON_REMOVE_ITEM_FAILURE';
export const NEW_ITEMS_ADDED_FROM_ORDER = 'NEW_ITEMS_ADDED_FROM_ORDER';
export const NO_PENDING_ITEMS_FROM_ORDER = 'NO_PENDING_ITEMS_FROM_ORDER';
export const MODIFYING_ADD_UNDO = 'MODIFYING_ADD_UNDO';
export const MODIFYING_CLEAR_UNDO = 'MODIFYING_CLEAR_UNDO';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const UPDATE_TEMP_REMOVAL_LIST = 'UPDATE_TEMP_REMOVAL_LIST';

const getSites = (store) => store.sites.list;
const getUndoItem = (store) => store.communalCart.undoItem;
const getOrder = (store) => store.communalCart.order;
const getCartItems = (store) => store.communalCart.items;
const getIgOrderProperties = (store) => store.communalCart.igOrderProperties;
const getPendingCommunalCartItems = (store) =>
  store.communalCart.items.filter(item => item.properties.isSentToKitchen === 'false').map(item => {
    delete item.childGroups;
    delete item.modifiers;
    return item;
  });
const getCurrentSchedule = (store) => store.concept.list.filter(concept => concept.id === store.concept.conceptId)[0].schedule; // eslint-disable-line max-len

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

export const modifyCommunalCartItem = (item, action, uniqueId) => {
  if (action === 'ADD') {
    const uniqueId = _generateUniqueId();
    item = {
      ...item,
      count: item.count || 1,
      modifierTotal: _getModifierTotals(item.selectedModifiers),
      mealPeriodId: null,
      uniqueId,
      properties: {
        uniqueId: `${uniqueId}`
      }
    };
  }
  return {
    type: MODIFY_COMMUNAL_CART_ITEM,
    item,
    action,
    uniqueId
  };
};

export const closeCommunalCart = (data) => ({
  type: CLOSE_COMMUNAL_CART,
  cartClose: data
});

export const closeCommunalCartNotification = (data) => ({
  type: CLOSE_COMMUNAL_CART_NOTIFICATION,
  cartCloseNotification: data
});

export const cancelCart = () => ({
  type: CANCEL_CART
});

export const modifingCommunalCart = () => ({
  type: MODIFYING_COMMUNAL_CART
});

export const modifingCommunalCartFailed = (error) => ({
  type: MODIFYING_COMMUNAL_CART_FAILED,
  error
});
export const modifingCommunalCartSucceeded = (order, profitCenterId) => ({
  type: MODIFYING_COMMUNAL_CART_SUCCEEDED,
  orderDetails: order.orderDetails,
  order,
  profitCenterId
});
export const modifingCommunalCartResolved = (msg) => ({
  type: MODIFYING_COMMUNAL_CART_RESOLVED,
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

export const toggleCommunalCart = (flag) => ({
  type: TOGGLE_COMMUNAL_CART,
  flag
});

export const lastCartLocation = (path) => ({
  type: LAST_CART_LOCATION,
  path: path
});

export const processAndUpadateCommunalCart = (cartItems) => ({
  type: PROCESS_AND_UPDATE_COMMUNAL_CART,
  cartItems
});

export const processCommunalCartFailed = (error) => ({
  type: PROCESS_COMMUNAL_CART_FAILED,
  error
});

export const processCommunalCartSuccess = (addLineItemsResponse) => ({
  type: PROCESS_COMMUNAL_CART_SUCCESS,
  addLineItemsResponse
});

export const newItemsAddedFromOrder = (lineItems) => ({
  type: NEW_ITEMS_ADDED_FROM_ORDER,
  lineItems
});

export const noPendingItemsFromOrder = (lineItems) => ({
  type: NO_PENDING_ITEMS_FROM_ORDER,
  lineItems
});

export const fetchingCommunalCartByOrderGuid = () => ({
  type: FETCHING_COMMUNAL_CART_BY_ORDER_GUID
});

export const fetchingCommunalCartByOrderGuidFailed = () => ({
  type: FETCHING_COMMUNAL_CART_BY_ORDER_GUID_FAILED
});

export const fetchingCommunalCartByOrderGuidSuccess = (orderGuidResponse) => ({
  type: FETCHING_COMMUNAL_CART_BY_ORDER_GUID_SUCCESS,
  orderGuidResponse
});

export const resetCommunalCart = () => ({
  type: RESET_COMMUNAL_CART
});

export const refreshCummunalCart = () => ({
  type: REFRESH_COMMUNAL_CART
});

export const setIgOrderProperties = (igOrderProperties) => ({
  type: SET_IG_ORDER_PROPERTIES,
  igOrderProperties
});

export const setOrderGuidChanged = () => ({
  type: ORDER_GUID_CHANGED
});

export const updateCommunalCartOnAddItemFailure = (item) => ({
  type: COMMUNAL_CART_UPDATE_ON_ADD_ITEM_FAILURE,
  item
});

export const updateCommunalCartOnRemoveItemFailure = (item) => ({
  type: COMMUNAL_CART_UPDATE_ON_REMOVE_ITEM_FAILURE,
  item
});

export const updateTempRemovalList = (item) => ({
  type: UPDATE_TEMP_REMOVAL_LIST,
  item
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

export const calculateOrderTotal = async (tenantId, siteId, payload) => { // eslint-disable-line max-len
  return axios.post(`${config.webPaths.api}communalCart/${tenantId}/${siteId}/orders/calculate`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const addLineItemToOrderByGuid = async (tenantId, siteId, orderId, payload) => { // eslint-disable-line max-len
  return axios.put(`${config.webPaths.api}communalCart/${tenantId}/${siteId}/orders/${orderId}`, payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const removeLineItemFromOrderByGuid = async (tenantId, siteId, orderId, itemId) => { // eslint-disable-line max-len
  return axios.delete(`${config.webPaths.api}communalCart/${tenantId}/${siteId}/orders/${orderId}/${itemId}`)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const addLineItemsToOrderByGuid = async (tenantId, siteId, payload) => { // eslint-disable-line max-len
  return axios.post(`${config.webPaths.api}communalCart/${tenantId}/${siteId}/orders/addLineItemsToOrderByGuid`, payload) // eslint-disable-line max-len
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const getItemsByOrderGuid = async (tenantId, siteId, payload) => { // eslint-disable-line max-len
  return axios.post(`${config.webPaths.api}communalCart/${tenantId}/${siteId}/orders/getItemsByOrderGuid`, payload)
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

}

export function * resetOrder () {
  yield put(resetCommunalCart());
}

export function * removeItemFromCommunalCart (item) {
  const tenantId = yield select(getTenantId);
  const sitesList = yield select(getSites);
  const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
  const site = sitesList.length === 1 && sitesList[0];
  if (!tenantId) {
    yield put(modifingCommunalCartFailed('Missing Tenant ID'));
  } else {
    yield put(modifingCommunalCart());
    try {
      let lineItemId = item.lineItemId;
      if (!lineItemId) {
        const undoItem = yield select(getUndoItem);
        lineItemId = undoItem.uniqueId === item.uniqueId && undoItem.lineItemId;
        yield put(modifingClearUndo());
      }
      if (lineItemId) {
        const orderDetails = yield call(removeLineItemFromOrderByGuid, tenantId, site.id, orderGuid, lineItemId); // eslint-disable-line max-len
        yield put(updateTempRemovalList(item));
        yield put(modifingCommunalCartSucceeded(orderDetails));
        yield put(getSiteTaxRuleData(site.id, true));
      } else {
        yield put(updateTempRemovalList(item));
        yield put(modifingCommunalCartFailed('REMOVE :: Item Not In Order'));
      }
    } catch (ex) {
      yield put(updateCommunalCartOnRemoveItemFailure(item));
      yield put(updateTempRemovalList(item));
      yield put(setAppError(new Error('Failed to remove item from order, please try again'), 'COMMUNAL_CART_REMOVE_FAIL')); // eslint-disable-line max-len
      yield put(modifingCommunalCartFailed(ex));
    }
    yield put(modifingCommunalCartResolved());
  }
}

export function * addItemToCommunalCart (item) {
  const tenantId = yield select(getTenantId);
  const sitesList = yield select(getSites);
  const currentCartItems = yield select(getCartItems);
  const site = sitesList.length === 1 && sitesList[0];
  if (!tenantId) {
    yield put(modifingCommunalCartFailed('Missing Tenant ID'));
  } else if (!currentCartItems.find(i => i.uniqueId === item.uniqueId)) {
    yield put(modifingCommunalCartFailed(`ADD :: Item Not In Cart`));
  } else {
    yield put(modifingCommunalCart());
    try {
      const schedule = yield select(getCurrentSchedule);
      const payload = yield call(getCommunalCartRequestPayload, site, tenantId, true);
      payload.cartItems = [item];
      payload.schedule = schedule;
      const orderDetails = yield call(addLineItemToOrderByGuid, tenantId, site.id, payload.orderGuid, payload); // eslint-disable-line max-len
      const latestCartItems = yield select(getCartItems);
      if (latestCartItems.find(i => i.uniqueId === item.uniqueId)) {
        yield put(modifingCommunalCartSucceeded(orderDetails, payload.profitCenterId));
      } else {
        yield put(modifingAddUndo(orderDetails.addedItem.uniqueId, orderDetails.addedItem.lineItemId));
        yield put(modifingCommunalCartFailed('ADD :: Item No Longer In Cart'));
      }
      yield put(getSiteTaxRuleData(site.id, site.displayProfileId, true));
    } catch (ex) {
      yield put(updateCommunalCartOnAddItemFailure(item));
      yield put(setAppError(new Error('Failed to add item to order, please try again'), 'COMMUNAL_CART_ADD_FAIL')); // eslint-disable-line max-len
      yield put(modifingCommunalCartFailed(ex));
    }
    yield put(modifingCommunalCartResolved());
  }
}

export function * processAndUpdateCommunalCartAsync (cartItems) {
  const tenantId = yield select(getTenantId);
  const sitesList = yield select(getSites);
  const site = sitesList.find(list => list.id === cartItems[0].contextId);
  const pendingCartItems = yield select(getPendingCommunalCartItems);
  const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
  if (!tenantId) {
    yield put(processCommunalCartFailed('Missing Tenant ID'));
  } else {
    try {
      const payload = yield call(getCommunalCartRequestPayload, site, tenantId, true, true);
      let pendingLineItemsFromOrder = payload.lineItemsFromOrder &&
        payload.lineItemsFromOrder.filter(item => item.properties.isSentToKitchen === 'false');
      if (pendingLineItemsFromOrder && pendingLineItemsFromOrder.length > 0 &&
         pendingCartItems.length !== pendingLineItemsFromOrder.length) {
        yield put(newItemsAddedFromOrder(payload.lineItemsFromOrder));
      } else if (pendingLineItemsFromOrder && pendingLineItemsFromOrder.length === 0) {
        yield put(noPendingItemsFromOrder(payload.lineItemsFromOrder));
      } else {
        const addLineItemsResponse = yield call(addLineItemsToOrderByGuid, tenantId, site.id, payload); // eslint-disable-line max-len
        addLineItemsResponse.lineItems.map(item => {
          let modifierTotal = 0;
          item.lineItemGroups.map(group => {
            group.lineItems.map(subOption => {
              modifierTotal += parseFloat(subOption.price.amount);
            });
          });
          if (modifierTotal > 0) {
            item.price.amount = (parseFloat(item.price.amount) - modifierTotal).toFixed(2);
          }
          item.contextId = addLineItemsResponse.contextId;
        });
        yield put(processCommunalCartSuccess(addLineItemsResponse));
      }
    } catch (ex) {
      const errorMessage = ex.response && ex.response.data.message;
      if (errorMessage === 'INVALID_ORDER_GUID') {
        yield put(setOrderGiudStatus(true));
        yield put(resetCommunalCart());
      } else {
        yield put(processCommunalCartFailed(ex));
      }
    }
  }
}

export function * fetchCommunalCartByOrderGuidAysnc () {
  try {
    const sitesList = yield select(getSites);
    const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
    if (!orderGuid) {
      yield put(setOrderGiudStatus(true));
      yield put(resetCommunalCart());
      yield put(fetchingCommunalCartByOrderGuidFailed());
      return;
    }
    const order = yield select(getOrder);
    if (order && order.orderId && order.orderId !== orderGuid) {
      yield put(setOrderGuidChanged());
    }
    if (sitesList && sitesList.length === 1) {
      const selectedSite = sitesList[0];
      const tenantId = yield select(getTenantId);
      const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
      const payload = yield call(getCommunalCartRequestPayload, selectedSite, tenantId, false);
      const orderGuidResponse = yield call(getItemsByOrderGuid, tenantId, selectedSite.id, payload);
      orderGuidResponse.lineItems.map(item => {
        let modifierTotal = 0;
        item.lineItemGroups && item.lineItemGroups.map(group => {
          group.lineItems.map(subOption => {
            modifierTotal += parseFloat(subOption.price.amount);
          });
        });
        if (modifierTotal > 0) {
          item.price.amount = (parseFloat(item.price.amount) - modifierTotal).toFixed(2);
        }
        item.contextId = orderGuidResponse.contextId;
      });
      yield put(fetchingCommunalCartByOrderGuidSuccess(orderGuidResponse));
      yield put(getSiteTaxRuleData(selectedSite.id, selectedSite.displayProfileId, true));
    } else {
      yield put(fetchingCommunalCartByOrderGuidFailed());
      yield put(setAppError(new Error('Failed invalid store configuration , please try again'), 'ERROR_OAAT_STORE_CONFIG')); // eslint-disable-line max-len
    }
  } catch (ex) {
    const errorMessage = ex.response && ex.response.data.message;
    if (errorMessage === 'INVALID_ORDER_GUID') {
      yield put(setOrderGiudStatus(true));
      yield put(resetCommunalCart());
    } else {
      yield put(setAppError(new Error('Failed to fetch get items , please try again'), 'ERROR_COMMUNAL_CART_FETCH_ITEMS')); // eslint-disable-line max-len
    }
    yield put(fetchingCommunalCartByOrderGuidFailed());
  }
}

function * getCommunalCartRequestPayload (site, tenantId, fetchOrderProperties = false, getItems = false) {
  const orderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID); // eslint-disable-line
  const orderTimeZone = site.timeZone;
  const storePriceLevel = site.storePriceLevel;
  const useIgOrderApi = site.useIgOrderApi;
  const currencyDetails = getCurrentCurrency(site);
  let igOrderProperties = yield select(getIgOrderProperties);
  let lineItemsFromOrder = [];
  if ((!igOrderProperties && fetchOrderProperties) || getItems) {
    const payload = {
      orderGuid,
      currencyDetails
    };
    const getItemsResponse = yield call(getItemsByOrderGuid, tenantId, site.id, payload);
    igOrderProperties = getItemsResponse.properties;
    getItemsResponse.lineItems.map(item => {
      let modifierTotal = 0;
      item.lineItemGroups && item.lineItemGroups.map(group => {
        group.lineItems.map(subOption => {
          modifierTotal += parseFloat(subOption.price.amount);
        });
      });
      if (modifierTotal > 0) {
        item.price.amount = (parseFloat(item.price.amount) - modifierTotal).toFixed(2);
      }
      item.contextId = getItemsResponse.contextId;
    });
    lineItemsFromOrder = getItemsResponse.lineItems;
    yield put(setIgOrderProperties(igOrderProperties));
  }
  const requestPayload = {
    orderGuid,
    currencyDetails,
    orderTimeZone,
    storePriceLevel,
    useIgOrderApi,
    lineItemsFromOrder,
    openTerminalId: get(igOrderProperties, 'openTerminalId'),
    closedTerminalId: get(igOrderProperties, 'closedTerminalId'),
    employeeId: get(igOrderProperties, 'employeeId'),
    profitCenterId: get(igOrderProperties, 'profitCenterId'),
    checkTypeId: get(igOrderProperties, 'checkTypeId'),
    mealPeriodId: get(igOrderProperties, 'mealPeriodId')
  };
  return requestPayload;
}
