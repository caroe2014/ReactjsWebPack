// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  fetching: false,
  isScheduleOrderEnabled: false,
  config: {},
  hideScheduleTime: false,
  scheduleOrderData: {},
  scheduledStoreConfig: {},
  scheduledStoreConfigList: [],
  error: null,
  capacityData: null,
  showCapacityWindow: false,
  isCapacitySuggested: false,
  paymentType: null,
  capacityFail: false
};

const ScheduleOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SCEHDULE_ORDER_CONFIG:
      return {
        ...state,
        config: action.config
      };
    case actions.SCHEDULE_ORDER_DATA:
      return {
        ...state,
        hideScheduleTime: true,
        scheduleOrderData: action.scheduleOrderData
      };
    case actions.RESET_SCHEDULE_ORDER_DATA:
      return {
        ...state,
        hideScheduleTime: false,
        scheduleOrderData: {},
        capacityData: null,
        showCapacityWindow: false,
        isCapacitySuggested: false,
        paymentType: null
      };
    case actions.SET_HIDE_SCHEDULE_TIME:
      return {
        ...state,
        hideScheduleTime: action.value
      };
    case actions.SCHEDULE_STORE_CONFIG:
      return {
        ...state,
        scheduledStoreConfig: action.scheduledStoreConfig,
        scheduledStoreConfigList: action.scheduledStoreConfigList,
        isScheduleOrderEnabled: action.enabled,
        isAsapOrderDisabled: action.asapOrderDisabled
      };
    case actions.RESET_SCHEDULE_ORDER:
      return {
        ...initialState
      };
    case actions.FETCHING_CAPACITY_CHECK:
      return {
        ...state,
        capacityData: null,
        fetching: true,
        showCapacityWindow: false,
        isCapacitySuggested: false,
        paymentType: action.paymentType,
        multiPaymentData: undefined
      };
    case actions.CAPACITY_CHECK_SUCCESS:
      return {
        ...state,
        fetching: false,
        capacityData: action.capacityData,
        paymentType: action.paymentType,
        showCapacityWindow: action.capacityData.isToSuggest,
        multiPaymentData: action.multiPaymentData
      };
    case actions.CAPACITY_CHECK_FAILED:
      return {
        ...state,
        fetching: false,
        capacityFail: !state.capacityFail
      };
    case actions.SET_MULTI_PAYMENT_DATA:
      return {
        ...state,
        multiPaymentData: action.multiPaymentData
      };
    case actions.SHOW_CAPACITY_WINDOW:
      return {
        ...state,
        showCapacityWindow: action.flag
      };
    case actions.ACCEPT_CAPACITY_TIME:
      return {
        ...state,
        scheduledOrderCompletionTime: action.scheduledOrderCompletionTime,
        isCapacitySuggested: true,
        showCapacityWindow: false
      };
    default:
      return state;
  }
};

export default ScheduleOrderReducer;
