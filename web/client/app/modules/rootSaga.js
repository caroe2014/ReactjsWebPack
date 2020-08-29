// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, takeLatest, takeEvery, put, select, take, actionChannel, fork, cancel } from 'redux-saga/effects';
import { buffers, delay } from 'redux-saga';
import { push, replace } from 'connected-react-router';
import config from 'app.config';
import { persistor } from 'web/client/store';

import {
  GET_APP_CONFIG,
  fetchAppConfigIfNeeded
} from 'web/client/app/modules/app/sagas';
import {
  GET_SITES,
  SELECT_SITE,
  RESET_SITES,
  GET_SITE_TAX_RULE_DATA,
  selectSite,
  fetchSitesIfNeeded,
  setOrderConfigIfNeeded,
  setLoyaltyEnabled,
  getSiteTaxRuleData,
  fetchSiteTaxRuleDataIfNeeded
} from 'web/client/app/modules/site/sagas';
import { GET_CONCEPT, setConceptOptions, fetchConceptsIfNeeded } from 'web/client/app/modules/concept/sagas';
import { GET_MENU, GET_ITEMS, fetchMenuIfNeeded, fetchCategoryItemsIfNeeded } from 'web/client/app/modules/menu/sagas';
import {
  GET_CART_READY_TIME,
  MODIFY_CART_ITEM,
  CHECK_MODIFY_ORDER,
  TOGGLE_CART,
  fetchCartReadyTimesForOpenCart,
  fetchCartReadyTimesForClosingOrder,
  completeOrder,
  addItemToOrder,
  removeItemFromOrder,
  fetchCartReadyTimeSaga } from 'web/client/app/modules/cart/sagas';
import { MAKE_CHARGE, MAKE_CHARGE_SUCCEEDED, setStripeToken } from 'web/client/app/modules/stripepay/sagas';
import {
  FETCHING_API_TOKEN,
  AUTO_FETCHING_API_TOKEN,
  SET_TOKENIZED_DATA,
  SALE_TRANSACTION_SUCCEEDED,
  SALE_CHECKOUT_SUCCEEDED,
  fetchApiToken,
  autoFetchApiToken,
  FETCH_ETF_DATA,
  setTokenizedToken,
  saleTransactionInititate} from 'web/client/app/modules/iFrame/sagas';
import {
  SEND_RECEIPT_EMAIL,
  SEND_SMS_RECEIPT_SUCCESSFUL,
  SEND_EMAIL_RECEIPT_SUCCESSFUL,
  GET_PRINT_DATA,
  SEND_CUSTOMER_EMAIL,
  fetchAndSendReceipt,
  fetchAndSendCustomerReceipt,
  fetchReceiptForPrint,
  SEND_RECEIPT_SMS,
  fetchAndSendSMSReceipt
} from 'web/client/app/modules/communication/sagas';

import {fetchAndProcessMultiPayments,
  setProcessMultiPaymentOrder,
  removeAllSplitPaymentsAsync, processMultiPayment,
  PROCESS_MULTIPAYMENTS,
  REMOVE_ALL_SPLIT_PAYMENTS } from 'web/client/app/modules/payOptions/sagas';
import { GET_ITEM, fetchItemIfNeeded } from 'web/client/app/modules/itemdetails/sagas';
import { SET_TIMEOUT_FLAG } from 'web/client/app/modules/error/sagas';
import {
  LOAD_LOYALTY_PAGE,
  GET_LOYALTY,
  SEND_LOYALTY_INQUIRY,
  SEND_LOYALTY_INFO,
  PROCESS_LOYALTY_ACCRUE,
  CANCEL_LOYALTY_INFO,
  GET_LOYALTY_INQUIRY,
  sendLoyaltyRewardsInfo,
  getLoyaltyInquiryId,
  getLoyaltyAccrue,
  showLoyaltyPage,
  getLoyaltyInquiryIfNeeded,
  clearLoyaltyError,
  LOYALTY_INFO_FAILED,
  LOYALTY_INQUIRY_FAILED,
  getLoyaltyPaymentList,
  removeLoyaltyPayments,
  LOYALTY_INFO_MODIFIED
} from 'web/client/app/modules/loyalty/sagas';
import { throttlingCapacityCheck, ACCEPT_CAPACITY_TIME,
  setMultipaymentData } from 'web/client/app/modules/scheduleorder/sagas';
import { paymentTypes } from 'web/client/app/utils/constants';
import { FETCH_ROOM_CHARGE,
  PROCESS_ROOM_CHARGE,
  ROOM_CHARGE_INQUIRY_FAILURE,
  ROOM_CHARGE_INQUIRY_SUCCESS,
  fetchRoomChargeIfNeeded,
  processRoomChargeAsync,
  fetchRoomChargeBySiteId,
  checkRoomInquiryCount,
  checkRoomChargeTimerIfNeeded,
  captureRoomChargePaymentAndCloseOrderAsync
}
  from 'web/client/app/modules/roomCharge/sagas';

import {
  FETCH_MEMBER_CHARGE,
  PROCESS_MEMBER_CHARGE,
  MEMBER_CHARGE_INQUIRY_SUCCESS,
  MEMBER_CHARGE_INQUIRY_FAILURE,
  processMemberChargeAsync,
  captureMemberChargePaymentAndCloseOrderAsync,
  fetchMemberChargeIfNeeded,
  fetchMemberChargeBySiteId,
  checkMemberInquiryCount,
  checkMemberChargeTimerIfNeeded
}
  from 'web/client/app/modules/memberCharge/sagas';

