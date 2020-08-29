const envConfigPosApi =
  process.env.isAzure && {
    serviceAccountTenantId: process.env.serviceAccountTenantId || '44',
    apiGatewayOndemandProductSubscriptionKey: process.env.apiGatewayOndemandProductSubscriptionKey || 'a0aab68dab704b688499a45ea73bb96f', // eslint-disable-line max-len
    apiGatewayPosApiProductBaseUrl: process.env.API_GATEWAY_POS_API_PRODUCT_BASE_URL || 'https://core-dev.azure-api.net' // eslint-disable-line max-len
  };

// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
const envConfig = process.env.globalTenantId && process.env.globalJWT
  ? {
    globalTenantId: process.env.globalTenantId,
    globalJWT: process.env.globalJWT,
    guestProfileGatewayKey: process.env.guestProfileGatewayKey,
    guestProfileBaseUrl: process.env.guestProfileBaseUrl
  }
  : process.env.ENVIRONMENT ? require(`./env/${process.env.ENVIRONMENT}`) : require(`./env/workstation.json`)[(process.env.IS_DEV === '1' ? 'DEV' : 'INT')]; // eslint-disable-line max-len

const config = Object.assign({}, envConfigPosApi, !process.env.isAzure && envConfig);
export default config;
