// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as saga from './sagas';
import axios from 'axios';
import config from 'app.config';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';
/* global describe, it, expect, beforeEach */

const getTenantId = require('./sagas').__get__('getTenantId');
const getProfileId = require('./sagas').__get__('getProfileId');
const getSelectedSiteId = require('./sagas').__get__('getSelectedSiteId');

const tenantID = '24';
const siteId = '12';
const profileId = '34';
const scheduleTime = '9:15 PM';
const digitalMenuId = '';
const scheduledDay = '';
describe('Concept Saga', () => {
  const generator = cloneableGenerator(saga.fetchConceptsIfNeeded)();
  let clone;
  beforeEach(() => {
    clone = generator.clone();
    clone.next();
  });
  it('fetch concept success action', () => {
    clone.next(tenantID);
    clone.next(siteId);
    clone.next(profileId);
    clone.next(digitalMenuId);
    expect(clone.next(scheduledDay).value).toEqual(call(getScheduleTime));
    expect(clone.next(scheduleTime).value).toEqual(put(saga.fetchingConcepts()));
    expect(clone.next().value).toEqual(call(saga.fetchConcepts, tenantID, siteId, profileId, scheduleTime, scheduledDay));
    expect(clone.next([{concept: 'test'}]).value).toEqual(put(saga.getConceptsSucceeded([{concept: 'test'}])));
    expect(clone.next().done).toEqual(true);
  });

  it('fetch concept failure action', () => {
    clone.next(tenantID);
    clone.next(siteId);
    clone.next(profileId);
    clone.next(digitalMenuId);
    expect(clone.next(scheduledDay).value).toEqual(call(getScheduleTime));
    expect(clone.next(scheduleTime).value).toEqual(put(saga.fetchingConcepts()));
    expect(clone.next().value).toEqual(call(saga.fetchConcepts, tenantID, siteId, profileId, scheduleTime, scheduledDay));
    expect(clone.throw().value).toEqual(put(saga.getConceptsFailed()));
    expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Failed to fetch concepts, please try again after few minutes'), 'ERROR_FAILED_FETCH_CONCEPTS'))); // eslint-disable-line max-len
    expect(clone.next().done).toEqual(true);
  });

  it('invalid tenant id', () => {
    clone.next();
    clone.next(siteId);
    clone.next(profileId);
    expect(clone.next(digitalMenuId).value).toEqual(put(saga.getConceptsFailed('Missing Tenant ID')));
    expect(clone.next().done).toEqual(true);
  });

  it('invalid site id', () => {
    clone.next(tenantID);
    clone.next(-1);
    clone.next(profileId);
    expect(clone.next(digitalMenuId).value).toEqual(put(saga.getConceptsFailed('Missing Site ID')));
    expect(clone.next().done).toEqual(true);
  });

  it('should fetch concept', async () => {
    const tenantId = 24;
    axios.post.mockReturnValue(Promise.resolve({data: {conceptData: {name: 'test'}}}));
    const response = await saga.fetchConcepts(tenantId, siteId, profileId);
    expect(axios.post).toBeCalledWith(`${config.webPaths.api}sites/${tenantId}/${siteId}/concepts/${profileId}`, {'scheduleTime': undefined});
    expect(response).toEqual({conceptData: {name: 'test'}});
  });

  it('should catch error on fetch concept', async () => {
    const tenantId = 24;
    axios.post.mockReturnValue(Promise.reject(new Error('fetch concept failed')));
    try {
      await saga.fetchConcepts(tenantId, siteId, profileId);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}sites/${tenantId}/${siteId}/concepts/${profileId}`, {'scheduleTime': undefined});
    } catch (error) {
      expect(error.message).toEqual('fetch concept failed');
    }
  });
  describe('unit test for non export functions', () => {
    it('should get tenant id', () => {
      const payload = {app: {config: {tenantId: 123}}};
      expect(getTenantId(payload)).toEqual(payload.app.config.tenantId);
    });
    it('should get selected siteId', () => {
      const payload = {sites: {selectedId: 123}};
      expect(getSelectedSiteId(payload)).toEqual(payload.sites.selectedId);
    });
  });
});