import {
  GET_GA_ACCOUNT_INFO,
  getGAAccountInfoAsync,
  GET_GA_ACCOUNT_INQUIRY_INFO,
  SELECTED_ACCOUNT,
  getGAAccountInquiryInfoAsync,
  getGAAccountInfoInquiryAsync,
  authorizeGAPaymentAsync,
  AUTHORIZE_GA_PAYMENT,
  AUTHORIZE_GA_PAYMENT_SUCCESS,
  AUTHORIZE_GA_SPLIT_PAYMENT,
  authorizeGaSplitPaymentAsync,
  REMOVE_GA_SPLIT_PAYMENT,
  removeGAPaymentFromOrderAsync
} from 'web/client/app/modules/gaPayment/sagas';

import {
  SET_USER_DATA,
  GET_USER_DATA,
  GET_ATRIUM_USER_DATA,
  sendUserAuthInfo,
  authAtriumUserInfoAsync,
  FETCH_USER_INFO,
  DELETE_SAVED_CARD,
  deleteUserSavedCard,
  SAVE_CARD_INFO,
  saveUserCardInfo,
  DECRYPT_SAML_COOKIE,
  decryptHapiSamlCookieAsync,
  SAML_LOGOUT,
  samlLogoutAsync,
  fetchAtriumUserInfo,
  fetchUserProfileInfo
} from 'web/client/app/modules/guestProfile/sagas';

import {
  captureLoyaltyPointsSplitPaymentAsync,
  CAPTURE_LOYALTY_POINTS_SPLIT_PAYMENT,
  captureLoyaltyVoucherSplitPaymentAsync,
  CAPTURE_LOYALTY_VOUCHER_SPLIT_PAYMENT,
  captureLoyaltyHostCompVoucherSplitPaymentAsync,
  REMOVE_LOYALTY_PAYMENTS,
  removeLoyaltyPaymentsAsync,
  CAPTURE_LOYALTY_HOST_COMP_VOUCHER_SPLIT_PAYMENT,
  CAPTURE_LOYALTY_PAYMENT,
  REMOVE_AND_PROCESS_LOYALTY_VOUCHER_PAYMENTS,
  removeAndAddLoyaltyVoucherPaymentsAsync,
  checkLoyaltyInquiryCount,
  checkLoyaltyTimerIfNeeded
} from './loyalty/sagas';

import {
  ATRIUM_INQUIRY,
  fetchAtriumInquiryIfNeeded,
  updateAtriumAuthResponseAsync,
  authAtriumPaymentAsync,
  ATRIUM_REMOVE_PAYMENT,
  AUTH_ATRIUM_PAYMENT,
  PROCESS_ATRIUM_LASTPAYMENT,
  removeAtriumPaymentAsync
} from 'web/client/app/modules/atrium/sagas';
import { MODIFY_COMMUNAL_CART_ITEM,
  PROCESS_AND_UPDATE_COMMUNAL_CART,
  FETCHING_COMMUNAL_CART_BY_ORDER_GUID,
  REFRESH_COMMUNAL_CART,
  addItemToCommunalCart,
  removeItemFromCommunalCart,
  processAndUpdateCommunalCartAsync,
  fetchCommunalCartByOrderGuidAysnc } from 'web/client/app/modules/communalCart/sagas';

import {
  GET_PLATFORM_PROFILE,
  getPlatformProfileAsync,
  CREATE_PLATFORM_PROFILE,
  UPDATE_PLATFORM_PROFILE_PHONE_NUMBER,
  UPDATE_PLATFORM_PROFILE_EMAIL,
  UPDATE_PLATFORM_PROFILE_GUEST_NAME,
  UPDATE_PLATFORM_PROFILE_GA,
  UPDATE_PLATFORM_PROFILE_CC,
  createPlatformProfileAsync,
  updatePlatformProfilePhoneNumber,
  updatePlatformProfileEmail,
  updatePlatformProfilePhoneNumberAsync,
  updatePlatformProfileEmailAsync,
  updatePlatformProfileGuestNameAsync,
  updatePlatformProfileGAAsync,
  updatePlatformProfileCCAsync,
  resetPlatformProfile
} from 'web/client/app/modules/platformGuestProfile/sagas';

const logger = config.logger.child({ childName: 'sagas' });

const getTenantId = (store) => store.app.config.tenantId;
const getMultiPaymentFlag = (store) => store.sites.orderConfig && store.sites.orderConfig.multiPaymentEnabled;
const getSelectedSiteId = (store) => store.sites.selectedId;
const getSelectedDisplayProfileId = (store) => store.sites.displayProfileId;
const getCurrentMenu = (store) => store.menu.current;
const getSelectedConceptId = (store) => store.concept.conceptId;
const getSelectedConcept = (conceptId) => (store) => store.concept.list.filter(concept => concept.id === conceptId)[0]; // eslint-disable-line max-len
const getLoyaltyEnabled = (siteId, displayProfileId) => (store) => store.sites.list.find(site => site.id === siteId && site.displayProfileId === displayProfileId && site.isLoyaltyEnabled); // eslint-disable-line max-len
const getPaymentType = (store) => store.scheduleorder.paymentType;
const checkModifyOrder = (store) => store.cart.modifyOrder || store.tip.modifyOrder;
const getMultiPaymentData = (store) => store.scheduleorder.multiPaymentData;
const storeToken = (store) => store.payments.tokenizedData;
const getStripeChargeData = (store) => store.stripepayments.stripeChargeData;
const getSCheduleOrderCompletionTime = (store) => store.scheduleorder.scheduledOrderCompletionTime;
const getRoomChargeAccountInfo = (store) => store.roomCharge.roomChargeAccountInfo;
const getMemberChargeAccountInfo = (store) => store.memberCharge.memberChargeAccountInfo;
const getDigitalMenuId = (store) => store.app.digitalMenuId;
const getRemoveAllPaymentStatus = (store) => store.paymentOptions.removingAllPayments;
const shouldOptInProfileFlag = (store) => store.platformGuestProfile.shouldOptIn;

