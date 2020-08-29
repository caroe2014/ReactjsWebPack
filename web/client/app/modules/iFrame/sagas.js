// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import { delay } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { PAYMENT_FAILED_DEFAULT_MESSAGE } from 'web/client/app/utils/ErrorMessageUtils';
import { sendLoyaltyInfo } from 'web/client/app/modules/loyalty/sagas';
import { buildReceiptInfoPayload } from 'web/client/app/modules/communication/sagas';
import { resetOrder } from 'web/client/app/modules/cart/sagas';
import { saveCardInfo } from 'web/client/app/modules/guestProfile/sagas';
import { resetSites } from 'web/client/app/modules/site/sagas';
import { replace } from 'connected-react-router';
import {
  getCloseOrderPayload,
  getCartDisplayProfileId,
  getCartConceptId,
  getTenantId } from 'web/client/app/utils/StateSelector';
export const FETCHING_API_TOKEN = 'FETCHING_API_TOKEN';
export const AUTO_FETCHING_API_TOKEN = 'AUTO_FETCHING_API_TOKEN';
export const GET_TOKEN_FAILED = 'GET_TOKEN_FAILED';
export const GET_TOKEN_SUCCEEDED = 'GET_TOKEN_SUCCEEDED';
export const SET_TOKENIZED_DATA = 'SET_TOKENIZED_DATA';
export const MAKE_SALE_TRANSACTION = 'MAKE_SALE_TRANSACTION';
export const FETCH_ETF_DATA = 'FETCH_ETF_DATA';
export const SALE_TRANSACTION_SUCCEEDED = 'SALE_TRANSACTION_SUCCEEDED';
export const SALE_TRANSACTION_FAILED = 'SALE_TRANSACTION_FAILED';
export const SALE_CHECKOUT_SUCCEEDED = 'SALE_CHECKOUT_SUCCEEDED';
export const STRIPE_CHECKOUT_SUCCEEDED = 'STRIPE_CHECKOUT_SUCCEEDED';
export const SALE_CHECKOUT_FAILED = 'SALE_CHECKOUT_FAILED';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const GET_AUTO_TOKEN_FAILED = 'GET_AUTO_TOKEN_FAILED';
export const GET_AUTO_TOKEN_SUCCEEDED = 'GET_AUTO_TOKEN_SUCCEEDED';
export const SALE_TRANSACTION_INITIATE = 'SALE_TRANSACTION_INITIATE';
export const RESET_SALE_DATA = 'RESET_SALE_DATA';
export const TRANSACTION_FAILED = 'TRANSACTION_FAILED';
export const PROCESS_MULTI_PAYMENTS = 'PROCESS_MULTI_PAYMENTS';
export const SET_CC_CARD_OPTION = 'SET_CC_CARD_OPTION';
export const REMOVE_CC_CARD_OPTION = 'REMOVE_CC_CARD_OPTION';

const storeToken = (store) => store.payments.tokenizedData;
const shouldPostCreditCardsAsExternalPayments = (store) => store.sites.shouldPostCreditCardsAsExternalPayments; // To be removed OND-294
const getSelectedContextID = (store) => store.sites.list.find(site => site.id === store.cart.items[0].contextId).id;

export const fetchingToken = () => ({
  type: FETCHING_API_TOKEN
});

export const autoFetchingToken = () => ({
  type: AUTO_FETCHING_API_TOKEN
});

export const makeSaleTransaction = () => ({
  type: MAKE_SALE_TRANSACTION
});

export const setTokenizedData = (data) => ({
  type: SET_TOKENIZED_DATA,
  tokenizedData: data
});

export const getTokenFailed = (error) => ({
  type: GET_TOKEN_FAILED,
  tokenError: GET_TOKEN_FAILED,
  error
});

export const getTokenSucceeded = (token) => ({
  type: GET_TOKEN_SUCCEEDED,
  apiToken: token
});

export const getAutoTokenFailed = (error) => ({
  type: GET_AUTO_TOKEN_FAILED,
  tokenError: GET_AUTO_TOKEN_FAILED,
  error
});
export const getAutoTokenSucceeded = (token) => ({
  type: GET_AUTO_TOKEN_SUCCEEDED,
  apiToken: token
});

