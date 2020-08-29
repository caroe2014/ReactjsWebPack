// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import get from 'lodash.get';
import { getVatEntriesFromOrderedItems } from 'web/client/app/utils/VatUtils';
import { emailReceiptSucceeded, smsReceiptSucceeded,
  setDeliveryConfirmationTextInCart } from 'web/client/app/modules/cart/sagas';
import { getCurrentStore } from 'web/client/app/utils/StateSelector';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';
import { getDeliveryProperties } from 'web/client/app/modules/deliverylocation/sagas';

export const SEND_RECEIPT_EMAIL = 'SEND_RECEIPT_EMAIL';
export const GET_PRINT_DATA = 'GET_PRINT_DATA';
export const SET_PRINT_DATA = 'SET_PRINT_DATA';
export const SEND_RECEIPT_SMS = 'SEND_RECEIPT_SMS';
export const FETCHING_RECEIPT = 'FETCHING_RECEIPT';
export const GET_RECEIPT_SUCCESSFUL = 'GET_RECEIPT_SUCCESSFUL';
export const GET_RECEIPT_FAILED = 'GET_RECEIPT_FAILED';
export const GET_SMS_RECEIPT_SUCCESSFUL = 'GET_SMS_RECEIPT_SUCCESSFUL';
export const GET_SMS_RECEIPT_FAILED = 'GET_SMS_RECEIPT_FAILED';
export const SET_DELIVERY_CONFIRMATION_TEXT = 'SET_DELIVERY_CONFIRMATION_TEXT';

export const SENDING_RECEIPT = 'SENDING_RECEIPT';
export const SEND_RECEIPT_SUCCESSFUL = 'SEND_RECEIPT_SUCCESSFUL';
export const SEND_EMAIL_RECEIPT_SUCCESSFUL = 'SEND_EMAIL_RECEIPT_SUCCESSFUL';
export const SEND_SMS_RECEIPT_SUCCESSFUL = 'SEND_SMS_RECEIPT_SUCCESSFUL';
export const SEND_EMAIL_RECEIPT_FAILED = 'SEND_EMAIL_RECEIPT_FAILED';
export const SEND_SMS_RECEIPT_FAILED = 'SEND_SMS_RECEIPT_FAILED';

export const SET_APP_ERROR = 'SET_APP_ERROR';
export const RESET_COMMUNICATION = 'RESET_COMMUNICATION';

export const BUILD_RECEIPT_INFO = 'BUILD_RECEIPT_INFO';

export const SEND_CUSTOMER_EMAIL_RECEIPT_SUCCESSFUL = 'SEND_CUSTOMER_EMAIL_RECEIPT_SUCCESSFUL';
export const SEND_CUSTOMER_EMAIL_RECEIPT_FAILED = 'SEND_CUSTOMER_EMAIL_RECEIPT_FAILED';
export const GET_CUSTOMER_RECEIPT_FAILED = 'GET_CUSTOMER_RECEIPT_FAILED';
export const SEND_CUSTOMER_EMAIL = 'SEND_CUSTOMER_EMAIL';

