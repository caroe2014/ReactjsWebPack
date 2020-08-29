// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import envConfig from 'env.config';
import jwt from 'jsonwebtoken';
import GetJWTSigningKey from '../jwtKeyConfig';
import axios from 'axios';
import Boom from 'boom';
import path from 'path';
import crypto from 'crypto';

// import { markRequest, markResponse } from 'utils/performance-utils';

const logger = config.logger.child({ component: path.basename(__filename) });

const configCache = {};
const cryptoIv = [4, 22, 36, 36, 49, 53, 77, 94, 4, 22, 36, 36, 49, 53, 77, 94];
const decryptionAlgorithm = 'aes-128-cbc';
export const getGrantClient = (jwtKey) => axios.post(`${config.webPaths.posApi}/grant/client`, null, {
  headers: {
    authorization: `Bearer ${jwtKey}`
  }
}).then(response => {
  return response;
}).catch(error => {
  logger.error(`Error while fetching GrantClient ${error.response.status}`);
});

export const decrypt = (text) => {
  const decipher = crypto.createDecipheriv(decryptionAlgorithm, Buffer.from(text.key, 'base64'), Buffer.from(cryptoIv));
  let decrypted = decipher.update(text.encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(decryptionAlgorithm, Buffer.from(text.key, 'base64'), Buffer.from(cryptoIv));
  let encrypted = cipher.update(text.dataToEncrypt, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

export const getTenantConfig = async (request) => {
  const appDomain = process.env.DOMAIN ? process.env.DOMAIN
    : `${request.server.info.protocol}://${request.headers['x-original-host'] || request.info.host}`;

  logger.info(`Requesting config for ${appDomain}`);
  try {
    let globalJWT = envConfig.globalJWT;
    if (!process.env.isAzure && globalJWT.includes('ENC:')) {
      const jwtKey = await GetJWTSigningKey(true);
      const data = { encryptedData: globalJWT.split('ENC:')[1], key: jwtKey.toString().trimRight(), iv: cryptoIv };
      globalJWT = decrypt(data);
    }
    const loginResponse = !process.env.isAzure && await getGrantClient(globalJWT);
    const accessToken = !process.env.isAzure && loginResponse.headers['access-token'];
    const onDemandConfigurationRequestHeaders = process.env.isAzure ? {
      'X-Gateway-Key': envConfig.apiGatewayOndemandProductSubscriptionKey,
      TENANT_ID: envConfig.serviceAccountTenantId,
      domain: appDomain
    } : {
      authorization: `Bearer ${accessToken}`,
      TENANT_ID: envConfig.globalTenantId,
      domain: appDomain
    };

    const requestPath = process.env.isAzure ? '/api/buy/onDemandConfiguration/onDemandConfiguration' : '/api/buy/kiosk/onDemandConfiguration';
    const onDemandConfigurationRequestPath = `${config.webPaths.posApi}${requestPath}`;
    // const requestName = `API - ${onDemandConfigurationRequestPath}`;
    // markRequest(requestName);
    logger.info(`requesting config from ${onDemandConfigurationRequestPath}`);
    const tenantConfig = await axios.get(`${onDemandConfigurationRequestPath}`, {
      auth: false,
      headers: onDemandConfigurationRequestHeaders
    }).then(response => {
      configCache[appDomain] = {
        config: response.data
      };
      return configCache[appDomain].config;
    }).catch(error => {
      logger.error(`Internal server error ${error.response.status}`);
      return Boom.badImplementation(`Internal server error ${error.response.status}`);
    });
    if (!tenantConfig) {
      logger.error('Invalid Domain Configuration', JSON.stringify(tenantConfig));
      return Promise.reject(new Error('Invalid Domain Configuration'));
    }
    return tenantConfig;
  } catch (error) {
    logger.error(`Error in getTenantConfig ${error.response.status}`);
  }
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default {

  getPosApiCredentialsFromRequest: async (request) => {
    let credentials = {};
    const appDomain = process.env.DOMAIN ? process.env.DOMAIN
      : `${request.server.info.protocol}://${request.headers['x-original-host'] || request.info.host}`;
    let jwtKey = await GetJWTSigningKey();
    if (request.auth && request.auth.credentials && request.auth.credentials['tenant-id']) {
      credentials.tenantId = request.auth.credentials['tenant-id'];
      credentials.sessionToken = process.env.isAzure ? `${request.auth.credentials['gateway-token']}` : `Bearer ${request.auth.credentials['platform-access-token']}`;
    }
    if (!process.env.isAzure && request.headers['refreshtoken']) {
      const decodedRefreshToken = jwt.verify(request.headers.refreshtoken.split('Bearer ')[1], jwtKey, { algorithms: ['HS512'] });
      const decodedAccessToken = jwt.verify(request.headers.authorization.split('Bearer ')[1], jwtKey, { algorithms: ['HS512'], ignoreExpiration: true });
      credentials.refreshToken = `Bearer ${decodedRefreshToken['platform-refresh-token']}`;
      credentials.tenantId = decodedAccessToken['tenant-id'];
    }
    if (credentials.tenantId) {
      let tenantConfig = configCache[appDomain] && configCache[appDomain].config;
      if (!tenantConfig) {
        tenantConfig = await getTenantConfig(request);
      }
      credentials.tenantConfig = tenantConfig;
    }
    return credentials;
  }
};
