// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  lastUpdated: null,
  fetchingAccountInfo: false,
  fetchingAuthResponse: false,
  gaAccountInfo: null,
  gaAccountsList: [],
  gaAccountsInfoList: [],
  gaAccountInquiryInfo: null,
  employeeId: null,
  secondaryVerificationType: null,
  secondaryVerificationValue: null,
  indexOfSelectedGAPaymentType: null,
  getGAAccountError: '',
  getGAAccountInquiryError: '',
  authorizeGAPaymentError: '',
  closedOrderData: {},
  accountPopupFlag: false,
  selectedGaOption: null,
  fetchingGAAccountInfo: false,
  gaACCountInquiryFetchError: false,
  removeGaPaymentError: '',
  accountInfoSuccess: false
};

const genericErrorMessage = 'GENERIC_PAYMENT_FAILURE';

const GAPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_GA_ACCOUNT_INFO:
      return {
        ...state,
        fetchingAccountInfo: true,
        accountInfoSuccess: false,
        accountNumber: action.accountNumber,
        secondaryVerificationType: action.secondaryVerificationType,
        secondaryVerificationValue: action.secondaryVerificationValue,
        getGAAccountError: ''
      };
    case actions.GET_GA_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        fetchingAccountInfo: false,
        accountInfoSuccess: true,
        gaAccountInfo: action.gaAccountInfo,
        gaAccountsInfoList: state.gaAccountsInfoList.concat(action.gaAccountInfo.accountAssociatedGaTenders),
        gaAccountsList: state.gaAccountsList.concat(action.gaAccountInfo.accountNumber),
        accountPopupFlag: !state.accountPopupFlag,
        getGAAccountError: ''
      };

    case actions.GET_GA_ACCOUNT_INFO_FAILED:
      let errorMessage;

      if (action.error.response) {
        const errorCode = action.error.response.data.statusCode;
        if (errorCode === 404) {
          errorMessage = 'GA_NO_ACCOUNTS';
        } else {
          errorMessage = 'GA_GENERAL_ERROR';
        }
      } else {
        errorMessage = action.error.message;
      }

      return {
        ...state,
        fetchingAccountInfo: false,
        accountInfoSuccess: false,
        getGAAccountError: errorMessage
      };

    case actions.GET_GA_ACCOUNT_INQUIRY_INFO:
      return {
        ...state,
        getGAAccountInquiryError: '',
        authorizeGAPaymentError: '',
        fetchingGAAccountInfo: true,
        accountInfoSuccess: false,
        indexOfSelectedGAPaymentType: action.indexOfSelectedGAPaymentType
      };

    case actions.SELECTED_ACCOUNT:
      return {
        ...state,
        selectedGaOption: action.account,
        fetchingGAAccountInfo: true,
        accountInfoSuccess: false
      };

    case actions.FETCH_GA_ACCOUNT_SUCCESS:
      return {
        ...state,
        fetchingGAAccountInfo: false,
        accountInfoSuccess: false,
        gaAccountsInfoList: action.gaAccountsInfoList,
        selectedGaOption: {...state.selectedGaOption, ...action.accountInfo}
      };

    case actions.FETCH_GA_ACCOUNT_FAILED:
      return {
        ...state,
        fetchingGAAccountInfo: false,
        accountInfoSuccess: false,
        gaACCountInquiryFetchError: true
      };

    case actions.RESET_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedGaOption: '',
        fetchingGAAccountInfo: false,
        gaACCountInquiryFetchError: false
      };

    case actions.GET_GA_ACCOUNT_INQUIRY_INFO_SUCCESS:
      const { gaAccountInquiryInfo } = action;
      let { gaAccountInfo, indexOfSelectedGAPaymentType } = state;
      let { accountAssociatedGaTenders } = gaAccountInfo;

      accountAssociatedGaTenders[indexOfSelectedGAPaymentType] = {
        ...accountAssociatedGaTenders[indexOfSelectedGAPaymentType],
        ...gaAccountInquiryInfo
      };
      gaAccountInfo = {
        ...gaAccountInfo,
        accountAssociatedGaTenders
      };

      return {
        ...state,
        fetching: false,
        fetchingGAAccountInfo: false,
        accountInfoSuccess: false,
        gaAccountInfo
      };

    case actions.GET_GA_ACCOUNT_INQUIRY_INFO_FAILED:
      return {
        ...state,
        fetching: false,
        fetchingGAAccountInfo: false,
        accountInfoSuccess: false,
        getGAAccountInquiryError: genericErrorMessage
      };

    case actions.AUTHORIZE_GA_PAYMENT:
      return {
        ...state,
        authorizeGAPaymentError: '',
        fetchingAuthResponse: true
      };

    case actions.AUTHORIZE_GA_PAYMENT_SUCCESS:
      return {
        ...state,
        lastUpdate: Date.now(),
        saleData: action.saleData,
        saleTime: new Date(),
        fetchingAuthResponse: false,
        error: null
      };

    case actions.AUTHORIZE_GA_PAYMENT_FAILED:
      return {
        ...state,
        authorizeGAPaymentError: genericErrorMessage,
        fetchingAuthResponse: false
      };

    case actions.CLEAR_GA_STATE:
      return initialState;

    case actions.CLEAR_GA_ERRORS:
      return {
        ...state,
        getGAAccountError: '',
        getGAAccountInquiryError: '',
        authorizeGAPaymentError: '',
        removeGaPaymentError: ''
      };

    case actions.AUTHORIZE_GA_SPLIT_PAYMENT:
      return {
        ...state,
        fetchingAuthResponse: true,
        authorizeGAPaymentError: '',
        authResponse: ''
      };

    case actions.AUTHORIZE_GA_SPLIT_PAYMENT_SUCCESS:
      let gaAccountsInfoList = state.gaAccountsInfoList;
      let selectedAccount = action.account;

      let gaAccountPosition = gaAccountsInfoList.findIndex(
        account => account.accountNumber === selectedAccount.accountNumber &&
          account.gaTenderName === selectedAccount.displayLabel);

      gaAccountsInfoList[gaAccountPosition].amountToBeCharged = action.amount;
      gaAccountsInfoList[gaAccountPosition].paymentResponse = action.paymentResponse;

      return {
        ...state,
        gaAccountsInfoList: gaAccountsInfoList,
        authResponse: action.paymentResponse,
        fetchingAuthResponse: false
      };

    case actions.AUTHORIZE_GA_SPLIT_PAYMENT_FAILED:

      return {
        ...state,
        authorizeGAPaymentError: action.error || genericErrorMessage,
        fetchingAuthResponse: false
      };

    case actions.REMOVE_GA_SPLIT_PAYMENT:
      return {
        ...state,
        removingGaAuth: true,
        removeGaPaymentError: '',
        removeGAPaymentResponse: ''
      };

    case actions.REMOVE_GA_SPLIT_PAYMENT_SUCCESS:
      gaAccountsInfoList = state.gaAccountsInfoList;
      selectedAccount = action.account;

      gaAccountPosition = gaAccountsInfoList.findIndex(
        account => account.accountNumber === selectedAccount.accountNumber &&
            account.gaTenderName === selectedAccount.displayLabel);

      delete gaAccountsInfoList[gaAccountPosition].amountToBeCharged;
      delete gaAccountsInfoList[gaAccountPosition].paymentResponse;

      return {
        ...state,
        gaAccountsInfoList: gaAccountsInfoList,
        removingGaAuth: false,
        removeGAPaymentResponse: action.isAmountModified ? '' : action.response
      };

    case actions.REMOVE_GA_SPLIT_PAYMENT_FAILED:

      return {
        ...state,
        removeGaPaymentError: action.error || genericErrorMessage,
        removingGaAuth: false,
        fetchingAuthResponse: false
      };

    case actions.REMOVE_AMOUNT_AGAINST_GA:
      let gaAccountsInfosList = state.gaAccountsInfoList;
      let selectedGAAccount = action.account;

      let accountPosition = gaAccountsInfosList.findIndex(
        account => account.accountNumber === selectedGAAccount.accountNumber &&
        account.gaTenderName === selectedGAAccount.displayLabel);

      gaAccountsInfosList[accountPosition].amountToBeCharged = null;

      return {
        ...state,
        gaAccountsInfoList: gaAccountsInfosList
      };

    case actions.REMOVE_AMOUNT_AGAINST_GA_PAYMENT:
      gaAccountsInfosList = state.gaAccountsInfoList;
      selectedGAAccount = action.accountNumber;

      accountPosition = gaAccountsInfosList.findIndex(
        account => account.accountNumber === selectedGAAccount &&
          account.paymentTypeVerificationCode === action.verificationCode);

      gaAccountsInfosList[accountPosition].amountToBeCharged = null;

      return {
        ...state,
        gaAccountsInfoList: gaAccountsInfosList
      };

    case actions.SET_GA_TENDER_INDEX:
      return {
        ...state,
        indexOfSelectedGAPaymentType: action.index,
        getGAAccountInquiryError: ''
      };
    case actions.TOGGLE_FETCH_AUTH_RESPONSE:
      return {
        ...state,
        fetchingAuthResponse: action.flag
      };

    default:
      return state;
  }
};

export default GAPaymentReducer;
