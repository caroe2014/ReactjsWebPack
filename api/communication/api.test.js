// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from './api';
import MockAgilysys from '../../test/agilysys.mock';
import Agilysys from '../../agilysys.lib/agilysys.lib';
import { _mockConfigHooks } from 'app.config';

/* global describe, it, expect, jest, beforeAll */
/* eslint-disable max-len */

jest.mock('../../agilysys.lib/agilysys.lib');
const mockAgilysys = new MockAgilysys();
Agilysys.mockImplementation(() => mockAgilysys);
const credentials = { data: 'sample credentials' };
let logger = _mockConfigHooks.logger;

const storeInfo = { name: 'test', timezone: 'America/Bogota' };

const orderData = {
  orderPlacedTime: '1995-12-17T06:24:00-05:00',
  etfEnabled: true,
  closedOrderData: {
    selectedId: '123',
    order: {
      deliveryProperties: {deliveryOption: {id: 'pickup'}},
      payments: [{ amount: { amount: 110 }, tipAmount: {amount: 0} }],
      payments2: [{ amount: { amount: 110 } }],
      subTotalAmount: { amount: 100 },
      subTotalTaxAmount: { amount: 110 },
      taxIncludedTotalAmount: { amount: 110 },
      orderNumber: 1234,
      properties: {
        packageOption: false,
        closedTerminalId: '321'
      },
      created: 'December 17, 1995 03:24:00',
      paymentModel: 1,
      saleTransactionData: {
        authCode: 123,
        authorizedAmount: 110,
        transactionResponseData: {
          authorizedAmount: 110,
          tipAmount: 10
        },
        cardInfo: {
          cardIssuer: '',
          cardType: 'VISA',
          accountNumberMasked: '****'
        }

      }
    },
    items: [
      {
        id: 1,
        displayText: 'test',
        price: {amount: 10.00},
        count: 1,
        selectedModifiers: [
          {
            id: 1,
            description: 'test modifiers',
            suboption: [
              {
                id: 5,
                description: 'sub modifiers'
              }
            ]
          }
        ]
      }
    ],
    logoDetails: 'logo details'
  },
  currencyDetails: {}
};

const output = {
  orderData: {
    checkNumber: 1234,
    currencyInfo: {
      currencyCode: 'USD',
      currencyCultureName: 'en-US',
      currencyDecimalDigits: 2,
      currencySymbol: '$'
    },
    dateTime: '1995-12-17T06:24:00-05:00',
    gratuity: undefined,
    lineItems: [{'displayText': 'test', 'lineItemGroups': [{'description': 'test modifiers', 'id': 1, 'lineItems': [{'displayText': 'test modifiers', 'lineItemGroups': [{'lineItems': [{'displayText': 'sub modifiers', 'price': undefined}]}], 'price': undefined}], 'suboption': [{'description': 'sub modifiers', 'id': 5}]}], 'price': 10, 'quantity': 1}],
    orderMessage: 'Your order will be ready for pickup at undefined.',
    paymentInfo: [{
      account: '****',
      amount: '110.00',
      authCode: 123,
      cardInfo: {
        cardIssuer: '',
        cardType: 'VISA',
        entryMode: 'External'
      },
      showAuthorizationInfoOnReceipt: true,
      tenderName: '',
      tipAmount: {
        amount: 0
      },
      transactionData: {
        authorizedAmount: 110,
        tipAmount: 10
      }
    }],
    printDateTime: 'Dec 17, 1995 6:24 AM',
    receiptDate: 'Dec 17, 1995',
    receiptTime: '6:24 AM',
    receipientName: undefined,
    storeInfo,
    printedReceiptLogo: 'logo details',
    subtotalAmount: 100,
    taxAmount: 110,
    terminalNumber: '321',
    timezoneOffsetMinutes: 300,
    totalAmount: '110.00'
  },
  templateName: 'OnDemandReceiptTemplate'
};