/* HELPERS */
function * _fetchSites () {
  yield call(fetchAppConfigIfNeeded);
  yield call(fetchSitesIfNeeded);
  const digitalMenuId = yield select(getDigitalMenuId);
  if (!digitalMenuId) {
    yield call(setOrderConfigIfNeeded);
    yield call(checkRoomChargeTimerIfNeeded);
    yield call(checkMemberChargeTimerIfNeeded);
    yield call(checkLoyaltyTimerIfNeeded);
  }

}

function * _fetchConcepts (siteId, displayProfileId, withRedirect = true) {
  yield _fetchSites();
  const selectedSiteID = yield select(getSelectedSiteId);
  const selectedDisplayProfileId = yield select(getSelectedDisplayProfileId);
  if (selectedSiteID < 0 || selectedDisplayProfileId < 0) {
    yield put(selectSite(siteId, displayProfileId, withRedirect));
  }
  yield call(fetchConceptsIfNeeded);
  yield put(getSiteTaxRuleData(siteId, displayProfileId));
}

function * _fetchMenu (siteId, displayProfileId, conceptId, withRedirect = true) {
  const selectedConceptId = yield select(getSelectedConceptId);
  if (selectedConceptId < 0) {
    yield _fetchConcepts(siteId, displayProfileId, false);
  }
  const concept = yield select(getSelectedConcept(conceptId));
  yield put(setConceptOptions(concept.conceptOptions, conceptId, concept.igposApiConfiguration));
  yield call(fetchMenuIfNeeded, conceptId);
  const menu = yield select(getCurrentMenu);
  const category = menu && menu.categories && menu.categories.length === 1 ? menu.categories[0] : undefined;
  if (category && category.itemsLoaded && withRedirect) {
    yield put(replace(`/menu/${siteId}/${displayProfileId}/${conceptId}/${menu.categories[0].id}`));
  }
}

function * _fetchCategoryItems (siteId, displayProfileId, conceptId, categoryId) {
  const currentMenu = yield select(getCurrentMenu);
  if (!currentMenu.categories) {
    yield _fetchMenu(siteId, displayProfileId, conceptId, false);
  }
  yield call(fetchCategoryItemsIfNeeded, conceptId, categoryId);
  yield put(push(`/menu/${siteId}/${displayProfileId}/${conceptId}/${categoryId}`));
}

/* APP FLOW */
function * AppSaga () {
  yield takeLatest(GET_APP_CONFIG, fetchAppConfigIfNeeded);
}

function * SitesSaga () {
  yield takeLatest([GET_SITES, RESET_SITES], function * (action) {
    yield _fetchSites();
    yield put(resetPlatformProfile());
  });
}

function * SiteSelectSaga () {
  yield takeLatest(SELECT_SITE, function * (action) {
    if (action.withRedirect) {
      yield put(push(`/concepts/${action.siteId}/${action.displayProfileId}`));
      const digitalMenuId = yield select(getDigitalMenuId);
      if (!digitalMenuId) {
        yield put(fetchRoomChargeBySiteId(action.siteId, action.displayProfileId));
        yield put(fetchMemberChargeBySiteId(action.siteId, action.displayProfileId));
      }
    }
  });
}

function * FetchRoomChargeSaga () {
  yield takeLatest(FETCH_ROOM_CHARGE, function * (action) {
    yield call(fetchRoomChargeIfNeeded, action.siteId, action.displayProfileId);
  });
}

function * FetchMemberChargeSaga () {
  yield takeLatest(FETCH_MEMBER_CHARGE, function * (action) {
    yield call(fetchMemberChargeIfNeeded, action.siteId, action.displayProfileId);
  });
}

function * ConceptSaga () {
  yield takeLatest(GET_CONCEPT, function * (action) {
    yield _fetchConcepts(action.siteId, action.displayProfileId);
  });
}

function * MenuSaga () {
  yield takeLatest(GET_MENU, function * (action) {
    yield _fetchMenu(action.siteId, action.displayProfileId, action.menuId);
  });
}

function * CategorySaga () {
  yield takeLatest(GET_ITEMS, function * (action) {
    yield _fetchCategoryItems(action.siteId, action.displayProfileId, action.menuId, action.categoryId);
  });
}

function * CartReadyTimeSaga () {
  const cartReadyChannel = yield actionChannel(GET_CART_READY_TIME, buffers.expanding(10));
  while (true) {
    const { payload } = yield take(cartReadyChannel);
    yield call(fetchCartReadyTimeSaga, payload);
  }
}

