// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { saleTransactionSucceeded, fetchEtfData } from 'web/client/app/modules/iFrame/sagas';
import { deletePaymentsFromOrder, setRemainingTipAmount } from 'web/client/app/modules/payOptions/sagas';
import { sendLoyaltyInfo, updateRemovePaymentAmounts,
  updateAddPaymentAmounts } from 'web/client/app/modules/loyalty/sagas';
import { calculatePayableAmountWithTip } from 'web/client/app/utils/common';
import { resetSites } from 'web/client/app/modules/site/sagas';
import { resetOrder } from 'web/client/app/modules/cart/sagas';
import { replace } from 'connected-react-router';
import { getCloseOrderPayload,
  getOrder,
  getTipAmount,
  getCartProfitCenterId,
  getCurrencyDetails,
  getRemainingTipAmount,
  getTenantId } from 'web/client/app/utils/StateSelector';
import { buildReceiptInfoPayload } from 'web/client/app/modules/communication/sagas';
import { getPlatformProfile, updatePlatformProfileGA } from 'web/client/app/modules/platformGuestProfile/sagas';

export const GET_GA_ACCOUNT_INFO = 'GET_GA_ACCOUNT_INFO';
export const GET_GA_ACCOUNT_INFO_SUCCESS = 'GET_GA_ACCOUNT_INFO_SUCCESS';
export const GET_GA_ACCOUNT_INFO_FAILED = 'GET_GA_ACCOUNT_INFO_FAILED';

export const AUTHORIZE_GA_SPLIT_PAYMENT = 'AUTHORIZE_GA_SPLIT_PAYMENT';
export const AUTHORIZE_GA_SPLIT_PAYMENT_SUCCESS = 'AUTHORIZE_GA_SPLIT_PAYMENT_SUCCESS';
export const AUTHORIZE_GA_SPLIT_PAYMENT_FAILED = 'AUTHORIZE_GA_SPLIT_PAYMENT_FAILED';
export const REMOVE_GA_SPLIT_PAYMENT = 'REMOVE_GA_SPLIT_PAYMENT';
export const REMOVE_GA_SPLIT_PAYMENT_SUCCESS = 'REMOVE_GA_SPLIT_PAYMENT_SUCCESS';
export const REMOVE_GA_SPLIT_PAYMENT_FAILED = 'REMOVE_GA_SPLIT_PAYMENT_FAILED';

export const SELECTED_ACCOUNT = 'SELECTED_ACCOUNT';
export const RESET_SELECTED_ACCOUNT = 'RESET_SELECTED_ACCOUNT';

export const GET_GA_ACCOUNT_INQUIRY_INFO = 'GET_GA_ACCOUNT_INQUIRY_INFO';
export const GET_GA_ACCOUNT_INQUIRY_INFO_SUCCESS = 'GET_GA_ACCOUNT_INQUIRY_INFO_SUCCESS';
export const GET_GA_ACCOUNT_INQUIRY_INFO_FAILED = 'GET_GA_ACCOUNT_INQUIRY_INFO_FAILED';

export const AUTHORIZE_GA_PAYMENT = 'AUTHORIZE_GA_PAYMENT';
export const AUTHORIZE_GA_PAYMENT_SUCCESS = 'AUTHORIZE_GA_PAYMENT_SUCCESS';
export const AUTHORIZE_GA_PAYMENT_FAILED = 'AUTHORIZE_GA_PAYMENT_FAILED';

export const SET_GA_TENDER_INDEX = 'SET_GA_TENDER_INDEX';
export const CLEAR_GA_STATE = 'CLEAR_GA_STATE';
export const START_GA_PAYMENT = 'START_GA_PAYMENT';

export const TOGGLE_FETCH_AUTH_RESPONSE = 'TOGGLE_FETCH_AUTH_RESPONSE';

export const CLOSE_GA_ACCOUNT_POPUP = 'CLOSE_GA_ACCOUNT_POPUP';
export const CLEAR_GA_ERRORS = 'CLEAR_GA_ERRORS';

export const FETCH_GA_ACCOUNT_SUCCESS = 'FETCH_GA_ACCOUNT_SUCCESS';
export const FETCH_GA_ACCOUNT_FAILED = 'FETCH_GA_ACCOUNT_FAILED';

export const SET_APP_ERROR = 'SET_APP_ERROR';

