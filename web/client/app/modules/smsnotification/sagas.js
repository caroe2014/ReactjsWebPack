// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export const SET_SMS_DETAILS = 'SET_SMS_DETAILS';
export const SET_MOBILE_NUMBER = 'SET_MOBILE_NUMBER';
export const RESET_SMS_DETAILS = 'RESET_SMS_DETAILS';

export const setMobileNumber = (mobileNumber, selectedCountry) => ({
  type: SET_MOBILE_NUMBER,
  mobileNumber,
  selectedCountry
});

export const resetSmsDetails = () => ({
  type: RESET_SMS_DETAILS
});
