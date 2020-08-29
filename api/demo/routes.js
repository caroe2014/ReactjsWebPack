// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import { echo } from 'web/validation';
import Api from './api';
import util from '../util';

const logger = config.logger.child({ component: path.basename(__filename) });
const dir = path.basename(__dirname, __filename);

// HapiJS 17 Routing.
// NOTE: the second argument in the handler method(s), "reply" is the HapiJS "Response Toolkit".
// Reference : https://hapijs.com/api#response-toolkit

export default [
  {
    method: 'GET',
    path: `getTime`,
    handler: (request, reply) => {
      return Api.getTime();
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Current Time',
      notes: 'Returns the current server time.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `echo/{echo?}`,
    handler: (request, reply) => {
      const echo = request.params.echo;
      return Api.echo(echo);
    },
    config: {
      // SWAGGER DOCS
      description: 'Test Echo',
      notes: 'Echos the param send after the route',
      tags: ['api', dir, 'get'],
      // END SWAGGER DOCS
      validate: {
        params: echo
      }
    }
  },
  {
    method: 'GET',
    path: `stores`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.stores(credentials);
    },
    config: {
      // SWAGGER DOCS
      description: 'Test Stores',
      notes: 'Gets Stores',
      tags: ['api', dir, 'get'],
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `items/{context}/{itemIds*}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.items(credentials, request.params.context, request.params.itemIds.split('/'));
    },
    config: {
      // SWAGGER DOCS
      description: 'Test Items',
      notes: 'Gets Items',
      tags: ['api', dir, 'get'],
      // END SWAGGER DOCS
    }
  }
];
