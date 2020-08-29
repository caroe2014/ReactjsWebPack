// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  lastUpdated: null,
  fetching: false,
  paymentOptions: [],
  payTenantId: null,
  payUserKey: null,
  error: null,
  remaining: null,
  multiPaymentFetching: false,
  multiPaymentProcess: false,
  remainingTipAmount: 0,
  showTaxableTenders: null
};

const PaymentOptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_MULI_PAY_FETCHING:
      return {
        ...state,
        multiPaymentFetching: action.flag
      };
    case actions.RESET_REMAINING:
      return {
        ...state,
        fetching: false,
        remaining: null,
        remainingTipAmount: 0
      };

    case actions.SET_PROCESS_MULTIPAYMENTS_ORDER:
      return {
        ...state,
        multiPaymentFetching: true
      };

    case actions.PROCESS_MULTIPAYMENTS:
      return {
        ...state,
        multiPaymentFetching: true
      };

    case actions.PROCESS_MULTIPAYMENTS_SUCCESS:
      return {
        ...state,
        multiPaymentFetching: false,
        showTaxableTenders: null
      };

    case actions.PROCESS_MULTIPAYMENTS_FAILED:
      return {
        ...state,
        multiPaymentFetching: false,
        showTaxableTenders: null
      };

    case actions.SET_PAYMENT_AMOUNTS:
      return {
        ...state,
        remaining: state.remaining
          ? parseFloat(parseFloat(state.remaining) - parseFloat(action.amountPaid) +
            parseFloat(action.oldAmount)).toFixed(2)
          : parseFloat(parseFloat(action.total) - parseFloat(action.amountPaid)).toFixed(2)
      };

    case actions.SHOW_TAXABLE_TENDERS_ONLY:
      return {
        ...state,
        showTaxableTenders: action.showTaxableTendersOnly
      };

    case actions.REMOVE_PAYMENT_AMOUNTS:
      const remainder = state.remaining
        ? parseFloat(parseFloat(state.remaining) + parseFloat(action.amountRemoved)).toFixed(2) : null;
      return {
        ...state,
        remaining: remainder &&
          parseFloat(remainder).toFixed(2) === parseFloat(action.total).toFixed(2) ? null : remainder
      };

    case actions.SET_REMAINING_TIP_AMOUNT:
      return {
        ...state,
        remainingTipAmount: action.remainingTipAmount
      };
    case actions.REMOVE_ALL_SPLIT_PAYMENT:
      return {
        ...state,
        removingAllPayments: true
      };
    case actions.REMOVE_ALL_SPLIT_PAYMENT_SUCCESS:
      return {
        ...state,
        removingAllPayments: false
      };
    case actions.REMOVE_ALL_SPLIT_PAYMENT_FAILED:
      return {
        ...state,
        removingAllPayments: false
      };
    default:
      return state;
  }
};

export default PaymentOptionsReducer;
