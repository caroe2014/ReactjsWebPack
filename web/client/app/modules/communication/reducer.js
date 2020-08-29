// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  lastUpdated: null,
  fetching: false,
  sendToData: null,
  smsSelectedCountry: null,
  receiptImage: null,
  sendEmailReceipt: null,
  sendEmailFlag: false,
  sendSMSReceipt: null,
  sendSMSFlag: false,
  printReceipt: null,
  sendEmailReceiptError: false,
  sendSMSReceiptError: false,
  emailReceiptError: false,
  smsReceiptError: false,
  error: null,
  deliveryConfirmationText: '',
  sendReceiptError: false,
  receiptError: false,
  customerAddress: [],
  receiptInfo: null
};

const CommunicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SEND_RECEIPT_EMAIL:
      return {
        ...state,
        sendToData: action.sendToData
      };
    case actions.GET_PRINT_DATA:
      return {
        ...state,
        printReceipt: null,
        fetching: false
      };
    case actions.SEND_CUSTOMER_EMAIL:
      return {
        ...state,
        customerAddress: action.customerAddress
      };
    case actions.SET_PRINT_DATA:
      return {
        ...state,
        printReceipt: action.printData,
        fetching: false
      };
    case actions.SEND_RECEIPT_SMS:
      return {
        ...state,
        sendToData: action.sendToData,
        smsSelectedCountry: action.smsSelectedCountry
      };
    case actions.FETCHING_RECEIPT:
      return {
        ...state,
        fetching: true
      };
    case actions.GET_RECEIPT_SUCCESSFUL:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        receiptImage: action.receiptImage,
        error: null
      };
    case actions.GET_RECEIPT_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        emailReceiptError: !state.emailReceiptError
      };
    case actions.GET_SMS_RECEIPT_SUCCESSFUL:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        receiptImage: action.receiptImage,
        error: null
      };
    case actions.GET_SMS_RECEIPT_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error,
        smsReceiptError: !state.smsReceiptError
      };
    case actions.SEND_EMAIL_RECEIPT_SUCCESSFUL:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        sendEmailReceipt: action.sendReceipt,
        sendEmailFlag: !state.sendEmailFlag,
        error: null
      };
    case actions.SEND_SMS_RECEIPT_SUCCESSFUL:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        sendSMSReceipt: action.sendReceipt,
        sendSMSFlag: !state.sendSMSFlag,
        error: null
      };
    case actions.SEND_EMAIL_RECEIPT_FAILED:
      return {
        ...state,
        fetching: false,
        sendEmailReceiptError: !state.sendEmailReceiptError,
        error: action.error
      };
    case actions.SEND_SMS_RECEIPT_FAILED:
      return {
        ...state,
        fetching: false,
        sendSMSReceiptError: !state.sendSMSReceiptError,
        error: action.error
      };
    case actions.SET_DELIVERY_CONFIRMATION_TEXT:
      return {
        ...state,
        deliveryConfirmationText: action.deliveryConfirmationText
      };
    default:
      return state;
  }
};

export default CommunicationReducer;
