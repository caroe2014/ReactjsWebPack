// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  tipData: 0,
  tipAmount: 0,
  tipFlag: false,
  fetching: false
};

const TipReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_TIP_DATA:
      return {
        ...state,
        tipData: action.tipData,
        tipAmount: action.tipAmount,
        tipFlag: !state.tipFlag,
        fetching: false,
        modifyOrder: action.tipAmount && parseFloat(state.tipAmount) !== parseFloat(action.tipAmount)
      };
    case actions.RESET_TIP_DATA:
      return {
        ...state,
        tipData: 0,
        tipAmount: 0,
        fetching: false,
        modifyOrder: action.modifyTip
      };
    case actions.SET_MODIFY_ORDER_FLAG:
      return {
        ...state,
        modifyOrder: action.flag
      };
    default:
      return state;
  }
};

export default TipReducer;