export const saleTransactionSucceeded = (saleClosedData, saleData) => ({
  type: SALE_TRANSACTION_SUCCEEDED,
  saleData: saleClosedData,
  paymentSaleData: saleData
});

export const fetchEtfData = () => ({
  type: FETCH_ETF_DATA
});

export const saleTransactionFailed = (error) => ({
  type: SALE_TRANSACTION_FAILED,
  saleError: SALE_TRANSACTION_FAILED,
  error
});

export const transactionFailed = () => ({
  type: TRANSACTION_FAILED
});

export const saleTransactionInititate = () => ({
  type: SALE_TRANSACTION_INITIATE
});

export const saleCheckoutSucceeded = (saleClosedData) => ({
  type: SALE_CHECKOUT_SUCCEEDED,
  saleData: saleClosedData
});

export const stripeCheckoutSucceeded = (saleClosedData) => ({
  type: STRIPE_CHECKOUT_SUCCEEDED,
  saleData: saleClosedData
});

export const saleCheckoutFailed = (error) => ({
  type: SALE_CHECKOUT_FAILED,
  checkoutSaleError: SALE_CHECKOUT_FAILED,
  error
});

export const resetSaleData = () => ({
  type: RESET_SALE_DATA
});

export const setAppError = (error, key, dynamicKey, sessionExpired = undefined) => ({
  type: SET_APP_ERROR,
  error,
  key,
  dynamicKey,
  sessionExpired
});

export const processMultiPayment = () => ({
  type: PROCESS_MULTI_PAYMENTS
});

export const setCCPaymentCard = (obj) => ({
  type: SET_CC_CARD_OPTION,
  cardInfo: obj
});

export const removeCCPaymentCard = () => ({
  type: REMOVE_CC_CARD_OPTION
});

export const fetchToken = (tenantId, contextId, profileId, conceptId) =>
  axios.post(`${config.webPaths.api}iFrame/token/${tenantId}`,
    {
      contextId,
      profileId,
      conceptId
    })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });

function * autoFetchTokenApi (tenantId, contextId, profileId, conceptId) {
  for (let i = 0; i < 5; i++) {
    try {
      const apiResponse = yield call(fetchToken, tenantId, contextId, profileId, conceptId);
      return apiResponse;
    } catch (err) {
      if (i < 4) {
        yield call(delay, 5000);
      }
    }
  }
  // Throw error after 5 failed attempts
  throw new Error('autoFetchToken API request failed');
}

