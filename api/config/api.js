// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Boom from 'boom';
import get from 'lodash.get';
import { getTenantConfig } from '../util';
import _ from 'lodash';

export default {
  getTenantLogo: (tenantConfig) => {
    const appConfig = tenantConfig.theme;
    if (appConfig) {
      return appConfig.logoImage;
    }
    return Boom.notFound('Could not find tenant logo.');
  },
  getAppConfig: async (credentials, request) => {
    const tenantConfig = await getTenantConfig(request);
    const cloneAppConfig = _.cloneDeep(tenantConfig);
    const { grantClientJWT, ...prunedConfig } = cloneAppConfig;
    prunedConfig.tenantId = cloneAppConfig.tenantID;
    prunedConfig.enabledLocation = get(cloneAppConfig, 'properties.location.enabledLocation', false);
    if (prunedConfig.siteAuth && (prunedConfig.siteAuth.type === 'socialLogin' || prunedConfig.siteAuth.type === 'atrium') && prunedConfig.siteAuth.config) {
      let loginMethods = get(prunedConfig, 'siteAuth.config.loginMethods', []);
      loginMethods = loginMethods.map(data => {
        const { clientId, ...prunedData } = data;
        return prunedData;
      });
      prunedConfig.siteAuth.config.loginMethods = loginMethods;
    }
    return prunedConfig;
  }
};
