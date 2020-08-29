// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';
import { getCurrentStore } from 'web/client/app/utils/StateSelector';

const getTenantId = (store) => store.app.config.tenantId;
const getSelectedSiteId = (store) => store.sites.selectedId;
const getDisplayProfileId = (store) => store.sites.displayProfileId;
const getCurrentMenu = (store) => store.menu.current;
const getCurrentConcept = (conceptId) => (store) => store.concept.list.filter(concept => concept.id === conceptId)[0];
const getScheduledDay = (store) => store.scheduleorder.scheduleOrderData && store.scheduleorder.scheduleOrderData.daysToAdd; // eslint-disable-line max-len

export const GET_MENU = 'GET_MENU';
export const FETCHING_MENU = 'FETCHING_MENU';
export const GET_MENU_SUCCEEDED = 'GET_MENU_SUCCEEDED';
export const GET_MENU_FAILED = 'GET_MENU_FAILED';
export const GET_ITEMS = 'GET_ITEMS';
export const FETCHING_ITEMS = 'FETCHING_ITEMS';
export const GET_ITEMS_SUCCEEDED = 'GET_ITEMS_SUCCEEDED';
export const GET_ITEMS_FAILED = 'GET_ITEMS_FAILED';
export const SET_APP_ERROR = 'SET_APP_ERROR';

export const getMenu = (siteId, displayProfileId, menuId) => ({
  type: GET_MENU,
  siteId,
  displayProfileId,
  menuId
});
export const getItems = (siteId, displayProfileId, menuId, categoryId) => ({
  type: GET_ITEMS,
  siteId,
  displayProfileId,
  menuId,
  categoryId
});
export const fetchingMenu = () => ({
  type: FETCHING_MENU
});
export const fetchingItems = () => ({
  type: FETCHING_ITEMS
});
export const getMenuFailed = (error) => ({
  type: GET_MENU_FAILED,
  error
});
export const getItemsFailed = (error) => ({
  type: GET_ITEMS_FAILED,
  error
});
export const getMenuSucceeded = (menu) => ({
  type: GET_MENU_SUCCEEDED,
  menu
});
export const getItemsSucceeded = (menu) => ({
  type: GET_ITEMS_SUCCEEDED,
  menu
});
export const setAppError = (error, key, goBackFlag) => ({
  type: SET_APP_ERROR,
  error,
  key,
  goBackFlag
});

export const fetchMenu = (tenantId, siteId, profileId, conceptId, menus,
  schedule, scheduleTime, storePriceLevel, scheduledDay) =>
  axios.post(`${config.webPaths.api}sites/${tenantId}/${siteId}/concepts/${profileId}/menus/${conceptId}`,
    {menus, schedule, scheduleTime, storePriceLevel, scheduledDay})
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

export const fetchCategoryItems = (tenantId, siteId, conceptId, itemIds, storePriceLevel) => {
  const payload = {
    conceptId,
    itemIds,
    storePriceLevel
  };
  return axios.post(`${config.webPaths.api}sites/${tenantId}/${siteId}/kiosk-items/get-items`,
    payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
};

export function * fetchMenuIfNeeded (conceptId = -1) {
  const tenantId = yield select(getTenantId);
  const selectedSiteId = yield select(getSelectedSiteId);
  const profileId = yield select(getDisplayProfileId);
  const storeData = yield select(getCurrentStore(selectedSiteId, profileId));
  if (!tenantId) {
    yield put(getMenuFailed('Missing Tenant ID'));
  } else if (conceptId < 0) {
    yield put(getMenuFailed('Missing Concept ID'));
  } else {
    try {
      const currentConcept = yield select(getCurrentConcept(conceptId));
      let menu;
      const scheduleTime = yield call(getScheduleTime);
      const scheduledDay = yield select(getScheduledDay);
      yield put(fetchingMenu());
      menu = yield call(fetchMenu, tenantId, selectedSiteId, profileId, conceptId,
        currentConcept.menus, currentConcept.schedule, scheduleTime, storeData.storePriceLevel, scheduledDay); // eslint-disable-line max-len
      if (menu.length === 1 && menu[0].categories.length === 1 && !menu[0].categories[0].itemsListEmpty) {
        yield put(setAppError(new Error('Items not available, please try again after few minutes'), 'ERROR_ITEMS_UNAVAILABLE', true)); // eslint-disable-line max-len
      }
      yield put(getMenuSucceeded(menu));
    } catch (ex) {
      yield put(getMenuFailed(ex));
      yield put(setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD', true)); // eslint-disable-line max-len
    }
  }
}

export function * fetchCategoryItemsIfNeeded (conceptId, categoryId = -1) {
  const tenantId = yield select(getTenantId);
  const selectedSiteId = yield select(getSelectedSiteId);
  const profileId = yield select(getDisplayProfileId);
  const storeData = yield select(getCurrentStore(selectedSiteId, profileId));
  const currentMenu = yield select(getCurrentMenu);
  if (!tenantId) {
    yield put(getItemsFailed('Missing Tenant ID'));
  } else if (categoryId < 0) {
    yield put(getItemsFailed('Missing Category ID'));
  } else if (!currentMenu.categories[categoryId]) {
    yield put(getItemsFailed(`No Category With ID ${categoryId} In Current Menu`));
  } else if (currentMenu.categories[categoryId].itemsLoaded && currentMenu.categories[categoryId].itemsListEmpty) {
    yield put(getItemsSucceeded(currentMenu));
  } else {
    try {
      let menu = JSON.parse(JSON.stringify(currentMenu));
      yield put(fetchingItems());
      const itemIds = menu.categories[categoryId].items;
      const items = yield call(fetchCategoryItems, tenantId, selectedSiteId, conceptId, itemIds, storeData.storePriceLevel); // eslint-disable-line max-len
      if (!items || items.length === 0) {
        yield put(setAppError(new Error('Items not available, please try again after few minutes'), 'ERROR_ITEMS_UNAVAILABLE', true)); // eslint-disable-line max-len
        menu.categories[categoryId].itemsListEmpty = false;
        menu.categories[categoryId].items = itemIds;
      } else {
        menu.categories[categoryId].itemsListEmpty = true;
        menu.categories[categoryId].items = items;
      }
      menu.categories[categoryId].itemsLoaded = true;
      yield put(getItemsSucceeded(menu));
    } catch (ex) {
      yield put(getItemsFailed(ex));
      yield put(setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD', true)); // eslint-disable-line max-len
    }
  }
}
