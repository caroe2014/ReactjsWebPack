import config from 'app.config';
import fs from 'fs';
import forge from 'node-forge';
import path from 'path';
import { SAML_COOKIE_PASSWORD, SAML_COOKIE_TTL } from 'web/client/app/utils/constants';

const logger = config.logger.child({ component: path.basename(__filename) });

export const getCertByAlias = (alias) => {
  if (!process.env.P12_KEY_STORE_LOCATION) {
    logger.error('P12_KEY_STORE_LOCATION not set.');
  }
  const keyStoreLocation = process.env.P12_KEY_STORE_LOCATION || 'wc-bellevue.p12';
  var p12 = fs.readFileSync(keyStoreLocation, 'binary');
  var p12Asn1 = forge.asn1.fromDer(p12, false);
  if (!process.env.keystorePassword) {
    logger.error('keystorePassword not set.');
  }
  var p12Parsed = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, process.env.keystorePassword);
  var bags = p12Parsed.getBags({friendlyName: alias});
  var bag = bags.friendlyName[0];
  var pem = forge.pki.certificateToPem(bag.cert);

  return pem;
};

export const getPublicPrivateKeysByAlias = (alias, keystoreLocation) => {
  var p12 = fs.readFileSync(keystoreLocation, 'binary');
  var p12Asn1 = forge.asn1.fromDer(p12, false);
  var p12Parsed = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, process.env.keystorePassword);
  var bags = p12Parsed.getBags({friendlyName: alias});
  let key;
  let cert;

  bags.friendlyName.forEach(bag => {
    if (bag.cert) {
      cert = forge.pki.certificateToPem(bag.cert);
    } else if (bag.key) {
      key = forge.pki.privateKeyToPem(bag.key);
    }
  });

  return { key, cert };
};

export const getSamlOptions = () => {
  const redirectUrl = process.env.ENVIRONMENT && process.env.ENVIRONMENT !== 'production'
    ? `/kiosk-desktop-service${config.webPaths.ui}`
    : `/${config.webPaths.ui}`;
  return {
    saml: {
      callbackUrl: '',
      host: `${config.server.host}:${config.server.port}`,
      protocol: config.server.protocol,
      entryPoint: '', // will be set once SSO route is hit
      identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
      issuer: '',
      disableRequestedAuthnContext: true
    },
    // hapi-passport-saml settings
    config: {
      cookieName: 'session',
      routes: {
        metadata: {
          path: '/metadata.xml'
        },
        assert: {
          path: `${config.webPaths.ui}/samllogin/callback`
        }
      },
      assertHooks: {
        onResponse: (profile, request, h) => {
          return h.redirect(redirectUrl);
        }
      }
    }
  };
};

export const samlSchemeOpts = {
  password: SAML_COOKIE_PASSWORD,
  isSecure: false,
  isHttpOnly: false,
  ttl: SAML_COOKIE_TTL
};
