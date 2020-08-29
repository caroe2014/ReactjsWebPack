// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Boom from 'boom';

import Agilysys from 'agilysys.lib';

const logger = config.logger.child({ component: path.basename(__filename) });

export default {
  getTime: () => {
    const time = new Date().toTimeString();
    logger.info(`getTime: ${time}`);
    return time;
  },
  echo: (echo) => {
    logger.info(`echo: ${echo}`);
    return echo;
  },
  stores: async function (credentials) {
    try {
      const agilysys = new Agilysys(credentials);
      const stores = await agilysys.getStores();
      return stores;
    } catch (ex) {
      return new Boom(ex.message, { statusCode: ex.response.status });
    }
  },
  items: async (credentials, context, itemIds) => {
    try {
      const agilysys = new Agilysys(credentials);
      return await agilysys.getItemDetails(context, itemIds);;
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response.status,  });
    }
  }
};
