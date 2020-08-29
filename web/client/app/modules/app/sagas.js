// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { push } from 'connected-react-router';
import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import i18n from 'web/client/i18n';
import { getUserData, resetUserData, getAtriumUserData } from 'web/client/app/modules/guestProfile/sagas';

export const GET_APP_CONFIG = 'GET_APP_CONFIG';
export const FETCHING_APP_CONFIG = 'FETCHING_APP_CONFIG';
export const GET_APP_CONFIG_FAILED = 'GET_APP_CONFIG_FAILED';
export const GET_APP_CONFIG_SUCCEEDED = 'GET_APP_CONFIG_SUCCEEDED';
export const SET_MULTI_PASS_FLAG = 'SET_MULTI_PASS_FLAG';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const SET_DIGITAL_MENU_ID = 'SET_DIGITAL_MENU_ID';
export const SET_ORDER_GUID_STATUS = 'SET_ORDER_GUID_STATUS';

const getCurrentAppConfig = (store) => store.app ? store.app.config : {};
const getOndToken = (store) => store.profile.ondToken;

export const getAppConfig = () => ({
  type: GET_APP_CONFIG
});
export const fetchingAppConfig = () => ({
  type: FETCHING_APP_CONFIG
});
export const getAppConfigFailed = (error) => ({
  type: GET_APP_CONFIG_FAILED,
  error
});
export const getAppConfigSucceeded = (appConfig) => ({
  type: GET_APP_CONFIG_SUCCEEDED,
  appConfig
});

export const setMultiPassFlag = (isEnabled) => ({
  type: SET_MULTI_PASS_FLAG,
  isEnabled
});

export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export const setDigitalMenuID = (storeContextId) => ({
  digitalMenuId: storeContextId,
  type: SET_DIGITAL_MENU_ID
});

export const setOrderGiudStatus = (isInvalid = false) => ({
  type: SET_ORDER_GUID_STATUS,
  isInvalid
});

export const fetchAppConfig = () => axios.get(`${config.webPaths.api}config`)
  .then(response => response.data)
  .catch(err => {
    throw err;
  });

export const fetchLocalizedProfiles = async (appConfig) => {
  await Promise.all(appConfig.storeList.map(async (store) => {
    store.displayProfileId.map(async (profileId) => {
      await i18n.loadNamespaces(`profile-${profileId}`);
    });
  }));
};

export function * fetchAppConfigIfNeeded () {
  try {
    let appConfig = yield select(getCurrentAppConfig);
    if (!appConfig.tenantId) {
      yield put(fetchingAppConfig());
      appConfig = yield call(fetchAppConfig);
      yield call(fetchLocalizedProfiles, appConfig);
      yield put(getAppConfigSucceeded(appConfig));
      const ondToken = yield select(getOndToken);
      if (ondToken && appConfig.siteAuth.type === 'socialLogin') {
        yield put(getUserData());
      } else if (ondToken && appConfig.siteAuth.type === 'atrium') {
        yield put(getAtriumUserData());
      } else {
        yield put(resetUserData());
      }
    }
  } catch (ex) {
    yield put(getAppConfigFailed(ex));
    yield put(push('/logout'));
  }
}
