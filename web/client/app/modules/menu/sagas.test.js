// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as saga from './sagas';
import axios from 'axios';
import config from 'app.config';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';

const getTenantId = require('./sagas').__get__('getTenantId');
const getSelectedSiteId = require('./sagas').__get__('getSelectedSiteId');
const getCurrentMenu = require('./sagas').__get__('getCurrentMenu');
const getCurrentConcept = require('./sagas').__get__('getCurrentConcept');
/* global describe, it, expect, beforeEach */
/* eslint-disable max-len */

const tenantID = '24';
const siteId = '12';
const displayProfileId = '123';
const conceptId = '656';
const profileId = '45435';
const scheduledDay = '';
const storeData = {
  storePriceLevel: undefined
};
const currentConcept = {menus: [], schedule: {}};
const currentMenu = {categories: {
  '123': {}
}};
const menusPayload = {
  conceptId,
  itemIds: []
};
const categoryId = '123';
describe('Menu Saga', () => {

  describe('fetch menu if needed', () => {
    const generator = cloneableGenerator(saga.fetchMenuIfNeeded)(conceptId);
    let clone;
    const menu = [
      {
        categories: [
          {
            itemsListEmpty: false
          }
        ]
      }
    ];
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    it('fetch menu success action', () => {
      clone.next(tenantID);
      clone.next(siteId);
      clone.next(displayProfileId);
      clone.next(storeData);
      expect(clone.next(currentConcept).value).toEqual(call(getScheduleTime));
      clone.next();
      expect(clone.next(scheduledDay).value).toEqual(put(saga.fetchingMenu()));
      expect(clone.next().value).toEqual(call(saga.fetchMenu, tenantID, siteId, displayProfileId, conceptId, currentConcept.menus, currentConcept.schedule, undefined, undefined, scheduledDay));
      expect(clone.next(menu));
      expect(clone.next().value).toEqual(put(saga.getMenuSucceeded(menu)));
      expect(clone.next().done).toEqual(true);
    });

    it('fetch menu failure action', () => {
      clone.next(tenantID);
      clone.next(siteId);
      clone.next(displayProfileId);
      clone.next(storeData);
      expect(clone.next(currentConcept).value).toEqual(call(getScheduleTime));
      clone.next();
      expect(clone.next(scheduledDay).value).toEqual(put(saga.fetchingMenu()));
      expect(clone.next().value).toEqual(call(saga.fetchMenu, tenantID, siteId, displayProfileId, conceptId, currentConcept.menus, currentConcept.schedule, undefined, undefined, scheduledDay));
      expect(clone.throw().value).toEqual(put(saga.getMenuFailed()));
      expect(clone.next().value).toEqual(put(saga.setAppError(new Error(`Something went wrong \nwe are working on it, please try again after few minutes`), 'ERROR_STANDARD', true)));
      expect(clone.next().done).toEqual(true);
    });

    it('invalid tenant id', () => {
      clone.next();
      clone.next(siteId);
      clone.next(displayProfileId);
      expect(clone.next(storeData).value).toEqual(put(saga.getMenuFailed('Missing Tenant ID')));
      expect(clone.next().done).toEqual(true);
    });

    it('invalid concept id', () => {
      const generator = cloneableGenerator(saga.fetchMenuIfNeeded)(-1);
      let clone = generator.clone();
      clone.next();
      clone.next(tenantID);
      clone.next(siteId);
      clone.next(displayProfileId);
      expect(clone.next(storeData).value).toEqual(put(saga.getMenuFailed('Missing Concept ID')));
      expect(clone.next().done).toEqual(true);
    });
  });

  describe('fetch category items if needed', () => {
    const generator = cloneableGenerator(saga.fetchCategoryItemsIfNeeded)(conceptId, categoryId);
    const menuResponse = {categories: {'123': {items: [{'id': 10}], 'itemsListEmpty': true, itemsLoaded: true}}};
    let clone;
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    it('fetch category items success action', () => {
      let items = [
        {
          id: 10
        }
      ];
      clone.next(tenantID);
      clone.next(siteId);
      clone.next(displayProfileId);
      clone.next(storeData);
      clone.next(currentMenu);
      expect(clone.next(profileId).value).toEqual(call(saga.fetchCategoryItems, tenantID, siteId, conceptId, undefined, undefined));
      // clone.next(items);
      expect(clone.next(items).value).toEqual(put(saga.getItemsSucceeded(menuResponse)));
      expect(clone.next().done).toEqual(true);
    });

    it('fetch category failure action', () => {
      clone.next(tenantID);
      clone.next(siteId);
      clone.next(displayProfileId);
      clone.next(storeData);
      clone.next(currentMenu);
      expect(clone.next(profileId).value).toEqual(call(saga.fetchCategoryItems, tenantID, siteId, conceptId, undefined, undefined));
      expect(clone.throw().value).toEqual(put(saga.getItemsFailed()));
      expect(clone.next().value).toEqual(put(saga.setAppError(new Error(`Something went wrong \nwe are working on it, please try again after few minutes`), 'ERROR_STANDARD', true)));
      expect(clone.next().done).toEqual(true);
    });

    it('missing tenant id', () => {
      clone.next();
      clone.next(siteId);
      clone.next(displayProfileId);
      clone.next(storeData);
      expect(clone.next(currentMenu).value).toEqual(put(saga.getItemsFailed('Missing Tenant ID')));
      expect(clone.next().done).toEqual(true);
    });

    it('missing category id', () => {
      const generator = cloneableGenerator(saga.fetchCategoryItemsIfNeeded)(-1);
      let clone = generator.clone();
      clone.next();
      clone.next(tenantID);
      clone.next(siteId);
      clone.next(displayProfileId);
      clone.next(storeData);
      expect(clone.next(currentMenu).value).toEqual(put(saga.getItemsFailed('Missing Category ID')));
      expect(clone.next().done).toEqual(true);
    });

    it('no category id found for current menu', () => {
      const categoryId = 456;
      const generator = cloneableGenerator(saga.fetchCategoryItemsIfNeeded)(conceptId, categoryId);
      let clone = generator.clone();
      clone.next();
      clone.next(tenantID);
      clone.next(siteId);
      clone.next(displayProfileId);
      clone.next(storeData);
      expect(clone.next(currentMenu).value).toEqual(put(saga.getItemsFailed(`No Category With ID ${categoryId} In Current Menu`)));
      expect(clone.next().done).toEqual(true);
    });

    // it('no category id found for current menu', () => {
    //   const mockCurrentMenu = {...currentMenu};
    //   mockCurrentMenu.categories['123'].itemsLoaded = true;
    //   const generator = cloneableGenerator(saga.fetchCategoryItemsIfNeeded)(categoryId);
    //   let clone = generator.clone();
    //   clone.next();
    //   clone.next(tenantID);
    //   clone.next(siteId);
    //   expect(clone.next(mockCurrentMenu).value).toEqual(put(saga.getItemsSucceeded(mockCurrentMenu)));
    //   expect(clone.next().done).toEqual(true);
    // });
  });

  describe('fetch menu axios', () => {
    const mockResponse = {data: {menus: 'test'}};
    it('should fetch fetch menu', async () => {
      axios.post.mockReturnValue(Promise.resolve(mockResponse));
      const response = await saga.fetchMenu(tenantID, siteId, profileId, conceptId, currentConcept.menus, currentConcept.schedule);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/concepts/${profileId}/menus/${conceptId}`, {menus: currentConcept.menus, schedule: currentConcept.schedule});
      expect(response).toEqual(mockResponse.data);
    });

    it('should fetch menu catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('Failed to fetch menu')));
      try {
        await saga.fetchMenu(tenantID, siteId, profileId, conceptId, currentConcept.menus, currentConcept.schedule);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/concepts/${profileId}/menus/${conceptId}`, {conceptId, menus: currentConcept.menus, schedule: currentConcept.schedule});
      } catch (error) {
        expect(error).toEqual(new Error('Failed to fetch menu'));
      }
    });
  });

  describe('fetch category items axios', () => {
    const mockResponse = {data: {items: 'test'}};
    it('should fetch category items', async () => {
      axios.post.mockReturnValue(Promise.resolve(mockResponse));
      const response = await saga.fetchCategoryItems(tenantID, siteId, conceptId, currentConcept.menus);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/kiosk-items/get-items`, menusPayload);
      expect(response).toEqual(mockResponse.data);
    });

    it('should fetch category items catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('Failed to fetch category items')));
      try {
        await saga.fetchCategoryItems(tenantID, siteId, currentConcept.menus);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/kiosk-items/get-items`, currentConcept.menus);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to fetch category items'));
      }
    });
  });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24, storeList: [{businessContextId: 'abc', displayProfileId: '123'}]}},
      sites: {selectedId: 4, currencyForPay: {}, scheduledTime: 34},
      menu: {current: {}},
      concept: {list: [{id: conceptId, schedule: 24}], conceptId: conceptId}};
    it('should get tenant id', () => {
      expect(getTenantId(payload)).toEqual(payload.app.config.tenantId);
    });
    it('should get selected siteId', () => {
      expect(getSelectedSiteId(payload)).toEqual(payload.sites.selectedId);
    });
    it('should get current menu', () => {
      expect(getCurrentMenu(payload)).toEqual(payload.menu.current);
    });
    it('should get current concept', () => {
      expect(getCurrentConcept(conceptId)(payload)).toEqual(payload.concept.list[0]);
    });
  });

});
