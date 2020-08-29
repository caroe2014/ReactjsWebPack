// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  mobileNumber: '',
  selectedCountry: undefined
};

const SmsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_MOBILE_NUMBER:
      return {
        ...state,
        mobileNumber: action.mobileNumber,
        selectedCountry: action.selectedCountry
      };
    case actions.RESET_SMS_DETAILS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default SmsReducer;
