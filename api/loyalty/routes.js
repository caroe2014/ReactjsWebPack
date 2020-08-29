// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import path from 'path';
import Api from './api';
import util from '../util';
import { loyaltyAccountInfo } from '../../__mocks__/loyalty';

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
      return Api.getAccountInquiryCallbackId(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account Inquiry',
      notes: 'Get account data for given customer info',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `accountInquiry/{contextId}/{callbackId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getAccountInquiryByCallbackId(credentials, reply, request.params.contextId, request.params.callbackId);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account Inquiry',
      notes: 'Get account data for given customer info',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS 
    }
  },
  {
    method: 'POST',
    path: `capturePaymentAndAddToOrder`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.capturePaymentAndAddToOrder(credentials, request.payload, false);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account Inquiry',
      notes: 'Get account data for given customer info',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `capturePaymentAndCloseOrder`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.capturePaymentAndCloseOrder(credentials, request.payload, true);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account Inquiry',
      notes: 'Get account data for given customer info',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    
    method: 'POST',
    path: `payment/void`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.voidLoyaltyPayment(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Account Inquiry',
      notes: 'Get account data for given customer info',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    
    method: 'POST',
    path: `getLoyaltyTendersFromPaymentTypeList`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getLoyaltyTendersFromPaymentTypeList(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Loyalty Tenders List',
      notes: 'Get loyalty tenders from payment list',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  // {
  //   method: 'POST',
  //   path: `payment`,
  //   handler: async (request, reply) => {
  //     const credentials = await util.getPosApiCredentialsFromRequest(request);
  //     return Api.postLoyaltyPaymentAnddGetCallbackId(credentials, request.payload);
  //   },
  //   config: {
  //     // SWAGGER DOCS
  //     description: 'Account Inquiry',
  //     notes: 'Get account data for given customer info',
  //     tags: ['api', dir, 'post']
  //     // END SWAGGER DOCS
  //   }
  // },
  // {
  //   method: 'GET',
  //   path: `payment/{callbackId}`,
  //   handler: async (request, reply) => {
  //     const credentials = await util.getPosApiCredentialsFromRequest(request);
  //     return Api.getPaymentResponseByCallbackId(credentials, reply, request.params.callbackId);
  //   },
  //   config: {
  //     // SWAGGER DOCS
  //     description: 'Account Inquiry',
  //     notes: 'Get account data for given customer info',
  //     tags: ['api', dir, 'post']
  //     // END SWAGGER DOCS
  //   }
  // },
  {
    method: 'POST',
    path: `pointsAccrual/{siteId}/{orderId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.pointsAccrual(credentials, reply, request.params.siteId, request.params.orderId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Points accrual',
      notes: 'Accrue points to the given account id',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  }
];
