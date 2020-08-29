// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { cloneableGenerator } from 'redux-saga/utils';
import * as saga from './sagas';
import config from 'app.config';
import axios from 'axios';
import { loyaltyConfig } from 'web/client/app/utils/constants';
import { fetchProfitCenterIfNeeded, getProfitCenterId } from 'web/client/app/modules/site/sagas';
/* global describe, it, expect, beforeEach */
/* eslint-disable max-len */
const getLoyaltyInfo = require('./sagas').__get__('getLoyaltyInfo');
const getSiteId = require('./sagas').__get__('getSiteId');
const getTenantId = require('./sagas').__get__('getTenantId');
const getLoyaltyInfoMap = require('./sagas').__get__('getLoyaltyInfoMap');
const getClosedOrder = require('./sagas').__get__('getClosedOrder');
const getCartLoyaltyInfo = require('./sagas').__get__('getCartLoyaltyInfo');
const getCurrentStore = require('./sagas').__get__('getCurrentStore');

const siteList = [{ id: '1', loyaltyDetails: {} }];

const contextId = '1234';
const inquiryId = 'abcd';
const displayProfileId = '123';

describe('Loyalty Saga', () => {
  describe('get Account Info', () => {
    const isDelayAccount = false;
    const generator = cloneableGenerator(saga.getAccountInfo)(contextId, displayProfileId, inquiryId, isDelayAccount);
    let clone;
    const accountPayload = {
      contextId,
      inquiryId
    };
    const accountResponse = {
      loyaltyAccountTierData: {},
      status: 200
    };
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    it('get account info success action', () => {
      expect(clone.next(siteList[0]).value).toEqual(call(saga.accountInfo, accountPayload));
      expect(clone.next(accountResponse).done).toEqual(true);
    });
    it('get account info success action without retry and delay param', () => {
      const generator = cloneableGenerator(saga.getAccountInfo)(contextId, displayProfileId, inquiryId);
      clone = generator.clone();
      clone.next();
      expect(clone.next(siteList[0]).value).toEqual(call(saga.accountInfo, accountPayload));
      expect(clone.next(accountResponse).done).toEqual(true);
    });
    // it('get account info success action with retry > 1', () => {
    //   const waitTime = loyaltyConfig.defaultLoyaltyWaitTime * 1000;
    //   const generator = cloneableGenerator(saga.getAccountInfo)(contextId, inquiryId, isDelayAccount);
    //   clone = generator.clone();
    //   clone.next();
    //   accountResponse.status = 202;
    //   expect(clone.next(siteList[0]).value).toEqual(call(saga.accountInfo, accountPayload));
    //   expect(clone.next(accountResponse).value).toEqual(call(delay, waitTime));
    //   accountResponse.status = 200;
    //   expect(clone.next(siteList[0]).value).toEqual(call(saga.accountInfo, accountPayload));
    //   expect(clone.next(accountResponse).done).toEqual(true);
    // });
    it('get account info success action with delay true', () => {
      const isDelayAccount = true;
      const waitTime = loyaltyConfig.defaultLoyaltyWaitTime * 1000;
      const generator = cloneableGenerator(saga.getAccountInfo)(contextId, displayProfileId, inquiryId, isDelayAccount);
      clone = generator.clone();
      clone.next();
      expect(clone.next(siteList[0]).value).toEqual(call(delay, waitTime));
      expect(clone.next().value).toEqual(call(saga.accountInfo, accountPayload));
      expect(clone.next(accountResponse).done).toEqual(true);
    });
    // it('get account info catch error', () => {
    //   accountResponse.status = 202;
    //   try {
    //     expect(clone.next(siteList[0]).value).toEqual(call(saga.accountInfo, accountPayload));
    //     expect(clone.next(accountResponse).done).toEqual(true);
    //   } catch (error) {
    //     expect(new Error('Failed to get account information')).toEqual(error);
    //   }
    // });
  });

  describe('get Loyalty Inquiry Id', () => {
    const isDelayAccount = true;
    const generator = cloneableGenerator(saga.getLoyaltyInquiryId)(contextId, displayProfileId);
    let clone;
    const loyaltyRewardsInfo = {
      selectedOption: 'phone',
      formatNumber: '425-875-2324'
    };
    const selectedOption = 'phone';
    const profitCenterDetails = 'test';
    const tenantId = 1;
    const inquiryPayload = {
      tenantId: undefined,
      contextId,
      accountIdentifier: {
        type: 'PHONE_NUMBER',
        value: loyaltyRewardsInfo.formatNumber.replace(/[-\s]+/g, '')
      },
      cardSource: loyaltyConfig.cardSource,
      properties: {
        loyaltyProviderId: undefined,
        siteId: undefined,
        profitCenterName: profitCenterDetails
      }
    };
    const loyaltyInfo = {
      loyaltyInfo: loyaltyRewardsInfo,
      selectedOption: selectedOption,
      siteId: contextId,
      inquiryId
    };
    const loyaltyInfoMap = {
      [contextId]: loyaltyInfo
    };
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    // it('get Loyalty Inquiry Id success action', () => {
    //   clone.next(loyaltyRewardsInfo);
    //   clone.next(loyaltyInfoMap);
    //   clone.next(siteList[0]);
    //   expect(clone.next().value).toEqual(call(getProfitCenterId, contextId));
    //   expect(clone.next(profitCenterDetails).value).toEqual(put(saga.sentLoyaltyInquiry()));
    //   expect(clone.next().value).toEqual(call(saga.accountInquiry, inquiryPayload));
    //   loyaltyRewardsInfo.inquiryId = inquiryId;
    //   expect(clone.next(inquiryId).value).toEqual(put(saga.setCartLoyaltyInfo(contextId, loyaltyRewardsInfo)));
    //   expect(clone.next().value).toEqual(put(saga.loyaltyInquirySuccess(inquiryId)));
    //   expect(clone.next().value).toEqual(call(saga.sendLoyaltyRewardsInfo, contextId, isDelayAccount));
    //   expect(clone.next().done).toEqual(true);
    // });
    // it('get Loyalty Inquiry Id success action without passing siteId', () => {
    //   const generator = cloneableGenerator(saga.getLoyaltyInquiryId)();
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(loyaltyRewardsInfo);
    //   clone.next(contextId);
    //   clone.next(loyaltyInfoMap);
    //   clone.next(siteList[0]);
    //   expect(clone.next().value).toEqual(call(fetchProfitCenterIfNeeded, contextId));
    //   expect(clone.next(profitCenterDetails).value).toEqual(put(saga.sentLoyaltyInquiry()));
    //   expect(clone.next().value).toEqual(call(saga.accountInquiry, inquiryPayload));
    //   expect(clone.next().value).toEqual(put(saga.updateLoyaltyMap(loyaltyInfoMap)));
    //   expect(clone.next().value).toEqual(put(saga.loyaltyInquirySuccess(inquiryId)));
    //   expect(clone.next().done).toEqual(true);
    // });
    // it('get Loyalty Inquiry Id failure action without passing siteId', () => {
    //   const generator = cloneableGenerator(saga.getLoyaltyInquiryId)();
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(loyaltyRewardsInfo);
    //   clone.next(contextId);
    //   clone.next(loyaltyInfoMap);
    //   clone.next(siteList[0]);
    //   expect(clone.next().value).toEqual(call(fetchProfitCenterIfNeeded, contextId));
    //   expect(clone.throw().value).toEqual(put(saga.updateLoyaltyMap(loyaltyInfoMap)));
    //   expect(clone.next().value).toEqual(put(saga.loyaltyInquiryFailed()));
    //   expect(clone.next().done).toEqual(true);
    // });
  });

  describe('send Loyalty Rewards Info', () => {
    const isDelayAccount = false;
    const generator = cloneableGenerator(saga.sendLoyaltyRewardsInfo)(contextId, displayProfileId, isDelayAccount);
    let clone;
    const cartLoyaltyInfo = {
      contextId,
      inquiryId
    };
    const store = {
      loyaltyDetails: {
        accountInquiryFailureText: 'account inquiry failed'
      }
    };
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    it('send Reward info success action', () => {
      const accountInfo = {
        loyaltyAccountTierData: {loyaltyAccountTiers: [{test: '1234'}]}
      };
      clone.next(cartLoyaltyInfo);
      expect(clone.next(store).value).toEqual(put(saga.loyaltyInfoSent()));
      expect(clone.next().value).toEqual(call(saga.getAccountInfo, contextId, displayProfileId, inquiryId, isDelayAccount));
      expect(clone.next(accountInfo).value).toEqual(put(saga.loyaltyInfoSuccess(accountInfo.loyaltyAccountTierData, contextId)));
      expect(clone.next().done).toEqual(true);
    });
    it('send Reward info success action with empty array', () => {
      clone.next(cartLoyaltyInfo);
      expect(clone.next(store).value).toEqual(put(saga.loyaltyInfoSent()));
      expect(clone.next().value).toEqual(call(saga.getAccountInfo, contextId, displayProfileId, inquiryId, isDelayAccount));
      expect(clone.next().value).toEqual(put(saga.loyaltyInfoSuccess([], contextId)));
      expect(clone.next().done).toEqual(true);
    });
    it('send Reward info failure action', () => {
      clone.next(cartLoyaltyInfo);
      expect(clone.next(store).value).toEqual(put(saga.loyaltyInfoSent()));
      expect(clone.throw().value).toEqual(put(saga.loyaltyInfoFailed(store.loyaltyDetails.accountInquiryFailureText)));
    });
    it('send Reward success with cart empty', () => {
      clone.next();
      expect(clone.next(store).done).toEqual(true);
    });
  });

  describe('get Loyalty Accrue', () => {
    const accountNumber = 123;
    const generator = cloneableGenerator(saga.getLoyaltyAccrue)(accountNumber);
    let clone;
    const closedOrder = {
      order: {
        orderNumber: 123,
        orderId: 123,
        contextId
      }
    };
    const accrualObject = {
      accountEntryMethod: loyaltyConfig.cardSource,
      accountId: accountNumber,
      orderNumber: closedOrder.order.orderNumber,
      cardType: 'ACCOUNT_NUMBER',
      properties: {
        employeeId: undefined,
        terminalId: undefined
      }
    };
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    it('get Loyalty Accrue success action', () => {
      clone.next(closedOrder);
      clone.next(displayProfileId);
      expect(clone.next(siteList[0]).value).toEqual(call(saga.pointAccrual, contextId, closedOrder.order.orderNumber, accrualObject));
      expect(clone.next().value).toEqual(put(saga.loyaltyAccrueSuccess()));
      expect(clone.next().done).toEqual(true);
    });
    it('get Loyalty Accrue failure action', () => {
      clone.next(closedOrder);
      clone.next(displayProfileId);
      expect(clone.next(siteList[0]).value).toEqual(call(saga.pointAccrual, contextId, closedOrder.order.orderNumber, accrualObject));
      expect(clone.throw().value).toEqual(put(saga.loyaltyAccrueFailed()));
      expect(clone.next().done).toEqual(true);
    });
  });

  describe('fetch point Accrual axios', () => {
    const mockResponse = {data: {message: 'accrrued'}};
    const orderId = '123';
    it('should fetch point Accrual', async () => {
      axios.post.mockReturnValueOnce(Promise.resolve(mockResponse));
      const response = await saga.pointAccrual(contextId, orderId, {});
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}loyalty/pointsAccrual/${contextId}/${orderId}`, {});
      expect(response).toEqual(mockResponse.data);
    });

    it('should fetch point Accrual catch error', async () => {
      const errorMessage = new Error('Failed to point Accrual');
      axios.post.mockReturnValueOnce(Promise.reject(errorMessage));
      try {
        await saga.pointAccrual(contextId, orderId, {});
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}loyalty/pointsAccrual/${contextId}/${orderId}`, {});
      } catch (error) {
        expect(error).toEqual(errorMessage);
      }
    });
  });

  describe('fetch account Info axios', () => {
    const mockResponse = {data: {account: '123'}};
    it('should fetch account Info', async () => {
      axios.post.mockReturnValueOnce(Promise.resolve(mockResponse));
      const response = await saga.accountInfo({});
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}loyalty/pointsAccrual/1234/123`, {});
      expect(response).toEqual({});
    });
  });

  describe('fetch account Inquiry axios', () => {
    const mockResponse = {data: {account: '123'}};
    it('should account Inquiry', async () => {
      axios.post.mockReturnValueOnce(Promise.resolve(mockResponse));
      const response = await saga.accountInquiry({});
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}loyalty/accountInquiry`, {});
      expect(response).toEqual(mockResponse.data);
    });

    it('should account Inquiry catch error', async () => {
      const errorMessage = new Error('Failed to account inquiry');
      axios.post.mockReturnValueOnce(Promise.reject(errorMessage));
      try {
        await saga.accountInquiry({});
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}loyalty/accountInquiry`, {});
      } catch (error) {
        expect(error).toEqual(errorMessage);
      }
    });
  });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24}},
      cart: {closedOrder: {items: []}},
      sites: {raw: [{name: 'test'}],
        lastUpdate: 'today',
        list: [{id: '1'}]},
      loyalty: {
        loyaltyInfo: 'test',
        selectedOption: '',
        siteId: 'abc',
        loyaltyInfoMap: '',
        cartLoyaltyInfo: ''
      }
    };
    it('should get tenant id', () => {
      expect(getTenantId(payload)).toEqual(payload.app.config.tenantId);
    });
    // it('should get loyalty info', () => {
    //   expect(getLoyaltyInfo(payload)).toEqual(payload.loyalty.loyaltyInfo);
    // });
    it('should get loyalty site id', () => {
      expect(getSiteId(payload)).toEqual(payload.loyalty.siteId);
    });
    it('should get LoyaltyInfo Map', () => {
      expect(getLoyaltyInfoMap(payload)).toEqual(payload.loyalty.loyaltyInfoMap);
    });
    it('should get Closed Order', () => {
      expect(getClosedOrder(payload)).toEqual(payload.cart.closedOrder);
    });
    it('should get CartLoyalty Info', () => {
      expect(getCartLoyaltyInfo(payload)).toEqual(payload.loyalty.cartLoyaltyInfo);
    });
    it('should get Current Store', () => {
      expect(getCurrentStore(payload.sites.list[0].id)(payload)).toEqual(payload.sites.list[0]);
    });
  });

});
