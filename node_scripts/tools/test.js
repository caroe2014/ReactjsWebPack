// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import jest from 'jest';
const argv = [...process.argv.slice(2), '--verbose'];
console.log(`Running JEST with ${argv}`);
jest.run(argv);
