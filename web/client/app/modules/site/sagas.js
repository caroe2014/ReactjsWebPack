// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import config from 'app.config';
import { replace } from 'connected-react-router';
import { setScheduledStoreConfig, resetScheduleOrder } from 'web/client/app/modules/scheduleorder/sagas';
import { setDigitalMenuID, setMultiPassFlag } from 'web/client/app/modules/app/sagas';
import moment from 'moment';
import { convertTimeStringToMomentFormat } from 'web/client/app/utils/common';
import { cancelCart } from 'web/client/app/modules/cart/sagas';
import { getOrderConfigurationDetails } from 'web/client/app/utils/OrderConfig';
import { resetUserData } from 'web/client/app/modules/guestProfile/sagas';
import { fetchingCommunalCartByOrderGuid } from 'web/client/app/modules/communalCart/sagas';
import { getCurrentStore } from 'web/client/app/utils/StateSelector';

import _ from 'lodash';

export const GET_SITES = 'GET_SITES';
export const FETCHING_SITES = 'FETCHING_SITES';
export const UPDATE_NEARBY_SITES = 'UPDATE_NEARBY_SITES';
export const IS_SORT_NEARBY_SITES = 'IS_SORT_NEARBY_SITES';
export const GET_SITES_FAILED = 'GET_SITES_FAILED';
export const GET_SITES_SUCCEEDED = 'GET_SITES_SUCCEEDED';
export const SELECT_SITE = 'SELECT_SITE';
export const UNSET_SELECTED_SITE = 'UNSET_SELECTED_SITE';
export const SET_CURRENCY_PAY = 'SET_CURRENCY_PAY';
export const SET_ORDER_CONFIG = 'SET_ORDER_CONFIG';
export const SET_ORDER_CONFIG_FAILED = 'SET_ORDER_CONFIG_FAILED';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const SET_LOYALTY_ENABLED = 'SET_LOYALTY_ENABLED';
export const UPDATE_PROFIT_CENTER = 'UPDATE_PROFIT_CENTER';
export const RESET_SITES = 'RESET_SITES';
export const GET_SITE_TAX_RULE_DATA = 'GET_SITE_TAX_RULE_DATA';
export const FETCHING_TAX_RULE_DATA = 'FETCHING_TAX_RULE_DATA';
export const FETCH_TAX_RULE_DATA_SUCCEEDED = 'FETCH_TAX_RULE_DATA_SUCCEEDED';
export const FETCH_TAX_RULE_DATA_FAILED = 'FETCH_TAX_RULE_DATA_FAILED';

const getTenantId = (store) => store.app.config.tenantId;
const getDomainGroupType = (store) => store.app.config.domainGroupType;
const getSitesFromStore = (store) => store.sites.raw;
const getSitesLastUpdate = (store) => store.sites.lastUpdate;
const getCartItems = (store) => store.cart.items;
const getVatEnabled = (store) => store.app.multiPassEnabled ? store.communalCart.vatEnabled : store.cart.vatEnabled;
const getStoresList = (store) => store.sites.list;
const getDisplayProfileId = (store) => store.cart.displayProfileId;
const getCartSite = (store) => store.cart.items.length > 0 && store.sites.list.find(site => site.id === store.cart.items[0].contextId && site.displayProfileId === store.cart.displayProfileId); // eslint-disable-line max-len
const getComunalCartSite = (store) => store.communalCart.items.length > 0 && store.sites.list.find(site => site.id === store.communalCart.items[0].contextId); // eslint-disable-line max-len

export const resetSites = () => ({
  type: RESET_SITES
});

export const getSites = () => ({
  type: GET_SITES
});
export const fetchingSites = () => ({
  type: FETCHING_SITES
});
export const getSitesFailed = (error) => ({
  type: GET_SITES_FAILED,
  error
});
export const getSitesSucceeded = (sites) => ({
  type: GET_SITES_SUCCEEDED,
  sites
});
export const selectSite = (siteId, displayProfileId, withRedirect = true) => ({
  type: SELECT_SITE,
  siteId,
  displayProfileId,
  withRedirect
});
export const setCurrencyForPay = (siteId, displayProfileId) => ({
  type: SET_CURRENCY_PAY,
  siteId,
  displayProfileId
});
export const updateSiteProfitCenter = (siteId, displayProfileId, profitCenterDetails) => ({
  type: UPDATE_PROFIT_CENTER,
  siteId,
  displayProfileId,
  key: 'profitCenterDetails',
  profitCenterDetails
});
export const unsetSelectedSite = () => ({
  type: UNSET_SELECTED_SITE
});

