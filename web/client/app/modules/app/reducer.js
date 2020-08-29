// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  fetching: false,
  config: {},
  error: null,
  multiPassEnabled: false,
  digitalMenuId: '',
  isOrderGuidInvalid: false
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_APP_CONFIG:
      return {
        ...state
      };
    case actions.FETCHING_APP_CONFIG:
      return {
        ...state,
        fetching: true
      };
    case actions.GET_APP_CONFIG_SUCCEEDED:
      // action.appConfig.loginMethods.push({
      //   "type": "atrium",
      //   "name": "Suny Brockport login",
      //   "entryPoint": "https://dev-i848fy0t.auth0.com/samlp/1b5kpR0QY6UoPjrOHuX934bP73T9bDev"
      // });
      return {
        ...state,
        fetching: false,
        config: action.appConfig,
        error: null
      };
    case actions.GET_APP_CONFIG_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    case actions.SET_MULTI_PASS_FLAG:
      return {
        ...state,
        multiPassEnabled: action.isEnabled
      };
    case actions.SET_DIGITAL_MENU_ID:
      return {
        ...state,
        fetching: false,
        digitalMenuId: action.digitalMenuId,
        displayProfileId: action.displayProfileId
      };
    case actions.SET_ORDER_GUID_STATUS:
      return {
        ...state,
        isOrderGuidInvalid: action.isInvalid
      };
    default:
      return state;
  }
};

export default AppReducer;