const getAccountNumber = (store) => store.gaPayment.accountNumber;
const getSecondaryVerificationType = (store) => store.gaPayment.secondaryVerificationType;
const getSecondaryVerificationValue = (store) => store.gaPayment.secondaryVerificationValue;
const getGAAccountNumber = (store) => store.gaPayment.gaAccountInfo.accountNumber;
const getIndexOfSelectedGAPaymentType = (store) => store.gaPayment.indexOfSelectedGAPaymentType;
const getSelectedGAAccountType = (index) => (store) => store.gaPayment.gaAccountInfo.accountAssociatedGaTenders[index]; // eslint-disable-line max-len
const getSiteId = (store) => store.cart.order.contextId;
const getSelectedAccount = (store) => store.gaPayment.selectedGaOption;
const getAccountsInfoList = (store) => store.gaPayment.gaAccountsInfoList;
const getMultiPaymentFlag = (store) => store.sites.orderConfig.multiPaymentEnabled;
const getGAPaymentConfig = (store) => store.sites.orderConfig.pay.payOptions.find(payOption => payOption.type === 'genericAuthorization'); // eslint-disable-line max-len

const getCurrentProfile = (store) => store.platformGuestProfile.profile;
const getPlatformGuestProfileConfig = (store) => store.sites.orderConfig.platformGuestProfileConfig;
const getShouldOptIn = (store) => store.platformGuestProfile.shouldOptIn;

export const getGAAccountInfo = (accountNumber, secondaryVerificationType, secondaryVerificationValue) => ({
  type: GET_GA_ACCOUNT_INFO,
  accountNumber,
  secondaryVerificationType,
  secondaryVerificationValue
});

export const getGAAccountInfoSuccess = (gaAccountInfo) => ({
  type: GET_GA_ACCOUNT_INFO_SUCCESS,
  gaAccountInfo
});

export const getGAAccountInfoFailed = (error) => ({
  type: GET_GA_ACCOUNT_INFO_FAILED,
  error
});

export const getGAAccountInquiryInfo = (indexOfSelectedGAPaymentType) => ({
  type: GET_GA_ACCOUNT_INQUIRY_INFO,
  indexOfSelectedGAPaymentType: indexOfSelectedGAPaymentType
});

export const getGAAccountInquiryInfoSuccess = (gaAccountInquiryInfo) => ({
  type: GET_GA_ACCOUNT_INQUIRY_INFO_SUCCESS,
  gaAccountInquiryInfo
});

export const getGAAccountInquiryInfoFailed = (error) => ({
  type: GET_GA_ACCOUNT_INQUIRY_INFO_FAILED,
  error
});

export const setSelectedIndexWithoutInquiry = (index) => ({
  type: SET_GA_TENDER_INDEX,
  index
});

export const authorizeGAPayment = () => ({
  type: AUTHORIZE_GA_PAYMENT
});

export const authorizeGAPaymentSuccess = (saleData) => ({
  type: AUTHORIZE_GA_PAYMENT_SUCCESS,
  saleData
});

export const authorizeGAPaymentFailed = () => ({
  type: AUTHORIZE_GA_PAYMENT_FAILED
});

export const clearGAState = () => ({
  type: CLEAR_GA_STATE
});

export const clearGAErrors = () => ({
  type: CLEAR_GA_ERRORS
});

export const selectedAccount = (account) => ({
  type: SELECTED_ACCOUNT,
  account
});

export const resetSelectedAccount = () => ({
  type: RESET_SELECTED_ACCOUNT
});

export const startGAPayment = () => ({
  type: START_GA_PAYMENT
});

export const fetchGaAccountSuccess = (accountInfo, gaAccountsInfoList) => ({
  type: FETCH_GA_ACCOUNT_SUCCESS,
  accountInfo,
  gaAccountsInfoList
});

export const fetchGaAccountFailed = () => ({
  type: FETCH_GA_ACCOUNT_FAILED
});

export const toggleFetchAuthResponse = (flag = false) => ({
  type: TOGGLE_FETCH_AUTH_RESPONSE,
  flag
});

export const authorizeGaSplitPayment = (account, amount, isAmountModified = false, isLastPayment = false) => ({
  type: AUTHORIZE_GA_SPLIT_PAYMENT,
  account,
  amount,
  isAmountModified,
  isLastPayment
});

export const authorizeGaSplitPaymentSuccess = (paymentResponse, account, amount) => ({
  type: AUTHORIZE_GA_SPLIT_PAYMENT_SUCCESS,
  paymentResponse,
  amount,
  account
});

export const authorizeGaSplitPaymentFailed = (error) => ({
  type: AUTHORIZE_GA_SPLIT_PAYMENT_FAILED,
  error
});

export const removeGaSplitPayment = (selectedAccount) => ({
  type: REMOVE_GA_SPLIT_PAYMENT,
  selectedAccount
});

