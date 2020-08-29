// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as saga from './sagas';
import axios from 'axios';
import config from 'app.config';
/* global describe, it, expect */
/* eslint-disable max-len */

const getCurrentStore = require('./sagas').__get__('getCurrentStore');
const sendToData = require('./sagas').__get__('sendToData');
const closedOrder = require('./sagas').__get__('closedOrder');
const getTip = require('./sagas').__get__('getTip');
const getTipEnabled = require('./sagas').__get__('getTipEnabled');
const getPaymentSaleData = require('./sagas').__get__('paymentSaleData');
const getSaleTime = require('./sagas').__get__('saleTime');
const mockCurrencyDetails = require('./sagas').__get__('getCurrencyDetails');
const getDeliveryLocation = require('./sagas').__get__('getDeliveryLocation');
const getNameCapture = require('./sagas').__get__('getNameCapture');

const tip = 10;
const tipEnabled = false;
const sendTo = 'test@email.com';
const businessContextId = 'eadf-345ddgds';
const saleTime = '12:10 PM';
const readyTime = '3:30 PM';
const gaPaymentConfig = {
  accountNumberLabelText: 'Account number',
  secondaryVerificationType: 'POSTING_ACCOUNT'
};
const selectedGAIndex = 1;
const selectedGAAccount = {
  gaTenderName: 'Payroll Deduct',
  limitOnAccount: true,
  remainingBalance: {
    amount: '123.56'
  }
};
const closeOrderData = {
  name: 'test',
  total: 100,
  order: {
    contextId: businessContextId,
    gaPayment: {
      selectedIndex: 0,
      gaAccountInfo: {
        gaTenderName: 'Payroll',
        accountAssociatedGaTenders: [
          selectedGAAccount
        ]
      }
    }
  }
};
const closeOrderReceived = { logoDetails: {}, name: 'test', selectedId: 'eadf-345ddgds', total: 100 };
const receiptData = { receiptId: '12' };
const templateData = '<html><body>Test Html data</body</html>';
const sendReceipt = {
  emailInfo: {
    sendTo
  },
  receiptHtml: templateData,
  sendOrderTo: sendTo,
  contextId: businessContextId
};
const paymentSaleData = {};
let storeData = [
  {
    id: businessContextId,
    image: ''
  }
];
const currencyDetails = {};
const deliveryLocation = {};
const nameCapture = {};
const smsReceipt = {
  sendOrderTo: sendTo,
  contextId: businessContextId,
  total: closeOrderData.total
};
const expectedValues = {
  logoDetails: {},
  name: 'test',
  order: {
    contextId: 'eadf-345ddgds'
  },
  saleTransactionData: {},
  selectedId: 'eadf-345ddgds',
  stripeChargeData: undefined,
  stripeSaleData: undefined,
  tip: tip,
  total: 100
};

const etfEnabled = true;
const dateTime = '12-12-2019 12:12';

