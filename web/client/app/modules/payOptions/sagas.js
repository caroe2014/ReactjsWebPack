// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { PAYMENT_FAILED_DEFAULT_MESSAGE } from 'web/client/app/utils/ErrorMessageUtils';
import { resetOrder, setCartModifyOrderFlag, processRemovePayments,
  resolveRemovePayments, modifyCartItem } from 'web/client/app/modules/cart/sagas';
import { replace } from 'connected-react-router';
import { fetchEtfData, saleTransactionSucceeded,
  removeCCPaymentCard } from 'web/client/app/modules/iFrame/sagas';
import { sendLoyaltyInfo, removeLoyaltyPaymentsAsync,
  processLoyaltyRemovePayment, getLoyaltyPaymentList } from 'web/client/app/modules/loyalty/sagas';
import { saveCardInfo } from 'web/client/app/modules/guestProfile/sagas';
import { removeAmountAgainstGAPayment, clearGAState } from 'web/client/app/modules/gaPayment/sagas';
import { setTipModifyOrderFlag } from 'web/client/app/modules/tip/sagas';
import { resetStripe } from 'web/client/app/modules/stripepay/sagas';
import { resetSites } from 'web/client/app/modules/site/sagas';
import { buildReceiptInfoPayload } from 'web/client/app/modules/communication/sagas';
import { getRoomChargePaymentData, captureRoomChargePaymentAndCloseOrderFailure } from 'web/client/app/modules/roomCharge/sagas'; // eslint-disable-line max-len
import { getMemberChargePaymentData, captureMemberChargePaymentAndCloseOrderFailure } from 'web/client/app/modules/memberCharge/sagas'; // eslint-disable-line max-len
import { removeAtriumPaymentAsync } from 'web/client/app/modules/atrium/sagas'; // eslint-disable-line max-len
import {
  getCurrentStore,
  getCloseOrderPayload,
  getOrder,
  getTipAmount,
  getRemainingTipAmount,
  getCartDisplayProfileId } from 'web/client/app/utils/StateSelector';

export const GET_OPTIONS_FAILED = 'GET_OPTIONS_FAILED';
export const GET_OPTIONS_SUCCEEDED = 'GET_OPTIONS_SUCCEEDED';
export const SET_PAYMENT_AMOUNTS = 'SET_PAYMENT_AMOUNTS';
export const REMOVE_PAYMENT_AMOUNTS = 'REMOVE_PAYMENT_AMOUNTS';
export const PROCESS_MULTIPAYMENTS = 'PROCESS_MULTIPAYMENTS';
export const PROCESS_MULTIPAYMENTS_SUCCESS = 'PROCESS_MULTIPAYMENTS_SUCCESS';
export const PROCESS_MULTIPAYMENTS_FAILED = 'PROCESS_MULTIPAYMENTS_FAILED';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const MULTI_TRANSACTION_FAILED = 'MULTI_TRANSACTION_FAILED';
export const SET_REMAINING_TIP_AMOUNT = 'SET_REMAINING_TIP_AMOUNT';
export const REMOVE_ALL_SPLIT_PAYMENT = 'REMOVE_ALL_SPLIT_PAYMENT';
export const REMOVE_ALL_SPLIT_PAYMENT_SUCCESS = 'REMOVE_ALL_SPLIT_PAYMENT_SUCCESS';
export const REMOVE_ALL_SPLIT_PAYMENT_FAILED = 'REMOVE_ALL_SPLIT_PAYMENT_FAILED';
export const SET_PROCESS_MULTIPAYMENTS_ORDER = 'SET_PROCESS_MULTIPAYMENTS_ORDER';
export const TOGGLE_MULI_PAY_FETCHING = 'TOGGLE_MULI_PAY_FETCHING';
export const REMOVE_ALL_SPLIT_PAYMENTS = 'REMOVE_ALL_SPLIT_PAYMENTS';
export const SHOW_TAXABLE_TENDERS_ONLY = 'SHOW_TAXABLE_TENDERS_ONLY';

export const RESET_REMAINING = 'RESET_REMAINING';
export const SET_REMAINING = 'SET_REMAINING';