export const makeTransaction = (obj) => axios.post(`${config.webPaths.api}iFrame/sale`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const createClosedOrder = (obj) => axios.post(`${config.webPaths.api}order/createClosedOrder`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export function * fetchApiToken () {
  const tenantId = yield select(getTenantId);
  if (tenantId) {
    const contextId = yield select(getSelectedContextID);
    const displayProfileId = yield select(getCartDisplayProfileId);
    const conceptId = yield select(getCartConceptId);
    try {
      const token = yield call(fetchToken, tenantId, contextId, displayProfileId, conceptId);
      yield put(getTokenSucceeded(token));
    } catch (ex) {
      yield put(getTokenFailed(ex));
    }
  } else {
    yield put(getTokenFailed('Missing Tenant ID'));
  }
}

export function * autoFetchApiToken () {
  const tenantId = yield select(getTenantId);
  if (tenantId) {
    const contextId = yield select(getSelectedContextID);
    const displayProfileId = yield select(getCartDisplayProfileId);
    const conceptId = yield select(getCartConceptId);
    try {
      const token = yield call(autoFetchTokenApi, tenantId, contextId, displayProfileId, conceptId);
      yield put(getAutoTokenSucceeded(token));
      yield put(getTokenSucceeded(token));
    } catch (ex) {
      yield put(getAutoTokenFailed(ex));
    }
  } else {
    yield put(getTokenFailed('Missing Tenant ID'));
  }
}

export function * setTokenizedToken (scheduledOrderCompletionTime, isCapacitySuggested = false) {
  try {
    const sToken = yield select(storeToken);
    const payload = yield call(getCloseOrderPayload, isCapacitySuggested, scheduledOrderCompletionTime);
    const processPaymentAsExternalPayment = yield select(shouldPostCreditCardsAsExternalPayments);
    if (sToken) {
      try {
        payload.tokenizedData = sToken;
        payload.terminalId = payload.igSettings.onDemandTerminalId;
        payload.processPaymentAsExternalPayment = processPaymentAsExternalPayment;
        yield put(sendLoyaltyInfo(payload.order.contextId));
        yield put(fetchEtfData());
        const receiptInfo = yield call(buildReceiptInfoPayload, payload);
        payload.receiptInfo = receiptInfo;
        const closedOrder = yield call(createClosedOrder, payload);
        yield put(saleTransactionSucceeded(closedOrder));
        if (sToken.saveCardFlag) {
          const paymentInfo = closedOrder.closedOrder.paymentInfoList.find(data => data.buyPaymentForm === 'CREDIT_CARD'); // eslint-disable-line max-len
          const accountNumberMasked = paymentInfo.cardInfo.accountNumberMasked;
          const cardInfo = {
            token: sToken.token,
            id: accountNumberMasked.substr(accountNumberMasked.length - 4),
            cardIssuer: paymentInfo.cardInfo.cardIssuer,
            cardHolderName: paymentInfo.cardInfo.cardHolderName,
            expiry: paymentInfo.cardInfo.expirationYearMonth
          };
          yield put(saveCardInfo(cardInfo));
        }
      } catch (ex) {
        const errorMessage = ex.response && ex.response.data.message;
        if (errorMessage) {
          switch (errorMessage) {
            case 'REFUND_FAILED':
              yield put(setAppError(new Error('Payment failed with transaction id {{transactionId}}'), 'ERROR_REFUND', { transactionId: payload.order.orderNumber })); // eslint-disable-line max-len
              yield put(replace('/'));
              yield call(resetOrder);
              yield put(resetSites());
              return;
            case 'REFUND_FAILED_AND_CLOSED_ASAP':
              yield put(setAppError(new Error('High demand - Try ordering for later!, Payment failed with transaction id {{transactionId}}'), 'REFUND_FAILED_AND_CLOSED_ASAP', { transactionId: payload.order.orderNumber })); // eslint-disable-line max-len
              yield put(replace('/'));
              yield call(resetOrder);
              yield put(resetSites());
              return;
            case 'REFUND_SUCCESS':
              yield put(setAppError(new Error('Order failed and refund initiated. Please place a new order.'), 'ERROR_ORDER_FAILED')); // eslint-disable-line max-len
              yield put(replace('/'));
              yield call(resetOrder);
              yield put(resetSites());
              return;
            case 'REFUND_SUCCESS_AND_CLOSED_ASAP':
              yield put(setAppError(new Error('High demand - Try ordering for later!, Refund has been initiated.'), 'REFUND_SUCCESS_AND_CLOSED_ASAP')); // eslint-disable-line max-len
              yield put(replace('/'));
              yield call(resetOrder);
              yield put(resetSites());
              return;
            case 'OND_FETCH_CARD_FAILED':
              yield put(setAppError(new Error('Failed to fetch card info details. Please place a new order.'), 'ERROR_FETCH_SAVED_CARD_FAILED')); // eslint-disable-line max-len
              yield put(transactionFailed());
              return;
            case 'OND_TOKEN_FAILED':
              yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', null, true)); // eslint-disable-line max-len
              return;
          }
        }
        yield put(setAppError(new Error(PAYMENT_FAILED_DEFAULT_MESSAGE), 'PAYMENT_PAGE_ERROR_TRANSACTION')); // eslint-disable-line max-len
        yield put(saleTransactionFailed(ex));
      }
    } else {
      yield put(saleTransactionFailed('Transaction Failed'));
    }
  } catch (error) {
    yield put(setAppError(new Error(PAYMENT_FAILED_DEFAULT_MESSAGE), 'PAYMENT_PAGE_ERROR_TRANSACTION')); // eslint-disable-line max-len
    yield put(saleTransactionFailed('Transaction Failed'));
  }
}
