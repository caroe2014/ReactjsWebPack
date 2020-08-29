// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as saga from './sagas';
import config from 'app.config';
import { replace } from 'connected-react-router';
import axios from 'axios';
import { setScheduledStoreConfig, resetScheduleOrder } from 'web/client/app/modules/scheduleorder/sagas';
import { cancelCart } from 'web/client/app/modules/cart/sagas';
/* global describe, it, expect, beforeEach */
/* eslint-disable max-len */
const getTenantId = require('./sagas').__get__('getTenantId');
const getSitesFromStore = require('./sagas').__get__('getSitesFromStore');
const getSitesLastUpdate = require('./sagas').__get__('getSitesLastUpdate');
const getScheduledStoreConfig = require('./sagas').__get__('getScheduledStoreConfig');
const getCartSite = require('./sagas').__get__('getCartSite');

config.cache = { ttl: 200 };
const tenantID = '24';
const siteList = [{ id: '1' }];

describe('site Saga', () => {
  describe('api site fetch', () => {
    const generator = cloneableGenerator(saga.fetchSitesIfNeeded)();
    let clone;
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    // it('fetch site if sitelist not in store', () => {
    //   const sitesLastUpdate = Date.now();
    //   clone.next(tenantID);
    //   clone.next(sitesLastUpdate);
    //   expect(clone.next().value).toEqual(put(saga.fetchingSites()));
    //   expect(clone.next([]).value).toEqual(call(saga.fetchSites, tenantID));
    //   expect(clone.next([]).value).toEqual(call(saga.getScheduleOrderEnabled, []));
    //   expect(clone.next([]).value).toEqual(call(saga.getAsapOrderDisabled, []));
    //   expect(clone.next(false).value).toEqual(put(resetScheduleOrder()));
    //   expect(clone.next().value).toEqual(put(saga.getSitesSucceeded([])));
    //   clone.next(false);
    //   expect(clone.next().value).toEqual(put(cancelCart()));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('fetch site with scheduleOrderenabled', () => {
    //   const sitesLastUpdate = Date.now();
    //   clone.next(tenantID);
    //   clone.next(sitesLastUpdate);
    //   const tempSiteList = [{id: '1', isScheduleOrderEnabled: true}];
    //   expect(clone.next().value).toEqual(put(saga.fetchingSites()));
    //   expect(clone.next([]).value).toEqual(call(saga.fetchSites, tenantID));
    //   expect(clone.next(tempSiteList).value).toEqual(call(saga.getScheduleOrderEnabled, tempSiteList));
    //   expect(clone.next(tempSiteList).value).toEqual(call(saga.getAsapOrderDisabled, tempSiteList));
    //   expect(clone.next(true).value).toEqual(call(getScheduledStoreConfig, tempSiteList));
    //   expect(clone.next().value).toEqual(put(setScheduledStoreConfig({scheduledStoreConfig: undefined, enabled: true})));
    //   expect(clone.next().value).toEqual(put(saga.getSitesSucceeded(tempSiteList)));
    //   clone.next(false);
    //   expect(clone.next().value).toEqual(put(cancelCart()));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('fetch site data if cache time exit', () => {
    //   let sitesLastUpdate = Date.now() - 200;
    //   clone.next(tenantID);
    //   clone.next(sitesLastUpdate);
    //   expect(clone.next(siteList).value).toEqual(put(saga.fetchingSites()));
    //   expect(clone.next([]).value).toEqual(call(saga.fetchSites, tenantID));
    //   expect(clone.next([]).value).toEqual(call(saga.getScheduleOrderEnabled, []));
    //   expect(clone.next(false).value).toEqual(put(resetScheduleOrder()));
    //   expect(clone.next().value).toEqual(put(saga.getSitesSucceeded([])));
    //   clone.next(false);
    //   expect(clone.next().value).toEqual(put(cancelCart()));
    //   expect(clone.next().done).toEqual(true);
    // });

    it('if site list have no update display cache', () => {
      let sitesLastUpdate = Date.now();
      clone.next(tenantID);
      clone.next(sitesLastUpdate);
      expect(clone.next(siteList).done).toEqual(true);
    });

    it('fetch site failure action', () => {
      const sitesLastUpdate = Date.now();
      clone.next(tenantID);
      clone.next(sitesLastUpdate);
      expect(clone.next().value).toEqual(put(saga.fetchingSites()));
      expect(clone.next().value).toEqual(call(saga.fetchSites, tenantID));
      expect(clone.throw().value).toEqual(put(saga.getSitesFailed()));
      expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Failed to fetch sites, please try again after few minutes'), 'ERROR_FAILED_FETCH_SITES'))); // eslint-disable-line max-len
      expect(clone.next().done).toEqual(true);
    });

    it('invalid tenant id', () => {
      const generator = cloneableGenerator(saga.fetchSitesIfNeeded)();
      let clone;
      clone = generator.clone();
      clone.next();
      expect(clone.next().value).toEqual(put(saga.getSitesFailed('Missing Tenant ID')));
      expect(clone.next().value).toEqual(put(replace(`/logout`)));
      expect(clone.next().done).toEqual(true);
    });
  });

  describe('fetch sites axios', () => {
    const mockResponse = {data: {sites: 'test'}};
    it('should fetch sites', async () => {
      axios.get.mockReturnValue(Promise.resolve(mockResponse));
      const response = await saga.fetchSites(tenantID);
      expect(axios.get).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}`);
      expect(response).toEqual(mockResponse.data);
    });

    it('should fetch sites catch error', async () => {
      axios.get.mockReturnValue(Promise.reject(new Error('Failed to fetch sites')));
      try {
        await saga.fetchSites(tenantID);
        expect(axios.get).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}`);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to fetch sites'));
      }
    });
  });

  describe('fetch SiteProfitCenterById axios', () => {
    const mockResponse = {data: {sites: 'test'}};
    let siteId = 1;
    let profitCenterId = 123;
    it('should fetch sites', async () => {
      axios.get.mockReturnValue(Promise.resolve(mockResponse));
      const response = await saga.fetchSiteProfitCenterById(tenantID, siteId, profitCenterId);
      expect(axios.get).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/profitCenter/${profitCenterId}`);
      expect(response).toEqual(mockResponse.data);
    });

    it('should fetch sites catch error', async () => {
      axios.get.mockReturnValue(Promise.reject(new Error('Failed to fetch site profit center by id.')));
      try {
        await saga.fetchSiteProfitCenterById(tenantID, siteId, profitCenterId);
        expect(axios.get).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/profitCenter/${profitCenterId}`);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to fetch site profit center by id.'));
      }
    });
  });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24}},
      sites: {raw: [{name: 'test'}],
        lastUpdate: 'today',
        list: [{id: '1'}]},
      cart: {items: [{contextId: '1'}]}
    };
    const siteId = '123';
    const tempSiteList = [{id: '1', isScheduleOrderEnabled: true}, {id: '2', isScheduleOrderEnabled: true}];
    let dateNowSpy;
    const displayProfileId = '123';
    beforeAll(() => {
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1568797387277);
    });
    it('should get tenant id', () => {
      expect(getTenantId(payload)).toEqual(payload.app.config.tenantId);
    });
    it('should get sites from store', () => {
      expect(getSitesFromStore(payload)).toEqual(payload.sites.raw);
    });
    it('should get sites last update', () => {
      expect(getSitesLastUpdate(payload)).toEqual(payload.sites.lastUpdate);
    });
    it('should get cart site', () => {
      expect(getCartSite(payload)).toEqual(payload.sites.list[0]);
    });
    it('should get sites', () => {
      expect(saga.getSites()).toEqual({type: saga.GET_SITES});
    });
    it('should get sites failed', () => {
      expect(saga.getSitesFailed('sites failed')).toEqual({type: saga.GET_SITES_FAILED, error: 'sites failed'});
    });
    it('should get sites succeeded', () => {
      expect(saga.getSitesSucceeded(payload.sites.raw)).toEqual({type: saga.GET_SITES_SUCCEEDED, sites: payload.sites.raw});
    });
    it('should select site', () => {
      expect(saga.selectSite(siteId, displayProfileId, true)).toEqual({type: saga.SELECT_SITE, siteId, displayProfileId, withRedirect: true});
    });
    it('should select site redirect false', () => {
      expect(saga.selectSite(siteId)).toEqual({type: saga.SELECT_SITE, siteId, withRedirect: true});
    });
    it('should set currency for pay', () => {
      expect(saga.setCurrencyForPay(siteId)).toEqual({type: saga.SET_CURRENCY_PAY, siteId});
    });
    it('should fetching sites', () => {
      expect(saga.fetchingSites()).toEqual({type: saga.FETCHING_SITES});
    });
    it('should set order config', () => {
      let orderConfig = {name: 'test'};
      expect(saga.setOrderConfig(orderConfig)).toEqual({type: saga.SET_ORDER_CONFIG, orderConfig});
    });
    it('should order config with empty object', () => {
      expect(saga.setOrderConfig()).toEqual({type: saga.SET_ORDER_CONFIG, orderConfig: {}});
    });
    it('should get schedule order config without availability', () => {
      expect(getScheduledStoreConfig([])).toEqual({openWindowTimeFrames: [],
        storeOpenNow: false,
        storeOpenLater: false});
    });
    it('should get schedule order config with availability', () => {
      tempSiteList[0].availableAt = {opens: '12:01 AM', closes: '11:59 PM', openWindowTimeFrames: { 'closes': '11:59 PM', 'opens': '12:01 AM' }};
      tempSiteList[1].availableAt = {opens: '12:01 AM', closes: '11:59 PM', openWindowTimeFrames: { 'closes': '11:59 PM', 'opens': '12:01 AM' }};
      expect(getScheduledStoreConfig(tempSiteList)).toEqual({openWindowTimeFrames: [{ 'closes': '11:59 PM', 'opens': '12:01 AM' }, { 'closes': '11:59 PM', 'opens': '12:01 AM' }],
        storeOpenNow: true,
        storeOpenLater: true});
    });
    afterAll(() => {
      dateNowSpy.mockRestore();
    });
  });

  describe('api ProfitCenter fetch', () => {
    let clone;
    let siteId = 1234;
    let tenantId = 1;
    let currentStore = {
      id: 123,
      profitCenterDetails: { test: 'test' }
    };
    const generator = cloneableGenerator(saga.fetchProfitCenterIfNeeded)(siteId);
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    it('should ProfitCenter if already present in store', () => {
      clone.next(currentStore);
      expect(clone.next().done).toEqual(true);
    });
    // it('should fetch ProfitCenter if not present in store', () => {
    //   currentStore = {
    //     id: 123,
    //     profitCenterId: 1
    //   };
    //   clone.next(currentStore);
    //   expect(clone.next(tenantId).value).toEqual(call(saga.fetchSiteProfitCenterById, tenantId, siteId, currentStore.profitCenterId));
    //   expect(clone.next().value).toEqual(put(saga.updateSiteProfitCenter(siteId, undefined)));
    //   expect(clone.next().done).toEqual(true);
    // });
  });

});
