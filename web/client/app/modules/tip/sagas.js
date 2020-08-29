// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export const SET_TIP_DATA = 'SET_TIP_DATA';
export const SET_TIP_MODIFY_ORDER_FLAG = 'SET_MODIFY_ORDER_FLAG';
export const RESET_TIP_DATA = 'RESET_TIP_DATA';

export const setTipData = (data) => ({
  type: SET_TIP_DATA,
  tipData: data.selectedTip,
  tipAmount: data.selectedTipAmount
});

export const setTipModifyOrderFlag = (flag = false) => ({
  type: SET_TIP_MODIFY_ORDER_FLAG,
  flag
});

export const resetTipData = (modifyTip = false) => ({
  type: RESET_TIP_DATA,
  modifyTip
});
