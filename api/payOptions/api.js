// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import { getTenantConfig } from '../util';
import Agilysys, { paymentUtils } from 'agilysys.lib';
import * as cssUtils from '../cssHelper';
import translator from '../../web/client/fs-i18n';
import get from 'lodash.get';
var fs = require('fs');

const logger = config.logger.child({component: path.basename(__filename)});

export default {
  getOptions: async (request) => {
    const payload = request.payload;
    const profileDetails = await Agilysys.getDetails(payload.contextId, payload.profileId);
    const paymentConfig = paymentUtils.getIframeConfiguration(profileDetails.displayProfile);
    const paymentOptions = paymentUtils.getPaymentOptions(profileDetails.displayProfile);
    logger.info('Getting payment options for tenant ', payload.tenantId);
    return {
      paymentOptions,
      tenantId: payload.tenantId,
      payTenantId: get(paymentConfig, 'config.iframeAuth.iFrameTenantID'),
      payUserKey: {
        clientId: get(paymentConfig, 'config.iframeAuth.clientId')
      }
    };
  },
  getIFrameCss: async (request, language, domain) => {
    const i18n = await translator(domain);
    await i18n.changeLanguage(language);
    logger.info('Getting Css for iframe with theme options for tenant');
    const tenantConfig = await getTenantConfig(request);
    const iFrameCss = fs.readFileSync(path.resolve(config.paths.assets, 'pay-iframe.css'), 'utf8');
    const translatedCss = await cssUtils.cssConstructor(iFrameCss, tenantConfig.theme, language, i18n);
    return translatedCss;
  }
};
