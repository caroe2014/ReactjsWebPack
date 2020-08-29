// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import path from 'path';
import Api from './api';
import util from '../util';

const dir = path.basename(__dirname, __filename);

// HapiJS 17 Routing.
// NOTE: the second argument in the handler method(s), "reply" is the HapiJS "Response Toolkit".
// Reference : https://hapijs.com/api#response-toolkit

export default [
  {
    method: 'POST',
    path: `accountInquiry`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.accountInquiry(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account inquiry',
      notes: 'Get atrium account info',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `authAtriumAutoDetectPayment`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.authAtriumAutoDetectPayment(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Auth atrium auto detect',
      notes: 'auth atrium auto detect',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `captureAtriumAutoDetectPayment`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.captureAtriumAutoDetectPayment(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Capture qtrium auto detect payment',
      notes: 'capture qtrium auto detect payment',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `authAtriumPayment`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.authAtriumPayment(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Auth atrium payment',
      notes: 'Auth atrium payment',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `captureAtriumPayment`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.captureAtriumPayment(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Capture Atrium Payment',
      notes: 'Capture Atrium Payment',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `capturePaymentAndCloseOrder`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.capturePaymentAndCloseOrder(credentials, request.payload, reply);
    },
    config: {
      // SWAGGER DOCS
      description: 'Capture member charge payment and close order',
      notes: 'Capture member charge payment and close order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  }
];
