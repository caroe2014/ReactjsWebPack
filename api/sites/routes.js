// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Api from './api';
import util from '../util';
import moment from 'moment';

const logger = config.logger.child({component: path.basename(__filename)});
const dir = path.basename(__dirname, __filename);

// HapiJS 17 Routing.
// NOTE: the second argument in the handler method(s), "reply" is the HapiJS "Response Toolkit".
// Reference : https://hapijs.com/api#response-toolkit

export default [
  {
    method: 'GET',
    path: `{tenantId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getSites(credentials);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Mock Sites',
      notes: 'Returns a list of stores.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/concepts/{profileId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getConcepts(credentials, request.params.siteId, request.params.profileId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Concepts',
      notes: 'Returns a list of concepts for a store.',
      tags: ['api', dir, 'POST']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/concepts/{profileId}/menus/{conceptId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getMenus(credentials, request.params.siteId, request.params.conceptId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Menus',
      notes: 'Returns a list of menus for a concept',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/kiosk-items/get-items`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getCategoryItems(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Item List as a batch',
      notes: 'Get Item List as a batch',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/kiosk-items/{itemId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getItemDetails(credentials, request.params.siteId, request.params.itemId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Item Details for a specific item',
      notes: 'Get Item Details for a specific item',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `{tenantId}/{siteId}/profitCenter/{profitCenterId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getProfitCenterDetails(credentials, request.params.siteId, request.params.profitCenterId);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get profit center  for a specific store',
      notes: 'Get profit center  for a specific store',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `{tenantId}/{siteId}/profitCenter/getProfitCenterId`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getProfitCenterId(credentials, request.params.siteId);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get profit center  for a specific store',
      notes: 'Get profit center  for a specific store',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/getRoomChargeDetails`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getRoomChargeDetails(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Payment types and room charge menu list',
      notes: 'Get Room charge List as a batch',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `{tenantId}/{siteId}/getMemberChargeDetails`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getMemberChargeDetails(credentials, request.params.siteId, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Payment types and member charge verification code',
      notes: 'Get Room charge List as a batch',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `{tenantId}/siteTaxRuleData/{siteId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getTaxRuleData(credentials, request.params.siteId);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get site tax rule data for a specific store',
      notes: 'Get site tax rule data for a specific store',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  }
];