const getCustomerAddress = (store) => store.communication.customerAddress;
const getStorePriceLevel = (store) => store.sites.orderConfig.storePriceLevel;
const sendToData = (store) => store.communication.sendToData;
const closedOrder = (store) => store.cart.closedOrder;
const saleData = (store) => store.cart.saleData;
const getReadyTime = (store) => store.cart.readyTimeData;
const getTip = (store) => store.tip.tipData;
const getDisplayProfileId = (store) => store.cart.orderConfig.displayProfileId;
const getTipEnabled = (store) => store.cart.orderConfig.tip && store.cart.orderConfig.tip.acceptTips;
const getEtfEnabled = (store) => store.cart.orderConfig.etf && store.cart.orderConfig.etf.etfEnabled;
const getDateTime = (store) => store.cart.orderConfig.dateTime;
const getSMSConfig = (store) => store.cart.orderConfig.textReceiptFormat;
const paymentSaleData = (store) => store.cart.paymentSaleData;
const stripePaymentSaleData = (store) => store.cart.stripePaymentSaleData;
const stripeSaleChargeData = (store) => store.cart.stripeSaleChargeData;
const stripeChargeForReceipt = (store) => store.stripepayments.stripeSaleChargeData;
const saleTime = (store) => store.cart.saleTime;
const getCurrencyDetails = (store) => store.cart.currencyDetails;
const getEmailInfo = (store) => store.cart.orderConfig.emailReceipt;
const getDeliveryLocation = (store) => store.cart.orderConfig.deliveryDestination && store.cart.orderConfig.deliveryDestination.deliverToDestinationEnabled; // eslint-disable-line max-len
const getStoreInfo = (store) => store.cart.orderConfig.storeInfo;
const getNameCapture = (store) => store.sites.orderConfig.nameCapture && store.sites.orderConfig.nameCapture.featureEnabled; // eslint-disable-line max-len
const getSelectedSMSCountry = (store) => store.smsnotification.selectedCountry;
const getMobileNumber = (store) => store.smsnotification.mobileNumber;
const getTipAmount = (store) => store.tip.tipAmount;
const getGAPaymentInfo = (store) => store.gaPayment;
const getEtfForReceiptInfo = (store) => store.sites.orderConfig.etf && store.sites.orderConfig.etf.etfEnabled;
const getDateTimeForReceiptInfo = (store) => store.sites.orderConfig.dateTime;
const getCurrencyDetailsForReceiptInfo = (store) => store.sites.currencyForPay;
const getDeliveryLocationForReceiptInfo = (store) => store.sites.orderConfig.deliveryDestination && store.sites.orderConfig.deliveryDestination.deliverToDestinationEnabled; // eslint-disable-line max-len
const getTipEnabledForReceiptInfo = (store) => store.sites.orderConfig.tip && store.sites.orderConfig.tip.acceptTips;
const getGAPaymentConfigForReceiptInfo = (store) => store.sites.orderConfig.pay.payOptions.find(payOption => payOption.type === 'genericAuthorization'); // eslint-disable-line max-len
const getCartItems = (store) => store.cart.items;
const getNameString = (store) => (store.namecapture.firstName || store.namecapture.lastInitial) &&
`${store.namecapture.firstName} ${store.namecapture.lastInitial}`;
const getScheduledDay = (store) => store.scheduleorder.scheduleOrderData && store.scheduleorder.scheduleOrderData.daysToAdd; // eslint-disable-line max-len

// Functions for receiptInfo
const getOrderDataForReceiptInfo = (store) => store.cart.order;

const getGAPaymentConfig = (store) => store.cart.orderConfig.pay.payOptions.find(payOption => payOption.type === 'genericAuthorization'); // eslint-disable-line max-len
const getDeliveryInstructionText = (currentStore, deliveryType) => (store) => {
  const deliveryInfo = store.cart.orderConfig[deliveryType === 'delivery' ? 'deliveryDestination' : deliveryType === 'dinein' ? 'dineInConfig' : 'pickUpConfig']; // eslint-disable-line max-len
  const conceptProfitCenterId = store.cart.conceptOptions && store.cart.conceptOptions.profitCenterId;
  const conceptId = store.cart.closedOrder.items[0].conceptId;
  const confirmationText = get(deliveryInfo, `conceptEntries.${conceptId}.confirmationText`);
  if (conceptProfitCenterId && currentStore.profitCenter && currentStore.profitCenter.useProfitCenterByConcept) {
    return confirmationText || deliveryInfo.defaultConfirmationText;
  } else {
    const isItemsInSameConcept = store.cart.closedOrder.items.every(item => item.conceptId === conceptId);
    return (isItemsInSameConcept && confirmationText) || deliveryInfo.defaultConfirmationText;
  }
};
const getVatEntries = (currentStore, order) => (store) => {
  const vatEnabled = get(order, 'taxBreakdown.isVatEnabled', false);
  if (currentStore && vatEnabled) {
    const vatEntries = order && order.taxBreakdown.isVatEnabled ? getVatEntriesFromOrderedItems(order, currentStore.taxRuleData) : []; // eslint-disable-line max-len
    return vatEntries;
  }
};
const getDeliveryInstructionTextForReceipt = (currentStore, deliveryType) => (store) => {
  const deliveryInfo = store.sites.orderConfig[deliveryType === 'delivery' ? 'deliveryDestination' : deliveryType === 'dinein' ? 'dineInConfig' : 'pickUpConfig']; // eslint-disable-line max-len
  const conceptProfitCenterId = store.cart.conceptOptions && store.cart.conceptOptions.profitCenterId;
  const conceptId = store.cart.items[0].conceptId;
  const confirmationText = get(deliveryInfo, `conceptEntries.${conceptId}.confirmationText`);
  if (conceptProfitCenterId && currentStore.profitCenter && currentStore.profitCenter.useProfitCenterByConcept) {
    return confirmationText || deliveryInfo.defaultConfirmationText;
  } else {
    const isItemsInSameConcept = store.cart.items.every(item => item.conceptId === conceptId);
    return (isItemsInSameConcept && confirmationText) || deliveryInfo.defaultConfirmationText;
  }
};

