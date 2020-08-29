// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';
import uuidv4 from 'uuid/v4';

const initialState = {
  items: [],
  removedItemsList: [],
  subTotal: 0,
  total: 0,
  gratuity: 0,
  serviceAmount: 0,
  tax: 0,
  closeFlag: false,
  closeNotificationFlag: false,
  error: undefined,
  order: {},
  mealPeriodId: null,
  processCommunalCart: false,
  fetchCommunalCart: false,
  lastItemAdded: null,
  cartOpen: false,
  lastCartLocation: '',
  profitCenterId: '',
  conceptOptions: null,
  vatEnabled: false,
  igOrderProperties: undefined,
  orderModified: false,
  newLineItemsInOrder: false,
  noPendingItemsInOrder: false,
  undoItem: {}
};

const updateTotal = (items) => {
  return items.reduce((p, c) => {
    let itemTotal = 0;
    if (typeof p === 'number') {
      itemTotal = p + ((Number.parseFloat(c.amount ? c.amount.toString() : c.price.amount) + Number.parseFloat(c.modifierTotal || 0)) * (c.count || 1)); // eslint-disable-line max-len
    } else {
      itemTotal = (Number.parseFloat(p.amount ? p.amount.toString() : p.price.amount) +
        Number.parseFloat((p.modifierTotal || 0).toString())) *
        (p.count || 1);
    }
    return itemTotal;
  }, 0);
};

const updateModifierItem = (orderItem, contextId) => {
  let modifierTotal = 0;
  orderItem.lineItemGroups && orderItem.lineItemGroups.map(group => {
    group.lineItems.map(subOption => {
      modifierTotal += parseFloat(subOption.price.amount);
    });
  });
  if (modifierTotal > 0) {
    orderItem.price.amount = (parseFloat(orderItem.price.amount) - modifierTotal).toFixed(2);
  }
  orderItem.contextId = contextId;
  return orderItem;
};

