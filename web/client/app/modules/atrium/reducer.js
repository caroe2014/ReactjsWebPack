// Copyright © 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  fetchingInquiry: false,
  inquiryError: null,
  accountInfo: [],
  proccessAtriumAccount: undefined,
  paymentTenderInfo: undefined
};

const AtriumReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ATRIUM_INQUIRY:
      return {
        ...state,
        accountInfo: [],
        fetchingInquiry: true,
        inquiryError: null
      };
    case actions.ATRIUM_INQUIRY_SUCCESS:
      return {
        ...state,
        fetchingInquiry: false,
        accountInfo: action.atriumAccountInfo
      };
    case actions.ATRIUM_INQUIRY_FAILURE:
      return {
        ...state,
        fetchingInquiry: false,
        inquiryError: true
      };
    case actions.ATRIUM_PAYMENT_PROCESSING:
      return {
        ...state,
        proccessAtriumAccount: action.accountInfo
      };
    case actions.UPDATE_ATRIUM_AUTH_INFO:
      return {
        ...state,
        accountInfo: state.accountInfo.map(account => {
          if (account.tenderId === action.accountInfo.tenderId) {
            account.authResponse = action.accountInfo.authResponse;
            account.amountToBeCharged = action.accountInfo.amountToBeCharged;
            account.isAllTaxExempt = action.accountInfo.isAllTaxExempt;
            account.taxExemptVerficationCode = action.accountInfo.taxExemptVerficationCode;
            account.taxableVerficationCode = action.accountInfo.taxableVerficationCode;
          }
          return account;
        })
      };
    case actions.ATRIUM_REMOVE_PAYMENT_SUCCESS:
      return {
        ...state,
        accountInfo: state.accountInfo.map(account => {
          if (!action.atriumAccount || (action.atriumAccount && account.tenderId === action.atriumAccount.tenderId)) {
            delete account.authResponse;
            delete account.amountToBeCharged;
            delete account.isAllTaxExempt;
          }
          return account;
        })
      };
    case actions.RESET_ATRIUM:
      return {
        fetchingInquiry: false,
        inquiryError: null,
        accountInfo: [],
        proccessAtriumAccount: undefined,
        paymentTenderInfo: undefined
      };
    case actions.SET_PAYMENT_TENDER_INFO:
      return {
        ...state,
        paymentTenderInfo: action.paymentTenderInfo
      };
    default:
      return state;
  }
};

export default AtriumReducer;
