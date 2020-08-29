// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from './api';
import MockAgilysys from '../../test/agilysys.mock';
import Agilysys from '../../agilysys.lib/agilysys.lib';
import Boom from 'boom';
import uuid from 'uuid/v1';
/* global describe, it, expect, jest */

jest.useFakeTimers();
jest.mock('../../agilysys.lib/agilysys.lib');
const mockAgilysys = new MockAgilysys();
Agilysys.mockImplementation(() => mockAgilysys);
let mockData = {addExpectationResult: 'mock result', content: '{ "msg": "valid link" }'};
jest.mock('uuid/v1');
uuid.mockImplementation(() => {
  return 'mock-uuid';
});
jest.mock('../../env/workstation.json', () => ({
  domains: { mockmail: 23 },
  tenants: {
    23: {
      platformAuth: {

      }
    }
  }
}));
Api.__Rewire__('amqp', {
  connect () {
    return {
      createChannel () {
        return {
          assertExchange () {
            return null;
          },
          assertQueue () {
            return {
              queue: 'mock queue'
            };
          },
          bindQueue () {

          },
          sendToQueue () {

          },
          deleteQueue () {

          },
          consume (queue, cb) {
            cb(mockData);
          },
          close (cb) {
            cb();
          }
        };
      },
      close () {
      }
    };
  }
});

describe('login api', () => {

  describe('send mail', () => {
    let email = 'mock@mockmail.com';
    const requestInfo = {referrer: 'mocktoken'};

    it('send mail success action', async () => {
      let data = await Api.sendEmail(email, requestInfo);
      expect(data).toEqual('mocktoken/email/mock@mockmail.com/mock-uuid');
      jest.runAllTimers();
    });

    it('mail failure if request info not found', async () => {
      let data = await Api.sendEmail(email, undefined);
      expect(data).toEqual(Boom.serverUnavailable('Error Sending Email.'));
      jest.runAllTimers();
    });

    it('invalid email address if email not configured', async () => {
      email = 'mock@test.com';
      let data = await Api.sendEmail(email, requestInfo);
      expect(data).toEqual(Boom.badRequest('Invalid Email Address'));
      jest.runAllTimers();
    });
  });

  describe('validate link', () => {
    let email = 'mock@mockmail.com';
    let loginToken = 'mock-token';

    it('validate link success action', async () => {
      let data = await Api.validateLink(loginToken, email);
      expect(data).toEqual({'msg': 'valid link'});
      jest.runAllTimers();
    });

    it('failure if email is undefined', async () => {
      try {
        await Api.validateLink(loginToken, undefined);
      } catch (error) {
        expect(error).toEqual(new TypeError('Cannot read property \'split\' of undefined'));
      }
    });
  });

  describe('get way login', () => {
    it('gateway login success action', async () => {
      mockAgilysys.isApiKeyValid = true;
      let data = await Api.gatewayLogin(23);
      expect(data).toEqual(true);
    });

    it('failure if the api key is not valid', async () => {
      mockAgilysys.isApiKeyValid = false;
      let data = await Api.gatewayLogin(23);
      expect(data).toEqual(false);
    });
  });

});