const storeToken = (store) => store.payments.tokenizedData;
const shouldPostCreditCardsAsExternalPayments = (store) => store.sites.shouldPostCreditCardsAsExternalPayments; // To be removed OND-294
const getStripeChargeData = (store) => store.stripepayments.stripeChargeData;
const getAccountsInfoList = (store) => store.gaPayment.gaAccountsInfoList;
const getAtriumPaymentAccounts = (store) => store.atrium.accountInfo && store.atrium.accountInfo.length > 0
  ? store.atrium.accountInfo.filter(account => account.authResponse) : undefined;
const getLoyaltyPayment = (store) => {
  let loyaltyPayment = store.loyalty.hostCompVoucherPayments && store.loyalty.hostCompVoucherPayments.length > 0;
  if (!loyaltyPayment) {
    const loyaltyAccounts = store.loyalty.loyaltyProcess.loyaltyLinkedAccounts;
    if (loyaltyAccounts && loyaltyAccounts.length > 0) {
      loyaltyAccounts.forEach(loyaltyAccount => {
        loyaltyAccount.loyaltyAccountTiers.forEach(loyaltyAccountTier => {
          loyaltyPayment = loyaltyAccountTier.voucherSummaries &&
            loyaltyAccountTier.voucherSummaries.find(voucherSummarie => voucherSummarie.paymentResponse !== null) !== null; // eslint-disable-line max-len
          if (!loyaltyPayment) {
            loyaltyPayment = loyaltyAccountTier.pointsSummaries &&
              loyaltyAccountTier.pointsSummaries.find(pointsSummarie => pointsSummarie.paymentResponse !== null) !== null; // eslint-disable-line max-len
          }
        });
      });
    }
  }
  return loyaltyPayment;
};

export const removeAllMultiPayments = (cartItem = undefined, actionType = undefined) => ({
  type: REMOVE_ALL_SPLIT_PAYMENTS,
  cartItem,
  actionType
});

export const setPaymentsAmount = (amountPaid, total, oldAmount) => ({
  type: SET_PAYMENT_AMOUNTS,
  amountPaid,
  total,
  oldAmount
});

export const removePaymentsAmount = (amountRemoved, total) => ({
  type: REMOVE_PAYMENT_AMOUNTS,
  amountRemoved,
  total
});

export const resetRemaining = () => ({
  type: RESET_REMAINING
});

export const setProcessMultiPaymentOrder = () => ({
  type: SET_PROCESS_MULTIPAYMENTS_ORDER
});

export const processMultiPayment = () => ({
  type: PROCESS_MULTIPAYMENTS
});

export const processMultiPaymentSuccess = () => ({
  type: PROCESS_MULTIPAYMENTS_SUCCESS
});

export const processMultiPaymentFailed = () => ({
  type: PROCESS_MULTIPAYMENTS_FAILED
});

export const setRemainingTipAmount = (remainingTipAmount) => ({
  type: SET_REMAINING_TIP_AMOUNT,
  remainingTipAmount
});

export const removeAllSplitPayment = () => ({
  type: REMOVE_ALL_SPLIT_PAYMENT
});

export const removeAllSplitPaymentSuccess = () => ({
  type: REMOVE_ALL_SPLIT_PAYMENT_SUCCESS
});

export const removeAllSplitPaymentFailed = () => ({
  type: REMOVE_ALL_SPLIT_PAYMENT_FAILED
});

export const setAppError = (error, key, dynamicKey, sessionExpired = undefined) => ({
  type: SET_APP_ERROR,
  error,
  key,
  dynamicKey,
  sessionExpired
});

export const multiTransactionFailed = (error) => ({
  type: PROCESS_MULTIPAYMENTS_FAILED,
  error
});

export const toggleMultiPayFetching = (flag = false) => ({
  type: TOGGLE_MULI_PAY_FETCHING,
  flag
});

export const updateShowTaxableTendersOnly = (showTaxableTendersOnly) => ({
  type: SHOW_TAXABLE_TENDERS_ONLY,
  showTaxableTendersOnly
});