function * ModifyCartItemSaga () {
  const cartChannel = yield actionChannel(MODIFY_CART_ITEM, buffers.expanding(10));
  let isDefault = true;
  while (true) {
    const payload = yield take(cartChannel);
    switch (payload.action) {
      case 'ADD':
        isDefault = false;
        yield call(addItemToOrder, payload.item);
        break;
      case 'REMOVE':
        isDefault = false;
        yield call(removeItemFromOrder, payload.item);
        yield call(fetchCartReadyTimesForOpenCart);
        break;
      default:
        if (!isDefault) { // the queue is empty
          logger.warn('ON MODIFYCART SAGA EMPTY');
        }
        logger.warn('modify default...');
        break;
    }
  }
}

function * LoyaltyInquiryFailedMessageSaga () {
  yield takeLatest([LOYALTY_INFO_FAILED, LOYALTY_INQUIRY_FAILED], function * (action) {
    yield call(delay, 5000);
    yield put(clearLoyaltyError());
  });
}

function * RemoveAndCaptureLoyaltyVoucherPaymentsSaga () {
  yield takeLatest(REMOVE_AND_PROCESS_LOYALTY_VOUCHER_PAYMENTS, function * (action) {
    yield call(removeAndAddLoyaltyVoucherPaymentsAsync, action.voidPayments, action.capturePayments, action.amountCharged, action.isAmountModified, action.isLastPayment); // eslint-disable-line max-len
  });
}

function * CartSaga () {
  yield takeLatest(TOGGLE_CART, fetchCartReadyTimesForOpenCart);
}

function * ETFSaga () {
  yield takeLatest(FETCH_ETF_DATA, fetchCartReadyTimesForClosingOrder);
}

function * IFrameSaga () {
  yield takeLatest(SALE_TRANSACTION_SUCCEEDED, completeOrder);
}

function * StripePaySaga () {
  yield takeLatest(MAKE_CHARGE_SUCCEEDED, completeOrder);
}

function * StripeTokenSaga () {
  yield takeLatest(MAKE_CHARGE, function * (action) {
    const multiPaymentEnabled = yield select(getMultiPaymentFlag);
    if (!multiPaymentEnabled) {
      yield call(throttlingCapacityCheck, paymentTypes.STRIPE);
    }
  });
}

function * GAPaySaga () {
  yield takeLatest(AUTHORIZE_GA_PAYMENT_SUCCESS, completeOrder);
}

function * IFrameTokenSaga () {
  yield takeLatest(FETCHING_API_TOKEN, function * (action) {
    const tenantId = yield select(getTenantId);
    if (!tenantId) {
      yield call(fetchAppConfigIfNeeded);
    }
    yield call(fetchApiToken);
  });
}

function * IFrameAutoTokenSaga () {
  yield takeLatest(AUTO_FETCHING_API_TOKEN, function * (action) {
    const tenantId = yield select(getTenantId);
    if (!tenantId) {
      yield call(fetchAppConfigIfNeeded);
    }
    yield call(autoFetchApiToken);
  });
}

function * IframeTokenizedSaga () {
  yield takeLatest(SET_TOKENIZED_DATA, function * (action) {
    const multiPaymentEnabled = yield select(getMultiPaymentFlag);
    if (!multiPaymentEnabled) {
      yield call(throttlingCapacityCheck, paymentTypes.IFRAME);
    }
  });
}

function * MultiPaymentSaga () {
  yield takeLatest(PROCESS_MULTIPAYMENTS, function * (action) {
    const chargeData = yield select(getStripeChargeData);
    const sToken = yield select(storeToken);
    const roomChargeAccountInfo = yield select(getRoomChargeAccountInfo);
    const memberChargeAccountInfo = yield select(getMemberChargeAccountInfo);
    if (sToken || chargeData || roomChargeAccountInfo || memberChargeAccountInfo) {
      yield call(throttlingCapacityCheck, paymentTypes.MULTIPAYMENT);
    } else {
      const multiPaymentData = yield select(getMultiPaymentData);
      const isCapacitySuggested = multiPaymentData && multiPaymentData.isCapacitySuggested;
      const scheduledOrderCompletionTime = (multiPaymentData && multiPaymentData.scheduledOrderCompletionTime) || (yield select(getSCheduleOrderCompletionTime)); // eslint-disable-line max-len
      yield call(fetchAndProcessMultiPayments, scheduledOrderCompletionTime, isCapacitySuggested);
    }
  });
}

function * AcceptCapacityTimeSaga () {
  yield takeLatest(ACCEPT_CAPACITY_TIME, function * (action) {
    const selectPaymentType = yield select(getPaymentType);
    switch (selectPaymentType) {
      case paymentTypes.IFRAME:
        yield put(saleTransactionInititate());
        yield call(setTokenizedToken, action.scheduledOrderCompletionTime);
        break;
      case paymentTypes.STRIPE:
        yield call(setStripeToken, action.scheduledOrderCompletionTime);
        break;
      case paymentTypes.GA:
        yield call(authorizeGAPaymentAsync, action.scheduledOrderCompletionTime);
        break;
      case paymentTypes.MULTIPAYMENT:
        yield put(setProcessMultiPaymentOrder());
        yield call(fetchAndProcessMultiPayments, action.scheduledOrderCompletionTime);
        break;
        // TODO: add for LOYALTY payments
      case paymentTypes.GA_LASTMULTIPAYMENT:
        let multiPaymentData = yield select(getMultiPaymentData);
        let { account, amount, isAmountModified } = multiPaymentData;
        multiPaymentData.scheduledOrderCompletionTime = action.scheduledOrderCompletionTime;
        yield put(setMultipaymentData(multiPaymentData));
        yield call(authorizeGaSplitPaymentAsync, account, amount, isAmountModified);
        break;
      case paymentTypes.ROOM_CHARGE:
        yield call(captureRoomChargePaymentAndCloseOrderAsync, action.scheduledOrderCompletionTime);
        break;
      case paymentTypes.MEMBER_CHARGE:
        yield call(captureMemberChargePaymentAndCloseOrderAsync, action.scheduledOrderCompletionTime);
        break;
      case paymentTypes.ATRIUM_LASTPAYMENT:
        multiPaymentData = yield select(getMultiPaymentData);
        account = multiPaymentData.account;
        multiPaymentData.scheduledOrderCompletionTime = action.scheduledOrderCompletionTime;
        yield put(setMultipaymentData(multiPaymentData));
        yield call(updateAtriumAuthResponseAsync, account, multiPaymentData.completePayment);
        break;
    }
  });
}

