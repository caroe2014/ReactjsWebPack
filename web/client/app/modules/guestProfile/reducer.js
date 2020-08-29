// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';

const initialState = {
  userStatus: undefined,
  loginMode: undefined,
  userName: '',
  userId: '',
  cardInfo: [],
  fetching: false,
  showLoginPopup: false,
  ondToken: undefined,
  continueWithPay: false,
  continueLoyaltyCheckout: false,
  showSavedCards: false,
  userInfoError: false,
  deletingCard: false,
  hideGuestOption: false,
  samlCookie: '',
  decryptedSamlCookie: {},
  decryptSamlCookieError: ''
};

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SHOW_LOGIN_POPUP:
      return {
        ...state,
        showLoginPopup: true,
        hideGuestOption: action.hideGuestOption,
        fetching: false
      };
    case actions.CLOSE_LOGIN_POPUP:
      return {
        ...state,
        showLoginPopup: false,
        hideGuestOption: false,
        fetching: false
      };
    case actions.SET_USER_DATA:
      return {
        ...state,
        loginMode: action.loginMode,
        userId: action.userId,
        userName: action.userName,
        fetching: true
      };
    case actions.OND_TOKEN_RECEIVED:
      return {
        ...state,
        ondToken: action.token,
        showLoginPopup: false,
        continueWithPay: !state.continueWithPay,
        fetching: false
      };
    case actions.FETCH_USER_INFO:
      return {
        ...state,
        userInfoError: false,
        fetchingUser: true
      };
    case actions.FETCH_USER_INFO_SUCCESS:
      return {
        ...state,
        userName: action.userName,
        userId: action.userId,
        cardInfo: action.cardInfo,
        ondToken: action.ondToken,
        userInfoError: false,
        fetchingUser: false,
        fetching: false,
        lastUserPage: '/testwebsite',
        loginMode: action.loginMode || state.loginMode
      };
    case actions.USER_AUTH_FAILED:
      return {
        ...state,
        loginMode: undefined,
        userId: '',
        userName: '',
        fetchingUser: false,
        fetching: false,
        userInfoError: false
      };
    case actions.FETCH_USER_INFO_FAILED:
      return {
        ...state,
        fetchingUser: false,
        fetching: false,
        userInfoError: true
      };
    case actions.OND_TOKEN_FAILED:
      return {
        ...state,
        fetching: false
      };
    case actions.PROFILE_CONTINUE_PAYMENT:
      return {
        ...state,
        continueWithPay: !state.continueWithPay,
        showLoginPopup: false,
        hideGuestOption: false,
        fetching: false
      };
    case actions.PROFILE_CONTINUE_LOYALTY_PAYMENT:
      return {
        ...state,
        continueLoyaltyCheckout: !state.continueLoyaltyCheckout,
        fetching: false
      };
    case actions.RESET_USER_DATA:
      return {
        ...initialState,
        lastUserPage: state.lastUserPage,
        fetching: false,
        samlCookie: state.samlCookie,
        userId: state.userId,
        decryptedSamlCookie: state.decryptedSamlCookie
      };
    case actions.SHOW_SAVED_CARDS:
      return {
        ...state,
        showSavedCards: action.flag,
        fetching: false
      };
    case actions.DELETE_SAVED_CARD:
      return {
        ...state,
        deletingCard: true,
        deleteCardError: false
      };
    case actions.SAVE_CARD_INFO_SUCCESS:
      return {
        ...state,
        cardInfo: action.cardInfo
      };
    case actions.DELETE_SAVED_CARD_SUCCESS:
      const updateCardInfo = state.cardInfo.filter(card => card.uniqueId !== action.uniqueId);
      return {
        ...state,
        cardInfo: updateCardInfo,
        deletingCard: false
      };
    case actions.DELETE_SAVED_CARD_FAILED:
      return {
        ...state,
        deletingCard: false,
        deleteCardError: true
      };
    case actions.SAVE_USER_PAGE:
      return {
        ...state,
        lastUserPage: action.lastUserPage
      };
    case actions.CLEAR_SAVED_USER_PAGE:
      return {
        ...state,
        lastUserPage: ''
      };
    case actions.DECRYPT_SAML_COOKIE:
      return {
        ...state,
        samlCookie: action.samlCookie
      };
    case actions.DECRYPT_SAML_COOKIE_SUCCESS:
      return {
        ...state,
        loginMode: 'atrium',
        decryptedSamlCookie: action.decryptedSamlCookie,
        userId: action.decryptedSamlCookie.profile[action.samlUserIdKey]
      };
    case actions.DECRYPT_SAML_COOKIE_FAILED:
      return {
        ...state,
        decryptSamlCookieError: action.decryptSamlCookieError
      };
    case actions.SAML_LOGOUT_SUCCESS:
      return {
        ...state,
        samlCookie: '',
        decrypedSamlCookie: {},
        userId: '',
        loginMode: undefined,
        showLoginPopup: false,
        showSavedCards: false
      };
    default:
      return state;
  }
};

export default ProfileReducer;
