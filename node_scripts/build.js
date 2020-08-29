// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import webpack from 'webpack';

module.exports = function (callback) {
  webpack(require('../webpack-config.babel').default).run(() => {
    if (typeof callback === 'function') {
      callback();
    }
  });
};

