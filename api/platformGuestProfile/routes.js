// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import path from 'path';
import Api from './api';
import util from '../util';
import envConfig from 'env.config';

const dir = path.basename(__dirname, __filename);

export default [
  {
    method: 'POST',
    path: 'searchProfile',
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.searchProfile(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'search platform guest profile by variety of terms',
      notes: 'search the platform guest profile by variety of terms',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: 'createProfile',
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.createProfile(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'create platform guest profile',
      notes: 'create the platform guest profile',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'PUT',
    path: 'updateProfile',
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.updateProfile(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'update platform guest profile',
      notes: 'update the platform guest profile',
      tags: ['api', dir, 'put']
      // END SWAGGER DOCS
    }
  }
];