function * CheckoutWithoutPaySuccessSaga () {
  yield takeLatest(SALE_CHECKOUT_SUCCEEDED, completeOrder);
}

function * SendEmailCommunicationSaga () {
  yield takeLatest(SEND_RECEIPT_EMAIL, fetchAndSendReceipt);
}

function * SendLoyaltyInquirySaga () {
  let loyaltyInquiryTask = null;

  yield takeLatest([SEND_LOYALTY_INQUIRY, CANCEL_LOYALTY_INFO], function * (action) {
    if (action.type === CANCEL_LOYALTY_INFO && loyaltyInquiryTask) {
      yield cancel(loyaltyInquiryTask);
      loyaltyInquiryTask = null;
      return;
    }
    loyaltyInquiryTask = yield fork(getLoyaltyInquiryId, action.siteId, action.clearLoyaltyAccount);
  });
}

function * getLoyaltyInquirySaga () {
  yield takeLatest(GET_LOYALTY_INQUIRY, function * (action) {
    yield call(getLoyaltyInquiryIfNeeded);
  });
}

function * clearMultiPayment () {
  yield takeLatest(CHECK_MODIFY_ORDER, function * (action) {
    const modifyOrder = yield select(checkModifyOrder);
    const removePaymentStatus = yield select(getRemoveAllPaymentStatus);
    if (modifyOrder && !removePaymentStatus) {
      yield call(removeAllSplitPaymentsAsync);
    }
  });
}

function * clearAllMultiPayment () {
  yield takeLatest(REMOVE_ALL_SPLIT_PAYMENTS, function * (action) {
    yield call(removeAllSplitPaymentsAsync, action.cartItem, action.actionType);
  });
}

function * loyaltyInfoModifiedSaga () {
  yield takeLatest(LOYALTY_INFO_MODIFIED, function * (action) {
    const loyaltyPayments = yield call(getLoyaltyPaymentList);
    if (loyaltyPayments.length > 0) {
      yield put(removeLoyaltyPayments(loyaltyPayments, true));
    }
  });
}

function * SendLoyaltyInfoSaga () {
  let loyaltyAccountTask = null;
  yield takeLatest([SEND_LOYALTY_INFO, CANCEL_LOYALTY_INFO], function * (action) {
    if (action.type === CANCEL_LOYALTY_INFO && loyaltyAccountTask) {
      yield cancel(loyaltyAccountTask);
      loyaltyAccountTask = null;
      return;
    }
    loyaltyAccountTask = yield fork(sendLoyaltyRewardsInfo, action.siteId, action.displayProfileId, action.isDelayAccount); // eslint-disable-line max-len
  });
}

function * getLoyaltyAccrueSaga () {
  yield takeLatest(PROCESS_LOYALTY_ACCRUE, function * (action) {
    yield call(getLoyaltyAccrue, action.loyaltyAccrueInfo);
  });
}

function * PrintPreviewCommunicationSaga () {
  yield takeLatest(GET_PRINT_DATA, fetchReceiptForPrint);
}

function * sendCustomerEmailSaga () {
  yield takeLatest(SEND_CUSTOMER_EMAIL, fetchAndSendCustomerReceipt);
}

function * SendSMSCommunicationSaga () {
  yield takeLatest(SEND_RECEIPT_SMS, fetchAndSendSMSReceipt);
}

function * ItemSelectSaga () {
  yield takeLatest(GET_ITEM, function * (action) {
    const menu = yield select(getCurrentMenu);
    if (!menu.categories) {
      yield _fetchMenu(action.siteId, action.conceptId, false);
    }
    yield fetchItemIfNeeded(action.itemId);
  });
}

function * SessionEndedSaga () {
  yield takeLatest(SET_TIMEOUT_FLAG, function * (action) {
    const digitalMenuId = yield select(getDigitalMenuId);
    if (!digitalMenuId) {
      persistor.pause();
      persistor.purge(action.flag);
    }
  });
}

function * loadloyaltySaga () {
  yield takeLatest(LOAD_LOYALTY_PAGE, function * (action) {
    if (action.isLoyaltyEnabled) {
      yield put(setLoyaltyEnabled(true));
      yield put(selectSite(action.siteId, action.displayProfileId, false));
      yield put(showLoyaltyPage(true));
    } else {
      yield put(setLoyaltyEnabled(false));
      yield put(showLoyaltyPage(false));
    }
  });
}

