// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { select, put, call } from 'redux-saga/effects';

import axios from 'axios';
import config from 'app.config';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const SET_USER_DATA = 'SET_USER_DATA';
export const GET_USER_DATA = 'GET_USER_DATA';
export const GET_ATRIUM_USER_DATA = 'GET_ATRIUM_USER_DATA';
export const SEND_USER_AUTH_DATA = 'SEND_USER_AUTH_DATA';
export const RESET_USER_DATA = 'RESET_USER_DATA';
export const CLOSE_LOGIN_POPUP = 'CLOSE_LOGIN_POPUP';
export const SHOW_LOGIN_POPUP = 'SHOW_LOGIN_POPUP';
export const OND_TOKEN_RECEIVED = 'OND_TOKEN_RECEIVED';
export const OND_TOKEN_FAILED = 'OND_TOKEN_FAILED';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const GET_PROFILE_SUCCESSFUL = 'GET_PROFILE_SUCCESSFUL';
export const GET_PROFILE_FAILED = 'GET_PROFILE_FAILED';
export const PROFILE_CONTINUE_PAYMENT = 'PROFILE_CONTINUE_PAYMENT';
export const PROFILE_CONTINUE_LOYALTY_PAYMENT = 'PROFILE_CONTINUE_LOYALTY_PAYMENT';
export const FETCH_USER_INFO = 'FETCH_USER_INFO';
export const FETCH_USER_INFO_SUCCESS = 'FETCH_USER_INFO_SUCCESS';
export const FETCH_USER_INFO_FAILED = 'FETCH_USER_INFO_FAILED';
export const SAVE_CARD_INFO = 'SAVE_CARD_INFO';
export const SAVE_CARD_INFO_SUCCESS = 'SAVE_CARD_INFO_SUCCESS';
export const SAVE_CARD_INFO_FAILED = 'SAVE_CARD_INFO_FAILED';
export const DELETE_SAVED_CARD = 'DELETE_SAVED_CARD';
export const DELETE_SAVED_CARD_SUCCESS = 'DELETE_SAVED_CARD_SUCCESS';
export const DELETE_SAVED_CARD_FAILED = 'DELETE_SAVED_CARD_FAILED';
export const USER_AUTH_FAILED = 'USER_AUTH_FAILED';
export const SHOW_SAVED_CARDS = 'SHOW_SAVED_CARDS';
export const SAVE_USER_PAGE = 'SAVE_USER_PAGE';
export const CLEAR_SAVED_USER_PAGE = 'CLEAR_SAVED_USER_PAGE';
export const DECRYPT_SAML_COOKIE = 'DECRYPT_SAML_COOKIE';
export const DECRYPT_SAML_COOKIE_SUCCESS = 'DECRYPT_SAML_COOKIE_SUCCESS';
export const DECRYPT_SAML_COOKIE_FAILED = 'DECRYPT_SAML_COOKIE_FAILED';
export const SAML_LOGOUT = 'SAML_LOGOUT';
export const SAML_LOGOUT_SUCCESS = 'SAML_LOGOUT_SUCCESS';
export const SAML_LOGOUT_FAILED = 'SAML_LOGOUT_FAILED';

const getProfileInfo = (store) => store.profile;
const getAuthConfig = (store) => store.app.config.siteAuth.config;
const getSamlCookie = (store) => store.profile.samlCookie;
const getSamlUserIdKey = (store) => store.app.config.siteAuth.config.samlUserIdKey;

export const setUserData = (data) => ({
  type: SET_USER_DATA,
  loginMode: data.loginMode,
  userId: data.userId,
  userName: data.userName,
  accessToken: data.accessToken
});

export const getUserData = () => ({
  type: GET_USER_DATA
});

export const getAtriumUserData = () => ({
  type: GET_ATRIUM_USER_DATA
});

export const resetUserData = () => ({
  type: RESET_USER_DATA
});

export const showLoginPopup = (flag = false) => ({
  type: SHOW_LOGIN_POPUP,
  hideGuestOption: flag
});

export const closeLoginPopup = () => ({
  type: CLOSE_LOGIN_POPUP
});

export const ondTokenReceived = (token) => ({
  type: OND_TOKEN_RECEIVED,
  token
});

export const ondTokenFailed = () => ({
  type: OND_TOKEN_FAILED
});

export const setAppError = (error, key, sessionExpired) => ({
  type: SET_APP_ERROR,
  error,
  key,
  sessionExpired
});

export const continueWithPay = () => ({
  type: PROFILE_CONTINUE_PAYMENT
});

export const continueWithLoyaltyCheckout = () => ({
  type: PROFILE_CONTINUE_LOYALTY_PAYMENT
});

export const sendUserAuthData = () => ({
  type: SEND_USER_AUTH_DATA
});

export const fetchUserInfo = (loginMode) => ({
  type: FETCH_USER_INFO,
  loginMode
});

