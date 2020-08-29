// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Api from './api';
import Boom from 'boom';
import Joi from 'joi';
import util, { getTenantConfig } from '../util';


const logger = config.logger.child({ component: path.basename(__filename) });
const dir = path.basename(__dirname, __filename);

export default [
  {
    method: 'GET',
    path: `concepts`,
    handler: async (request, reply) => {
      return await Api.getCurrentConcepts(request.headers["client_time"] || Date.now());
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Current Concepts',
      notes: 'Returns the concepts for the configuration based on schedule rules.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `logo/{tenantId}`,
    handler: async (request, reply) => {
      const tenantConfig = await getTenantConfig(request);
      return Api.getTenantLogo(tenantConfig);
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'Get Current Concepts',
      notes: 'Returns the concepts for the configuration based on schedule rules.',
      tags: ['api', dir, 'get'],
      // END SWAGGER DOCS
      validate: {
        params: {
          tenantId: Joi.number().required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: ``,
    handler: async (request, reply) => {
      try {
        const credentials = await util.getPosApiCredentialsFromRequest(request);
        return await Api.getAppConfig(credentials, request);
      } catch (ex) {
        logger.error(ex);
        return Boom.badRequest(ex.message);
      }
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Basic App Config',
      notes: 'Using the API-Gateway generated access token, read the user\'s assigned tenantId and get a base-config for the client app',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  }
];