const CommunalCartReducer = (state = initialState, action) => {
  let newItems = null;
  let subTotal = null;
  let newItem = null;

  const addItem = (action) => {
    newItem = action.item;
    newItem.cartItemId = uuidv4();
    newItem.properties.isSentToKitchen = 'false';
    newItems = [...state.items, newItem];
    subTotal = updateTotal(newItems);
    return {
      ...state,
      items: newItems,
      lastItemAdded: newItem,
      subTotal,
      total: subTotal + state.tax
    };
  };

  const removeItem = (action) => {
    newItems = state.items.filter((item) => {
      return item.uniqueId ? (item.uniqueId !== action.item.uniqueId) : (item.lineItemId !== action.item.lineItemId);
    });
    subTotal = updateTotal(newItems);
    let removedItemsTempList = [...state.removedItemsList, action.item];
    return {
      ...state,
      items: newItems,
      subTotal,
      removedItemsList: removedItemsTempList,
      total: subTotal + state.tax
    };
  };

  // let existingItem = false;
  switch (action.type) {
    case actions.MODIFY_COMMUNAL_CART_ITEM:
      switch (action.action) {
        case 'ADD':
          return addItem(action);
        case 'REMOVE':
          return removeItem(action);
        default:
          return { ...state };
      }
    case actions.SET_CART_TAX:
      return {
        ...state,
        tax: action.tax
      };
    case actions.COMMUNAL_CART_UPDATE_ON_ADD_ITEM_FAILURE:
      return removeItem(action);
    case actions.COMMUNAL_CART_UPDATE_ON_REMOVE_ITEM_FAILURE:
      return addItem(action);
    case actions.CANCEL_CART:
      return {
        ...state,
        items: [],
        subTotal: 0,
        total: 0,
        gratuity: 0,
        serviceAmount: 0,
        vatEnabled: false,
        readyTime: undefined,
        order: {},
        lastItemAdded: null
      };
    case actions.CLOSE_COMMUNAL_CART:
      return {
        ...state,
        closeFlag: action.cartClose
      };
    case actions.CLOSE_COMMUNAL_CART_NOTIFICATION:
      return {
        ...state,
        closeNotificationFlag: action.cartCloseNotification
      };
    case actions.MODIFYING_ADD_UNDO:
      return {
        ...state,
        undoItem: { uniqueId: action.uniqueId, lineItemId: action.lineItemId }
      };

    case actions.MODIFYING_CLEAR_UNDO:
      return {
        ...state,
        undoItem: {}
      };
    case actions.MODIFYING_COMMUNAL_CART:
      return {
        ...state,
        processCommunalCart: true,
        refreshCommunalCart: false
      };
    case actions.MODIFYING_COMMUNAL_CART_FAILED:
      return {
        ...state,
        refreshCommunalCart: true
      };

    case actions.MODIFYING_COMMUNAL_CART_SUCCEEDED:

      let cartListItems = [...state.items];
      let removedItemsTempList = state.removedItemsList;
      let orderItems = action.order.orderDetails.lineItems;
      let finalList = [];
      finalList = cartListItems.filter(cartItem =>
        !orderItems.some(orderItem => cartItem.properties.uniqueId === orderItem.properties.uniqueId));
      finalList = orderItems.concat(finalList);

      const filterCartItemsWithLineITemID = cartListItems.filter(cartItem => cartItem.lineItemId);
      const itemsRemovedFromOrder = filterCartItemsWithLineITemID.filter(
        cartItem => !orderItems.some(orderItem => cartItem.lineItemId === orderItem.lineItemId));
      finalList = finalList.filter(finalItem =>
        !itemsRemovedFromOrder.some(orderItem => finalItem.lineItemId === orderItem.lineItemId));
      finalList = finalList.filter(finalItem =>
        !removedItemsTempList.some(removedItem => finalItem.properties.uniqueId === removedItem.properties.uniqueId));

      finalList.map(item => {
        item = updateModifierItem(item, action.order.orderDetails.contextId);
      });

      return {
        ...state,
        items: finalList,
        subTotal: parseFloat(action.orderDetails.subTotalAmount.amount),
        tax: parseFloat(action.orderDetails.subTotalTaxAmount.amount),
        total: parseFloat(action.orderDetails.taxIncludedTotalAmount.amount),
        gratuity: parseFloat(action.orderDetails.gratuityAmount ? action.orderDetails.gratuityAmount.amount : '0'),
        vatEnabled: action.orderDetails.taxBreakdown && action.orderDetails.taxBreakdown.isVatEnabled,
        serviceAmount: parseFloat(action.orderDetails.serviceAmount ? action.orderDetails.serviceAmount.amount : '0'),
        profitCenterId: action.profitCenterId || state.profitCenterId
      };
    case actions.MODIFYING_COMMUNAL_CART_RESOLVED:
      return {
        ...state,
        processCommunalCart: false
      };
    case actions.TOGGLE_COMMUNAL_CART:
      return {
        ...state,
        cartOpen: action.flag
      };
    case actions.LAST_CART_LOCATION:
      return {
        ...state,
        lastCartLocation: action.path
      };
    case actions.SET_CART_CONCEPT_OPTIONS:
      return {
        ...state,
        conceptOptions: action.conceptOptions
      };
    case actions.PROCESS_AND_UPDATE_COMMUNAL_CART:
      return {
        ...state,
        processCommunalCart: true,
        error: undefined,
        orderModified: false
      };
    case actions.PROCESS_COMMUNAL_CART_SUCCESS:
      action.addLineItemsResponse.lineItems.map(item => {
        item.cartItemId = uuidv4();
      });
      return {
        ...state,
        processCommunalCart: false,
        order: action.addLineItemsResponse,
        items: action.addLineItemsResponse.lineItems,
        subTotal: parseFloat(action.addLineItemsResponse.subTotalAmount.amount),
        tax: parseFloat(action.addLineItemsResponse.subTotalTaxAmount.amount),
        total: parseFloat(action.addLineItemsResponse.taxIncludedTotalAmount.amount),
        gratuity: parseFloat(action.addLineItemsResponse.gratuityAmount ? action.addLineItemsResponse.gratuityAmount.amount : '0'), // eslint-disable-line max-len
        vatEnabled: action.addLineItemsResponse.taxBreakdown && action.addLineItemsResponse.taxBreakdown.isVatEnabled,
        serviceAmount: parseFloat(action.addLineItemsResponse.serviceAmount ? action.addLineItemsResponse.serviceAmount.amount : '0'), // eslint-disable-line max-len
        orderModified: true
      };
    case actions.NEW_ITEMS_ADDED_FROM_ORDER:
      return {
        ...state,
        newLineItemsInOrder: !state.newLineItemsInOrder,
        items: action.lineItems,
        processCommunalCart: false
      };
    case actions.NO_PENDING_ITEMS_FROM_ORDER:
      return {
        ...state,
        noPendingItemsInOrder: !state.noPendingItemsInOrder,
        items: action.lineItems,
        processCommunalCart: false
      };
    case actions.PROCESS_COMMUNAL_CART_FAILED:
      return {
        ...state,
        processCommunalCart: false,
        error: action.error
      };
    case actions.FETCHING_COMMUNAL_CART_BY_ORDER_GUID:
      return {
        ...state,
        fetchCommunalCart: true,
        refreshCommunalCart: false
      };
    case actions.FETCHING_COMMUNAL_CART_BY_ORDER_GUID_FAILED:
      return {
        ...state,
        fetchCommunalCart: false,
        igOrderProperties: undefined,
        refreshCommunalCart: true
      };
    case actions.FETCHING_COMMUNAL_CART_BY_ORDER_GUID_SUCCESS:
      action.orderGuidResponse.lineItems.map(item => {
        item.cartItemId = uuidv4();
      });
      return {
        ...state,
        fetchCommunalCart: false,
        order: action.orderGuidResponse,
        igOrderProperties: action.orderGuidResponse.properties,
        items: action.orderGuidResponse.lineItems,
        subTotal: parseFloat(action.orderGuidResponse.subTotalAmount.amount),
        tax: parseFloat(action.orderGuidResponse.subTotalTaxAmount.amount),
        total: parseFloat(action.orderGuidResponse.taxIncludedTotalAmount.amount),
        gratuity: parseFloat(action.orderGuidResponse.gratuityAmount ? action.orderGuidResponse.gratuityAmount.amount : '0'), // eslint-disable-line max-len
        vatEnabled: action.orderGuidResponse.taxBreakdown && action.orderGuidResponse.taxBreakdown.isVatEnabled,
        serviceAmount: parseFloat(action.orderGuidResponse.serviceAmount ? action.orderGuidResponse.serviceAmount.amount : '0') // eslint-disable-line max-len
      };
    case actions.SET_IG_ORDER_PROPERTIES:
      return {
        ...state,
        igOrderProperties: action.igOrderProperties
      };
    case actions.ORDER_GUID_CHANGED:
      return {
        ...initialState,
        fetchCommunalCart: true,
        refreshCommunalCart: false,
        items: [],
        order: {},
        igOrderProperties: undefined,
        closeFlag: state.closeFlag,
        closeNotificationFlag: state.closeNotificationFlag,
        cartOpen: state.cartOpen
      };
    case actions.RESET_COMMUNAL_CART:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default CommunalCartReducer;
