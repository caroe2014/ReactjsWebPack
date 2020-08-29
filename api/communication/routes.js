// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
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
    path: `getReceipt`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getReceipt(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get receipt image from Receipt service',
      notes: 'Returns a valid token.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `getSMSReceipt`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getSMSReceipt(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get receipt SMS text string from Receipt service',
      notes: 'Returns a valid response.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `sendEmailReceipt`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.sendEmailReceipt(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Send an Email receipt with bill attachment using Communication service',
      notes: 'Returns a valid response.',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `sendSMSReceipt`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.sendSMSReceipt(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Send an SMS receipt using Communication service',
      notes: 'Returns a valid response.',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `createReceiptData`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.createReceiptData(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Create receipt input data for receipt service call',
      notes: 'Returns a valid response.',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `createSMSReceiptData`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.createSMSReceiptData(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Create receipt input data for SMS receipt service call',
      notes: 'Returns a valid response.',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  }
];
