// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as saga from './sagas';
import axios from 'axios';
import config from 'app.config';

const getTenantId = require('./sagas').__get__('getTenantId');
const getSelectedSiteId = require('./sagas').__get__('getSelectedSiteId');

/* global describe, it, expect, beforeEach */
/* eslint-disable max-len */

const tenantID = '24';
const siteId = '12';
const displayProfileId = '123';
const itemId = '545';
const conceptId = '243';
const itemDetails = [{name: 'burger'}];
const storeData = {
  storePriceLevel: undefined
};
describe('Item Details Saga', () => {
  const generator = cloneableGenerator(saga.fetchItemIfNeeded)(itemId);
  let clone;
  beforeEach(() => {
    clone = generator.clone();
    clone.next();
  });
  it('fetch item details success action', () => {
    clone.next(tenantID);
    clone.next(conceptId);
    clone.next(siteId);
    clone.next(displayProfileId);
    expect(clone.next(storeData).value).toEqual(put(saga.fetchingItem()));
    expect(clone.next().value).toEqual(call(saga.fetchItemDetails, tenantID, siteId, itemId, undefined));
    expect(clone.next(itemDetails[0]).value).toEqual(put(saga.getItemSucceeded(itemDetails[0])));
    expect(clone.next().done).toEqual(true);
  });

  it('fetch item details failure action', () => {
    clone.next(tenantID);
    clone.next(conceptId);
    clone.next(siteId);
    clone.next(displayProfileId);
    expect(clone.next(storeData).value).toEqual(put(saga.fetchingItem()));
    expect(clone.next().value).toEqual(call(saga.fetchItemDetails, tenantID, siteId, itemId, undefined));
    expect(clone.throw().value).toEqual(put(saga.getItemFailed()));
    expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Failed to fetch item details, please try again after few minutes'), 'ERROR_FAILED_FETCH_ITEM_DETAILS')));
    expect(clone.next().done).toEqual(true);
  });

  it('invalid tenant id', () => {
    clone.next();
    clone.next(conceptId);
    clone.next(siteId);
    clone.next(displayProfileId);
    expect(clone.next(storeData).value).toEqual(put(saga.getItemFailed('Missing Tenant ID')));
    expect(clone.next().done).toEqual(true);
  });

  it('invalid site id', () => {
    clone.next(tenantID);
    clone.next(conceptId);
    clone.next(-1);
    clone.next(displayProfileId);
    expect(clone.next(storeData).value).toEqual(put(saga.getItemFailed('Missing Site ID')));
    expect(clone.next().done).toEqual(true);
  });

  // describe('fetch item details axios', () => {
  //   const mockResponse = {data: {item: 'test'}};
  //   const payload = {name: 'test data'};
  //   it('should fetch item details', async () => {
  //     axios.post.mockReturnValue(Promise.resolve(mockResponse));
  //     const response = await saga.fetchItemDetails(tenantID, siteId, itemId, undefined);
  //     expect(axios.post).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/kiosk-items/${itemId}`, undefined);
  //     expect(response).toEqual(mockResponse.data);
  //   });

  //   it('should fetch item details catch error', async () => {
  //     axios.get.mockReturnValue(Promise.reject(new Error('Failed to get item details')));
  //     try {
  //       await saga.fetchItemDetails(payload);
  //       expect(axios.get).toBeCalledWith(`${config.webPaths.api}sites/${tenantID}/${siteId}/kiosk-items/${itemId}`);
  //     } catch (error) {
  //       expect(error).toEqual(new Error('Failed to get item details'));
  //     }
  //   });
  // });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24}},
      sites: {selectedId: 4, currencyForPay: {}, scheduledTime: 34}};
    it('should get tenant id', () => {
      expect(getTenantId(payload)).toEqual(payload.app.config.tenantId);
    });
    it('should get selected siteId', () => {
      expect(getSelectedSiteId(payload)).toEqual(payload.sites.selectedId);
    });
  });
});