export const removeGaSplitPaymentSuccess = (account, response, isAmountModified) => ({
  type: REMOVE_GA_SPLIT_PAYMENT_SUCCESS,
  account,
  response,
  isAmountModified
});

export const removeGaSplitPaymentFailed = () => ({
  type: REMOVE_GA_SPLIT_PAYMENT_FAILED
});

export const setAppError = (error, key, dynamicKey, sessionExpired = undefined) => ({
  type: SET_APP_ERROR,
  error,
  key,
  dynamicKey,
  sessionExpired
});

export const getGAAccountInfoRequest = (payload) => axios.post(`${config.webPaths.api}ga/accountInfo`, payload)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const getGAAccountInquiryInfoRequest = (payload) => axios.post(`${config.webPaths.api}ga/accountInquiry`, payload) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const authorizeGAPaymentRequest = (payload) => axios.post(`${config.webPaths.api}ga/authorizePaymentAndCloseOrder`, payload) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const authorizeAndAddGaPaymentToOrderRequest = (payload) => axios.post(`${config.webPaths.api}ga/authorizeAndAddGaPaymentToOrder`, payload) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export function * getGAAccountInfoInquiryAsync () {
  const tenantId = yield select(getTenantId);
  const contextId = yield select(getSiteId);
  const profitCenterId = yield select(getCartProfitCenterId);
  const selectedAccount = yield select(getSelectedAccount);
  const gaAccountsInfoList = yield select(getAccountsInfoList);
  const currencyDetails = yield select(getCurrencyDetails);
  const gaAccountInfo = gaAccountsInfoList.find(account => account.accountNumber === selectedAccount.accountNumber &&
    account.gaTenderName === selectedAccount.displayLabel);
  const payload = {
    contextId,
    tenantId,
    accountNumber: gaAccountInfo.accountNumber,
    verificationCode: gaAccountInfo.paymentTypeVerificationCode,
    tenderId: gaAccountInfo.tenderId,
    profitCenterId,
    currencyUnit: currencyDetails.currencyCode
  };

  try {
    const accountInquiryResult = yield call(getGAAccountInquiryInfoRequest, payload);
    const gaAccountPosition = gaAccountsInfoList.findIndex(
      account => account.accountNumber === selectedAccount.accountNumber &&
        account.gaTenderName === selectedAccount.displayLabel);
    gaAccountsInfoList[gaAccountPosition].chargeToDate = accountInquiryResult.chargeToDate;
    gaAccountsInfoList[gaAccountPosition].limitOnAccount = accountInquiryResult.limitOnAccount;
    gaAccountsInfoList[gaAccountPosition].remainingBalance = accountInquiryResult.remainingBalance;

    yield put(fetchGaAccountSuccess(accountInquiryResult, gaAccountsInfoList));
  } catch (ex) {
    yield put(setAppError(new Error('Ga inquiry failed.'), 'ERROR_GA_INQUIRY_FAILED')); // eslint-disable-line max-len
    yield put(fetchGaAccountFailed());
  }
}

export function * getGAAccountInquiryInfoAsync () {
  const tenantId = yield select(getTenantId);
  const contextId = yield select(getSiteId);
  const accountNumber = yield select(getGAAccountNumber);
  const indexOfSelectedGAPaymentType = yield select(getIndexOfSelectedGAPaymentType);
  const selectedGAAccount = yield select(getSelectedGAAccountType(indexOfSelectedGAPaymentType));
  const profitCenterId = yield select(getCartProfitCenterId);

  const currencyDetails = yield select(getCurrencyDetails);
  const { paymentTypeVerificationCode, tenderId } = selectedGAAccount;

  const payload = {
    contextId,
    tenantId,
    accountNumber,
    verificationCode: paymentTypeVerificationCode,
    tenderId,
    profitCenterId,
    currencyUnit: currencyDetails.currencyCode
  };

  try {
    const accountInquiryResult = yield call(getGAAccountInquiryInfoRequest, payload);
    yield put(getGAAccountInquiryInfoSuccess(accountInquiryResult));
  } catch (error) {
    yield put(setAppError(new Error('Ga inquiry failed'), 'ERROR_GA_INQUIRY_FAILED')); // eslint-disable-line max-len
    yield put(getGAAccountInquiryInfoFailed(error));
  }
}

