// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import 'newrelic'; // newrelic must be first
import config from './app.config';
import path from 'path';
import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import HapiReactViews from 'hapi-react-views';
import hapiAuthJWT2 from 'hapi-auth-jwt2';
import H2o2 from 'h2o2';
import Swagger from 'hapi-swagger';
import figlet from 'figlet';
import chalk from 'chalk';
import Boom from 'boom';
import GetJWTSigningKey from './jwtKeyConfig';
import { getTenantConfig, getGrantClient } from 'api/util';
import jwt from 'jsonwebtoken';
import get from 'lodash.get';
import Iron from '@hapi/iron';
import fs from 'fs';
import util from 'util';
import LoginApi from 'api/login/api';
import InternalApi from 'api/internal/api';
import Api from './api';
import { getCertByAlias, getSamlOptions, samlSchemeOpts, getPublicPrivateKeysByAlias } from 'utils/saml-utils';

const logger = config.logger.child({ component: path.basename(__filename) });

const samlPlugin = {
  plugin: require('@aeroline_1025/hapi-corpsso'),
  options: getSamlOptions()
};

// watch and reload modules in web/server without restarting the webserver.
if (process.env.NODE_ENV === 'development') {
  const watcher = require('chokidar').watch('./web/server');
  watcher.on('ready', function () {
    watcher.on('all', function () {
      logger.debug('Hot reloading modules in web/server');
      Object.keys(require.cache).forEach(function (id) {
        if (/[\/\\]web\/server[\/\\]/.test(id)) {
          delete require.cache[id];
        }
      });
    });
  });
}

const server = new Hapi.Server({
  host: config.server.host,
  port: config.server.port,
  router: {
    isCaseSensitive: false,
    stripTrailingSlash: true
  },
  routes: {
    validate: {
      failAction: async (request, h, err) => {
        logger.error('ValidationError:', err.message);
        let error = Boom.badRequest('Invalid request parameters.');
        // We want the detailed validation error info but we really shouldn't echo back user-entered values that may contain malicious scripts. Easy xss vulnerability.
        error.output.payload.details = err.details.map(d => { delete d.context.value; return d; });
        throw error;
      }
    },
    cors: {
      origin: ['http://localhost:6006'],
      headers: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'client_time'],
      credentials: true
    }
  }
});

const plugins = [
  Inert, // enables serving static files (file and directory handlers)
  H2o2, // Enable proxying requests to webpack dev server (proxy handler)
  Vision, // enables rendering views with custom engines (view handler)
  hapiAuthJWT2, // JWT auth strat
  samlPlugin
];

if (process.env.NODE_ENV === 'development') {
  plugins.push({
    plugin: Swagger,
    options: {
      info: {
        title: 'Kiosk Desktop',
        description: 'Powered by node, hapi, joi, hapi-swaggered',
        version: '1.0'
      }
    }
  });
}

const createJWTKey = async (auth, tenantId) => {
  const jwtKey = await GetJWTSigningKey();
  const accessToken = process.env.isAzure ? jwt.sign({ 'tenant-id': tenantId, 'gateway-token': auth.gatewayToken }, jwtKey, { algorithm: 'HS512', expiresIn: "30m" }) :
    jwt.sign({ 'tenant-id': tenantId, 'platform-access-token': auth.accessToken }, jwtKey, { algorithm: 'HS512', expiresIn: "30m" });
  const refreshToken = !process.env.isAzure && jwt.sign({ 'tenant-id': tenantId, 'platform-refresh-token': auth.refreshToken }, jwtKey, { algorithm: 'HS512', expiresIn: "24h" });
  return { accessToken, refreshToken };
};