export const showSavedCardsPopup = (flag) => ({
  type: SHOW_SAVED_CARDS,
  flag
});
export const saveCardInfo = (cardInfo) => ({
  type: SAVE_CARD_INFO,
  cardInfo
});
export const savedCardInfoSuccess = (cardInfo) => ({
  type: SAVE_CARD_INFO_SUCCESS,
  cardInfo
});

export const savedCardInfoFailed = (uniqueId) => ({
  type: SAVE_CARD_INFO_FAILED,
  uniqueId
});

export const deleteSavedCard = (uniqueId) => ({
  type: DELETE_SAVED_CARD,
  uniqueId
});

export const deleteSavedCardSuccess = (uniqueId) => ({
  type: DELETE_SAVED_CARD_SUCCESS,
  uniqueId
});

export const deleteSavedCardFailed = () => ({
  type: DELETE_SAVED_CARD_FAILED
});

export const saveUserPage = (lastUserPage) => ({
  type: SAVE_USER_PAGE,
  lastUserPage: lastUserPage
});

export const clearSavedUserPage = () => ({
  type: CLEAR_SAVED_USER_PAGE
});

export const fetchUserSuccess = (ondToken, userInfo, loginMode) => ({
  type: FETCH_USER_INFO_SUCCESS,
  userName: userInfo.name,
  userId: userInfo.userId,
  cardInfo: userInfo.cardInfo || [],
  ondToken: ondToken,
  loginMode
});

export const fetchUserInfoFailed = () => ({
  type: FETCH_USER_INFO_FAILED
});
export const setUserAuthFailed = () => ({
  type: USER_AUTH_FAILED
});

export const decryptSamlCookie = (samlCookie) => ({
  type: DECRYPT_SAML_COOKIE,
  samlCookie
});

export const decryptSamlCookieSuccess = (decryptedSamlCookie, samlUserIdKey) => ({
  type: DECRYPT_SAML_COOKIE_SUCCESS,
  decryptedSamlCookie,
  samlUserIdKey
});

export const decryptSamlCookieFailed = (error) => ({
  type: DECRYPT_SAML_COOKIE_FAILED,
  decryptSamlCookieError: error
});

export const samlLogout = () => ({
  type: SAML_LOGOUT
});

export const samlLogoutSuccess = () => ({
  type: SAML_LOGOUT_SUCCESS
});

export const samlLogoutFailed = (error) => ({
  type: SAML_LOGOUT_FAILED,
  error
});