export function * getGAAccountInfoAsync () {
  const tenantId = yield select(getTenantId);
  const contextId = yield select(getSiteId);
  const accountNumber = yield select(getAccountNumber);
  const secondaryVerificationType = yield select(getSecondaryVerificationType);
  const secondaryVerificationValue = yield select(getSecondaryVerificationValue);
  let gAPaymentConfig = yield select(getGAPaymentConfig);

  const payload = {
    tenantId,
    contextId,
    accountNumber,
    secondaryVerificationType,
    secondaryVerificationValue
  };

  try {
    let gaAccountInfoResult = yield call(getGAAccountInfoRequest, payload);

    if (gAPaymentConfig.tenders && gAPaymentConfig.tenders.length > 0) {
      gaAccountInfoResult.accountAssociatedGaTenders =
        gaAccountInfoResult.accountAssociatedGaTenders.filter(gaAccount => {
          const tenderData = gAPaymentConfig.tenders.find(data => data.tenderId === gaAccount.tenderId);
          if (tenderData) {
            gaAccount.gaTenderName = tenderData.displayName;
          }
          return tenderData !== undefined;
        });
    }
    if (gaAccountInfoResult.accountAssociatedGaTenders.length === 0) {
      yield put(getGAAccountInfoFailed({ message: 'GA_NO_VALID_TENDERS' }));
    } else {
      gaAccountInfoResult.accountAssociatedGaTenders.forEach(accountInfo => {
        accountInfo.accountNumber = gaAccountInfoResult.accountNumber;
        accountInfo.accountName = gaAccountInfoResult.accountName;
      });
      yield put(getGAAccountInfoSuccess(gaAccountInfoResult));
    }
  } catch (error) {
    yield put(getGAAccountInfoFailed({ message: 'GA_ACCOUNT_FETCH_FAILED' }));
  }
}

export function * authorizeGAPaymentAsync (scheduledOrderCompletionTime, isCapacitySuggested = false) {
  const payload = yield call(getCloseOrderPayload, isCapacitySuggested, scheduledOrderCompletionTime);
  const tipAmount = yield select(getTipAmount);
  const multiPaymentEnabled = yield select(getMultiPaymentFlag);
  const indexOfSelectedGAPaymentType = yield select(getIndexOfSelectedGAPaymentType);
  const selectedAccount = multiPaymentEnabled ? yield select(getSelectedAccount)
    : yield select(getSelectedGAAccountType(indexOfSelectedGAPaymentType));
  const gaAccountsInfoList = yield select(getAccountsInfoList);
  const selectedGAAccount = multiPaymentEnabled ? gaAccountsInfoList.find(account => account.accountNumber === selectedAccount.accountNumber && // eslint-disable-line max-len
    account.gaTenderName === selectedAccount.displayLabel) : selectedAccount;

  const { paymentTypeVerificationCode, tenderId, postingAccount, accountName, accountNumber } = selectedGAAccount;

  // Appending extra order details that are needed for order close
  payload.subtotal = payload.order.taxIncludedTotalAmount.amount;
  payload.tipAmount = tipAmount;
  payload.verificationCode = paymentTypeVerificationCode;
  payload.accountNumber = accountNumber;
  payload.tenderId = tenderId;
  payload.gaAccountName = accountName;
  payload.gaPostingAccountNumber = postingAccount;

  try {
    yield put(sendLoyaltyInfo(payload.order.contextId));
    yield put(fetchEtfData());
    const receiptInfo = yield call(buildReceiptInfoPayload, payload);
    payload.receiptInfo = receiptInfo;
    const closedOrder = yield call(authorizeGAPaymentRequest, payload);
    yield put(saleTransactionSucceeded(closedOrder));

  } catch (error) {
    yield put(authorizeGAPaymentFailed(error));
    const errorData = error.response ? error.response.data.message.split('#') : [];
    const errorCode = errorData.length >= 1 && errorData[0];
    if (errorCode === 'CLOSED_ASAP') {
      yield put(setAppError(new Error('High demand - Try ordering later!'), 'CLOSED_ASAP'));
      yield put(replace('/'));
      yield call(resetOrder);
      yield put(resetSites());
    }
  }
}

