// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Api from './api';
import { email, userNamePassword } from 'web/validation';
import util, { getTenantConfig } from '../util';
import ldap from 'ldapjs';
import Boom from 'boom';
import GetJWTSigningKey from 'jwtKeyConfig';
import jwt from 'jsonwebtoken';

const logger = config.logger.child({ component: path.basename(__filename) });
const dir = path.basename(__dirname, __filename);

const createJwtHeaders = async (response, auth, tenantId) => {
  const jwtKey = await GetJWTSigningKey();
  if (process.env.isAzure) {
    const gatewayToken = jwt.sign({ 'tenant-id': tenantId, 'gateway-token': auth.gatewayToken }, jwtKey, { algorithm: 'HS512', expiresIn: "30m" });
    response.header(config.auth.gatewayKey, gatewayToken);
  } else {
    const accessToken = jwt.sign({ 'tenant-id': tenantId, 'platform-access-token': auth.accessToken }, jwtKey, { algorithm: 'HS512', expiresIn: "30m" });
    const refreshToken = jwt.sign({ 'tenant-id': tenantId, 'platform-refresh-token': auth.refreshToken }, jwtKey, { algorithm: 'HS512', expiresIn: "24h" });
    response.header(config.auth.tokenKey, accessToken).header(config.auth.refreshKey, refreshToken);
  }
};

export default [
  {
    method: 'POST',
    path: `email`,
    handler: async (request, reply) => {
      return await Api.sendEmail(request.payload.email, request.info);
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'TODO',
      notes: 'TODO',
      tags: ['api', dir, 'post'],
      // END SWAGGER DOCS

      validate: {
        payload: email
      }
    }
  },
  {
    method: 'PUT',
    path: `email/{emailAddress}/{loginToken}`,
    handler: async (request, reply) => {
      const validation = await Api.validateLink(request.params.loginToken, request.params.emailAddress);
      const response = reply.response(validation);
      const auth = await Api.gatewayLogin(validation.tenantId);
      if (validation.tenantId) {
        await createJwtHeaders(response, auth, validation.tenantId);
      }
      return response;
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'TODO',
      notes: 'TODO',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'PUT',
    path: `anonymous/{tenantId}`,
    handler: async (request, reply) => {
      const tenantConfig = await getTenantConfig(request);
      if (tenantConfig && (tenantConfig.siteAuth.type === 'none' || tenantConfig.siteAuth.type === 'socialLogin' || tenantConfig.siteAuth.type === 'atrium')) {
        const response = reply.response('Success');
        const auth = await Api.gatewayLogin(tenantConfig);
        await createJwtHeaders(response, auth, request.params.tenantId);
        return response;
      } else {
        return Boom.badRequest('Anonymous Login Not Allowed.');
      }
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'TODO',
      notes: 'TODO',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'POST',
    path: `ldap`,
    handler: async (request, reply) => {
      const un = request.payload.username;
      const pw = request.payload.password;
      const tenantId = request.payload.tenantId;
      const tenantConfig = await getTenantConfig(request);
      const OPTS = tenantConfig.siteAuth.config;
      let client;
      try {
        client = ldap.createClient({ url: OPTS.url, bindDN: OPTS.bindDN, bindCredentials: OPTS.bindCredentials });
      } catch (ex) {
        return Boom.badImplementation('Could Not Connect To Active Directory.');
      }
      const filter = `(sAMAccountName=${un})`;
      const searchPromise = new Promise((_resolve, _reject) => {
        client.search(OPTS.searchDN, { filter, scope: 'sub' }, (err, res) => {
          if (!err) {
            let user;
            res.on('searchEntry', (entry) => {
              logger.info(`Found User Entry: ${entry.object.dn}`);
              user = entry.object;
            });
            res.on('error', function (err) {
              _reject(err);
            });
            res.on('end', (result) => {
              if (result.status === 0 && user) {
                _resolve(user);
              } else {
                _reject(`User Not Found`);
              }
            });
          } else {
            _reject('LDAP Auth Failed.');
          }
        });
      });
      try {
        await searchPromise;
      } catch (ex) {
        return Boom.notFound(ex);
      }
      const user = await searchPromise;
      const ldapPromise = new Promise((resolve, reject) => {
        const userDN = user.dn;
        client.bind(userDN, pw, async (err) => {
          const status = err != null ? err.message : 'OK';
          client.unbind();
          if (status === 'OK') {
            return resolve(user);
          } else {
            return reject(Boom.badRequest('Invalid Credentials'));
          }
        });
      });
      try {
        await ldapPromise;
      } catch (ex) {
        logger.error(ex.message);
        return Boom.forbidden(ex);
      }
      const userEntry = await ldapPromise;
      const userInfo = {
        userName: userEntry.sAMAccountName,
        email: userEntry.mail,
        displayName: userEntry.displayName
      };
      const response = reply.response(userInfo);
      if (userInfo.userName.toLowerCase() === un.toLowerCase()) {
        logger.info('LOGGING INTO THE GATEWAY...');
        const auth = await Api.gatewayLogin(tenantId);
        logger.info(`Authorization Headers: ${JSON.stringify(auth, null, 2)}`);
        await createJwtHeaders(response, auth, tenantId);
      } else {
        return Boom.badImplementation(`Username Retrieved: ${userInfo.userName} does not equal username supplied: ${un}`);
      }
      return response;
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'TODO',
      notes: 'TODO',
      tags: ['api', dir, 'post'],
      // END SWAGGER DOCS

      validate: {
        payload: userNamePassword
      }
    }
  },
  {
    method: 'GET',
    path: `refresh`,
    handler: async (request, reply) => {
      const tenantConfig = await getTenantConfig(request);
      const auth = await Api.gatewayLogin(tenantConfig);
      const response = reply.response({ refresh: true });
      if (tenantConfig.tenantID) {
        await createJwtHeaders(response, auth, tenantConfig.tenantID);
      }
      return response;
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'TODO',
      notes: 'TODO',
      tags: ['api', dir, 'post']
      // END SWAGGER DOCS
    }
  }
];
