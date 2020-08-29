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
    method: 'PUT',
    path: `{tenantId}/{siteId}/orders/{orderId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.addLineItemToOrderByGuid(credentials,
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
      return Api.deleteLineItemFromOrderByGuid(
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
    path: `{tenantId}/{siteId}/orders/calculate`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.calculateOrderTotal(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Post calculate order total',
      notes: 'calculate order total',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/orders/getItemsByOrderGuid`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getItemsByOrderGuid(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Post getItemsByOrderGuid',
      notes: 'get Items By Order Guid',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/orders/addLineItemsToOrderByGuid`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.addLineItemsToOrderByGuid(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Post addLineItemsToOrderByGuid',
      notes: 'add LineItems To Order By Guid',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  }
];