export const sendReceiptEmail = (data) => ({
  type: SEND_RECEIPT_EMAIL,
  sendToData: data.sendTo
});

export const getPrintData = () => ({
  type: GET_PRINT_DATA
});

export const sendCustomerEmail = (address) => ({
  type: SEND_CUSTOMER_EMAIL,
  customerAddress: address
});

export const getCustomerReceiptFailed = (error) => ({
  type: GET_CUSTOMER_RECEIPT_FAILED,
  error
});

export const sendCustomerEmailReceiptSucceeded = (data) => ({
  type: SEND_CUSTOMER_EMAIL_RECEIPT_SUCCESSFUL
});

export const sendCustomerEmailReceiptFailed = (error) => ({
  type: SEND_CUSTOMER_EMAIL_RECEIPT_FAILED,
  error
});

export const setPrintData = (data) => ({
  type: SET_PRINT_DATA,
  printData: data
});

export const sendReceiptSMS = (data) => ({
  type: SEND_RECEIPT_SMS,
  sendToData: data.sendTo,
  smsSelectedCountry: data.selectedCountry
});

export const fetchingReceipt = () => ({
  type: FETCHING_RECEIPT
});

export const sendingReceipt = () => ({
  type: SENDING_RECEIPT
});

export const getReceiptFailed = (error) => ({
  type: GET_RECEIPT_FAILED,
  receiptError: GET_RECEIPT_FAILED,
  error
});
export const getReceiptSucceeded = (data) => ({
  type: GET_RECEIPT_SUCCESSFUL,
  receiptImage: data
});

export const getSMSReceiptFailed = (error) => ({
  type: GET_SMS_RECEIPT_FAILED,
  receiptError: GET_SMS_RECEIPT_FAILED,
  error
});
export const getSMSReceiptSucceeded = (data) => ({
  type: GET_SMS_RECEIPT_SUCCESSFUL,
  receiptImage: data
});

export const sendEmailReceiptSucceeded = (data) => ({
  type: SEND_EMAIL_RECEIPT_SUCCESSFUL,
  sendReceipt: data
});

export const sendSMSReceiptSucceeded = (data) => ({
  type: SEND_SMS_RECEIPT_SUCCESSFUL,
  sendReceipt: data
});

export const sendEmailReceiptFailed = (error) => ({
  type: SEND_EMAIL_RECEIPT_FAILED,
  sendReceiptError: SEND_EMAIL_RECEIPT_FAILED,
  error
});

export const sendSMSReceiptFailed = (error) => ({
  type: SEND_SMS_RECEIPT_FAILED,
  sendReceiptError: SEND_SMS_RECEIPT_FAILED,
  error
});

export const setDeliveryConfirmationText = (deliveryConfirmationText) => ({
  type: SET_DELIVERY_CONFIRMATION_TEXT,
  deliveryConfirmationText
});

