// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  errorMessage: null,
  title: null,
  showError: false,
  errorMessageKey: null,
  idleFlag: false,
  timeoutFlag: false,
  dynamicKey: null,
  goBackFlag: false
};

const ErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_APP_ERROR:
      return {
        ...state,
        showError: true,
        title: action.title,
        redirect: action.redirect,
        errorMessage: action.error,
        errorMessageKey: action.key,
        dynamicKey: action.dynamicKey,
        goBackFlag: action.goBackFlag,
        sessionExpired: action.sessionExpired
      };
    case actions.CLEAR_APP_ERROR:
      return {
        ...state,
        showError: false,
        errorMessage: null,
        errorMessageKey: null,
        dynamicKey: null,
        goBackFlag: false,
        sessionExpired: false
      };
    case actions.SET_IDLE_FLAG:
      return {
        ...state,
        idleFlag: action.flag
      };
    case actions.SET_TIMEOUT_FLAG:
      return {
        ...state,
        timeoutFlag: action.flag
      };
    case actions.CLEAR_IDLE_FLAGS:
      return {
        ...state,
        idleFlag: false,
        timeoutFlag: false
      };
    default:
      return state;
  }
};

export default ErrorReducer;