const init = async () => {
  await server.register(plugins);

  const jwtKey = await GetJWTSigningKey();
  logger.debug(`GOT JWT SIGNING KEY`);

  server.auth.strategy('jwt', 'jwt',
    {
      key: jwtKey, // Never Share your secret key
      validate: (decoded, request) => {
        if (decoded['tenant-id'] && (decoded['gateway-token'] || decoded['platform-access-token'])) {
        logger.debug('JWT IS VALID', decoded);
          return { isValid: true };
        } else {
          return { isValid: false };
        }
      },
      verifyOptions: {
        ignoreExpiration: false,
        algorithms: ['HS512']
      } // pick a strong algorithm
    });

  server.auth.strategy('corpsso', 'saml', samlSchemeOpts);
  server.auth.default('jwt');

  server.views({
    defaultExtension: 'jsx',
    engines: {
      jsx: HapiReactViews // support for .jsx files
    },
    relativeTo: __dirname,
    path: 'web/server/views'
  });

  // Proxy images on the buy cloud...
  server.route({
    method: 'GET',
    path: `/${config.webPaths.api}image/{tenantId}/{businessContext}/{fileName}`,
    config: {
      auth: 'jwt'
    },
    handler: {
      proxy: {
        mapUri: (request) => {
          const uri = `${config.webPaths.posApi}/api/buy/image/contexts/${request.params.businessContext}/images/${request.params.fileName}?tenantId=${request.params.tenantId}`;
          const headers = process.env.isAzure ? {
            'X-Gateway-Key': `${request.auth.credentials['gateway-token']}`,
            'TENANT_ID': request.params.tenantId
          }:{
              'authorization': `Bearer ${request.auth.credentials['platform-access-token']}`,
              'TENANT_ID': request.params.tenantId
          };
          logger.debug(`IMAGE PROXY TO: ${uri}`);
          return { uri, headers };
        },
        ttl: 'upstream',
        passThrough: false
      }
    }
  });

  // Serve all files from the assets directory
  // Note: in production this also serves webpack bundles
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `/${config.webPaths.assets}{path*}`,
    handler: {
      directory: {
        path: `${config.paths.assets}`,
        index: false,
        listing: true,
        showHidden: false,
        redirectToSlash: true
      }
    }
  });

  // App
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${(config.webPaths.ui) || '/'}`,
    handler: (request, reply) => {
      return reply.view('app');
    }
  });

  // Healthcheck View
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${config.webPaths.ui}/internal/index.html`,
    handler: {
      view: 'healthcheck' // healthcheck.jsx in /server/views
    }
  });

  // For Stripe Apple Pay Domain Association
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${config.webPaths.ui}/.well-known/apple-developer-merchantid-domain-association`,
    handler: (request, reply) => {
      // eslint-disable-next-line max-len
      return reply.file(`${config.paths.root}/.well-known/apple-developer-merchantid-domain-association`);
    }
  });

  // Healthcheck
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${config.webPaths.serviceContext}/internal/healthchecks`,
    handler: (request, reply) => {
      return InternalApi.getSummary();
    }
  });

  // Manifest
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${config.webPaths.serviceContext}/internal/manifest`,
    handler: (request, reply) => {
      return InternalApi.getManifest(reply);
    }
  });

  server.route({
    method: 'GET',
    config: {
      state: {
        parse: true,
        failAction: 'log'
      },
      auth: 'corpsso'
    },
    path: `${config.webPaths.ui}/samllogin/sso`,
    handler: async (request, reply) => {
      reply.view('app');
    }
  });

  server.route({
    method: 'GET',
    config: {
      state: {
        parse: true,
        failAction: 'log'
      },
      auth: false
    },
    path: `${config.webPaths.ui}/samllogin`,
    handler: async (request, reply) => {
      // set entryPoint based on OND configuration
      const redirectUrl = process.env.ENVIRONMENT && process.env.ENVIRONMENT !== 'production'
        ? `/kiosk-desktop-service${config.webPaths.ui}`
        : config.webPaths.ui;
      const hostAndPath = `${request.query.samlHostDomain}${redirectUrl}`;

      samlPlugin.options.saml.cert = getCertByAlias(request.query.friendlyName);
      samlPlugin.options.saml.entryPoint = request.query.entryPoint;
      samlPlugin.options.saml.issuer = hostAndPath;
      samlPlugin.options.saml.callbackUrl = `${hostAndPath}/samllogin/callback`;

      const keystoreLocation = request.query.keystoreLocation || process.env.P12_KEY_STORE_LOCATION;
      const { cert, key } = getPublicPrivateKeysByAlias(process.env.buyPayDigitalSignatureFactoryKeyAlias || 'rguestbuy', keystoreLocation);

      samlPlugin.options.saml.decryptionPvk = key;
      samlPlugin.options.config.decryptionCert = cert;

      if (request.query.samlIdentifierFormat) {
        samlPlugin.options.saml.identifierFormat = request.query.samlIdentifierFormat;
      }
      if (request.query.samlAssertPathOverride) {
        samlPlugin.options.config.routes.assert.path = request.query.samlAssertPathOverride;
      }

      return reply.redirect(`${redirectUrl}/samllogin/sso`);
    }
  });

  // Login
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${config.webPaths.ui}/login`,
    handler: async (request, reply) => {
      try {
        const tenantConfig = await getTenantConfig(request);
        logger.info('cbo config', JSON.stringify(tenantConfig));
        if (!tenantConfig || !tenantConfig.isConfigurationComplete) {
          return reply.view('login', {
            siteAuth: 'invalid'
          });
        }
        const siteAuth = get(tenantConfig, 'siteAuth.type');
        logger.info('login method', siteAuth);
        let headersToken;
        if (siteAuth === 'ldap' && process.env.isAzure) {
          headersToken = await createJWTKey({ gatewayToken: tenantConfig.grantClientJWT }, tenantConfig.tenantID);
        } else if (siteAuth === 'ldap' && !process.env.isAzure) {
          headersToken = await getGrantClient(tenantConfig.grantClientJWT);
          headersToken = await createJWTKey({ accessToken: headersToken.headers['access-token'], refreshToken: headersToken.headers['refresh-token'] }, tenantConfig.tenantID);
        }
        return process.env.isAzure ? reply.view('login', {
          siteAuth,
          tenantId: tenantConfig.tenantID,
          cboConfig: {
            desktop: get(tenantConfig, 'siteAuth.config.desktop'),
            mobile: get(tenantConfig, 'siteAuth.config.mobile'),
            theme: tenantConfig.theme,
            contextID: tenantConfig.contextID,
            gatewayToken: headersToken && headersToken.gatewayToken,
            logo: tenantConfig.theme.logoImage
          }
        }):
          reply.view('login', {
          siteAuth,
          tenantId: tenantConfig.tenantID,
          cboConfig: {
            desktop: get(tenantConfig, 'siteAuth.config.desktop'),
            mobile: get(tenantConfig, 'siteAuth.config.mobile'),
            theme: tenantConfig.theme,
            contextID: tenantConfig.contextID,
            accessToken: headersToken && headersToken.accessToken,
            logo: tenantConfig.theme.logoImage
          }
          }); // login.jsx in /server/views
      } catch (error) {
        return reply.view('login', {
          siteAuth: 'invalid'
        });
      }
    }
  });

  // Login Email Link Generation
  server.route({
    method: 'POST',
    config: {
      auth: false
    },
    path: `${config.webPaths.ui}/login/email`,
    handler: (request, reply) => {
      return LoginApi.sendEmail(request.payload.email, request.info);
    }
  });

  // Login Validation Link
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${config.webPaths.ui}/login/email/{emailAddress}/{loginToken}`,
    handler: async (request, reply) => {
      const tenantConfig = await getTenantConfig(request);
      logger.info('cbo config', JSON.stringify(tenantConfig));
      if (!tenantConfig || !tenantConfig.isConfigurationComplete) {
        return reply.view('login', {
          siteAuth: 'invalid'
        });
      }
      const siteAuth = get(tenantConfig, 'siteAuth.type');
      logger.info('login method', siteAuth);
      return reply.view('login', {
        ...request.params,
        siteAuth,
        tenantId: tenantConfig.tenantID
      });
    }
  });

  // API Routes
  server.route(Api.Routes);

  // Catch-all. Required for Deep Linking to the SPA.
  server.route({
    method: 'GET',
    config: {
      auth: false
    },
    path: `${config.webPaths.ui}/{path*}`,
    handler: (request, reply) => {
      return reply.view('app');
    }
  });

  if (config.webPaths.base !== '/') {
    // root redirect to login
    server.route({
      method: 'GET',
      config: {
        auth: false
      },
      path: `/`,
      handler: (request, reply) => {
        logger.warn('ROOT_REDIRECT');
        logger.info(`LOGIN REQUEST headers: ${JSON.stringify(request.response.headers)}`);
        return reply.redirect(`${config.webPaths.ui}/login`);
      }
    });
  }

  // DEV SETUP
  if (process.env.NODE_ENV === 'development') {
    // Proxy webpack assets requests to webpack-dev-server
    // Note: in development webpack bundles are served from memory, not filesystem
    server.route({
      method: 'GET',
      config: {
        auth: false
      },
      path: `${config.webPaths.build}{path*}`, // this includes HMR patches, not just webpack bundle files
      handler: {
        proxy: {
          host: config.server.host,
          port: config.webpack.port,
          passThrough: true
        }
      }
    });
  }

  server.state('session', {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true,
    strictHeader: true
  });

  server.events.on('request', (request, event, tags) => {
    // markRequest(`NODE - ${request.url.path}`);
  });

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    const developmentCSPKey = 'Content-Security-Policy-Report-Only';
    const developmentCSPValue = `default-src 'self' *.stripe.com *.google.com; font-src 'self' data: *.gstatic.com; img-src 'self' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com *.facebook.net *.newrelic.com *.stripe.com *.nr-data.net; style-src 'self' 'unsafe-inline' *.googleapis.com; connect-src 'self' *.facebook.com *.locize.io *.nr-data.net; frame-src 'self' *.hospitalityrevolution.com *.rguest.com *.google.com *.stripe.com`;

    const productionCSPKey = 'Content-Security-Policy';
    const productionCSPValue = `default-src 'self' *.stripe.com *.google.com; font-src 'self' data: *.gstatic.com; img-src 'self' data:; script-src 'self' 'unsafe-inline' *.google.com *.facebook.net *.newrelic.com *.stripe.com *.nr-data.net; style-src 'self' 'unsafe-inline' *.googleapis.com; connect-src 'self' *.facebook.com *.locize.io *.nr-data.net; frame-src 'self' *.hospitalityrevolution.com *.rguest.com *.google.com *.stripe.com`;

    if (response.header) {
      response.header('X-Frame-Options', 'deny');
      response.header('X-XSS-Protection', '1; mode=block');
      response.header('X-Content-Type-Options', 'nosniff');
      response.header(process.env.NODE_ENV === 'production' ? productionCSPKey : developmentCSPKey, process.env.NODE_ENV === 'production' ? productionCSPValue : developmentCSPValue);
    }

    return h.continue;
  });

  server.events.on('response', (request) => {
    try {
      const { password, ...requestPayload } = request.payload || {};
      // markResponse(`NODE - ${request.url.path}`);
      logger.debug(`Request Params :: ${JSON.stringify(request.params)}`);
      logger.debug(`Request Query :: ${JSON.stringify(request.query)}`);
      logger.debug(`Request Payload :: ${JSON.stringify(requestPayload)}`);
      logger.debug(`Request Headers :: ${JSON.stringify(request.raw.req.headers)}`);
      logger.debug(`Request path:: ${request.url.path} `);
    } catch (ex) {
      logger.error(`${request.info.remoteAddress} : ${request.method.toUpperCase()} ${request.url.path} => ${request.raw.res.statusCode}`);
    }
  });

  await server.start();

  // Startup Message
  const mode = process.env.NODE_ENV === 'development' ? ' - DEV' : '';
  figlet.text(`Web Ordering${mode}`, {
    font: 'Slant'
  }, (err, data) => {
    console.log(chalk.green(data), err);
    logger.info(`Web Ordering${mode}`);
    logger.info(`Started!`);
    logger.info(`Listening at: ${config.server.rootUrl}`);
    if (process.env.NODE_ENV === 'production') {
      logger.info(`UNSECURE URL: http://${config.server.host}:${config.server.port}${config.webPaths.ui}`);
    }
  });
};

init();

export default server;
