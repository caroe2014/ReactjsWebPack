// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { setStripeToken, createClosedOrder, refundStripe,
  makeChargeSucceeded, makeChargeFailed, setAppError } from './sagas';
import { stripeCheckoutSucceeded, fetchEtfData } from 'web/client/app/modules/iFrame/sagas';
import axios from 'axios';
import config from 'app.config';

import { sendLoyaltyInfo } from 'web/client/app/modules/loyalty/sagas';
import { getScheduleTime } from 'web/client/app/modules/scheduleorder/sagas';
import { fetchProfitCenterIfNeeded } from 'web/client/app/modules/site/sagas';
/* global describe, it, expect, beforeEach */

const getStripeChargeData = require('./sagas').__get__('getStripeChargeData');
const getTipAmount = require('./sagas').__get__('getTipAmount');
const getStoresList = require('./sagas').__get__('getStoresList');
const getOrder = require('./sagas').__get__('getOrder');
const getMobileNumber = require('./sagas').__get__('getMobileNumber');
const getSelectedSiteId = require('./sagas').__get__('getSelectedSiteId');
const getCurrencyDetails = require('./sagas').__get__('getCurrencyDetails');
const contextId = 'abcd';

const order = { taxIncludedTotalAmount: { amount: '100.00' }, subTotalAmount: {amount: '5.00'}, contextId: '123' };
const siteId = '1234';
const paymentObj = {'authorizedAmount': '100.00',
  'currencyDetails': {'code': 'USD'},
  'deliveryLocation': 'Test',
  'igSettings': {},
  'mobileNumber': '11233545567',
  'order': {
    'contextId': '123',
    'subTotalAmount': {
      'amount': '5.00'
    },
    'taxIncludedTotalAmount': {
      'amount': '100.00'
    }
  },
  'processPaymentAsExternalPayment': true,
  'profileId': '12',
  'profitCenterDetails': {},
  'siteId': '1234',
  'subtotal': '100.00',
  'tipAmount': '12.00',
  'chargeData': {
    'id': '1234'
  }
}; // eslint-disable-line max-len
const storeList = [{id: '123', displayOptions: {}, profitCenterDetails: {}}];
const mobilenumber = '1233545567';
const kitchenString = 'Test';
const nameString = 'Test';
const tipAmount = '12.00';
const currencyDetails = {code: 'USD'};
const chargeData = { id: '1234' };
const profileId = '123';
const refundData = {
  businessContextId: siteId,
  transactionId: chargeData.id,
  profileId
};

