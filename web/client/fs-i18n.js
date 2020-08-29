// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import i18next from 'i18next';
import Backend from 'i18next-node-locize-backend';

const translator = async (domain) => {
  await i18next
    .use(Backend)
    .init({
      fallbackLng: {
        'ja': ['ja-JP'],
        'default': ['en-US']
      },
      allowMultiLoading: true,
      backend: {
        projectId: '838d5fce-27b5-4368-8c54-8fcb33577f9a',
        referenceLng: 'en-US',
        version: process.env.ENVIRONMENT === 'production' ? 'latest' : process.env.ENVIRONMENT || process.env.NODE_ENV
      },
      debug: false,
      detection: {
        caches: []
      },
      // have a common namespace used around the full app
      ns: ['core', `domain-${domain}`],
      defaultNS: `domain-${domain}`,
      fallbackNS: [`domain-${domain}`, 'core'],
      keySeparator: false, // we use content as keys

      interpolation: {
        formatSeparator: ','
      },

      react: {
        wait: true
      }
    }, (err, t) => {
      if (err) return console.log('Something went wrong while loading.', err);
    });
  return i18next;
};

export default translator;