export function * authorizeGaSplitPaymentAsync (selectedGaAccount, amountToBeCharged, isAmountModified) {
  let amount = amountToBeCharged;
  if (parseFloat(amount) === parseFloat(selectedGaAccount.amountToBeCharged)) {
    yield put(authorizeGaSplitPaymentFailed('ERROR_GA_MODIFY_SAME_AMOUNT_FAILED'));
    return;
  }
  let removeGaResponse;
  if (isAmountModified) {
    removeGaResponse = yield call(removeGAPaymentFromOrderAsync, selectedGaAccount, isAmountModified);
    if (!removeGaResponse) {
      return;
    }
  }
  const remainingTipAmount = yield select(getRemainingTipAmount);
  let tipAmount = '0.00';
  let payableAmountWithTip;
  if (remainingTipAmount > 0) {
    payableAmountWithTip = calculatePayableAmountWithTip(amountToBeCharged, remainingTipAmount);
    amount = payableAmountWithTip.amount;
    tipAmount = payableAmountWithTip.tipAmount;
  }
  try {
    const { paymentTypeVerificationCode, tenderId, postingAccount, accountName, accountNumber } = selectedGaAccount;
    const tenantId = yield select(getTenantId);
    const contextId = yield select(getSiteId);
    const profitCenterId = yield select(getCartProfitCenterId);
    const currencyDetails = yield select(getCurrencyDetails);
    const order = yield select(getOrder); // needed to get total
    const payload = {
      tenantId,
      contextId,
      orderId: order.orderId,
      subtotal: amount,
      tipAmount,
      verificationCode: paymentTypeVerificationCode,
      accountNumber,
      profitCenterId,
      currencyUnit: currencyDetails.currencyCode,
      tenderId,
      gaAccountName: accountName,
      gaPostingAccountNumber: postingAccount
    };
    const authrorizeGaSplitResponse = yield call(authorizeAndAddGaPaymentToOrderRequest, payload);
    yield put(authorizeGaSplitPaymentSuccess(authrorizeGaSplitResponse.authResponse, selectedGaAccount, amountToBeCharged)); // eslint-disable-line max-len
    if (isAmountModified) {
      yield call(updateRemovePaymentAmounts, removeGaResponse.order, selectedGaAccount.amountToBeCharged || amount);
    }

    let platformGuestProfileConfig = yield select(getPlatformGuestProfileConfig);
    if (platformGuestProfileConfig && platformGuestProfileConfig.enabled) {
      let shouldOptIn = yield select(getShouldOptIn);
      let activeProfile = yield select(getCurrentProfile);
      const gaAccountNumber = yield select(getAccountNumber);
      if (Object.keys(activeProfile).length !== 0) {
        if (shouldOptIn) {
          const providerUuid = platformGuestProfileConfig.membershipProviderConfiguration.GA.membershipProviderUUID;
          let accountExist = activeProfile.gpBusinessCard.membershipCards.find(member =>
            member.membershipNumber === gaAccountNumber && member.membershipProviderUuid === providerUuid);
          if (!accountExist) {
            yield put(updatePlatformProfileGA(gaAccountNumber, providerUuid));
          }
        }
      } else {
        yield put(getPlatformProfile('GA', gaAccountNumber, platformGuestProfileConfig));
      }
    }

    payableAmountWithTip && (yield put(setRemainingTipAmount(payableAmountWithTip.remainingTip)));
    yield call(updateAddPaymentAmounts, authrorizeGaSplitResponse.order, amountToBeCharged);
  } catch (error) {
    if (isAmountModified) {
      yield call(updateRemovePaymentAmounts, removeGaResponse.order, selectedGaAccount.amountToBeCharged || amount);
    }
    yield put(authorizeGaSplitPaymentFailed());
  }
}

export function * removeGAPaymentFromOrderAsync (selectedGaAccount, isAmountModified) {
  try {
    const paymentId = selectedGaAccount.paymentResponse.paymentData.id;
    const tipAmount = yield select(getTipAmount);
    const contextId = yield select(getSiteId);
    const order = yield select(getOrder);
    const removeGaPaymentResponse = yield call(deletePaymentsFromOrder, contextId, order.orderId, [paymentId]);
    const tipAmountAgainstPayment = parseFloat(selectedGaAccount.paymentResponse.paymentData.paymentRequest.transactionData.tipAmount.amount); // eslint-disable-line max-len
    if (tipAmount && tipAmount > 0 && tipAmountAgainstPayment > 0) {
      const remainingTipAmount = yield select(getRemainingTipAmount);
      const payableRemainingTipAMount = parseFloat(tipAmountAgainstPayment) + parseFloat(remainingTipAmount);
      yield put(setRemainingTipAmount(payableRemainingTipAMount));
    }
    yield put(removeGaSplitPaymentSuccess(selectedGaAccount, removeGaPaymentResponse, isAmountModified));
    if (!isAmountModified) {
      yield call(updateRemovePaymentAmounts, removeGaPaymentResponse.order, selectedGaAccount.amountToBeCharged);
    }
    return removeGaPaymentResponse;
  } catch (error) {
    yield put(removeGaSplitPaymentFailed(isAmountModified ? 'ERROR_GA_MODIFY_AMOUNT_FAILED' : 'ERROR_GA_REMOVE_PAYMENT_FAILED')); // eslint-disable-line max-len
  }
}
