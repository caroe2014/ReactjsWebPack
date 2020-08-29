// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { getCurrentStore } from 'web/client/app/utils/StateSelector';

export const GET_ITEM = 'GET_ITEM';
export const FETCHING_ITEM = 'FETCHING_ITEM';
export const GET_ITEM_FAILED = 'GET_ITEM_FAILED';
export const GET_ITEM_SUCCEEDED = 'GET_ITEM_SUCCEEDED';
export const SET_APP_ERROR = 'SET_APP_ERROR';

const getTenantId = (store) => store.app.config.tenantId;
const getSelectedSiteId = (store) => store.sites.selectedId;
const getDisplayProfileId = (store) => store.sites.displayProfileId;
const getCurrentConceptId = (store) => store.concept.conceptId;

export const getItem = (siteId, conceptId, itemId) => ({
  type: GET_ITEM,
  siteId: siteId,
  conceptId: conceptId,
  itemId: itemId
});

export const fetchingItem = () => ({
  type: FETCHING_ITEM
});

export const getItemFailed = (error) => ({
  type: GET_ITEM_FAILED,
  error
});
export const getItemSucceeded = (item) => ({
  type: GET_ITEM_SUCCEEDED,
  selectItem: item
});

export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export const fetchItemDetails = (tenantId, siteId, itemId, storePriceLevel) => {
  return axios.post(`${config.webPaths.api}sites/${tenantId}/${siteId}/kiosk-items/${itemId}`, { storePriceLevel: storePriceLevel }) // eslint-disable-line max-len
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export function * fetchItemIfNeeded (itemId) {
  const tenantId = yield select(getTenantId);
  const conceptId = yield select(getCurrentConceptId);
  const selectedSiteId = yield select(getSelectedSiteId);
  const displayProfileId = yield select(getDisplayProfileId);
  const storeData = yield select(getCurrentStore(selectedSiteId, displayProfileId));

  if (!tenantId) {
    yield put(getItemFailed('Missing Tenant ID'));
  } else if (selectedSiteId < 0) {
    yield put(getItemFailed('Missing Site ID'));
  } else {
    try {
      let selectItem;
      yield put(fetchingItem());
      selectItem = yield call(fetchItemDetails, tenantId, selectedSiteId, itemId, storeData.storePriceLevel);
      selectItem.conceptId = conceptId;
      yield put(getItemSucceeded(selectItem));
    } catch (ex) {
      yield put(getItemFailed(ex));
      yield put(setAppError(new Error('Failed to fetch item details, please try again after few minutes'), 'ERROR_FAILED_FETCH_ITEM_DETAILS')); // eslint-disable-line max-len
    }
  }
}