export const setOrderConfig = (orderConfig = {}) => ({
  type: SET_ORDER_CONFIG,
  orderConfig
});

export const setOrderConfigFailed = () => ({
  type: SET_ORDER_CONFIG_FAILED
});

export const setLoyaltyEnabled = (loyaltyEnabled) => ({
  type: SET_LOYALTY_ENABLED,
  loyaltyEnabled
});

export const isSortNearBySites = (value = false) => ({
  type: IS_SORT_NEARBY_SITES,
  value
});

export const updateNearBySites = (sites) => ({
  type: UPDATE_NEARBY_SITES,
  sites
});

export const getSiteTaxRuleData = (siteId, displayProfileId, showError = false) => ({
  type: GET_SITE_TAX_RULE_DATA,
  siteId,
  displayProfileId,
  showError
});

export const fetchingSiteTaxRuleData = (siteId) => ({
  type: FETCHING_TAX_RULE_DATA,
  siteId
});

export const fetchSiteTaxRuleDataSucceeded = (siteId, taxRuleData) => ({
  type: FETCH_TAX_RULE_DATA_SUCCEEDED,
  siteId,
  taxRuleData
});

export const fetchSiteTaxRuleDataFailed = (error) => ({
  type: FETCH_TAX_RULE_DATA_FAILED,
  error
});

export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export const fetchSites = (tenantId) => axios.get(`${config.webPaths.api}sites/${tenantId}`) // eslint-disable-line max-len
  .then(response => response.data)
  .catch(err => {
    throw err;
  });

export const fetchSiteProfitCenterById = (tenantId, siteId, profitCenterId) =>
  axios.get(`${config.webPaths.api}sites/${tenantId}/${siteId}/profitCenter/${profitCenterId}`)
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

export const fetchSiteTaxRuleData = (tenantId, siteId) =>
  axios.get(`${config.webPaths.api}sites/${tenantId}/siteTaxRuleData/${siteId}`)
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

export const getProfitCenterIdFromStore = (tenantId, siteId) =>
  axios.get(`${config.webPaths.api}sites/${tenantId}/${siteId}/profitCenter/getProfitCenterId`)
    .then(response => response.data)
    .catch(err => {
      throw err;
    });

const getScheduledStoreConfigList = (sites) => {

  let scheduledStoreConfigList = [];
  try {
    const futureScheduledDays = sites.map(site => site.futureScheduledDays);
    const daysScheduled = Math.max(...futureScheduledDays);

    if (sites && sites.length > 0) {
      for (let day = 0; day <= daysScheduled; day++) {
        let storeOpenNow = false;
        let storeOpenLater = false;
        let openWindowTimeFrames = [];
        sites.map(site => {
          const availableMap = site.allAvailableList.find(availableAt => availableAt.index === day);
          if (availableMap && availableMap.availableAt.opens) {
            const time = {
              opens: availableMap.availableAt.opens,
              closes: availableMap.availableAt.closes
            };
            const currentDateTime = moment(moment.now()).second(0).millisecond(0);
            const { opens: openTime, closes: closeTime } = time;

            const openTimeFormatted = convertTimeStringToMomentFormat(openTime);
            const closeTimeFormatted = convertTimeStringToMomentFormat(closeTime);
            storeOpenNow = !storeOpenNow && currentDateTime.isSameOrAfter(openTimeFormatted) &&
            currentDateTime.isSameOrBefore(closeTimeFormatted) ? true : storeOpenNow;
            if (site.isScheduleOrderEnabled) {
              openWindowTimeFrames = openWindowTimeFrames.concat(availableMap.availableAt.openWindowTimeFrames);
              storeOpenLater = !storeOpenLater && currentDateTime.isSameOrBefore(closeTimeFormatted) ? true : storeOpenLater; // eslint-disable-line max-len
            }
          }
        });
        (!(day === 0 && openWindowTimeFrames.length === 0)) && scheduledStoreConfigList.push({
          day,
          storeOpenNow,
          storeOpenLater,
          openWindowTimeFrames
        });
      }
    }
  } catch (ex) {
    throw ex;
  }

  return scheduledStoreConfigList;
};

