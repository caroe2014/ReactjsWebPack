// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  deliveryDetails: {},
  kitchenString: '',
  deliveryOption: {}
};

const DeliveryReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_DELIVERY_DETAILS:
      return {
        ...state,
        deliveryDetails: action.deliveryDetails,
        kitchenString: action.kitchenString
      };
    case actions.SET_DELIVERY_OPTION:
      return {
        ...state,
        deliveryOption: action.deliveryOption
      };
    case actions.RESET_DELIVERY_DETAILS:
      return {
        ...initialState,
        deliveryOption: state.deliveryOption
      };
    default:
      return state;
  }
};

export default DeliveryReducer;
