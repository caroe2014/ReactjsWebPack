// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  menuId: undefined,
  fetching: false,
  raw: null,
  current: {},
  error: null
};

const MenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_MENU:
      return {
        ...state,
        menuId: action.menuId
      };
    case actions.GET_ITEMS:
      return { ...state };
    case actions.FETCHING_ITEMS:
      return {
        ...state,
        fetching: true
      };
    case actions.FETCHING_MENU:
      return {
        ...state,
        raw: null,
        current: {},
        fetching: true
      };
    case actions.GET_ITEMS_SUCCEEDED:
      return {
        ...state,
        fetching: false,
        raw: action.menu,
        current: action.menu,
        error: null
      };
    case actions.GET_MENU_SUCCEEDED:
      return {
        ...state,
        fetching: false,
        raw: action.menu[0],
        current: action.menu[0],
        error: null
      };
    case actions.GET_ITEMS_FAILED:
      return {
        ...state,
        fetching: false,
        raw: null,
        current: {},
        error: action.error
      };
    case actions.GET_MENU_FAILED:
      return {
        ...state,
        fetching: false,
        raw: null,
        current: {},
        error: action.error
      };
    default:
      return state;
  }
};

export default MenuReducer;
