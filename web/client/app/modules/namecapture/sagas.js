// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export const SET_NAME_DETAILS = 'SET_NAME_DETAILS';
export const RESET_NAME_DETAILS = 'RESET_NAME_DETAILS';

export const setNameDetails = (firstName, lastInitial) => ({
  type: SET_NAME_DETAILS,
  firstName,
  lastInitial
});

export const resetNameDetails = () => ({
  type: RESET_NAME_DETAILS
});