const getScheduledStoreConfig = (sites) => {
  let storeOpenNow = false;
  let storeOpenLater = false;
  let openWindowTimeFrames = [];

  if (sites && sites.length > 0) {
    sites.map(site => {
      if (site.availableAt.opens) {
        const time = {
          opens: site.availableAt.opens,
          closes: site.availableAt.closes
        };
        const currentDateTime = moment(moment.now()).second(0).millisecond(0);
        const { opens: openTime, closes: closeTime } = time;

        const openTimeFormatted = convertTimeStringToMomentFormat(openTime);
        const closeTimeFormatted = convertTimeStringToMomentFormat(closeTime);
        storeOpenNow = !storeOpenNow && currentDateTime.isSameOrAfter(openTimeFormatted) &&
          currentDateTime.isSameOrBefore(closeTimeFormatted) ? true : storeOpenNow;
        if (site.isScheduleOrderEnabled) {
          openWindowTimeFrames = openWindowTimeFrames.concat(site.availableAt.openWindowTimeFrames);
          storeOpenLater = !storeOpenLater && currentDateTime.isSameOrBefore(closeTimeFormatted) ? true : storeOpenLater; // eslint-disable-line max-len
        }
      }
    });
  }
  return {
    storeOpenNow,
    storeOpenLater,
    openWindowTimeFrames
  };
};

export const getScheduleOrderEnabled = (siteList) => siteList.find(site => site.isScheduleOrderEnabled);
export const getAsapOrderDisabled = (siteList) => siteList.every(site => site.isAsapOrderDisabled);

export function * fetchSitesIfNeeded () {
  const tenantId = yield select(getTenantId);
  if (tenantId) {
    try {
      const sitesLastUpdate = yield select(getSitesLastUpdate);
      let sites = yield select(getSitesFromStore);
      if (Date.now() - sitesLastUpdate >= config.cache.ttl || !sites) {
        yield put(fetchingSites());
        sites = yield call(fetchSites, tenantId);
        const scheduleOrderenabled = yield call(getScheduleOrderEnabled, sites);
        const asapOrderDisabled = yield call(getAsapOrderDisabled, sites);
        if (scheduleOrderenabled) {
          const scheduledStoreConfig = yield call(getScheduledStoreConfig, sites);
          const scheduledStoreConfigList = yield call(getScheduledStoreConfigList, sites);
          yield put(setScheduledStoreConfig({ scheduledStoreConfig, scheduledStoreConfigList, enabled: true, asapOrderDisabled })); // eslint-disable-line max-len
        } else {
          yield put(resetScheduleOrder());
        }
        const domainGroupType = yield select(getDomainGroupType);
        let multiPassEnabled = false;
        if (domainGroupType === 'digital_menu' && sites.length === 1 && sites[0].digitalMenuEnabled) {
          yield put(setDigitalMenuID(sites[0].id, sites[0].displayProfileId));
          yield put(selectSite(sites[0].id, sites[0].displayProfileId));
        } else if (domainGroupType === 'on_demand_dine_in' && sites.length === 1 && sites[0].multiPassEnabled) {
          yield put(resetUserData());
          yield put(setMultiPassFlag(true));
          multiPassEnabled = true;
        }
        yield put(getSitesSucceeded(sites));
        multiPassEnabled && (yield put(fetchingCommunalCartByOrderGuid()));
        const cartSite = yield select(multiPassEnabled ? getComunalCartSite : getCartSite);
        yield put(cartSite ? setCurrencyForPay(cartSite.id, cartSite.displayProfileId) : cancelCart());
      }
    } catch (ex) {
      console.log(ex);
      yield put(getSitesFailed(ex));
      yield put(setAppError(new Error('Failed to fetch sites, please try again after few minutes'), 'ERROR_FAILED_FETCH_SITES')); // eslint-disable-line max-len
    }
  } else {
    yield put(getSitesFailed('Missing Tenant ID'));
    yield put(replace(`/logout`));
  }
}

