// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';
import uuidv4 from 'uuid/v4';

const initialState = {
  items: [],
  subTotal: 0,
  total: 0,
  gratuity: 0,
  serviceAmount: 0,
  tax: 0,
  closeFlag: false,
  closeNotificationFlag: false,
  readyTime: undefined,
  error: undefined,
  order: {},
  clearedCart: {},
  mealPeriodId: null,
  changePending: 0, // open requests to order service for add/remove.
  lastItemAdded: null,
  cartOpen: false,
  undoItem: {},
  lastCartLocation: '',
  profitCenterId: '',
  conceptOptions: null,
  conceptConfig: null,
  vatEnabled: false,
  removePayments: false,
  emailReceiptSent: false,
  smsReceiptSent: false,
  deliveryConfirmationText: '',
  displayProfileId: ''
};

const updateTotal = (items) => {
  return items.reduce((p, c) => {
    let itemTotal = 0;
    if (typeof p === 'number') {
      itemTotal = p + ((Number.parseFloat(c.amount.toString()) + Number.parseFloat(c.modifierTotal)) * (c.count || 1));
    } else {
      itemTotal = (Number.parseFloat(p.amount.toString()) +
        Number.parseFloat(p.modifierTotal.toString())) *
        (p.count || 1);
    }
    return itemTotal;
  }, 0);
};

