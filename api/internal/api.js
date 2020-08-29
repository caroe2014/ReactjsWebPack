// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import path from 'path';

export default {
  getSummary: () => {
    let healthCheck = [
      'Service is up and reachable'
    ];
    return healthCheck;
  },
  getManifest: (reply) => {
    const file = path.join(__dirname, '../../', 'manifest.json');
    return reply.file(file);
  }
};