describe('Comunication Saga', () => {
  // describe('Fetch and Send receipt', () => {
  //   const generator = cloneableGenerator(saga.fetchAndSendReceipt)();
  //   let clone;
  //   let tipEnabled = true;
  //   let emailInfo = { sendTo: 'test@email.com' };
  //   it('send receipt success action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next(sendTo);
  //     clone.next(closeOrderData);
  //     clone.next(saleTime);
  //     clone.next(paymentSaleData);
  //     clone.next();
  //     clone.next();
  //     clone.next(storeData);
  //     clone.next(tip);
  //     clone.next(etfEnabled);
  //     clone.next(dateTime);
  //     clone.next(deliveryLocation);
  //     clone.next(nameCapture);
  //     clone.next(tipEnabled);
  //     clone.next(readyTime);
  //     clone.next(gaPaymentConfig);
  //     expect(clone.next(emailInfo).value).toEqual(call(saga.getLogoImage, ''));
  //     clone.next(currencyDetails);
  //     clone.next(closeOrderData);
  //     // expect(clone.next(closeOrderData).value).toEqual(call(saga.createReceiptData, closeOrderData, expectedValues, {}, {}, tipEnabled, saleTime, readyTime, etfEnabled, dateTime));
  //     expect(clone.next(receiptData).value).toEqual(call(saga.fetchReceipt, receiptData));
  //     expect(clone.next(templateData).value).toEqual(put(saga.getReceiptSucceeded(templateData)));
  //     expect(clone.next().value).toEqual(call(saga.sendEmailReceipt, sendReceipt));
  //     expect(clone.next().value).toEqual(put(saga.sendReceiptSucceeded()));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('send receipt failure action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next(sendTo);
  //     clone.next(closeOrderData);
  //     clone.next(saleTime);
  //     clone.next(paymentSaleData);
  //     clone.next();
  //     clone.next();
  //     clone.next(storeData);
  //     clone.next(tip);
  //     clone.next(etfEnabled);
  //     clone.next(dateTime);
  //     clone.next(deliveryLocation);
  //     clone.next(nameCapture);
  //     clone.next(tipEnabled);
  //     clone.next(readyTime);
  //     clone.next(gaPaymentConfig);
  //     expect(clone.next(emailInfo).value).toEqual(call(saga.getLogoImage, ''));
  //     clone.next(currencyDetails);
  //     clone.next(closeOrderData);
  //     // expect(clone.next(closeOrderData).value).toEqual(call(saga.createReceiptData, closeOrderData, expectedValues, {}, {}, tipEnabled, saleTime, readyTime, etfEnabled, dateTime));
  //     expect(clone.next(receiptData).value).toEqual(call(saga.fetchReceipt, receiptData));
  //     expect(clone.next(templateData).value).toEqual(put(saga.getReceiptSucceeded(templateData)));
  //     expect(clone.next().value).toEqual(call(saga.sendEmailReceipt, sendReceipt));
  //     expect(clone.throw('send receipt failed').value).toEqual(put(saga.sendReceiptFailed('send receipt failed')));
  //     expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('get receipt failure action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next(sendTo);
  //     clone.next(closeOrderData);
  //     clone.next(saleTime);
  //     clone.next(paymentSaleData);
  //     clone.next();
  //     clone.next();
  //     clone.next(storeData);
  //     clone.next(tip);
  //     clone.next(etfEnabled);
  //     clone.next(dateTime);
  //     clone.next(deliveryLocation);
  //     clone.next(nameCapture);
  //     clone.next(tipEnabled);
  //     clone.next(readyTime);
  //     clone.next(gaPaymentConfig);
  //     expect(clone.next(emailInfo).value).toEqual(call(saga.getLogoImage, ''));
  //     clone.next(currencyDetails);
  //     clone.next(closeOrderData);
  //     // expect(clone.next(closeOrderData).value).toEqual(call(saga.createReceiptData, closeOrderData, expectedValues, {}, {}, tipEnabled, saleTime, readyTime, etfEnabled, dateTime));
  //     expect(clone.next(receiptData).value).toEqual(call(saga.fetchReceipt, receiptData));
  //     expect(clone.throw('get receipt data failed').value).toEqual(put(saga.getReceiptFailed('get receipt data failed')));
  //     expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('missing sendto receipt failure action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next();
  //     clone.next(closeOrderData);
  //     clone.next(saleTime);
  //     clone.next(paymentSaleData);
  //     clone.next();
  //     clone.next();
  //     clone.next(storeData);
  //     clone.next(tip);
  //     clone.next(etfEnabled);
  //     clone.next(dateTime);
  //     clone.next(deliveryLocation);
  //     clone.next(nameCapture);
  //     clone.next(tipEnabled);
  //     clone.next(readyTime);
  //     clone.next(gaPaymentConfig);
  //     expect(clone.next(emailInfo).value).toEqual(put(saga.getReceiptFailed('Missing to info')));
  //     expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')));
  //     expect(clone.next().done).toEqual(true);
  //   });
  // });

  // describe('Send SMS receipt Saga', () => {
  //   const generator = cloneableGenerator(saga.fetchAndSendSMSReceipt)();
  //   let clone;
  //   it('send sms receipt success action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next(sendTo);
  //     expect(clone.next(closeOrderData).value).toEqual(call(saga.sendSMSReceipt, smsReceipt));
  //     expect(clone.next().value).toEqual(put(saga.sendReceiptSucceeded()));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('send sms receipt failure action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next(sendTo);
  //     expect(clone.next(closeOrderData).value).toEqual(call(saga.sendSMSReceipt, smsReceipt));
  //     expect(clone.throw('sms receipt failed').value).toEqual(put(saga.sendReceiptFailed('sms receipt failed')));
  //     expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('missing sendto receipt failure action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next();
  //     expect(clone.next().value).toEqual(put(saga.getReceiptFailed('Missing to info')));
  //     expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')));
  //     expect(clone.next().done).toEqual(true);
  //   });
  // });

  // describe('fetch receipt for print Saga', () => {
  //   const generator = cloneableGenerator(saga.fetchReceiptForPrint)();
  //   let clone;
  //   it('send fetch receipt for print success action', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next(closeOrderData);
  //     clone.next(saleTime);
  //     clone.next(paymentSaleData);
  //     clone.next();
  //     clone.next();
  //     clone.next(storeData);
  //     clone.next(tip);
  //     clone.next(etfEnabled);
  //     clone.next(dateTime);
  //     clone.next(currencyDetails);
  //     clone.next(deliveryLocation);
  //     clone.next(nameCapture);
  //     clone.next(readyTime);
  //     clone.next(tipEnabled);
  //     clone.next(selectedGAIndex);
  //     clone.next(selectedGAAccount);
  //     expect(clone.next(gaPaymentConfig).value).toEqual(call(saga.getLogoImage, ''));
  //     expect(clone.next().value).toEqual(call(saga.createReceiptData, closeOrderData, currencyDetails, deliveryLocation || nameCapture, {}, tipEnabled, saleTime, readyTime, etfEnabled, dateTime, 
  //       gaPaymentConfig.accountNumberLabelText, selectedGAAccount.gaTenderName, selectedGAAccount.remainingBalance.amount));
  //     expect(clone.next().value).toEqual(put(saga.setPrintData()));
  //     expect(clone.next().done).toEqual(true);
  //   });

  //   it('should catch exception on send fetch receipt', () => {
  //     clone = generator.clone();
  //     clone.next();
  //     clone.next(closeOrderData);
  //     clone.next(saleTime);
  //     clone.next(paymentSaleData);
  //     clone.next();
  //     clone.next();
  //     clone.next(storeData);
  //     clone.next(tip);
  //     clone.next(etfEnabled);
  //     clone.next(dateTime);
  //     clone.next(currencyDetails);
  //     clone.next(deliveryLocation);
  //     clone.next(nameCapture);
  //     clone.next(readyTime);
  //     clone.next(tipEnabled);
  //     clone.next(selectedGAIndex);
  //     clone.next(selectedGAAccount);
  //     expect(clone.next(gaPaymentConfig).value).toEqual(call(saga.getLogoImage, ''));
  //     expect(clone.throw('receipt fetch failure').value).toEqual(put(saga.getReceiptFailed('receipt fetch failure')));
  //     expect(clone.next().value).toEqual(put(saga.setAppError(new Error('Something went wrong \nwe are working on it, please try again after few minutes'), 'ERROR_STANDARD')));
  //     expect(clone.next().done).toEqual(true);
  //   });
  // });

  describe('fetch receipt axios', () => {
    const payload = {data: {receiptData: {id: '123', name: 'test'}}};
    it('should fetch receipt', async () => {
      axios.post.mockReturnValue(Promise.resolve(payload));
      const response = await saga.fetchReceipt(payload);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/getReceipt`, payload);
      expect(response).toEqual(payload.data);
    });

    it('should fetch receipt catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('receipt error')));
      try {
        await saga.fetchReceipt(payload);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/getReceipt`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('receipt error'));
      }
    });
  });

  describe('send email receipt axios', () => {
    const payload = {data: {receiptData: {id: '123', name: 'test'}}};
    it('should send email receipt', async () => {
      axios.post.mockReturnValue(Promise.resolve(payload));
      const response = await saga.sendEmailReceipt(payload);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/sendEmailReceipt`, payload);
      expect(response).toEqual(payload.data);
    });

    it('should send email catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('email receipt error')));
      try {
        await saga.sendEmailReceipt(payload);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/sendEmailReceipt`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('email receipt error'));
      }
    });
  });

  describe('send SMS receipt axios', () => {
    const payload = {data: {receiptData: {id: '123', name: 'test'}}};
    it('should send SMS receipt', async () => {
      axios.post.mockReturnValue(Promise.resolve(payload));
      const response = await saga.sendSMSReceipt(payload);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/sendEmailReceipt`, payload);
      expect(response).toEqual(payload.data);
    });

    it('should send SMS catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('SMS receipt error')));
      try {
        await saga.sendSMSReceipt(payload);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/sendEmailReceipt`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('SMS receipt error'));
      }
    });
  });

  describe('create receipt data axios', () => {
    const closedOrderData = {id: 10};
    const currencyDetails = {currency: '$'};
    const deliveryLocation = {roomNo: 123};
    const orderPlacedTime = '12:10 PM';
    const nameCapture = false;
    const readyTime = '04:30 PM';
    const payload = {data: {closedOrderData, currencyDetails, deliveryLocation, nameCapture, orderPlacedTime, readyTime, tipEnabled}};
    it('should create receipt data', async () => {
      axios.post.mockReturnValue(Promise.resolve(payload));
      const response = await saga.createReceiptData(closedOrderData, currencyDetails, deliveryLocation, nameCapture, tipEnabled, orderPlacedTime, readyTime);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/createReceiptData`, payload.data);
      expect(response).toEqual(payload.data);
    });

    it('should create receipt catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('create receipt error')));
      try {
        await saga.createReceiptData(closedOrderData, currencyDetails, deliveryLocation, tipEnabled, orderPlacedTime);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}communication/createReceiptData`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('create receipt error'));
      }
    });
  });

  describe('get logo image axios', () => {
    const imageUrl = 'test url';

    it('should get logo image catch error', async () => {
      axios.get.mockReturnValue(Promise.reject(new Error('logo image error')));
      try {
        await saga.getLogoImage(imageUrl);
        expect(axios.get).toBeCalledWith(imageUrl, {'responseType': 'blob'});
      } catch (error) {
        expect(error).toEqual(new Error('logo image error'));
      }
    });
  });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24}},
      sites: {list: [{contexId: 'test', id: 'test'}], selectedId: 4, currencyForPay: {}, scheduledTime: 34, orderConfig: { nameCapture: {featureEnabled: true} }},
      cart: {readyTime: 45, order: 23, items: [], closedOrder: {items: []}, cartOpen: 12, undoItem: false, orderConfig: {tip: {acceptTips: true}, deliveryDestination: {deliverToDestinationEnabled: true}, nameCapture: {featureEnabled: true}}, paymentSaleData: {}, currencyDetails: {}},
      tip: {tipAmount: 10, tipData: {}},
      concept: {list: [{id: 2, schedule: 24}], conceptId: 2},
      communication: {sendToData: 'Test Data'},
      payments: {paymentSaleData: {}, saleTime: '12:10 pm'}};
    it('should get store data', () => {
      expect(getCurrentStore(payload.sites.list[0].contexId)(payload)).toEqual(payload.sites.list[0]);
    });
    it('should send to data', () => {
      expect(sendToData(payload)).toEqual(payload.communication.sendToData);
    });
    it('should closed order', () => {
      expect(closedOrder(payload)).toEqual(payload.cart.closedOrder);
    });
    it('should get tip', () => {
      expect(getTip(payload)).toEqual(payload.tip.tipData);
    });
    it('should get tip enabled', () => {
      expect(getTipEnabled(payload)).toEqual(true);
    });
    it('should get payment sale data', () => {
      expect(getPaymentSaleData(payload)).toEqual(payload.cart.paymentSaleData);
    });
    it('should get sale time', () => {
      expect(getSaleTime(payload)).toEqual(payload.cart.saleTime);
    });
    it('should get currency details', () => {
      expect(mockCurrencyDetails(payload)).toEqual(payload.cart.currencyDetails);
    });
    it('should get delivery location', () => {
      expect(getDeliveryLocation(payload)).toEqual(true);
    });
    it('should get name capture', () => {
      expect(getNameCapture(payload)).toEqual(true);
    });
  });

});