function * loyaltySaga () {
  yield takeLatest(GET_LOYALTY, function * (action) {
    yield _fetchSites();
    const selectedSiteID = yield select(getSelectedSiteId);
    if (selectedSiteID < 0) {
      yield put(selectSite(action.siteId, false));
    }
    const isLoyaltyEnabled = yield select(getLoyaltyEnabled(action.siteId, action.displayProfileId));
    yield put(isLoyaltyEnabled ? setLoyaltyEnabled(true) : push(`/`));
  });
}

function * processRoomChargeSaga () {
  yield takeEvery(PROCESS_ROOM_CHARGE, processRoomChargeAsync);
}

function * processMemberChargeSaga () {
  yield takeEvery(PROCESS_MEMBER_CHARGE, processMemberChargeAsync);
}

function * getGAAccountInfoSaga () {
  yield takeEvery(GET_GA_ACCOUNT_INFO, getGAAccountInfoAsync);
}

function * checkRoomChargeInquiryCount () {
  yield takeEvery(ROOM_CHARGE_INQUIRY_FAILURE, checkRoomInquiryCount);
}

function * checkMemberChargeInquiryCount () {
  yield takeEvery(MEMBER_CHARGE_INQUIRY_FAILURE, checkMemberInquiryCount);
}

function * checkLoyaltyInquiryRetryCount () {
  yield takeEvery(LOYALTY_INFO_FAILED, checkLoyaltyInquiryCount);
}

function * getGAAccountInquiryInfoSaga () {
  yield takeEvery(GET_GA_ACCOUNT_INQUIRY_INFO, getGAAccountInquiryInfoAsync);
}

function * getGAAccountInfoInquirySaga () {
  yield takeEvery(SELECTED_ACCOUNT, function * (action) {
    if (!action.account.remainingBalance) {
      yield call(getGAAccountInfoInquiryAsync);
    }
  });
}

function * authorizeGAPaymentSaga () {
  yield takeEvery(AUTHORIZE_GA_PAYMENT, function * (action) {
    const multiPaymentEnabled = yield select(getMultiPaymentFlag);
    if (!multiPaymentEnabled) {
      yield call(throttlingCapacityCheck, paymentTypes.GA);
    }
  });
}

function * authorizeGaSplitPaymentSaga () {
  yield takeEvery(AUTHORIZE_GA_SPLIT_PAYMENT, function * (action) {
    if (action.isLastPayment) {
      const multiPaymentData = {
        account: action.account,
        amount: action.amount,
        isAmountModified: action.isAmountModified
      };
      yield call(throttlingCapacityCheck, paymentTypes.GA_LASTMULTIPAYMENT, multiPaymentData);
    } else {
      yield call(authorizeGaSplitPaymentAsync, action.account, action.amount, action.isAmountModified);
    }
  });
}

function * captureLoyaltyPaymentSaga () {
  yield takeEvery(CAPTURE_LOYALTY_PAYMENT, function * (action) {
    // TODO: rename this, this isn't a multipayment flow
    const multiPaymentData = {
      loyaltyPaymentInfo: action.loyaltyTenderInfo,
      loyaltyPaymentType: action.loyaltyPaymentType
    };
    yield call(throttlingCapacityCheck, paymentTypes.LOYALTY, multiPaymentData);
  });
}

function * processSplitLoyaltyHostCompVoucherPaymentSaga () {
  yield takeEvery(CAPTURE_LOYALTY_HOST_COMP_VOUCHER_SPLIT_PAYMENT, function * (action) {
    if (action.isLastPayment) {
      const multiPaymentData = {
        voucher: action.voucher,
        amount: action.amount,
        isAmountModified: action.isAmountModified
      };
      yield call(throttlingCapacityCheck, paymentTypes.LOYALTY_HOSTCOMPVOUCHER_LASTMULTIPAYMENT, multiPaymentData);
    } else {
      yield call(captureLoyaltyHostCompVoucherSplitPaymentAsync, action.voucher,
        action.amount, action.isAmountModified);
    }
  });
}

function * processSplitLoyaltyVoucherPaymentSaga () {
  yield takeEvery(CAPTURE_LOYALTY_VOUCHER_SPLIT_PAYMENT, function * (action) {
    if (action.isLastPayment) {
      const multiPaymentData = {
        vouchers: action.vouchers,
        amount: action.amount,
        isAmountModified: action.isAmountModified
      };
      yield call(throttlingCapacityCheck, paymentTypes.LOYALTY_VOUCHER_LASTMULTIPAYMENT, multiPaymentData);
    } else {
      yield call(captureLoyaltyVoucherSplitPaymentAsync, action.vouchers, action.amount, action.isAmountModified);
    }
  });
}

function * processSplitLoyaltyPointsPaymentSaga () {
  yield takeEvery(CAPTURE_LOYALTY_POINTS_SPLIT_PAYMENT, function * (action) {
    if (action.isLastPayment) {
      const multiPaymentData = {
        account: action.account,
        amount: action.amount,
        isAmountModified: action.isAmountModified
      };
      yield call(throttlingCapacityCheck, paymentTypes.LOYALTY_POINTS_LASTMULTIPAYMENT, multiPaymentData);
    } else {
      yield call(captureLoyaltyPointsSplitPaymentAsync, action.account, action.amount, action.isAmountModified);
    }
  });
}

function * removeGaSplitPaymentSaga () {
  yield takeEvery(REMOVE_GA_SPLIT_PAYMENT, function * (action) {
    yield call(removeGAPaymentFromOrderAsync, action.selectedAccount);
  });
}

