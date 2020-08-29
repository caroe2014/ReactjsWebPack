// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { injectGlobal } from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import envConfig from './env.config';

if (process.env.NODE_ENV === 'development') {
  if (process.env.isAzure) {
    process.env['DOMAIN'] = 'http://buy-kioskdesktop-dev.rguest.com';
  } else {
    process.env['IS_DEV'] = '0';
    process.env['DOMAIN'] = process.env.IS_DEV === '1' ? 'http://buy-dev-buy-01.bellevue.agilysys.com:8080'
      : 'http://buy-int.hospitalityrevolution.com';
  }
}

/* istanbul ignore next */
axios.interceptors.request.use((request) => {
  request.headers.common['client_time'] = new moment().format();
  return request;
});

const isClient = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/*
  BUNYAN LOGGER - For client and server.
*/
let bunyan;
let logger;
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development' && !isClient) { // Development Server Logger
  bunyan = require('bunyan');
  const PrettyStream = require('bunyan-pretty-colors');
  let prettyStdOut = new PrettyStream({ mode: 'short' });
  try {
    prettyStdOut.pipe(process.stdout);
  } catch (ex) {
    console.log(ex);
  }
  logger = bunyan.createLogger({
    name: 'kiosk-desktop',
    serializers: bunyan.stdSerializers,
    streams: [{
      level: 'debug',
      stream: prettyStdOut
    }]
  });
} else {
  if (isClient) { // Client Logger: Dev and Prod
    bunyan = require('browser-bunyan');
    logger = bunyan.createLogger({
      name: 'app',
      streams: [{
        stream: new bunyan.ConsoleFormattedStream(),
        level: process.env.NPM_CONFIG_LOGLEVEL || 'info'
      }]
    });

  } else { // Production Server Logger
    bunyan = require('bunyan');
    logger = bunyan.createLogger({
      name: 'kiosk-desktop',
      serializers: bunyan.stdSerializers,
      level: process.env.NPM_CONFIG_LOGLEVEL || 'info'
    });
  }
}
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
  logger.level('fatal');
}
/*
  END BUNYAN LOGGER
*/

/*
  SERVER ONLY CONFIG - Depends on Node libs like Path that aren't available on the client.
*/
let paths = {};
let webpack = {};
/* istanbul ignore next */
if (!isClient) { // Server Only Config - Depends on Node libs like Path that aren't available on the client.
  const path = require('path');
  const dotenv = require('dotenv');
  dotenv.config();

  const ROOT_PATH = path.resolve(__dirname);
  const ENV = path.join(ROOT_PATH, 'env');
  const WEB_ROOT = path.join(ROOT_PATH, 'public');
  const ASSETS_ROOT = path.join(WEB_ROOT, 'static');
  const BUILD_ROOT = path.join(ASSETS_ROOT, 'build');
  const WEB_VIEWS = path.join(ROOT_PATH, 'web');
  const SERVER_ROOT = path.join(ROOT_PATH, 'web/server');
  const CLIENT_ROOT = path.join(ROOT_PATH, 'web/client');
  const SERVER_VIEWS = path.join(SERVER_ROOT, 'views');
  const SERVER_LOGS = path.join(ROOT_PATH, 'logs');
  const TEST_COVERAGE = path.join(ROOT_PATH, 'coverage');
  const API_ROOT = path.join(ROOT_PATH, 'api');
  paths = {
    root: ROOT_PATH, // project root
    env: ENV, // environment configs
    webRoot: WEB_ROOT, // root for all web; client and server
    assets: ASSETS_ROOT, // static assets go here
    build: BUILD_ROOT, // Webpack output goes here. DO NOT KEEP NON-GENERATED FILES HERE.
    client: CLIENT_ROOT, // SPA code goes here
    serverViews: SERVER_VIEWS, // server-generated views go here
    logs: SERVER_LOGS, // server-generated log files.
    api: API_ROOT, // root of api logs
    coverage: TEST_COVERAGE, // jest-generated test coverage artifacts.
    webViews: WEB_VIEWS
  };
  webpack = {
    outputFilename: process.env.NODE_ENV === 'development' ? '[name]-bundle-[hash].js' : '[name]-bundle-[contentHash].js', // eslint-disable-line max-len
    assetsFileName: 'webpack-assets.json',
    assetsPath: ROOT_PATH,
    port: 3000
  };
}
/*
  END SERVER ONLY CONFIG
*/

const BASE_PATH = process.env.ENVIRONMENT === 'production' ? '/' : '/application/';
const BASE_UI = process.env.ENVIRONMENT === 'production' ? '' : `ui/`;
const BASE_API = `api/`;
const ASSETS_PATH = `static/assets/`;
const ASSETS_BUILD_PATH = `${ASSETS_PATH}build/`;
const SERVER_HOST = process.env.HOST;
const SERVER_PORT = process.env.PORT;
/* istanbul ignore next */
const SERVER_PROTOCOL = process.env.PROTOCOL || (process.env.NODE_ENV === 'workstation' || process.env.ENVIRONMENT === 'development' ||
  process.env.ENVIRONMENT === 'test' || !process.env.ENVIRONMENT) ? 'http' : 'https';