function * removePayments (payType, totalAmount, tipAmount, amountRemoved, gaData) {
  let amountCharged;
  const authorizedAmount = (parseFloat(totalAmount) + parseFloat(tipAmount)).toFixed(2);
  if (payType === 'GA') {
    const gaDataList = gaData.split('#');
    yield put(removeAmountAgainstGAPayment(gaDataList[0], gaDataList[1]));
    const gaAccountsInfoList = yield select(getAccountsInfoList);
    const accountPosition = gaAccountsInfoList.findIndex(
      account => account.accountNumber === gaDataList[0] &&
        account.paymentTypeVerificationCode === gaDataList[1]);
    amountCharged = gaAccountsInfoList[accountPosition].amountToBeCharged = null;
    yield put(removePaymentsAmount(amountRemoved || amountCharged, authorizedAmount));
  } else if (payType === 'CC') {
    yield put(removeCCPaymentCard());
    yield put(removePaymentsAmount(amountRemoved || amountCharged, authorizedAmount));
  } else if (payType === 'STRIPE') {
    yield put(resetStripe());
    yield put(removePaymentsAmount(amountRemoved, authorizedAmount));
  } else if (payType === 'ALL') {
    yield put(clearGAState());
    yield put(resetRemaining());
    yield put(removeCCPaymentCard());
    yield put(resetStripe());
  }
};