function * removeLoyaltyPaymentsSaga () {
  yield takeEvery(REMOVE_LOYALTY_PAYMENTS, function * (action) {
    yield call(removeLoyaltyPaymentsAsync, action.loyaltyPayments, undefined, false, action.removeAll);
  });
}

function * userProfileAuthSaga () {
  yield takeLatest([SET_USER_DATA, GET_USER_DATA], function * (action) {
    yield call(sendUserAuthInfo, action.accessToken);
  });
}

function * atriumUserProfileAuthSaga () {
  yield takeLatest(GET_ATRIUM_USER_DATA, function * (action) {
    yield call(fetchAtriumUserInfo, action.accessToken);
  });
}

function * userProfileInfoSaga () {
  yield takeLatest(FETCH_USER_INFO, function * (action) {
    if (action.loginMode === 'atrium') {
      yield call(authAtriumUserInfoAsync);
    } else {
      yield call(fetchUserProfileInfo);
    }
  });
}

function * saveUserProfileCard () {
  yield takeLatest(SAVE_CARD_INFO, function * (action) {
    yield call(saveUserCardInfo, action.cardInfo);
  });
}

function * deleteUserProfileCard () {
  yield takeLatest(DELETE_SAVED_CARD, function * (action) {
    yield call(deleteUserSavedCard, action.uniqueId);
  });
}

function * makeRoomChargePaymentSaga () {
  yield takeEvery(ROOM_CHARGE_INQUIRY_SUCCESS, function * (action) {
    const multiPaymentEnabled = yield select(getMultiPaymentFlag);
    if (!multiPaymentEnabled) {
      yield call(throttlingCapacityCheck, paymentTypes.ROOM_CHARGE);
    } else {
      yield put(processMultiPayment());
    }
  });
}

function * makeMemberChargePaymentSaga () {
  yield takeEvery(MEMBER_CHARGE_INQUIRY_SUCCESS, function * (action) {
    const multiPaymentEnabled = yield select(getMultiPaymentFlag);
    if (!multiPaymentEnabled) {
      yield call(throttlingCapacityCheck, paymentTypes.MEMBER_CHARGE);
    } else {
      yield put(processMultiPayment());
    }
  });
}

function * getSiteTaxDetailsSaga () {
  yield takeLatest(GET_SITE_TAX_RULE_DATA, function * (action) {
    yield call(fetchSiteTaxRuleDataIfNeeded, action.siteId, action.displayProfileId, action.showError);
  });
}

function * decryptSamlCookieSaga () {
  yield takeEvery(DECRYPT_SAML_COOKIE, decryptHapiSamlCookieAsync);
}

function * samlLogoutSaga () {
  yield takeEvery(SAML_LOGOUT, samlLogoutAsync);
}

function * getAtriumInquirySaga () {
  yield takeLatest(ATRIUM_INQUIRY, function * (action) {
    yield call(fetchAtriumInquiryIfNeeded, action.siteId);
  });
}

function * authAtriumPaymentSaga () {
  yield takeEvery(AUTH_ATRIUM_PAYMENT, function * (action) {
    if (action.isMealCountModified) {
      yield call(removeAtriumPaymentAsync, action.account);
    }
    yield call(authAtriumPaymentAsync, action.account, action.amountToCharge, action.isAutoDetect);
  });
}

function * processAtriumLastPaymentSaga () {
  yield takeEvery(PROCESS_ATRIUM_LASTPAYMENT, function * (action) {
    const multiPaymentData = {
      account: action.accountInfo,
      completePayment: action.completePayment
    };
    yield call(throttlingCapacityCheck, paymentTypes.ATRIUM_LASTPAYMENT, multiPaymentData);
  });
}

function * removeAtriumPaymentSaga () {
  yield takeLatest(ATRIUM_REMOVE_PAYMENT, function * (action) {
    yield call(removeAtriumPaymentAsync, action.atriumAccount);
  });
}

function * getPlatformProfileSaga () {
  yield takeLatest(GET_PLATFORM_PROFILE, function * (action) {
    yield fork(getPlatformProfileAsync, action.paymentType, action.number, action.platformGuestProfileConfig);
  });
}

function * createPlatformProfileSaga () {
  yield takeLatest(CREATE_PLATFORM_PROFILE, function * (action) {
    yield fork(createPlatformProfileAsync, action.paymentType, action.number, action.platformGuestProfileConfig);
  });
}

function * updatePlatformProfileGASaga () {
  yield takeLatest(UPDATE_PLATFORM_PROFILE_GA, function * (action) {
    yield fork(updatePlatformProfileGAAsync, action.gaAccountNumber, action.providerUuid);
  });
}

function * updatePlatformProfileCCSaga () {
  yield takeLatest(UPDATE_PLATFORM_PROFILE_CC, function * (action) {
    yield fork(updatePlatformProfileCCAsync, action.correlationId);
  });
}

function * updatePlatformProfilePhoneNumberSaga () {
  yield takeLatest(SEND_SMS_RECEIPT_SUCCESSFUL, function * (action) {
    let shouldOptIn = yield select(shouldOptInProfileFlag);
    if (shouldOptIn) {
      yield put(updatePlatformProfilePhoneNumber());
    }
  });
}