export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export const buildReceiptInfo = (receiptInfo) => ({
  type: BUILD_RECEIPT_INFO,
  receiptInfo
});

export const fetchReceipt = (obj) => axios.post(`${config.webPaths.api}communication/getReceipt`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const fetchSMSReceipt = (obj) => axios.post(`${config.webPaths.api}communication/getSMSReceipt`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const sendEmailReceipt = (obj) => axios.post(`${config.webPaths.api}communication/sendEmailReceipt`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const sendSMSReceipt = (obj) => axios.post(`${config.webPaths.api}communication/sendSMSReceipt`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const createReceiptData = (closedOrderData, currencyDetails,
  deliveryLocation, nameCapture, tipEnabled, orderPlacedTime,
  readyTime, etfEnabled, dateTime, accountNumberLabelText,
  gaTenderBalance, deliveryConfirmationText, vatEntries, taxIdentificationNumber, storeInfo) => {

  let data = {
    closedOrderData,
    currencyDetails,
    deliveryLocation,
    nameCapture,
    tipEnabled,
    orderPlacedTime,
    readyTime,
    etfEnabled,
    dateTime,
    accountNumberLabelText,
    gaTenderBalance,
    deliveryConfirmationText,
    vatEntries,
    taxIdentificationNumber,
    storeInfo
  };
  return axios.post(`${config.webPaths.api}communication/createReceiptData`, data)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const createSMSReceiptData = (closedOrderData, currencyDetails,
  deliveryLocation, nameCapture, tipEnabled, orderPlacedTime,
  readyTime, etfEnabled, dateTime, accountNumberLabelText, smsConfig, vatEnabled, storeInfo) => {

  let data = {
    closedOrderData,
    currencyDetails,
    deliveryLocation,
    nameCapture,
    tipEnabled,
    orderPlacedTime,
    readyTime,
    etfEnabled,
    dateTime,
    accountNumberLabelText,
    smsConfig,
    vatEnabled,
    storeInfo
  };
  return axios.post(`${config.webPaths.api}communication/createSMSReceiptData`, data)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export const getLogoImage = async (imageUrl) => {
  return axios.get(imageUrl,
    { responseType: 'blob' })
    .then((response) => {
      return new Promise((resolve, reject) => {
        let reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });
    }).catch(err => {
      console.log(err);
    });

};

export function * buildReceiptInfoPayload (receiptInfo) {
  const orderData = yield select(getOrderDataForReceiptInfo);
  const stripeChargeData = yield select(stripeChargeForReceipt);
  const storeData = yield select(getCurrentStore(receiptInfo.order.contextId, receiptInfo.displayProfileId));
  const tip = yield select(getTip);
  const etfEnabled = yield select(getEtfForReceiptInfo);
  const deliveryProperties = yield call(getDeliveryProperties);
  const dateTime = yield select(getDateTimeForReceiptInfo);
  const storePriceLevel = yield select(getStorePriceLevel);
  const currencyDetails = yield select(getCurrencyDetailsForReceiptInfo);
  const deliveryEnabled = yield select(getDeliveryLocationForReceiptInfo);
  const nameCaptureEnabled = yield select(getNameCapture);
  const readyTime = yield select(getReadyTime);
  const tipEnabled = yield select(getTipEnabledForReceiptInfo);
  const deliveryType = get(deliveryProperties, 'deliveryOption.id', '');
  const deliveryConfirmationText = yield select(getDeliveryInstructionTextForReceipt(storeData, deliveryType)); // eslint-disable-line max-len
  yield put(setDeliveryConfirmationTextInCart(deliveryConfirmationText));
  yield put(setDeliveryConfirmationText(deliveryConfirmationText));
  const vatEntries = yield select(getVatEntries(storeData, orderData));
  const taxIdentificationNumber = get(storeData, 'taxIdentificationNumber', '');
  const storeName = get(storeData, 'name', '');
  const timeZone = get(storeData, 'timeZone');
  const items = yield select(getCartItems);
  const terminalId = get(orderData, 'properties.closedTerminalId');
  const checkNumber = get(orderData, 'orderNumber');
  const nameString = yield select(getNameString);
  const selectedSMSCountry = yield select(getSelectedSMSCountry);
  const tipAmount = yield select(getTipAmount);
  const mobileNumber = yield select(getMobileNumber);
  const scheduledTime = yield call(getScheduleTime);
  const scheduledDay = yield select(getScheduledDay);

  const gaPaymentInfo = yield select(getGAPaymentInfo);
  let gaPayment = {};
  let gaAccountInfoList = [];
  if (gaPaymentInfo) {
    gaPayment = {
      gaAccountInfoList: gaPaymentInfo.gaAccountsInfoList
    };
  }
  const gaPaymentConfig = yield select(getGAPaymentConfigForReceiptInfo);
  // const gaTenderBalance = closedOrderData.order.remainingGAAccountBalance;
  // Get remainingGAAccountBalance from api and send to receipt info; !!!!!
  let accountNumberLabelText;
  if (gaPaymentConfig && gaPayment && gaPayment.gaAccountInfoList) {
    accountNumberLabelText = gaPaymentConfig.accountNumberLabelText;
    gaAccountInfoList = gaPayment.gaAccountInfoList;
  }

  const receiptPayload = {
    orderData,
    items,
    stripeChargeData,
    tip,
    tipAmount,
    etfEnabled,
    dateTime,
    storePriceLevel,
    currencyDetails,
    deliveryEnabled,
    nameCaptureEnabled,
    readyTime,
    tipEnabled,
    deliveryProperties,
    vatEntries,
    taxIdentificationNumber,
    accountNumberLabelText,
    gaAccountInfoList,
    deliveryConfirmationText,
    orderPlacedTime: new Date(),
    storeName,
    timeZone,
    terminalId,
    checkNumber,
    nameString,
    selectedSMSCountry,
    mobileNumber,
    scheduledTime,
    scheduledDay
  };

  // yield put(setReceiptInfoForCloseOrder(receiptPayload));
  return receiptPayload;
}

export function * fetchReceiptForPrint () {
  const closedOrderData = yield select(closedOrder);
  const closedSaleData = yield select(saleData);
  const orderPlacedTime = yield select(saleTime);
  const saleTransactionData = yield select(paymentSaleData);
  const stripeSaleData = yield select(stripePaymentSaleData);
  const stripeChargeData = yield select(stripeSaleChargeData);
  const displayProfileId = yield select(getDisplayProfileId);
  const storeData = yield select(getCurrentStore(closedOrderData.order.contextId, displayProfileId));
  const tip = yield select(getTip);
  const etfEnabled = yield select(getEtfEnabled);
  const dateTime = yield select(getDateTime);
  const storePriceLevel = yield select(getStorePriceLevel);
  const storeInfo = yield select(getStoreInfo);
  closedOrderData.selectedId = closedOrderData.order.contextId;
  closedOrderData.saleTransactionData = saleTransactionData;
  closedOrderData.stripeSaleData = stripeSaleData;
  closedOrderData.stripeChargeData = stripeChargeData;
  closedOrderData.storePriceLevel = storePriceLevel;
  const currencyDetails = yield select(getCurrencyDetails);
  const deliveryEnabled = yield select(getDeliveryLocation);
  const nameCaptureEnabled = yield select(getNameCapture);
  const readyTime = yield select(getReadyTime);
  const tipEnabled = yield select(getTipEnabled);
  const deliveryType = get(closedOrderData, 'order.deliveryProperties.deliveryOption.id', '');
  const deliveryConfirmationText = yield select(getDeliveryInstructionText(storeData, deliveryType)); // eslint-disable-line max-len
  yield put(setDeliveryConfirmationTextInCart(deliveryConfirmationText));
  yield put(setDeliveryConfirmationText(deliveryConfirmationText));
  const vatEntries = yield select(getVatEntries(storeData, closedOrderData.order));
  const taxIdentificationNumber = get(storeData, 'taxIdentificationNumber', '');

  let accountNumberLabelText;
  const gaTenderBalance = closedOrderData.order.remainingGAAccountBalance;
  const gaPayment = closedOrderData.order.gaPayment;
  const gaPaymentConfig = yield select(getGAPaymentConfig);
  if (gaPaymentConfig && gaPayment && gaPayment.gaAccountInfoList) {
    accountNumberLabelText = gaPaymentConfig.accountNumberLabelText;
    closedOrderData.order.gaAccountInfoList = gaPayment.gaAccountInfoList;
  }

  try {
    const logoData = yield call(getLogoImage, storeData.image);
    closedOrderData.logoDetails = logoData;
    closedOrderData.tip = tip;
    const receiptData = yield call(createReceiptData,
      closedOrderData, currencyDetails, deliveryEnabled, nameCaptureEnabled, tipEnabled, orderPlacedTime, readyTime,
      etfEnabled, dateTime, accountNumberLabelText, gaTenderBalance, deliveryConfirmationText, vatEntries, taxIdentificationNumber, storeInfo); // eslint-disable-line max-len
    closedSaleData.printReceipt = receiptData;
    yield put(setPrintData(receiptData));
  } catch (ex) {
    yield put(getReceiptFailed(ex));
    yield put(setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')); // eslint-disable-line max-len
  }
}

export function * fetchAndSendReceipt () {
  const sendTo = yield select(sendToData);
  const closedOrderData = yield select(closedOrder);
  const orderPlacedTime = yield select(saleTime);
  const saleTransactionData = yield select(paymentSaleData);
  const stripeSaleData = yield select(stripePaymentSaleData);
  const stripeChargeData = yield select(stripeSaleChargeData);
  const displayProfileId = yield select(getDisplayProfileId);
  const storeData = yield select(getCurrentStore(closedOrderData.order.contextId, displayProfileId));
  const tip = yield select(getTip);
  const etfEnabled = yield select(getEtfEnabled);
  const dateTime = yield select(getDateTime);
  const storePriceLevel = yield select(getStorePriceLevel);
  const deliveryEnabled = yield select(getDeliveryLocation);
  const nameCaptureEnabled = yield select(getNameCapture);
  const tipEnabled = yield select(getTipEnabled);
  const readyTime = yield select(getReadyTime);
  const deliveryType = get(closedOrderData, 'order.deliveryProperties.deliveryOption.id', '');
  const deliveryConfirmationText = yield select(getDeliveryInstructionText(storeData, deliveryType)); // eslint-disable-line max-len
  const vatEntries = yield select(getVatEntries(storeData, closedOrderData.order));
  const taxIdentificationNumber = get(storeData, 'taxIdentificationNumber', '');
  const storeInfo = yield select(getStoreInfo);

  let accountNumberLabelText;
  const gaTenderBalance = closedOrderData.order.remainingGAAccountBalance;
  const gaPayment = closedOrderData.order.gaPayment;
  const gaPaymentConfig = yield select(getGAPaymentConfig);
  if (gaPaymentConfig && gaPayment && gaPayment.gaAccountInfoList) {
    accountNumberLabelText = gaPaymentConfig.accountNumberLabelText;
    closedOrderData.order.gaAccountInfoList = gaPayment.gaAccountInfoList;
  }

  closedOrderData.selectedId = closedOrderData.order.contextId;
  closedOrderData.saleTransactionData = saleTransactionData;
  closedOrderData.stripeSaleData = stripeSaleData;
  closedOrderData.stripeChargeData = stripeChargeData;
  closedOrderData.storePriceLevel = storePriceLevel;
  const emailInfo = yield select(getEmailInfo);
  if (sendTo) {
    try {
      const logoData = yield call(getLogoImage, storeData.image); // eslint-disable-line max-len
      closedOrderData.logoDetails = logoData;
      closedOrderData.tip = tip;
      const currencyDetails = yield select(getCurrencyDetails);
      const receiptData = yield call(createReceiptData,
        closedOrderData, currencyDetails, deliveryEnabled,
        nameCaptureEnabled, tipEnabled, orderPlacedTime,
        readyTime, etfEnabled, dateTime, accountNumberLabelText,
        gaTenderBalance, deliveryConfirmationText, vatEntries, taxIdentificationNumber, storeInfo);
      const templateData = yield call(fetchReceipt, receiptData);
      yield put(getReceiptSucceeded(templateData));
      try {
        const obj = {
          receiptHtml: templateData,
          sendOrderTo: sendTo,
          emailInfo,
          contextId: closedOrderData.order.contextId
        };
        const sendResponse = yield call(sendEmailReceipt, obj);
        yield put(emailReceiptSucceeded(true));
        yield put(sendEmailReceiptSucceeded(sendResponse));
      } catch (ex) {
        yield put(sendEmailReceiptFailed(ex));
        yield put(setAppError(new Error('Unable to send email now \nwe are working on it, please try again after few minutes'), 'ERROR_EMAIL')); // eslint-disable-line max-len
      }
    } catch (ex) {
      yield put(getReceiptFailed(ex));
      yield put(setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')); // eslint-disable-line max-len
    }
  } else {
    yield put(getReceiptFailed('Missing to info'));
    yield put(setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')); // eslint-disable-line max-len
  }
}

export function * fetchAndSendCustomerReceipt () {
  const customerAddress = yield select(getCustomerAddress);
  const closedOrderData = yield select(closedOrder);
  const orderPlacedTime = yield select(saleTime);
  const saleTransactionData = yield select(paymentSaleData);
  const stripeSaleData = yield select(stripePaymentSaleData);
  const stripeChargeData = yield select(stripeSaleChargeData);
  const displayProfileId = yield select(getDisplayProfileId);
  const storeData = yield select(getCurrentStore(closedOrderData.order.contextId, displayProfileId));
  const tip = yield select(getTip);
  const etfEnabled = yield select(getEtfEnabled);
  const dateTime = yield select(getDateTime);
  const storePriceLevel = yield select(getStorePriceLevel);
  const deliveryEnabled = yield select(getDeliveryLocation);
  const nameCaptureEnabled = yield select(getNameCapture);
  const tipEnabled = yield select(getTipEnabled);
  const readyTime = yield select(getReadyTime);
  const deliveryType = get(closedOrderData, 'order.deliveryProperties.deliveryOption.id', '');
  const deliveryConfirmationText = yield select(getDeliveryInstructionText(storeData, deliveryType)); // eslint-disable-line max-len
  const vatEntries = yield select(getVatEntries(storeData, closedOrderData.order));
  const taxIdentificationNumber = get(storeData, 'taxIdentificationNumber', '');
  const storeInfo = yield select(getStoreInfo);

  let accountNumberLabelText;
  const gaTenderBalance = closedOrderData.order.remainingGAAccountBalance;
  const gaPayment = closedOrderData.order.gaPayment;
  const gaPaymentConfig = yield select(getGAPaymentConfig);
  if (gaPaymentConfig && gaPayment && gaPayment.gaAccountInfoList) {
    accountNumberLabelText = gaPaymentConfig.accountNumberLabelText;
    closedOrderData.order.gaAccountInfoList = gaPayment.gaAccountInfoList;
  }

  closedOrderData.selectedId = closedOrderData.order.contextId;
  closedOrderData.saleTransactionData = saleTransactionData;
  closedOrderData.stripeSaleData = stripeSaleData;
  closedOrderData.stripeChargeData = stripeChargeData;
  closedOrderData.storePriceLevel = storePriceLevel;
  const emailInfo = yield select(getEmailInfo);
  if (customerAddress) {
    try {
      const logoData = yield call(getLogoImage, storeData.find(pay => pay.id === closedOrderData.order.contextId).image); // eslint-disable-line max-len
      closedOrderData.logoDetails = logoData;
      closedOrderData.tip = tip;
      const currencyDetails = yield select(getCurrencyDetails);
      const receiptData = yield call(createReceiptData,
        closedOrderData, currencyDetails, deliveryEnabled,
        nameCaptureEnabled, tipEnabled, orderPlacedTime,
        readyTime, etfEnabled, dateTime, accountNumberLabelText,
        gaTenderBalance, deliveryConfirmationText, vatEntries, taxIdentificationNumber, storeInfo);
      const templateData = yield call(fetchReceipt, receiptData);
      try {
        const obj = {
          receiptHtml: templateData,
          customerAddress,
          emailInfo,
          contextId: closedOrderData.order.contextId
        };
        const sendResponse = yield call(sendEmailReceipt, obj);
        yield put(sendCustomerEmailReceiptSucceeded(sendResponse));
      } catch (ex) {
        yield put(sendCustomerEmailReceiptFailed(ex));
      }
    } catch (ex) {
      yield put(getCustomerReceiptFailed(ex));
    }
  } else {
    yield put(getCustomerReceiptFailed('Missing address info'));
  }
}

export function * fetchAndSendSMSReceipt () {
  const sendTo = yield select(sendToData);
  const closedOrderData = yield select(closedOrder);
  const orderPlacedTime = yield select(saleTime);
  const saleTransactionData = yield select(paymentSaleData);
  const stripeSaleData = yield select(stripePaymentSaleData);
  const stripeChargeData = yield select(stripeSaleChargeData);
  const tip = yield select(getTip);
  const etfEnabled = yield select(getEtfEnabled);
  const dateTime = yield select(getDateTime);
  const deliveryEnabled = yield select(getDeliveryLocation);
  const nameCaptureEnabled = yield select(getNameCapture);
  const tipEnabled = yield select(getTipEnabled);
  const readyTime = yield select(getReadyTime);
  const smsConfig = yield select(getSMSConfig);
  const storePriceLevel = yield select(getStorePriceLevel);
  const vatEnabled = get(closedOrderData, 'order.taxBreakdown.isVatEnabled', false);
  const storeInfo = yield select(getStoreInfo);

  let accountNumberLabelText;
  const gaPayment = closedOrderData.order.gaPayment;
  const gaPaymentConfig = yield select(getGAPaymentConfig);
  if (gaPaymentConfig && gaPayment && gaPayment.gaAccountInfoList) {
    accountNumberLabelText = gaPaymentConfig.accountNumberLabelText;
    closedOrderData.order.gaAccountInfoList = gaPayment.gaAccountInfoList;
  }

  closedOrderData.selectedId = closedOrderData.order.contextId;
  closedOrderData.saleTransactionData = saleTransactionData;
  closedOrderData.stripeSaleData = stripeSaleData;
  closedOrderData.stripeChargeData = stripeChargeData;
  closedOrderData.tip = tip;
  closedOrderData.storePriceLevel = storePriceLevel;
  const currencyDetails = yield select(getCurrencyDetails);

  if (sendTo) {
    try {
      const receiptData = yield call(createSMSReceiptData,
        closedOrderData, currencyDetails, deliveryEnabled,
        nameCaptureEnabled, tipEnabled, orderPlacedTime,
        readyTime, etfEnabled, dateTime, accountNumberLabelText,
        smsConfig, vatEnabled, storeInfo);

      const templateData = yield call(fetchSMSReceipt, receiptData);
      yield put(getSMSReceiptSucceeded(templateData));

      try {
        const obj = {
          sendOrderTo: sendTo,
          contextId: closedOrderData.order.contextId,
          receiptText: templateData.receipt
        };
        const sendResponse = yield call(sendSMSReceipt, obj);
        yield put(smsReceiptSucceeded(true));
        yield put(sendSMSReceiptSucceeded(sendResponse));
      } catch (ex) {
        yield put(sendSMSReceiptFailed(ex));
        yield put(setAppError(new Error('Unable to send SMS now \nwe are working on it, please try again after few minutes'), 'ERROR_SMS')); // eslint-disable-line max-len
      }
    } catch (ex) {
      yield put(getSMSReceiptFailed(ex));
      yield put(setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')); // eslint-disable-line max-len
    }
  } else {
    yield put(getReceiptFailed('Missing to info'));
    yield put(setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')); // eslint-disable-line max-len
  }
}
