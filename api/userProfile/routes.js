// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import path from 'path';
import Api from './api';
import util from '../util';
import config from 'app.config';
const logger = config.logger.child({ component: path.basename(__filename) });

const dir = path.basename(__dirname, __filename);

export default [
  {
    method: 'POST',
    path: `login`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      // eslint-disable-next-line no-return-await
      return await Api.guestLogin(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Current Concepts',
      notes: 'Returns the concepts for the configuration based on schedule rules.',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `getUserProfile`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.getUserProfile(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'get user profile',
      notes: 'get the user profile data',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `saveNewCCCard`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.saveNewCCCard(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Saved Card',
      notes: 'user profile saved card',
      tags: ['api', dir, 'save']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `deleteSavedCard`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.deleteUserSavedCard(credentials, request.payload);
    },
    config: {
      // SWAGGER DOCS
      description: 'Delete Saved Card',
      notes: 'delete user profile saved card',
      tags: ['api', dir, 'delete']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: 'decryptSamlCookie',
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return Api.decryptSamlCookie(credentials, request.payload);
    },
    config: {
      description: 'Decrypt Saml cookie',
      notes: 'decrypt saml cookie',
      tags: ['api', dir, 'save']
    }
  }
];