describe('Stripe Pay Saga', () => {
  // describe('', () => {
  //   const generator = cloneableGenerator(setStripeToken)();
  //   let clone;
  //   let seatNumber = '123';
  //   let profileId = '12';
  //   let profitCenterDetails = {};
  //   beforeEach(() => {
  //     clone = generator.clone();
  //     clone.next();
  //   });
  //   it('raise stripe pay success action', () => {
  //     const chargeData = { id: '1234' };
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next(chargeData);
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next(kitchenString);
  //     clone.next(tipAmount);
  //     expect(clone.next(nameString).value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next(profitCenterDetails).value).toEqual(call(getScheduleTime));
  //     clone.next();
  //     expect(clone.next(profileId).value).toEqual(put(sendLoyaltyInfo('123', 2)));
  //     expect(clone.next(nameString).value).toEqual(call(createClosedOrder, paymentObj));
  //     expect(clone.next().value).toEqual(put(fetchEtfData()));
  //     expect(clone.next().value).toEqual(put(stripeCheckoutSucceeded()));
  //     expect(clone.next().value).toEqual(put(makeChargeSucceeded()));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('should order contain name string when name capture enabled', () => {
  //     const chargeData = { id: '1234' };
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next(chargeData);
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next();
  //     clone.next(tipAmount);
  //     expect(clone.next(nameString).value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next(profitCenterDetails).value).toEqual(call(getScheduleTime));
  //     clone.next();
  //     expect(clone.next(profileId).value).toEqual(put(sendLoyaltyInfo('123', 2)));

  //     expect(clone.next(nameString).value).toEqual(call(createClosedOrder, paymentObj));
  //     expect(clone.next().value).toEqual(put(fetchEtfData()));
  //     expect(clone.next().value).toEqual(put(stripeCheckoutSucceeded()));
  //     expect(clone.next().value).toEqual(put(makeChargeSucceeded()));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('should order contain seat number when delivery and name disabled', () => {
  //     paymentObj.deliveryLocation = seatNumber;
  //     const chargeData = { id: '1234' };
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next(chargeData);
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next();
  //     clone.next(tipAmount);
  //     expect(clone.next().value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next(profitCenterDetails).value).toEqual(call(getScheduleTime));
  //     clone.next();
  //     expect(clone.next(profileId).value).toEqual(put(sendLoyaltyInfo('123', 2)));

  //     expect(clone.next(nameString).value).toEqual(call(createClosedOrder, paymentObj));
  //     expect(clone.next().value).toEqual(put(fetchEtfData()));
  //     expect(clone.next().value).toEqual(put(stripeCheckoutSucceeded()));
  //     expect(clone.next().value).toEqual(put(makeChargeSucceeded()));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('raise stripe pay invalid charge data failure action', () => {
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next();
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next(kitchenString);
  //     clone.next(tipAmount);
  //     expect(clone.next(nameString).value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next().value).toEqual(put(makeChargeFailed('Stripe Transaction Failed')));
  //     expect(clone.next().value).toEqual(put(setAppError(new Error('Payment failed. Please try again.'), 'ERROR_FAILED_STRIPE')));
  //     expect(clone.next().done).toEqual(true);
  //   });
  //   it('raise stripe refund failure action', () => {
  //     const errorObject = {
  //       response: {
  //         data: {
  //           message: 'STRIPE_REFUND_FAILED'
  //         }
  //       }
  //     };
  //     const chargeData = { id: '1234' };
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next(chargeData);
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next();
  //     clone.next(tipAmount);
  //     expect(clone.next().value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next(profitCenterDetails).value).toEqual(call(getScheduleTime));
  //     clone.next();
  //     expect(clone.throw(errorObject).value).toEqual(put(setAppError(new Error('Payment failed with transaction id {{transactionId}}'), 'ERROR_REFUND', { transactionId: undefined })));
  //     expect(clone.next().value).toEqual(put(makeChargeFailed(errorObject.response)));
  //     expect(clone.next().done).toEqual(true);
  //   });
  //   it('raise stripe refund success action', () => {
  //     const errorObject = {
  //       response: {
  //         data: {
  //           message: 'STRIPE_REFUND_SUCCESS'
  //         }
  //       }
  //     };
  //     const chargeData = { id: '1234' };
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next(chargeData);
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next();
  //     clone.next(tipAmount);
  //     expect(clone.next().value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next(profitCenterDetails).value).toEqual(call(getScheduleTime));
  //     clone.next();
  //     expect(clone.throw(errorObject).value).toEqual(put(setAppError(new Error('Order failed and refund initiated. Please place a new order.'), 'ERROR_ORDER_FAILED')));
  //     expect(clone.next().value).toEqual(put(makeChargeFailed(errorObject.response)));
  //     expect(clone.next().done).toEqual(true);
  //   });
  //   it('raise stripe transaction failure action', () => {
  //     const errorObject = {
  //       response: {
  //         data: {
  //           message: 'STRIPE_TRANSACTION_FAILED'
  //         }
  //       }
  //     };
  //     const chargeData = { id: '1234' };
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next(chargeData);
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next();
  //     clone.next(tipAmount);
  //     expect(clone.next().value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next(profitCenterDetails).value).toEqual(call(getScheduleTime));
  //     clone.next();
  //     expect(clone.throw(errorObject).value).toEqual(put(setAppError(new Error('Payment failed. Please try again.'), 'ERROR_FAILED_STRIPE')));
  //     expect(clone.next().value).toEqual(put(makeChargeFailed(errorObject.response)));
  //     expect(clone.next().done).toEqual(true);
  //   });
  //   it('raise stripe failure action', () => {
  //     const errorObject = {
  //       response: {
  //         data: {
  //         }
  //       }
  //     };
  //     const chargeData = { id: '1234' };
  //     clone.next(order);
  //     clone.next(siteId);
  //     clone.next(chargeData);
  //     clone.next(currencyDetails);
  //     clone.next(storeList);
  //     clone.next(mobilenumber);
  //     clone.next();
  //     clone.next(tipAmount);
  //     expect(clone.next().value).toEqual(call(fetchProfitCenterIfNeeded, order.contextId));
  //     expect(clone.next(profitCenterDetails).value).toEqual(call(getScheduleTime));
  //     clone.next();
  //     expect(clone.throw(errorObject).value).toEqual(put(setAppError(new Error('Payment failed. Please try again.'), 'ERROR_FAILED_STRIPE')));
  //     expect(clone.next().value).toEqual(put(makeChargeFailed(errorObject.response)));
  //     expect(clone.next().done).toEqual(true);
  //   });
  // });

  describe('create closed order axios', () => {
    const mockResponse = {data: {order: '342'}};
    const payload = {name: 'test data'};
    it('should create closed order', async () => {
      axios.post.mockReturnValue(Promise.resolve(mockResponse));
      const response = await createClosedOrder(payload);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/createClosedOrderWallets`, payload);
      expect(response).toEqual(mockResponse.data);
    });

    it('should create closed order catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('Failed to create closed order')));
      try {
        await createClosedOrder(payload);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/createClosedOrderWallets`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to create closed order'));
      }
    });
  });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24,
      storeList:
      [{businessContextId: contextId, displayProfileId: '123'}]}},
    sites: {selectedId: 4,
      currencyForPay: {},
      scheduledTime: 34,
      list: [{id: contextId}],
      shouldPostCreditCardsAsExternalPayments: true,
      orderConfig: {sms: {isSmsEnabled: true}}},
    cart: {readyTime: 45, order: 23, items: [{contextId}], closedOrder: {items: []}, cartOpen: 12, undoItem: false},
    delivery: {kitchenString: 'test'},
    stripepayments: {stripeChargeData: {}},
    tip: {tipAmount: 10},
    payments: {tokenizedData: {}},
    smsnotification: {mobileNumber: 1233435},
    namecapture: {firstName: 'Test', lastInitial: 'T'}
    };
    it('should get stripe charge data', () => {
      expect(getStripeChargeData(payload)).toEqual(payload.stripepayments.stripeChargeData);
    });
    it('should get tip amount', () => {
      expect(getTipAmount(payload)).toEqual(payload.tip.tipAmount);
    });
    it('should get mobilenumber', () => {
      expect(getMobileNumber(payload)).toEqual(payload.smsnotification.mobileNumber);
    });
    it('should get currency details', () => {
      expect(getCurrencyDetails(payload)).toEqual(payload.sites.currencyForPay);
    });
    it('should get order', () => {
      expect(getOrder(payload)).toEqual(payload.cart.order);
    });
  });
});
