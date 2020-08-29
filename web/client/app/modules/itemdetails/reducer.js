// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  itemId: null,
  selectItem: null,
  fetching: false,
  error: null
};

const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ITEM:
      return {
        ...state,
        selectItem: null,
        itemId: action.itemId
      };
    case actions.FETCHING_ITEM:
      return {
        ...state,
        fetching: true
      };
    case actions.GET_ITEM_SUCCEEDED:
      return {
        ...state,
        fetching: false,
        selectItem: action.selectItem
      };
    case actions.GET_ITEM_FAILED:
      return {
        ...state,
        selectItem: null,
        fetching: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default itemReducer;
