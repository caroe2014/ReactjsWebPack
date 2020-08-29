// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as saga from './sagas';
import axios from 'axios';
import config from 'app.config';

const getTenantId = require('./sagas').__get__('getTenantId');
const storeToken = require('./sagas').__get__('storeToken');
const getStoresList = require('./sagas').__get__('getStoresList');
const shouldPostCreditCardsAsExternalPayments = require('./sagas').__get__('shouldPostCreditCardsAsExternalPayments');
const getOrder = require('./sagas').__get__('getOrder');
const getMobileNumber = require('./sagas').__get__('getMobileNumber');
const getSelectedContextID = require('./sagas').__get__('getSelectedContextID');
const getProfileId = require('./sagas').__get__('getProfileId');
const getCurrencyDetails = require('./sagas').__get__('getCurrencyDetails');

/* global describe, it, expect, beforeEach */

/* eslint-disable max-len */

const autoFetchTokenApi = require('./sagas').__get__('autoFetchTokenApi');

const tenantID = '24';
const sToken = '344';
const order = { orderId: '434', contextId: 'abcd' };
const checkoutOrder = { orderId: '434', contextId: 'abcd', taxIncludedTotalAmount: {amount: '10'} };
const storeList = [{id: 'abcd', displayOptions: {}, profitCenterDetails: {}}];
const currencyDetails = {};
const contextId = 'abcd';
const profileId = '434';
const conceptId = '2434';
const requestSaleData = {
  tokenizedData: sToken,
  tenantId: tenantID,
  profitCenterDetails: {}
};
const processPaymentAsExternalPayment = {type: 'cc'};
const paymentObj = {
  order: { orderId: '434', contextId: 'abcd' },
  igSettings: storeList[0].displayOptions,
  processPaymentAsExternalPayment,
  tenantId: '24',
  terminalId: undefined,
  tokenizedData: '344',
  currencyDetails,
  profitCenterDetails: requestSaleData.profitCenterDetails,
  capacitySuggestionPerformed: false
};

const checkoutPaymentObj = {
  authorizedAmount: checkoutOrder.taxIncludedTotalAmount.amount,
  order: checkoutOrder,
  transactionId: '',
  igSettings: storeList[0].displayOptions,
  processPaymentAsExternalPayment: true,
  subtotal: checkoutOrder.taxIncludedTotalAmount.amount,
  currencyDetails
};

