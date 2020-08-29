// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  firstName: '',
  lastInitial: ''
};

const NameCaptureReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_NAME_DETAILS:
      return {
        ...state,
        firstName: action.firstName,
        lastInitial: action.lastInitial
      };
    case actions.RESET_NAME_DETAILS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default NameCaptureReducer;
