// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { cloneableGenerator } from 'redux-saga/utils';
import { fetchAppConfigIfNeeded, fetchingAppConfig, fetchAppConfig,
  getAppConfigSucceeded, getAppConfigFailed, fetchLocalizedProfiles } from './sagas';
import axios from 'axios';
import config from 'app.config';
const getCurrentAppConfig = require('./sagas').__get__('getCurrentAppConfig');

/* global describe, it, expect */
/* global describe, it, expect */

const tenantID = '24';
describe('App Saga', () => {
  const generator = cloneableGenerator(fetchAppConfigIfNeeded)();
  let clone;
  // it('raise config success action', () => {
  //   clone = generator.clone();
  //   clone.next();
  //   expect(clone.next(tenantID).value).toEqual(put(fetchingAppConfig()));
  //   expect(clone.next().value).toEqual(call(fetchAppConfig));
  //   expect(clone.next().value).toEqual(call(fetchLocalizedProfiles, undefined));
  //   expect(clone.next().value).toEqual(put(getAppConfigSucceeded()));
  //   expect(clone.next().done).toEqual(true);
  // });

  it('should not fetch config if tenant id available', () => {
    clone = generator.clone();
    clone.next();
    expect(clone.next({tenantId: tenantID}).value).toEqual(undefined);
    expect(clone.next().done).toEqual(true);
  });

  it('should catch error', () => {
    clone = generator.clone();
    clone.next();
    expect(clone.next(tenantID).value).toEqual(put(fetchingAppConfig()));
    expect(clone.next().value).toEqual(call(fetchAppConfig));
    expect(clone.throw('get app config failed').value).toEqual(put(getAppConfigFailed('get app config failed')));
    expect(clone.next().value).toEqual(put(push('/logout')));
    expect(clone.next().done).toEqual(true);
  });

  it('should fetchAppConfig', async () => {
    axios.get.mockReturnValue(Promise.resolve({data: {config: {key: '123'}}}));
    let appConfig = {
      storeList: [
        {
          displayProfileId: [1001]
        }
      ]
    };
    const response = await fetchAppConfig();
    await fetchLocalizedProfiles(appConfig);
    expect(axios.get).toBeCalledWith(`${config.webPaths.api}config`);
    expect(response).toEqual({config: {key: '123'}});
  });

  it('should fetchAppConfig catch error', async () => {
    axios.get.mockReturnValue(Promise.reject(new Error('No config found')));
    try {
      await fetchAppConfig();
      expect(axios.get).toBeCalledWith(`${config.webPaths.api}config`);
    } catch (error) {
      expect(error).toEqual(new Error('No config found'));
    }
  });

  describe('getCurrentAppConfig', () => {
    const appConfig = {app: {config: {theme: 'test'}}};
    it('should return config', () => {
      expect(getCurrentAppConfig(appConfig)).toEqual(appConfig.app.config);
    });
    it('should return empty if app config not found', () => {
      delete appConfig.app;
      expect(getCurrentAppConfig(appConfig)).toEqual({});
    });
  });
});