export function * setOrderConfigIfNeeded () {
  try {
    const items = yield select(getCartItems);
    const displayProfileId = yield select(getDisplayProfileId);
    const storesList = yield select(getStoresList);
    if (items.length > 0) {
      const orderConfig = getOrderConfigurationDetails(items, storesList, displayProfileId);
      yield put(setOrderConfig(orderConfig));
    }
  } catch (err) {
    yield put(setOrderConfigFailed());
  }
}

export function * fetchProfitCenterIfNeeded (siteId, displayProfileId, profitCenterId) {
  const currentStore = yield select(getCurrentStore(siteId, displayProfileId));
  try {
    if (!currentStore.profitCenterDetails || currentStore.profitCenterId !== profitCenterId) {
      const tenantId = yield select(getTenantId);
      let profitCenterDetails;
      const iscurrentStoreProfitCenterValid = currentStore.profitCenterId && currentStore.profitCenterId !== null &&
        (!profitCenterId || profitCenterId === null);
      const isLoyaltyProfitCenterValid = profitCenterId && profitCenterId !== null;

      if (iscurrentStoreProfitCenterValid && isLoyaltyProfitCenterValid) {
        profitCenterDetails = yield call(fetchSiteProfitCenterById, tenantId, siteId, profitCenterId);
      } else if (iscurrentStoreProfitCenterValid && !isLoyaltyProfitCenterValid) {
        profitCenterDetails = yield call(fetchSiteProfitCenterById, tenantId, siteId, currentStore.profitCenterId);
      } else if (!iscurrentStoreProfitCenterValid && isLoyaltyProfitCenterValid) {
        profitCenterDetails = yield call(fetchSiteProfitCenterById, tenantId, siteId, profitCenterId);
      } else {
        const profitCenterId = yield call(getProfitCenterIdFromStore, tenantId, currentStore.id);
        profitCenterDetails = yield call(fetchSiteProfitCenterById, tenantId, siteId, profitCenterId);
      }
      yield put(updateSiteProfitCenter(siteId, displayProfileId, profitCenterDetails));
      return profitCenterDetails;
    }
    return currentStore.profitCenterDetails;
  } catch (error) {
    throw error;
  }
}

export function * fetchSiteTaxRuleDataIfNeeded (siteId, displayProfileId, showError) {
  const currentStore = yield select(getCurrentStore(siteId, displayProfileId));
  const vatEnabled = yield select(getVatEnabled);
  try {
    if (vatEnabled && !currentStore.taxRuleData) {
      yield put(fetchingSiteTaxRuleData(siteId));
      const tenantId = yield select(getTenantId);
      const siteTaxRuleDataResponse = yield call(fetchSiteTaxRuleData, tenantId, siteId);
      const taxRuleData = [];
      const taxRuleHashMap = {};
      if (siteTaxRuleDataResponse && siteTaxRuleDataResponse.length > 0) {
        siteTaxRuleDataResponse.map((data) => {
          data.taxActionData.rate = parseFloat(data.taxActionData.rate) * 100;
          let mapData = taxRuleHashMap[data.taxConditionData.class];
          if (!mapData && !(mapData && mapData.taxConditionData.class === data.taxConditionData.class)) {
            taxRuleHashMap[data.taxConditionData.class] = _.cloneDeep(data);
            taxRuleData.push(taxRuleHashMap[data.taxConditionData.class]);
          }
          let taxRate = mapData ? parseFloat(mapData.taxActionData.rate) + parseFloat(data.taxActionData.rate) : parseFloat(data.taxActionData.rate); // eslint-disable-line max-len
          const taxRateMap = taxRate.toString().split('.');
          if (taxRateMap.length > 1 && taxRateMap[1].length > 3) {
            taxRate = parseFloat(taxRate.toFixed(3));
          }
          taxRuleHashMap[data.taxConditionData.class].taxActionData.rate = taxRate;
        });
      }
      yield put(fetchSiteTaxRuleDataSucceeded(siteId, taxRuleData));
    }
  } catch (error) {
    if (showError) {
      yield put(setAppError(new Error('Failed to fetch site tax rule data, please try again after few minutes'), 'ERROR_FAILED_FETCH_TAX_RULE')); // eslint-disable-line max-len
    }
    yield put(fetchSiteTaxRuleDataFailed(error));
  }
}
