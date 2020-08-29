// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export const SET_APP_ERROR = 'SET_APP_ERROR';
export const CLEAR_APP_ERROR = 'CLEAR_APP_ERROR';
export const SET_IDLE_FLAG = 'SET_IDLE_FLAG';
export const SET_TIMEOUT_FLAG = 'SET_TIMEOUT_FLAG';
export const CLEAR_IDLE_FLAGS = 'CLEAR_IDLE_FLAGS';

export const clearAppError = () => ({
  type: CLEAR_APP_ERROR
});

export const getAppError = (error) => ({
  type: SET_APP_ERROR,
  error
});

export const setIdleFlag = (flag) => ({
  type: SET_IDLE_FLAG,
  flag
});

export const setTimeoutFlag = (flag) => ({
  type: SET_TIMEOUT_FLAG,
  flag
});

export const clearIdleFlags = () => ({
  type: CLEAR_IDLE_FLAGS
});
