// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import fs from 'fs';
import path from 'path';
// import { startObserver } from 'utils/performance-utils';

const logger = config.logger.child({ component: path.basename(__filename) });

// Get APIs as a function of top-level directory names in the service/api path
let apiNames = ((srcPath) => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory()))(__dirname);

let Apis = { Routes: [] };

// startObserver();

// Build the routes using configured base name and add tags for swagger.
apiNames.forEach((name) => {
  try {
    const api = require(`api/${name}`);
    if (!api.Api || !api.Routes) {
      throw new Error();
    }
    Apis[name] = api.Api;
    let apiRoutes = api.Routes.map(r => {
      const route = {
        ...r,
        path: `/${config.webPaths.api}${name}${r.path ? `/${r.path}` : ''}`,
        config: {
          auth: config.authorization,
          ...r.config,
          id: `${config.webPaths.api}${name}/${r.config.id || r.path}`,
          tags: [...r.config.tags, name]
        }
      };
      logger.info(`Api Route Built :: ${route.path}`);
      return route;
    });
    Apis.Routes.push(...apiRoutes);
  } catch (ex) {
    logger.debug(ex);
    logger.warn(`Api '${name}' appears to be malformed. Make sure the directory has an index.js which exports an object: {Api, Routes}.`);
  }
});

module.exports = Apis;
