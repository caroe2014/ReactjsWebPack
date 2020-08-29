// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  lastUpdated: null,
  fetching: false,
  error: null,
  token: null,
  stripeChargeData: null,
  chargeData: null,
  saleData: null,
  chargeError: null
};

const StripePayReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.MAKE_CHARGE:
      return {
        ...state,
        fetching: true,
        stripeChargeData: action.stripeChargeData
      };
    case actions.MAKE_CHARGE_SUCCEEDED:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        chargeData: action.saleData,
        saleData: action.saleData,
        error: null
      };
    case actions.MAKE_CHARGE_FAILED:
      return {
        ...state,
        fetching: false,
        chargeError: action.chargeError,
        error: action.error
      };
    case actions.RESET_STRIPE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default StripePayReducer;
