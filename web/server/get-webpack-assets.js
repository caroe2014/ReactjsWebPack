// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';

const logger = config.logger.child({ component: path.basename(__filename) });

const assetsJsonPath = path.resolve(config.webpack.assetsPath, config.webpack.assetsFileName);
let getWebpackAssets;
let assets;

if (process.env.NODE_ENV === 'production') {
  // Require the file only once for efficiency
  assets = require(assetsJsonPath);
  getWebpackAssets = (rootURI) => {
    return assets;
  };

} else {
  const fs = require('fs');

  getWebpackAssets = (rootURI) => {
    // On dev we read the file every time we need it. Not efficient, but easy to work with.
    var fileContents = fs.readFileSync(assetsJsonPath).toString();
    try {
      assets = JSON.parse(fileContents);
      return assets;
    } catch (err) {
      logger.error(`Could not parse ${config.webpack.assetsFilename} - maybe webpack is still processing?`);
      throw err;
    }
  };
}

module.exports = getWebpackAssets;
