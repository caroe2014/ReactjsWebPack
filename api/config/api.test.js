// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from './api';
import Boom from 'boom';
import { getTenantConfig } from '../util';

/* global describe, it, expect, jest */
jest.mock('../util');
getTenantConfig.mockImplementationOnce(() => ({'enabledLocation': false, 'tenantID': 123, 'tenantId': 123, 'theme': {'logoImage': 'mock-app-logo.jpg'}})); // eslint-disable-line
const tenantConfig = {
  tenantId: 123,
  theme: {
    logoImage: 'mock-app-logo.jpg'
  }
};

const appCredentials = {
  tenantConfig: {
    ...tenantConfig,
    tenantID: 123,
    grantClientJWT: 'test JWT'
  }
};

describe('config api', () => {

  describe('get tenant logo', () => {

    it('get tenant logo success', async () => {
      let data = await Api.getTenantLogo(tenantConfig);
      expect(data).toEqual('mock-app-logo.jpg');
    });

    it('get tenant logo not found if logo name not in the theme config', async () => {
      delete tenantConfig.theme;
      let data = await Api.getTenantLogo(tenantConfig);
      expect(data).toEqual(Boom.notFound('Could not find tenant logo.'));
    });
  });

  describe('get App Config', () => {

    it('get App Config success', async () => {
      let data = await Api.getAppConfig(appCredentials);
      expect(data).toEqual({'enabledLocation': false, 'tenantID': 123, 'tenantId': 123, 'theme': {'logoImage': 'mock-app-logo.jpg'}});
    });
  });

});
