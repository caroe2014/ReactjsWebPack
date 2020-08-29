// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Api from './api';
import util from '../util';

const logger = config.logger.child({component: path.basename(__filename)});
const dir = path.basename(__dirname, __filename);

// HapiJS 17 Routing.
// NOTE: the second argument in the handler method(s), "reply" is the HapiJS "Response Toolkit".
// Reference : https://hapijs.com/api#response-toolkit

export default [
  {
    method: 'POST',
    path: `accountInfo`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.accountInfo(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account Info',
      notes: 'Get account data for given GA account',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `accountInquiry`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.accountInquiry(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account Inquiry',
      notes: 'Get account balance and rules for given GA account and tender',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `authorizePaymentAndCloseOrder`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.authorizeGAPaymentAndCloseOrder(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Authorize GA Payment and close order',
      notes: 'Authorize GA Payment and close order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `authorizeAndAddGaPaymentToOrder`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.authorizeAndAddGAPaymentToOrder(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Authorize and add GA payment to order',
      notes: 'Authorize and add GA payment to order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  }
];
