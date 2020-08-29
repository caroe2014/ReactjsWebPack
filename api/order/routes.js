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
    path: `{tenantId}/{siteId}/orders`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.createOrder(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Post a new order',
      notes: 'Create a new order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'PUT',
    path: `{tenantId}/{siteId}/orders/{orderId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.addItemToOrder(
        credentials,
        request.params.siteId,
        request.params.orderId,
        request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Update order',
      notes: 'Modify an exisiting order',
      tags: ['api', dir, 'put']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'DELETE',
    path: `{tenantId}/{siteId}/orders/{orderId}/{itemId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.deleteItemFromOrder(
        credentials,
        request.params.siteId,
        request.params.orderId,
        request.params.itemId);
    },
    config: {
      // SWAGGER DOCS
      description: 'Delete item',
      notes: 'Delete an item from an order',
      tags: ['api', dir, 'delete']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/orders/{orderId}/payment`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.openOrder(credentials, request.params.siteId, request.payload.items);
    },
    config: {
      // SWAGGER DOCS
      description: 'Add payment',
      notes: 'Add a payment to an order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'PUT',
    path: `{tenantId}/{siteId}/orders/{orderId}/close`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.openOrder(credentials, request.params.siteId, request.payload.items);
    },
    config: {
      // SWAGGER DOCS
      description: 'Close Order',
      notes: 'Close an order',
      tags: ['api', dir, 'put']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/getWaitTimeForItems`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getWaitTimeForItems(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Post a new order',
      notes: 'Create a new order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `createClosedOrder`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.createClosedOrder(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Close Order',
      notes: 'Close an order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'PUT',
    path: `capacityCheck`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.capacityCheck(credentials, reply, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'capacity check',
      notes: 'capacity check for  order throttling',
      tags: ['api', dir, 'put']
    }
  },
  {
    method: 'POST',
    path: `createClosedOrderWallets`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.createClosedOrderWallets(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Close Order',
      notes: 'Close an order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `createMultiPaymentClosedOrder`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.createMultiPaymentClosedOrder(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'split Close Order',
      notes: 'split payment Close an order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'DELETE',
    path: `{orderId}/deletePaymentsFromOrder/{contextId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.deletePaymentsFromOrder(credentials, request.params.contextId, request.params.orderId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'delete payments from order',
      notes: 'delete payments from order',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `getPaymentTenderInfo`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getPaymentTenderInfo(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'get payments tender info',
      notes: 'get payments tender info',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  }
];
