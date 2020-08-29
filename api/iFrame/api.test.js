// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from './api';
import MockAgilysys from '../../test/agilysys.mock';
import Agilysys from '../../agilysys.lib/agilysys.lib';
import axios from 'axios';
import { _mockConfigHooks } from 'app.config';

/* global describe, it, expect, jest, beforeAll */

jest.mock('../../agilysys.lib/agilysys.lib');
const mockAgilysys = new MockAgilysys();
Agilysys.mockImplementation(() => mockAgilysys);
let logger = _mockConfigHooks.logger;

mockAgilysys.profile = {
  displayProfile: {
    name: 'test'
  }
};

describe('iFrame api', () => {
  const credential = 'mock credential';

  describe('getToken', () => {
    const requestPayload = {
      payload: {
        contextId: 123,
        profileId: 456
      }
    };

    it('getToken success', async () => {
      axios.mockReturnValue(Promise.resolve({data: 'test'}));
      let data = await Api.getToken(credential, requestPayload);
      expect(axios).toBeCalledWith({
        'method': 'get',
        'url': `undefined/pay-iframe-service/iFrame/tenants/undefined/undefined?apiToken=undefined&doVerify=true&version=3`
      });
      expect(data).toEqual('test');
    });

    it('getToken with catch error', async () => {
      axios.mockReturnValue(Promise.reject('error'));
      try {
        await Api.getToken(credential, requestPayload);
        expect(axios).toBeCalledWith({
          'method': 'get',
          'url': `undefined/pay-iframe-service/iFrame/tenants/undefined/undefined?apiToken=undefined&doVerify=true&version=3`
        });
      } catch (error) {
        expect(logger.error).toBeCalled();
      }
    });
  });

});