const gatewayServices = (process.env.IS_DEV === '1')
  ? {
    'posApi': 'http://buy-dev-core-01.bellevue.agilysys.com:8080/api-gateway-service'
  } : {
    'posApi': 'https://api-int.hospitalityrevolution.com/api-gateway-service'
  };
const config = {
  authorization: 'jwt',
  logger,
  fontAwesome: 'font-awesome/css/font-awesome.min.css',
  auth: {
    gatewayKey: 'gateway-token',
    tokenKey: 'access-token',
    refreshKey: 'refresh-token',
    expiresKey: 'expiresAt',
    redirectKey: 'redirectKey',
    apiHeader: 'platform-auth-adapter-contract'
  },
  api: {
    root: `${BASE_API}`
  },
  cache: {
    image_ttl: 18000000 // 5 hours image cache
  },
  webPaths: {
    parts: {
      base: BASE_PATH,
      ui: BASE_UI,
      api: BASE_API,
      assets: ASSETS_PATH,
      build: ASSETS_BUILD_PATH
    },
    base: `${BASE_PATH}${BASE_UI}`,
    build: `${BASE_PATH}${BASE_UI}${ASSETS_BUILD_PATH}`,
    assets: `${BASE_PATH}${BASE_UI}${ASSETS_PATH}`.substr(1),
    api: `${BASE_PATH}${BASE_API}`.substr(1),
    ui: `${BASE_PATH}${BASE_UI}`.slice(0, -1),
    serviceContext: `${process.env.service_name || ''}`,
    newRelicAppName: process.env.NEW_RELIC_APP_NAME || ['buy-kiosk-desktop-service-local'],
    newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY || '77feb1b7141e13ef6203c0769fa0ae3bec8540ae',
    // onDemandApiBaseUrl: process.env.isAzure && envConfig.apiGatewayOnDemandProductUrl,
    posApi: process.env.isAzure ? envConfig.apiGatewayPosApiProductBaseUrl : process.env.API_GATEWAY_SERVICE || gatewayServices.posApi, // eslint-disable-line max-len
    receiptApi: process.env.isAzure ? envConfig.apiGatewayPosApiProductBaseUrl : process.env.API_GATEWAY_SERVICE || gatewayServices.posApi, // eslint-disable-line max-len
    computedBasePath: (location) => {
      return typeof (BASE_PATH) !== 'undefined' && BASE_PATH !== '/'
        ? location.href.split(BASE_PATH)[0] + '/' : location.origin + '/';
    },
    computeFavPath: (location, assetFavPath) => {
      return `${location}${location.charAt(location.length - 1) === '/' ? '' : '/'}${assetFavPath}`;
    }
  },
  platformEncryptionVersion: '0.0.81',
  paths,
  webpack,
  idle: { // in seconds
    warning: process.env.CLIENT_TIMEOUT_WARNING_SECONDS || 240, // warning shown after this long "idle"
    timeout: process.env.CLIENT_TIMEOUT_SECONDS || 60, // timeout shown this long after warning shown
    localStoragePersistTTL: process.env.LOCAL_STORAGE_TTL || 240 // TTL of persisted redux store in local storage,
  },
  server: {
    host: SERVER_HOST,
    port: SERVER_PORT,
    protocol: SERVER_PROTOCOL,
    rootUrl: `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/${BASE_PATH}`,
    amqp: process.env.RMQ_SERVICE || 'amqp:localhost:5672',
    loginExchangeName: `rguest.buy.cloud.desktop.login`,
    loginQueueName: (tenantId, emailAddress, linkToken) => `rguest.buy.cloud.desktop.login.tenants.${tenantId}.email.${emailAddress}.uuid.${linkToken}` // eslint-disable-line max-len
  }
};
config.getPOSImageURL = (businessContext, fileName, tenantId) => {
  return fileName ? `${config.webPaths.api}image/${tenantId}/${businessContext}/${fileName}` : undefined;
};
config.imagePathResolver = (imagePath) => {
  if (imagePath.indexOf('://') > 0) {
    return imagePath;
  } else {
    return `${config.webPaths.assets}${imagePath}`;
  }
};

/* VENDOR CSS */
if (isClient) {
  require('font-awesome/css/font-awesome.css');
  require('flag-icon-css/css/flag-icon.css');
  require('./public/static/agilysys-icons.css');
  require('muicss/dist/css/mui-noglobals.min.css');
  require('muicss/dist/js/mui.min.js');
  injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500');
  * {
    font-family: Roboto
  }
`;
}

export default config;