describe('iFrame Saga', () => {
  describe('Fetch API Token', () => {
    const generator = cloneableGenerator(saga.fetchApiToken)();
    let clone;
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    // it('api token success action', () => {
    //   clone.next(tenantID);
    //   clone.next(contextId);
    //   clone.next(profileId);
    //   expect(clone.next(conceptId).value).toEqual(call(saga.fetchToken, tenantID, contextId, profileId, conceptId));
    //   expect(clone.next().value).toEqual(put(saga.getTokenSucceeded()));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('api token failure action', () => {
    //   clone.next(tenantID);
    //   clone.next(contextId);
    //   clone.next(profileId);
    //   expect(clone.next(conceptId).value).toEqual(call(saga.fetchToken, tenantID, contextId, profileId, conceptId));
    //   expect(clone.throw().value).toEqual(put(saga.getTokenFailed()));
    //   expect(clone.next().done).toEqual(true);
    // });

    it('missing tenant id', () => {
      expect(clone.next().value).toEqual(put(saga.getTokenFailed('Missing Tenant ID')));
      expect(clone.next().done).toEqual(true);
    });
  });

  describe('Set Token', () => {
    // const generator = cloneableGenerator(saga.setTokenizedToken)();
    // let clone;
    // let kitchenString = 'delivery string';
    // let nameString = 'name string';
    // let mobileNumber = '123343445';
    // let seatNumber = '123';
    // let selectNumber = '123343445';
    // let profitCenterDetails = {};
    // beforeEach(() => {
    //   clone = generator.clone();
    //   clone.next();
    // });
    // it('set token success action', () => {
    //   paymentObj.deliveryLocation = kitchenString;
    //   paymentObj.mobileNumber = '1' + mobileNumber;
    //   clone.next(sToken);
    //   clone.next(order);
    //   clone.next(tenantID);
    //   clone.next(currencyDetails);
    //   clone.next(storeList);
    //   clone.next(profitCenterDetails);
    //   clone.next();
    //   clone.next(false);
    //   clone.next(processPaymentAsExternalPayment);
    //   clone.next(kitchenString);
    //   clone.next(nameString);
    //   clone.next(selectNumber);
    //   expect(clone.next().value).toEqual(call(saga.createClosedOrder, paymentObj));
    //   expect(clone.next().value).toEqual(put(saga.fetchEtfData()));
    //   expect(clone.next().value).toEqual(put(saga.saleTransactionSucceeded(undefined)));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('should order contain name string when name capture enabled', () => {
    //   paymentObj.deliveryLocation = nameString;
    //   paymentObj.mobileNumber = '1' + mobileNumber;
    //   clone.next(sToken);
    //   clone.next(order);
    //   clone.next(tenantID);
    //   clone.next(currencyDetails);
    //   clone.next(storeList);
    //   clone.next(profitCenterDetails);
    //   clone.next();
    //   clone.next(false);
    //   clone.next(processPaymentAsExternalPayment);
    //   clone.next();
    //   clone.next(nameString);
    //   clone.next(selectNumber);
    //   expect(clone.next(mobileNumber).value).toEqual(call(saga.createClosedOrder, paymentObj));
    //   expect(clone.next().value).toEqual(put(saga.fetchEtfData()));
    //   expect(clone.next().value).toEqual(put(saga.saleTransactionSucceeded(undefined)));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('should order contain seat number when delivery and name disabled', () => {
    //   paymentObj.deliveryLocation = seatNumber;
    //   paymentObj.mobileNumber = '1' + mobileNumber;
    //   clone.next(sToken);
    //   clone.next(order);
    //   clone.next(tenantID);
    //   clone.next(currencyDetails);
    //   clone.next(storeList);
    //   clone.next(profitCenterDetails);
    //   clone.next();
    //   clone.next(false);
    //   clone.next(processPaymentAsExternalPayment);
    //   clone.next();
    //   clone.next();
    //   clone.next(selectNumber);
    //   expect(clone.next(mobileNumber).value).toEqual(call(saga.createClosedOrder, paymentObj));
    //   expect(clone.next().value).toEqual(put(saga.fetchEtfData()));
    //   expect(clone.next().value).toEqual(put(saga.saleTransactionSucceeded(undefined)));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('set token failure action', () => {
    //   paymentObj.deliveryLocation = seatNumber;
    //   paymentObj.mobileNumber = '1' + mobileNumber;
    //   clone.next(sToken);
    //   clone.next(order);
    //   clone.next(tenantID);
    //   clone.next(currencyDetails);
    //   clone.next(storeList);
    //   clone.next(profitCenterDetails);
    //   clone.next();
    //   clone.next(false);
    //   clone.next(processPaymentAsExternalPayment);
    //   clone.next();
    //   clone.next();
    //   clone.next(selectNumber);
    //   expect(clone.next(mobileNumber).value).toEqual(call(saga.createClosedOrder, paymentObj));
    //   expect(clone.throw().value).toEqual(put(saga.saleTransactionFailed()));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('missing sToken', () => {
    //   paymentObj.deliveryLocation = seatNumber;
    //   paymentObj.mobileNumber = '1' + mobileNumber;
    //   clone.next();
    //   clone.next(order);
    //   clone.next(tenantID);
    //   clone.next(currencyDetails);
    //   clone.next(storeList);
    //   clone.next();
    //   clone.next(false);
    //   clone.next(processPaymentAsExternalPayment);
    //   clone.next();
    //   clone.next();
    //   clone.next();
    //   expect(clone.next().value).toEqual(put(saga.saleTransactionFailed('Transaction Failed')));
    //   expect(clone.next().done).toEqual(true);
    // });
  });

  describe('auto fetch API token', () => {
    const generator = cloneableGenerator(saga.autoFetchApiToken)();
    let clone;
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    // it('auto fetch api token success action', () => {
    //   clone.next(tenantID);
    //   clone.next(contextId);
    //   clone.next(profileId);
    //   expect(clone.next(conceptId).value).toEqual(call(autoFetchTokenApi, tenantID, contextId, profileId, conceptId));
    //   expect(clone.next().value).toEqual(put(saga.getAutoTokenSucceeded()));
    //   expect(clone.next().value).toEqual(put(saga.getTokenSucceeded()));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('auto fetch api token failure action', () => {
    //   clone.next(tenantID);
    //   clone.next(contextId);
    //   clone.next(profileId);
    //   expect(clone.next(conceptId).value).toEqual(call(autoFetchTokenApi, tenantID, contextId, profileId, conceptId));
    //   expect(clone.throw().value).toEqual(put(saga.getAutoTokenFailed()));
    //   expect(clone.next().done).toEqual(true);
    // });

    it('auto fetch missing tenant id', () => {
      expect(clone.next().value).toEqual(put(saga.getTokenFailed('Missing Tenant ID')));
      expect(clone.next().done).toEqual(true);
    });
  });

  describe('auto fetch token API', () => {
    const generator = cloneableGenerator(autoFetchTokenApi)(tenantID, contextId, profileId, conceptId);
    let clone;
    beforeEach(() => {
      clone = generator.clone();
    });
    it('api token success action', () => {
      expect(clone.next().value).toEqual(call(saga.fetchToken, tenantID, contextId, profileId, conceptId));
      expect(clone.next().done).toEqual(true);
    });

    it('should api token catch error', () => {
      try {
        expect(clone.throw().value).toEqual(call(saga.fetchToken, tenantID, contextId, profileId, conceptId));
      } catch (error) {
        expect(clone.next().done).toEqual(true);
      }
    });
  });

  describe('fetch token axios', () => {
    const mockResponse = {data: {token: '342'}};
    it('should fetch token', async () => {
      axios.post.mockReturnValue(Promise.resolve(mockResponse));
      const response = await saga.fetchToken(tenantID, contextId, profileId);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}iFrame/token/${tenantID}`, {contextId, profileId});
      expect(response).toEqual(mockResponse.data);
    });

    it('should fetch token catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('Failed to fetch  token')));
      try {
        await saga.fetchToken(tenantID, contextId, profileId);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}iFrame/token/${tenantID}`, {contextId, profileId});
      } catch (error) {
        expect(error).toEqual(new Error('Failed to fetch  token'));
      }
    });
  });

  describe('make transaction axios', () => {
    const mockResponse = {data: {token: '342'}};
    const payload = {name: 'test data'};
    it('should make transaction', async () => {
      axios.post.mockReturnValue(Promise.resolve(mockResponse));
      const response = await saga.makeTransaction(payload);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}iFrame/sale`, payload);
      expect(response).toEqual(mockResponse.data);
    });

    it('should make transaction catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('make transaction failed')));
      try {
        await saga.makeTransaction(tenantID, contextId, profileId);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}iFrame/sale`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('make transaction failed'));
      }
    });
  });

  describe('create closed order axios', () => {
    const mockResponse = {data: {order: '342'}};
    const payload = {name: 'test data'};
    it('should create closed order', async () => {
      axios.post.mockReturnValue(Promise.resolve(mockResponse));
      const response = await saga.createClosedOrder(payload);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/createClosedOrder`, payload);
      expect(response).toEqual(mockResponse.data);
    });

    it('should create closed order catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('Failed to create closed order')));
      try {
        await saga.createClosedOrder(payload);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/createClosedOrder`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to create closed order'));
      }
    });
  });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24, storeList: [{businessContextId: contextId, displayProfileId: '123'}]}},
      sites: {selectedId: 4, currencyForPay: {}, scheduledTime: 34, list: [{id: contextId}], shouldPostCreditCardsAsExternalPayments: true, orderConfig: {sms: {isSmsEnabled: true}}},
      cart: {readyTime: 45, order: 23, items: [{contextId}], closedOrder: {items: []}, cartOpen: 12, undoItem: false},
      delivery: {kitchenString: 'test'},
      payments: {tokenizedData: {}},
      smsnotification: {mobileNumber: 1233435},
      namecapture: {firstName: 'Test', lastInitial: 'T'}
    };
    it('should get tenant id', () => {
      expect(getTenantId(payload)).toEqual(payload.app.config.tenantId);
    });
    it('should get store token', () => {
      expect(storeToken(payload)).toEqual(payload.payments.tokenizedData);
    });
    it('should post credit cards as external payments', () => {
      expect(shouldPostCreditCardsAsExternalPayments(payload)).toEqual(payload.sites.shouldPostCreditCardsAsExternalPayments);
    });
    it('should get selected contextID', () => {
      expect(getSelectedContextID(payload)).toEqual(contextId);
    });
  });

});
