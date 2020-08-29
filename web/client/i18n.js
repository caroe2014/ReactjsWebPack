// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';

/* istanbul ignore next */
i18next
  .use(LanguageDetector)
  .use(Backend)
  .init({
    // fallback depending on user language
    fallbackLng: {
      'ja': ['ja-JP'],
      'default': ['en-US']
    },
    order: ['querystring', 'navigator'],
    lookupQuerystring: 'lng',
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
    ns: ['core', `domain-${window.location.hostname}`],
    defaultNS: `domain-${window.location.hostname}`,
    fallbackNS: [`domain-${window.location.hostname}`, 'core'],

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

export default i18next;
