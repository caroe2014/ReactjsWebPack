// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  lastUpdated: null,
  fetching: false,
  apiToken: null,
  tokenizedData: null,
  saleData: null,
  paymentSaleData: null,
  checkoutSaleData: null,
  error: null,
  tokenError: false,
  autoTokenError: false,
  saleErrorFlag: false,
  checkoutSaleErrorFlag: false,
  saleFetching: false,
  ccCardInfo: null
};

const PaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_API_TOKEN:
      return {
        ...state,
        fetching: true
      };
    case actions.SET_TOKENIZED_DATA:
      return {
        ...state,
        tokenizedData: action.tokenizedData
      };
    case actions.SET_CC_CARD_OPTION:
      return {
        ...state,
        ccCardInfo: action.cardInfo
      };
    case actions.REMOVE_CC_CARD_OPTION:
      return {
        ...state,
        ccCardInfo: null,
        tokenizedData: null
      };
    case actions.SET_CHECKOUT_DATA:
      return {
        ...state,
        fetching: true
      };
    case actions.GET_TOKEN_SUCCEEDED:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        apiToken: action.apiToken,
        error: null
      };
    case actions.GET_TOKEN_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        tokenError: !state.tokenError
      };
    case actions.GET_AUTO_TOKEN_SUCCEEDED:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        apiToken: action.apiToken,
        error: null
      };
    case actions.GET_AUTO_TOKEN_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        autoTokenError: !state.autoTokenError
      };

    case actions.SALE_TRANSACTION_INITIATE:
      return {
        ...state,
        saleFetching: true,
        error: null
      };

    case actions.SALE_TRANSACTION_SUCCEEDED:
      return {
        ...state,
        lastUpdated: Date.now(),
        saleData: action.saleData,
        saleTime: new Date(),
        paymentSaleData: action.paymentSaleData,
        fetching: false,
        error: null,
        saleFetching: false
      };
    case actions.SALE_TRANSACTION_FAILED:
      return {
        ...state,
        fetching: false,
        saleFetching: false,
        saleError: action.saleError,
        saleErrorFlag: !state.saleErrorFlag,
        error: action.error
      };
    case actions.TRANSACTION_FAILED:
      return {
        ...state,
        fetching: false,
        saleFetching: false
      };
    case actions.SALE_CHECKOUT_SUCCEEDED:
      return {
        ...state,
        lastUpdated: Date.now(),
        saleTime: new Date(),
        saleData: action.saleData,
        fetching: false,
        error: null
      };
    case actions.STRIPE_CHECKOUT_SUCCEEDED:
      return {
        ...state,
        saleTime: new Date(),
        lastUpdated: Date.now(),
        saleData: action.saleData,
        fetching: false,
        error: null
      };
    case actions.FETCH_ETF_DATA:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        error: null
      };
    case actions.SALE_CHECKOUT_FAILED:
      return {
        ...state,
        fetching: false,
        checkoutSaleError: action.saleError,
        checkoutSaleErrorFlag: !state.checkoutSaleErrorFlag,
        error: action.error
      };
    case actions.RESET_SALE_DATA:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default PaymentReducer;
