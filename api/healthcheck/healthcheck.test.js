// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from 'api/healthcheck/api';

test('get healthcheck response', () => {
  const healthcheck = Api.getSummary();
  expect(healthcheck[0]).toBe("Service is up and reachable");

});