function * processUpdatePlatformProfilePhoneNumberSaga () {
  yield takeLatest(UPDATE_PLATFORM_PROFILE_PHONE_NUMBER, function * (action) {
    yield fork(updatePlatformProfilePhoneNumberAsync);
  });
}

function * updatePlatformProfileEmailSaga () {
  yield takeLatest(SEND_EMAIL_RECEIPT_SUCCESSFUL, function * (action) {
    let shouldOptIn = yield select(shouldOptInProfileFlag);
    if (shouldOptIn) {
      yield put(updatePlatformProfileEmail());
    }
  });
}

function * processUpdatePlatformProfileEmailSaga () {
  yield takeLatest(UPDATE_PLATFORM_PROFILE_EMAIL, function * (action) {
    yield fork(updatePlatformProfileEmailAsync);
  });
}

function * updatePlatformProfileGuestNameSaga () {
  yield takeLatest(UPDATE_PLATFORM_PROFILE_GUEST_NAME, function * (action) {
    yield call(updatePlatformProfileGuestNameAsync);
  });
}

function * modifyCommunalCartSaga () {
  const cartChannel = yield actionChannel(MODIFY_COMMUNAL_CART_ITEM, buffers.expanding(10));
  let isDefault = true;
  while (true) {
    const payload = yield take(cartChannel);
    switch (payload.action) {
      case 'ADD':
        isDefault = false;
        yield call(addItemToCommunalCart, payload.item);
        break;
      case 'REMOVE':
        isDefault = false;
        yield call(removeItemFromCommunalCart, payload.item);
        break;
      default:
        if (!isDefault) { // the queue is empty
          logger.warn('ON MODIFYCOMMUNALCART SAGA EMPTY');
        }
        logger.warn('modify default...');
        break;
    }
  }
}

function * processAndUpdateCommunalCartSaga () {
  yield takeLatest(PROCESS_AND_UPDATE_COMMUNAL_CART, function * (action) {
    yield call(processAndUpdateCommunalCartAsync, action.cartItems);
  });
}

function * fetchCommunalCartByOrderGuidSaga () {
  yield takeLatest([FETCHING_COMMUNAL_CART_BY_ORDER_GUID, REFRESH_COMMUNAL_CART], function * (action) {
    yield call(fetchCommunalCartByOrderGuidAysnc);
  });
}

export default [
  AppSaga,
  SitesSaga,
  SiteSelectSaga,
  ConceptSaga,
  MenuSaga,
  CategorySaga,
  ModifyCartItemSaga,
  CartReadyTimeSaga,
  CartSaga,
  ETFSaga,
  StripeTokenSaga,
  IFrameTokenSaga,
  IFrameAutoTokenSaga,
  IframeTokenizedSaga,
  MultiPaymentSaga,
  CheckoutWithoutPaySuccessSaga,
  IFrameSaga,
  StripePaySaga,
  ItemSelectSaga,
  SendEmailCommunicationSaga,
  PrintPreviewCommunicationSaga,
  sendCustomerEmailSaga,
  SendSMSCommunicationSaga,
  SessionEndedSaga,
  SendLoyaltyInfoSaga,
  loadloyaltySaga,
  loyaltySaga,
  getLoyaltyInquirySaga,
  getLoyaltyAccrueSaga,
  SendLoyaltyInquirySaga,
  getGAAccountInfoSaga,
  getGAAccountInquiryInfoSaga,
  getGAAccountInfoInquirySaga,
  authorizeGAPaymentSaga,
  GAPaySaga,
  AcceptCapacityTimeSaga,
  userProfileAuthSaga,
  userProfileInfoSaga,
  deleteUserProfileCard,
  saveUserProfileCard,
  clearMultiPayment,
  clearAllMultiPayment,
  authorizeGaSplitPaymentSaga,
  removeGaSplitPaymentSaga,
  FetchRoomChargeSaga,
  processRoomChargeSaga,
  checkRoomChargeInquiryCount,
  makeRoomChargePaymentSaga,
  FetchMemberChargeSaga,
  processMemberChargeSaga,
  makeMemberChargePaymentSaga,
  checkMemberChargeInquiryCount,
  processSplitLoyaltyPointsPaymentSaga,
  processSplitLoyaltyVoucherPaymentSaga,
  processSplitLoyaltyHostCompVoucherPaymentSaga,
  removeLoyaltyPaymentsSaga,
  captureLoyaltyPaymentSaga,
  getSiteTaxDetailsSaga,
  LoyaltyInquiryFailedMessageSaga,
  RemoveAndCaptureLoyaltyVoucherPaymentsSaga,
  checkLoyaltyInquiryRetryCount,
  decryptSamlCookieSaga,
  samlLogoutSaga,
  loyaltyInfoModifiedSaga,
  atriumUserProfileAuthSaga,
  getAtriumInquirySaga,
  authAtriumPaymentSaga,
  removeAtriumPaymentSaga,
  processAtriumLastPaymentSaga,
  getPlatformProfileSaga,
  createPlatformProfileSaga,
  updatePlatformProfilePhoneNumberSaga,
  processUpdatePlatformProfilePhoneNumberSaga,
  updatePlatformProfileEmailSaga,
  processUpdatePlatformProfileEmailSaga,
  updatePlatformProfileGuestNameSaga,
  updatePlatformProfileGASaga,
  updatePlatformProfileCCSaga,
  modifyCommunalCartSaga,
  processAndUpdateCommunalCartSaga,
  fetchCommunalCartByOrderGuidSaga
];
