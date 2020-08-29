// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from './api';
import fs from 'fs';
import path from 'path';
import { _mockConfigHooks } from 'app.config';

const mockFileCreation = jest.fn((file) => {
  let rawdata = fs.readFileSync(file);
  return JSON.parse(rawdata);
});

describe('Internal API', () => {
  test('get healthcheck response', () => {
    const healthcheck = Api.getSummary();
    expect(healthcheck).toEqual([ 'Service is up and reachable' ]);
  });

  test('get index response', async () => {
    let file = path.join(__dirname, '../..', '__mocks__/manifest.json');
    fs.writeFileSync(file, JSON.stringify({version: `1.0.1`}));
    const manifest = await Api.getManifest({file: mockFileCreation});
    expect(manifest.version).toBe('1.0.1');
    fs.unlinkSync(file);
  });
});