const CartReducer = (state = initialState, action) => {
  let newItems = null;
  let subTotal = null;
  let newItem = null;

  const addItem = (action) => {
    newItem = action.item;
    newItem.cartItemId = uuidv4();
    // TODO: Uncomment when order-service supports quantity
    // state.items.some(parentItem => {
    //   if (parentItem.id === newItem.id &&
    //     JSON.stringify(parentItem.selectedModifiers) === JSON.stringify(newItem.selectedModifiers)) {
    //     newItems = [...state.items].map((item) => (parentItem.uniqueId === item.uniqueId ? { ...item,
    //       count: action.item.count ? action.item.count + item.count : item.count + 1 } : item));
    //     existingItem = true;
    //     return true;
    //   }
    // });
    newItems = [...state.items, newItem];
    subTotal = updateTotal(newItems);
    return {
      ...state,
      items: newItems,
      lastItemAdded: newItem,
      subTotal,
      total: subTotal + state.tax,
      modifyOrder: true,
      displayProfileId: action.displayProfileId || state.displayProfileId
    };
  };

  const removeItem = (action) => {
    newItems = state.items.filter((item) => (item.uniqueId !== action.item.uniqueId));
    subTotal = updateTotal(newItems);
    return {
      ...state,
      items: newItems,
      subTotal,
      total: subTotal + state.tax,
      modifyOrder: true
    };
  };

  // let existingItem = false;
  switch (action.type) {
    case actions.MODIFY_CART_ITEM:
      switch (action.action) {
        case 'ADD':
          return addItem(action);
        case 'REMOVE':
          return removeItem(action);
        default:
          return { ...state };
      }
    case actions.INCREMENT_CART_ITEM:
      newItems = state.items.map((item) => (item.id === action.itemId &&
        item.uniqueId === action.uniqueId ? { ...item, count: item.count++ } : item));
      // remove zeros
      newItems = state.items.filter((item) => (item.count > 0));
      subTotal = updateTotal(newItems);
      return {
        ...state,
        items: newItems,
        subTotal,
        total: subTotal * (1 + state.tax / 10)
      };
    case actions.DECREMENT_CART_ITEM:
      // decrement
      newItems = state.items.map((item) => (item.id === action.itemId &&
        item.uniqueId === action.uniqueId ? { ...item, count: item.count-- } : item));
      // remove zeros
      newItems = state.items.filter((item) => (item.count > 0));
      subTotal = updateTotal(newItems);
      return {
        ...state,
        items: newItems,
        subTotal,
        total: subTotal * (1 + state.tax / 10)
      };
    case actions.SET_CART_TAX:
      return {
        ...state,
        tax: action.tax
      };
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
    case actions.GET_CART_READY_TIME:
      return {
        ...state,
        readyTime: undefined
      };
    case actions.GET_CART_READY_TIME_FAILED:
      return {
        ...state,
        readyTime: undefined,
        error: action.error
      };
    case actions.GET_CART_READY_TIME_SUCCEEDED:
      return {
        ...state,
        readyTime: action.readyTime,
        error: undefined
      };
    case actions.CLEAR_READY_TIME:
      return {
        ...state,
        readyTime: undefined
      };
    case actions.CLOSE_CART:
      return {
        ...state,
        closeFlag: action.cartClose
      };
    case actions.CLOSE_CART_NOTIFICATION:
      return {
        ...state,
        closeNotificationFlag: action.cartCloseNotification
      };

    case actions.CLOSE_ORDER:
      return {
        ...initialState,
        clearedCart: state,
        siteList: action.saleData.sites,
        orderConfig: action.saleData.orderConfig,
        currencyDetails: action.saleData.currencyDetails,
        readyTimeData: action.readyTime,
        paymentSaleData: action.saleData.paymentSaleData,
        stripePaymentSaleData: action.saleData.stripePaymentSaleData,
        stripeSaleChargeData: action.saleData.stripeSaleChargeData,
        saleTime: action.saleData.saleTime,
        saleData: action.saleData.closedOrder,
        profile: action.saleData.profile,
        closedOrder: {
          order: action.saleData.closedOrder,
          paymentData: action.saleData.paymentData,
          items: state.items,
          subTotal: state.subTotal,
          total: state.total,
          gratuity: state.gratuity,
          vatEnabled: state.vatEnabled,
          serviceAmount: state.serviceAmount,
          tax: state.tax
        },
        readyTime: action.readyTime,
        conceptOptions: state.conceptOptions,
        conceptConfig: state.conceptConfig
      };

    case actions.CLEAR_CLOSED_ORDER:
      return {
        ...state,
        siteList: undefined,
        orderConfig: undefined,
        currencyDetails: undefined,
        loyaltyData: undefined,
        readyTimeData: undefined,
        paymentSaleData: undefined,
        stripePaymentSaleData: undefined,
        stripeSaleChargeData: undefined,
        saleTime: undefined,
        saleData: undefined,
        profile: undefined
      };

    case actions.CART_UPDATE_ON_ADD_ITEM_FAILURE:
      return removeItem(action);

    case actions.CART_UPDATE_ON_REMOVE_ITEM_FAILURE:
      return addItem(action);

    case actions.MODIFYING_ORDER:
      return {
        ...state,
        changePending: state.changePending + 1
      };

    case actions.MODIFYING_ORDER_FAILED:
      return {
        ...state
      };

    case actions.MODIFYING_ORDER_SUCCEEDED:
      newItems = state.items;

      if (action.order.addedItem) {
        const addedIndex = newItems.findIndex(item => item.uniqueId === action.order.addedItem.uniqueId);
        if (addedIndex >= 0) {
          newItems[addedIndex] = action.order.addedItem;
        }
      }

      return {
        ...state,
        // lastItemItemAdded: null,
        items: newItems,
        order: action.order.orderDetails,
        subTotal: parseFloat(action.order.orderDetails.subTotalAmount.amount),
        tax: parseFloat(action.order.orderDetails.subTotalTaxAmount.amount),
        total: parseFloat(action.order.orderDetails.taxIncludedTotalAmount.amount),
        gratuity: parseFloat(action.order.orderDetails.gratuityAmount.amount),
        vatEnabled: action.order.orderDetails.taxBreakdown && action.order.orderDetails.taxBreakdown.isVatEnabled,
        serviceAmount: parseFloat(action.order.orderDetails.serviceAmount.amount),
        mealPeriodId: action.order.mealPeriodId,
        profitCenterId: action.profitCenterId || state.profitCenterId
      };
    case actions.MODIFYING_ORDER_RESOLVED:
      return {
        ...state,
        changePending: state.changePending - 1
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
    case actions.TOGGLE_CART:
      return {
        ...state,
        cartOpen: action.flag
      };
    case actions.EMAIL_RECEIPT_SUCCESS:
      return {
        ...state,
        emailReceiptSent: action.flag
      };
    case actions.SMS_RECEIPT_SUCCESS:
      return {
        ...state,
        smsReceiptSent: action.flag
      };
    case actions.SET_CART_DELIVERY_CONFIRM_TEXT:
      return {
        ...state,
        deliveryConfirmationText: action.text
      };
    case actions.LAST_CART_LOCATION:
      return {
        ...state,
        lastCartLocation: action.path
      };
    case actions.DELIVERY_CREATE_ORDER:
      return {
        ...state,
        order: action.order,
        items: action.addedItems,
        mealPeriodId: action.mealPeriodId
      };
    case actions.SET_MODIFY_ORDER_FLAG:
      return {
        ...state,
        modifyOrder: action.flag
      };
    case actions.SET_CART_CONCEPT_OPTIONS:
      return {
        ...state,
        conceptOptions: action.conceptOptions,
        conceptConfig: action.conceptConfig
      };
    case actions.RESET_CART:
      return {
        ...initialState
      };
    case actions.UPDATE_CART_ON_PAYMENTS:
      return {
        ...state,
        order: action.order,
        subTotal: parseFloat(action.order.subTotalAmount.amount),
        tax: parseFloat(action.order.subTotalTaxAmount.amount),
        total: parseFloat(action.order.taxIncludedTotalAmount.amount),
        gratuity: parseFloat(action.order.gratuityAmount.amount),
        vatEnabled: action.order.taxBreakdown && action.order.taxBreakdown.isVatEnabled,
        serviceAmount: parseFloat(action.order.serviceAmount.amount)
      };
    case actions.PROCESS_REMOVE_PAYMENTS:
      return {
        ...state,
        changePending: state.changePending + 1,
        removePayments: true
      };
    case actions.RESOLVE_REMOVE_PAYMENTS:
      return {
        ...state,
        changePending: state.changePending - 1,
        removePayments: false
      };
    default:
      return state;
  }
};

export default CartReducer;