export const createMultiPaymentClosedOrder = (obj) => axios.post(`${config.webPaths.api}order/createMultiPaymentClosedOrder`, obj) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const deletePaymentsFromOrder = (contextId, orderId, payload) => axios.delete(`${config.webPaths.api}order/${orderId}/deletePaymentsFromOrder/${contextId}`, {data: payload}) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export function * fetchAndProcessMultiPayments (scheduledOrderCompletionTime, isCapacitySuggested = false) {
  const sToken = yield select(storeToken);
  const payload = yield call(getCloseOrderPayload, isCapacitySuggested, scheduledOrderCompletionTime);

  const processPaymentAsExternalPayment = yield select(shouldPostCreditCardsAsExternalPayments);
  const chargeData = yield select(getStripeChargeData);
  const actualTipAmount = yield select(getTipAmount);
  const remainingTipAmount = yield select(getRemainingTipAmount);
  const roomChargeData = yield call(getRoomChargePaymentData);
  const memberChargeData = yield call(getMemberChargePaymentData);
  const gaAccountsInfoList = yield select(getAccountsInfoList);

  try {
    const loyaltyPayment = yield select(getLoyaltyPayment);
    const atriumPaymentAccounts = yield select(getAtriumPaymentAccounts);
    const isGaPaymentAvailable = gaAccountsInfoList && gaAccountsInfoList.find(account => account.amountToBeCharged && account.amountToBeCharged !== 0) !== undefined; // eslint-disable-line max-len
    payload.tokenizedData = sToken;
    payload.terminalId = payload.igSettings.onDemandTerminalId;
    payload.processPaymentAsExternalPayment = processPaymentAsExternalPayment;
    payload.authorizedAmount = payload.order.taxIncludedTotalAmount.amount;
    payload.subtotal = payload.order.taxIncludedTotalAmount.amount;
    payload.tipAmount = remainingTipAmount;
    payload.chargeData = chargeData;
    payload.profileId = payload.displayProfileId;
    payload.roomChargeData = roomChargeData;
    payload.memberChargeData = memberChargeData;
    payload.loyaltyPayment = loyaltyPayment;
    payload.atriumPaymentAccounts = atriumPaymentAccounts;
    payload.isGaPaymentAvailable = isGaPaymentAvailable;

    yield put(sendLoyaltyInfo(payload.contextId, payload.displayProfileId));
    yield put(fetchEtfData());
    // TODO: put the platform guest profile service into payload.order
    const receiptInfo = yield call(buildReceiptInfoPayload, payload);
    payload.receiptInfo = receiptInfo;
    const closedOrder = yield call(createMultiPaymentClosedOrder, payload);
    yield put(saleTransactionSucceeded(closedOrder));
    yield put(processMultiPaymentSuccess());
    if (sToken && sToken.saveCardFlag) {
      const paymentInfo = closedOrder.closedOrder.paymentInfoList.find(data => data.buyPaymentForm === 'CREDIT_CARD');
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
    const errorData = ex.response ? ex.response.data.message.split('#') : [];
    const errorCode = errorData.length >= 1 && errorData[0];
    if (errorCode) {
      switch (errorCode) {
        case 'CC_SALE_TRANSACTION_FAILED':
          yield call(removePayments, 'CC', payload.order.taxIncludedTotalAmount.amount, actualTipAmount, sToken.paymentDetails.multiPaymentAmount); // eslint-disable-line max-len
          yield put(setAppError(new Error('Card payment failed.'), 'CC_SALE_TRANSACTION_FAILED')); // eslint-disable-line max-len
          yield put(multiTransactionFailed());
          yield put(removeCCPaymentCard());
          return;
        case 'STRIPE_TRANSACTION_FAILED':
          const errorResponseMessage = errorData.length >= 2 && errorData[1];
          yield call(removePayments, 'STRIPE', payload.order.taxIncludedTotalAmount.amount, actualTipAmount, chargeData.amount); // eslint-disable-line max-len
          yield put(setAppError(new Error(errorResponseMessage), errorResponseMessage ? '' : 'STRIPE_CHARGE_TRANSACTION_FAILED')); // eslint-disable-line max-len
          yield put(multiTransactionFailed());
          return;
        case 'REFUND_FAILED':
          yield put(setAppError(new Error('Payment failed with transaction id {{transactionId}}'), 'ERROR_REFUND', { transactionId: payload.order.orderNumber })); // eslint-disable-line max-len
          yield put(replace('/'));
          yield put(multiTransactionFailed());
          yield call(resetOrder);
          yield put(resetSites());
          return;
        case 'REFUND_FAILED_AND_CLOSED_ASAP':
          yield put(setAppError(new Error('High demand - Try ordering for later!, Payment failed with transaction id {{transactionId}}'), 'REFUND_FAILED_AND_CLOSED_ASAP', { transactionId: payload.order.orderNumber })); // eslint-disable-line max-len
          yield put(replace('/'));
          yield put(multiTransactionFailed());
          yield call(resetOrder);
          yield put(resetSites());
          return;
        case 'REFUND_SUCCESS':
          yield put(setAppError(new Error('Order failed and refund initiated. Please place a new order.'), 'ERROR_ORDER_FAILED')); // eslint-disable-line max-len
          yield put(replace('/'));
          yield put(multiTransactionFailed());
          yield call(resetOrder);
          yield put(resetSites());
          return;
        case 'REFUND_SUCCESS_AND_CLOSED_ASAP':
          yield put(setAppError(new Error('High demand - Try ordering for later!, Refund has been initiated.'), 'REFUND_SUCCESS_AND_CLOSED_ASAP')); // eslint-disable-line max-len
          yield put(replace('/'));
          yield put(multiTransactionFailed());
          yield call(resetOrder);
          yield put(resetSites());
          return;
        case 'OND_FETCH_CARD_FAILED':
          yield call(removePayments, 'CC', payload.order.taxIncludedTotalAmount.amount, actualTipAmount, sToken.paymentDetails.multiPaymentAmount); // eslint-disable-line max-len
          yield put(setAppError(new Error('Failed to fetch card info details. Please place a new order.'), 'ERROR_FETCH_SAVED_CARD_FAILED')); // eslint-disable-line max-len
          yield put(multiTransactionFailed());
          return;
        case 'SPLIT_TRANSACTION_FAILED':
          yield call(removeAllSplitPaymentsAsync);
          yield put(setAppError(new Error('Split payment failed'), 'ERROR_SPLIT_TRANSACTION_FAILED')); // eslint-disable-line max-len
          yield put(captureRoomChargePaymentAndCloseOrderFailure(ex));
          yield put(captureMemberChargePaymentAndCloseOrderFailure(ex));
          yield put(multiTransactionFailed());
          return;
        case 'OND_TOKEN_FAILED':
          yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', null, true)); // eslint-disable-line max-len
          return;
        case 'ROOM_CHARGE_TRANSACTION_FAILED':
          yield put(setAppError(new Error('Failed to pay through room charge. Please try again.'), 'ERROR_ROOM_CHARGE_PAYMENT_FAILED')); // eslint-disable-line max-len
          yield put(captureRoomChargePaymentAndCloseOrderFailure(ex));
          yield put(multiTransactionFailed());
          return;
        case 'MEMBER_CHARGE_TRANSACTION_FAILED':
          yield put(setAppError(new Error('Failed to pay through member charge. Please try again.'), 'ERROR_MEMBER_CHARGE_PAYMENT_FAILED')); // eslint-disable-line max-len
          yield put(captureMemberChargePaymentAndCloseOrderFailure(ex));
          yield put(multiTransactionFailed());
          return;
        case 'CLOSED_ASAP':
          yield put(setAppError(new Error('High demand - Try ordering later!'), 'CLOSED_ASAP')); // eslint-disable-line max-len
          yield put(replace('/'));
          yield put(multiTransactionFailed());
          yield call(resetOrder);
          yield put(resetSites());
          return;
      }
    }
    if (sToken) {
      yield call(removePayments, 'CC', payload.order.taxIncludedTotalAmount.amount, actualTipAmount, sToken.paymentDetails.multiPaymentAmount); // eslint-disable-line max-len
    }
    yield put(setAppError(new Error(PAYMENT_FAILED_DEFAULT_MESSAGE), 'PAYMENT_PAGE_ERROR_TRANSACTION')); // eslint-disable-line max-len
    yield put(multiTransactionFailed(ex));
  }
}

export function * removeAllSplitPaymentsAsync (cartItem, actionType) {
  try {
    const gaAccountsInfoList = yield select(getAccountsInfoList);
    const order = yield select(getOrder);
    const displayProfileId = yield select(getCartDisplayProfileId);
    const currentStore = yield select(getCurrentStore(order.contextId, displayProfileId));
    const contextId = currentStore.id;
    const gaAccountsList = gaAccountsInfoList.filter(account => account.amountToBeCharged && account.amountToBeCharged !== 0); // eslint-disable-line max-len
    let paymentIdList = [];
    if (cartItem && actionType) {
      yield put(processRemovePayments());
    }

    gaAccountsList.map(selectedGaAccount => {
      paymentIdList.push(selectedGaAccount.paymentResponse.paymentData.id);
    });
    let removePaymentResponse;
    const loyaltyPayments = yield call(getLoyaltyPaymentList);
    (paymentIdList.length > 0 || loyaltyPayments.length > 0) && (yield put(removeAllSplitPayment()));
    if (paymentIdList.length > 0) {
      removePaymentResponse = yield call(deletePaymentsFromOrder, contextId, order.orderId, paymentIdList);
    }
    if (loyaltyPayments.length > 0) {
      yield put(processLoyaltyRemovePayment());
      removePaymentResponse = yield call(removeLoyaltyPaymentsAsync, loyaltyPayments, undefined, true, true);
    }
    yield call(removeAtriumPaymentAsync);
    if (paymentIdList.length > 0 || loyaltyPayments.length > 0) {
      yield put(removeAllSplitPaymentSuccess(removePaymentResponse));
    }
    yield put(clearGAState());
    yield put(resetRemaining());
    yield put(removeCCPaymentCard());
    yield put(setCartModifyOrderFlag());
    yield put(setTipModifyOrderFlag());
    yield put(resetStripe());
    const tipAmount = yield select(getTipAmount);
    yield put(setRemainingTipAmount(tipAmount));
    if (actionType) {
      yield put(modifyCartItem(cartItem, actionType));
      yield put(resolveRemovePayments());
    }
  } catch (error) {
    yield put(removeAllSplitPaymentFailed()); // eslint-disable-line max-len
    if (cartItem && actionType) {
      yield put(setAppError(new Error('Remove payment failed on modify cart items'), 'CART_ACTION_REMOVE_PAYMENTS_FAILED')); // eslint-disable-line max-len
      yield put(resolveRemovePayments());
    }
  }
}