export const getUserAuthInfo = (obj) => axios.post(`${config.webPaths.api}userProfile/login`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const authAtriumUserInfo = (obj) => axios.post(`${config.webPaths.api}userProfile/atriumLogin`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const getUserProfile = (obj) => axios.post(`${config.webPaths.api}userProfile/getUserProfile`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

const getAtriumUserProfile = (obj) => axios.post(`${config.webPaths.api}userProfile/getAtriumUserProfile`, obj)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const saveUserNewCCCard = (payload) => axios.post(`${config.webPaths.api}userProfile/saveNewCCCard`, payload) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const deleteUserProfileSavedCard = (payload) => axios.post(`${config.webPaths.api}userProfile/deleteSavedCard`, payload) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const decryptHapiSamlCookie = (payload) => axios.post(`${config.webPaths.api}userProfile/decryptSamlCookie`, payload) // eslint-disable-line max-len
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export const samlLogoutRequest = () => axios.get(`${config.webPaths.api}userProfile/samlLogout`)
  .then(response => {
    return response.data;
  })
  .catch(err => {
    throw err;
  });

export function * samlLogoutAsync () {
  try {
    cookies.remove('hapi-corpsso-cookie', { path: '/' });
    yield put(samlLogoutSuccess());
  } catch (ex) {
    yield put(samlLogoutFailed(ex));
  }
}

export function * decryptHapiSamlCookieAsync () {
  const samlCookie = yield select(getSamlCookie);
  const samlUserIdKey = yield select(getSamlUserIdKey) || 'campusId';

  const payload = {
    samlCookie
  };

  try {
    const decryptCookieResponse = yield call(decryptHapiSamlCookie, payload);
    yield put(decryptSamlCookieSuccess(decryptCookieResponse, samlUserIdKey));
  } catch (ex) {
    yield put(decryptSamlCookieFailed(ex));
  }
}

export function * sendUserAuthInfo (accessToken) {
  const userInfo = yield select(getProfileInfo);
  const authConfig = yield select(getAuthConfig);
  const socialLoginConfig = authConfig.loginMethods.find(loginMethod => loginMethod.type === userInfo.loginMode);
  try {
    const paramsObj = (userInfo.ondToken !== undefined)
      ? { ond_token: userInfo.ondToken }
      : {
        app_id: socialLoginConfig.appId,
        client_secret: socialLoginConfig.clientId,
        userName: userInfo.userName,
        user_id: userInfo.userId,
        tokenType: userInfo.loginMode,
        token: accessToken
      };

    try {
      const userAuthResponse = yield call(getUserAuthInfo, paramsObj);
      if (userAuthResponse.status === 'Success') {
        yield put(fetchUserSuccess(userAuthResponse.ond_token, userAuthResponse.userInfo, userInfo.loginMode));
      } else {
        yield put(resetUserData());
      }
    } catch (ex) {
      yield put(setUserAuthFailed());
      yield put(setAppError(new Error('Login failed \n Please try again'), 'ERROR_USER_LOGIN_ERROR')); // eslint-disable-line max-len
    }
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message;
    if (errorMessage && errorMessage === 'OND_TOKEN_FAILED') {
      yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', true)); // eslint-disable-line max-len
      return;
    }
    yield put(setAppError(new Error('Login failed \n Please try again'), 'ERROR_USER_LOGIN_ERROR')); // eslint-disable-line max-len
  }
}

export function * fetchUserProfileInfo () {
  const userInfo = yield select(getProfileInfo);
  try {
    const userProfileInfo = yield call(getUserProfile, { ond_token: userInfo.ondToken });
    yield put(fetchUserSuccess(userInfo.ondToken, userProfileInfo, userInfo.loginMode));
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message;
    if (errorMessage && errorMessage === 'OND_TOKEN_FAILED') {
      yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', true)); // eslint-disable-line max-len
      return;
    }
    yield put(fetchUserInfoFailed());
  }
}

export function * saveUserCardInfo (cardInfo) {
  const userInfo = yield select(getProfileInfo);
  const payload = {
    ond_token: userInfo.ondToken,
    userName: userInfo.userName,
    cardInfo
  };
  try {
    const saveCardResponse = yield call(saveUserNewCCCard, payload);
    yield put(savedCardInfoSuccess(saveCardResponse.cardInfo));
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message;
    if (errorMessage && errorMessage === 'OND_TOKEN_FAILED') {
      yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', true)); // eslint-disable-line max-len
      return;
    }
    yield put(setAppError(new Error('Failed to save card details. \n Please try again'), 'ERROR_USER_SAVE_CARD')); // eslint-disable-line max-len
  }
}

export function * deleteUserSavedCard (uniqueId) {
  const userInfo = yield select(getProfileInfo);
  const payload = {
    ond_token: userInfo.ondToken,
    uniqueId
  };
  try {
    yield call(deleteUserProfileSavedCard, payload);
    yield put(deleteSavedCardSuccess(uniqueId));
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message;
    if (errorMessage && errorMessage === 'OND_TOKEN_FAILED') {
      yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', true)); // eslint-disable-line max-len
      return;
    }
    yield put(deleteSavedCardFailed());
  }
}

export function * fetchAtriumUserInfo () {
  const userInfo = yield select(getProfileInfo);
  try {
    const userProfileInfo = yield call(getAtriumUserProfile, { ond_token: userInfo.ondToken });
    yield put(fetchUserSuccess(userInfo.ondToken, userProfileInfo, userInfo.loginMode));
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message;
    if (errorMessage && errorMessage === 'OND_TOKEN_FAILED') {
      yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', true)); // eslint-disable-line max-len
      return;
    }
    yield put(fetchUserInfoFailed());
  }
}

export function * authAtriumUserInfoAsync (accessToken) {
  const userInfo = yield select(getProfileInfo);
  const authConfig = yield select(getAuthConfig);
  const atriumLoginConfig = authConfig.loginMethods.find(loginMethod => loginMethod.type === userInfo.loginMode);
  try {
    const paramsObj = (userInfo.ondToken !== undefined)
      ? { ond_token: userInfo.ondToken }
      : {
        app_id: atriumLoginConfig.appId,
        client_secret: atriumLoginConfig.clientId,
        userName: userInfo.userName,
        user_id: userInfo.userId,
        tokenType: userInfo.loginMode,
        token: accessToken
      };

    try {
      const userAuthResponse = yield call(authAtriumUserInfo, paramsObj);
      if (userAuthResponse.status === 'Success') {
        yield put(fetchUserSuccess(userAuthResponse.ond_token, userAuthResponse.userInfo, userInfo.loginMode));
      } else {
        yield put(resetUserData());
      }
    } catch (ex) {
      yield put(setUserAuthFailed());
      yield put(setAppError(new Error('Login failed \n Please try again'), 'ERROR_USER_LOGIN_ERROR')); // eslint-disable-line max-len
    }
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message;
    if (errorMessage && errorMessage === 'OND_TOKEN_FAILED') {
      yield put(setAppError(new Error('session expired. Please login again.'), 'ERROR_OND_TOKEN_FAILED', true)); // eslint-disable-line max-len
      return;
    }
    yield put(setAppError(new Error('Login failed \n Please try again'), 'ERROR_USER_LOGIN_ERROR')); // eslint-disable-line max-len
  }
}