describe('communication api', () => {

  describe('get receipt', () => {

    beforeAll(() => {
      mockAgilysys.receipt = { data: { id: 1234 } };
    });

    it('get receipt success action', async () => {
      let data = await Api.getReceipt();
      expect(data).toEqual(mockAgilysys.receipt.data);
    });

    it('result data undefined if response is empty object', async () => {
      mockAgilysys.receipt = {};
      let data = await Api.getReceipt();
      expect(data).toEqual(undefined);
    });

    it('catch error if api throw error', async () => {
      mockAgilysys.receipt = undefined;
      let data = await Api.getReceipt();
      expect(data).toEqual(undefined);
    });
  });

  describe('send email receipt', () => {
    const emailContent = { sendOrderTo: 'test@gmail.com', emailInfo: 'test', receiptHtml: 'receipt image data', contextId: '1234' };
    // beforeAll(() => {
    //   mockAgilysys.sendEmailReceipt = { data: 'sample email data' };
    // });

    it('send email receipt success action', async () => {
      let data = await Api.sendEmailReceipt(credentials, emailContent);
      expect(data).toEqual(mockAgilysys.emailResponse);
    });

    it('send email receipt success action', async () => {
      let receiptData = {
        emailInfo: {
          receiptSubject: 'subject'
        },
        sendOrderTo: 'test@gmail.com',
        contextId: '1234'
      };
      let data = await Api.sendEmailReceipt(credentials, receiptData);
      expect(data).toEqual(mockAgilysys.emailResponse);
    });

    it('catch error if api throw error', async () => {
      let data = await Api.sendEmailReceipt(credentials, undefined);
      expect(logger.error).toBeCalled();
      expect(data).toEqual(undefined);
    });

  });

  describe('send SMS receipt', () => {
    const smsContent = { sendOrderTo: 'test@gmail.com', total: '100.00', contextId: '1234' };
    beforeAll(() => {
      mockAgilysys.smsResponse = { data: 'sample email data' };
    });

    it('send sms receipt success action', async () => {
      let data = await Api.sendSMSReceipt(credentials, smsContent);
      expect(data).toEqual(mockAgilysys.smsResponse);
    });

    it('catch error if api throw error', async () => {
      let data = await Api.sendSMSReceipt(credentials, undefined);
      expect(data).toEqual(undefined);
    });

  });

  describe('Create Receipt Data', () => {
    const storeInfo = { name: 'test', timezone: 'America/Bogota' };
    mockAgilysys.storeInfo = storeInfo;

    // it('create receipt data success action', async () => {
    //   let data = await Api.createReceiptData(credentials, orderData);
    //   expect(data).toEqual(output);
    // });

    // it('create receipt data success action with paymentModel 2', async () => {
    //   orderData.closedOrderData.order.paymentModel = 2;
    //   const output2 = JSON.parse(JSON.stringify(output));
    //   output2.orderData.paymentInfo[0].cardInfo.accountNumberMasked = '****';
    //   delete output2.orderData.paymentInfo[0].cardInfo.entryMode;
    //   output2.orderData.paymentInfo[0] = orderData.closedOrderData.order.payments2[0];
    //   output2.orderData.paymentInfo[0].showAuthorizationInfoOnReceipt = true;
    //   output2.orderData.gratuity = undefined;
    //   delete output2.orderData.paymentInfo[0].tipAmount;
    //   let data = await Api.createReceiptData(credentials, orderData);
    //   expect(data).toEqual(output2);
    // });

    // it('create receipt data with delivery location and modifiers', async () => {
    //   orderData.closedOrderData.order.paymentModel = 1;
    //   orderData.deliveryLocation = 'test';
    //   output.orderData.paymentInfo[0].buyPaymentForm = undefined;
    //   output.orderData.paymentInfo[0].amount = '110.00';
    //   delete output.orderData.seatNumber;

    //   let data = await Api.createReceiptData(credentials, orderData);
    //   expect(data).toEqual(output);
    // });

    // it('create receipt data without sale transaction data', async () => {
    //   orderData.closedOrderData.order.paymentModel = 1;
    //   orderData.deliveryLocation = 'test';
    //   delete orderData.closedOrderData.saleTransactionData;
    //   const output2 = JSON.parse(JSON.stringify(output));
    //   output2.orderData.paymentInfo[0].amount = '110.00';
    //   output2.orderData.totalAmount = '110.00';
    //   output2.orderData.paymentInfo[0].showAuthorizationInfoOnReceipt = true;
    //   output2.orderData.paymentInfo[0].cardInfo.cardIssuer = '';
    //   output2.orderData.paymentInfo[0].cardInfo.cardType = 'VISA';
    //   delete output2.orderData.seatNumber;

    //   let data = await Api.createReceiptData(credentials, orderData);
    //   expect(data).toEqual(output2);
    // });

    it('catch error if api throw error', async () => {
      let data = await Api.createReceiptData(credentials, undefined);
      expect(data).toEqual(undefined);
    });

  });

  describe('get Payment Amount', () => {
    const closedOrderData = {
      order: {
        saleTransactionData: {
          authorizedAmount: 123.234
        },
        payments: [{
          amount: {amount: 10.00},
          tipAmount: {amount: 5.00}
        }]
      }
    };

    it('should getPaymentAmount', async () => {
      let data = await Api.getPaymentAmount(closedOrderData);
      expect(data).toEqual(parseFloat(closedOrderData.order.saleTransactionData.authorizedAmount).toFixed(2));
    });

    it('should getPaymentAmount without authorizedAmount', async () => {
      delete closedOrderData.order.saleTransactionData.authorizedAmount;
      let data = await Api.getPaymentAmount(closedOrderData);
      expect(data).toEqual(parseFloat(closedOrderData.order.payments[0].amount.amount + closedOrderData.order.payments[0].tipAmount.amount).toFixed(2));
    });
  });
  describe('Get Order Message', () => {
    const deliveryProperties = {deliveryOption: {id: 'pickup'}};
    describe('Schedule time not enabled', () => {
      let scheduleTime;
      let scheduleDay;
      let deliveryEnabled = false;
      let nameEnabled = false;
      let deliveryLocation;
      const StroreName = 'Test';
      let readyTime;

      it('should get less than a minute when etf readytime is 0', () => {
        readyTime = {
          'etf': {
            'periodType': {
              'name': 'Minutes'
            },
            'minutes': 0,
            'fieldType': {
              'name': 'minutes'
            }
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in less than a minute.');
      });

      it('should get in a minute when etf readytime is 1', () => {
        readyTime = {
          'etf': {
            'periodType': {
              'name': 'Minutes'
            },
            'minutes': 1,
            'fieldType': {
              'name': 'minutes'
            }
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in a minute.');
      });

      it('should get in less than a minute when min and max time are 0', () => {
        readyTime = {
          'minTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 0
          },
          'maxTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 0
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in less than a minute.');
      });

      it('should get in about n minutes when min and max time are same and not 0', () => {
        readyTime = {
          'minTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 5
          },
          'maxTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 5
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in about <b>5</b> minutes.');
      });

      it('should get in a minute when min time is 0 and max time is 1', () => {
        readyTime = {
          'minTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 0
          },
          'maxTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 1
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in a minute.');
      });

      it('should get in less than n minutes when min time is 0 and max time is greatr than 1', () => {
        readyTime = {
          'minTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 0
          },
          'maxTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 5
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in less than <b>5</b> minutes.');
      });

      it('should get in m to n minutes when min and max times are available ', () => {
        readyTime = {
          'minTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 3
          },
          'maxTime': {
            'periodType': {
              'name': 'Minutes'
            },
            'fieldType': {
              'name': 'minutes'
            },
            'minutes': 6
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in <b>3 to 6</b> minutes.');
      });

      it('should get in about minutes when etf readytime is greater than 1', () => {
        readyTime = {
          'etf': {
            'periodType': {
              'name': 'Minutes'
            },
            'minutes': 5,
            'fieldType': {
              'name': 'minutes'
            }
          }
        };
        let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
        expect(result).toEqual('Your order will be ready for pickup at Test in about <b>5</b> minutes.');
      });

      describe('Get Order Message with old api call', () => {
        it('should get less than a minute when readytime is 0', () => {
          const newReadyTime = {
            minutes: 0
          };
          let result = Api.getOrderMessage(newReadyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
          expect(result).toEqual('Your order will be ready for pickup at Test in less than a minute.');
        });

        it('should get in a minute when readytime is 1', () => {
          const newReadyTime = {
            minutes: 1
          };
          let result = Api.getOrderMessage(newReadyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
          expect(result).toEqual('Your order will be ready for pickup at Test in a minute.');
        });

        it('should get in about minutes when readytime is greater than 1', () => {
          const newReadyTime = {
            minutes: 5
          };
          let result = Api.getOrderMessage(newReadyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
          expect(result).toEqual('Your order will be ready for pickup at Test in about <b>5</b> minutes.');
        });

        it('should not return  if value is negative', () => {
          readyTime = -5;
          let result = Api.getOrderMessage(readyTime, scheduleTime, scheduleDay, deliveryProperties, StroreName);
          expect(result).toEqual('Your order will be ready for pickup at Test.');
        });
      });
    });

    // describe('schedule time enabled', () => {
    //   let scheduleTime = '5:15 PM';
    //   let deliveryEnabled = false;
    //   let nameEnabled = false;
    //   let deliveryLocation;
    //   const StroreName = 'Test';
    //   let readyTime;

    //   it('should get default pick up message', () => {
    //     let result = Api.getOrderMessage(readyTime, scheduleTime, deliveryEnabled, nameEnabled, deliveryLocation, StroreName);
    //     expect(result).toEqual('Your order at Test will be ready for pick up at <b> 5:15 PM</b> today.');
    //   });

    //   it('should get pick up along with delivery location', () => {
    //     deliveryLocation = 'room 123';
    //     deliveryEnabled = true;
    //     let result = Api.getOrderMessage(readyTime, scheduleTime, deliveryEnabled, nameEnabled, deliveryLocation, StroreName);
    //     expect(result).toEqual('Your order at Test will be delivered by <b>5:15 PM</b> today at room 123.');
    //   });

    //   it('should get pick up when name capture enabled', () => {
    //     deliveryLocation = 'Agilysys';
    //     deliveryEnabled = false;
    //     nameEnabled = true;
    //     let result = Api.getOrderMessage(readyTime, scheduleTime, deliveryEnabled, nameEnabled, deliveryLocation, StroreName);
    //     expect(result).toEqual('Your order at Test will be ready for pick up at <b> 5:15 PM</b> today.');
    //   });

    //   it('should get default pick up message', () => {
    //     let result = Api.getOrderMessage(readyTime, scheduleTime, deliveryEnabled, nameEnabled, deliveryLocation, StroreName);
    //     expect(result).toEqual('Your order at Test will be ready for pick up at <b> 5:15 PM</b> today.');
    //   });

    //   it('should get pick up along with delivery location', () => {
    //     deliveryLocation = 'room 123';
    //     deliveryEnabled = true;
    //     let result = Api.getOrderMessage(readyTime, scheduleTime, deliveryEnabled, nameEnabled, deliveryLocation, StroreName);
    //     expect(result).toEqual('Your order at Test will be delivered by <b>5:15 PM</b> today at room 123.');
    //   });

    //   it('should get pick up when name capture enabled', () => {
    //     deliveryLocation = 'Agilysys';
    //     deliveryEnabled = false;
    //     nameEnabled = true;
    //     let result = Api.getOrderMessage(readyTime, scheduleTime, deliveryEnabled, nameEnabled, deliveryLocation, StroreName);
    //     expect(result).toEqual('Your order at Test will be ready for pick up at <b> 5:15 PM</b> today.');
    //   });
    // });

  });

});
