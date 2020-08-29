// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as paymentUtils from './payment';
import {
  payPayload,
  payAgentRequest
} from '../../__mocks__/pay_payload';

describe('payment utils', () => {

  it('should mapPaymentProcessorPropertiesConfiguration', () => {
    let mockConfigurations = {
      phasers: 'armed',
      shields: 'up',
      dilithium: 'powered'
    };

    let mapped = paymentUtils.mapPaymentProcessorPropertiesConfiguration(mockConfigurations);

    expect(mapped).toEqual([{
      key: 'phasers',
      value: 'armed'
    },
    {
      key: 'shields',
      value: 'up'
    },
    {
      key: 'dilithium',
      value: 'powered'
    }
    ]);
  });

  it('should getPaymentProperties', () => {
    const mockPaymentConfig = {
      igSettings: {
        onDemandEmployeeId: 'emp123'
      }
    };

    let properties = paymentUtils.getPaymentProperties(mockPaymentConfig);
    expect(properties).toEqual({
      employeeId: 'emp123'
    });
  });

  it('should getPaymentProperties empty payload if employeeid if not there', () => {
    const mockPaymentConfig = {
      igSettings: {}
    };

    let properties = paymentUtils.getPaymentProperties(mockPaymentConfig);
    expect(properties).toEqual({});
  });

  // it('should build external payments', () => {
  //   let mockPaymentData = {
  //     currencyDetails: {
  //       currencyCode: 'USD'
  //     },
  //     subtotal: '26.00',
  //     transactionId: 'mock-transaction-id-123',
  //     igSettings: {
  //       onDemandTenderId: 21,
  //       onDemandIgVerificationCodeId: 33
  //     }
  //   };

  //   let results = paymentUtils.buildExternalPaymentType(mockPaymentData);

  //   expect(results).toEqual({
  //     'currencyUnit': 'USD',
  //     'overtenderOperation': 'NONE',
  //     'paymentForm': 'EXTERNAL',
  //     'paymentTransaction': {
  //       'paymentProviderId': 'external',
  //       'transactionData': {
  //         'amount': {
  //           'amount': '26.00',
  //           'currencyUnit': 'USD'
  //         },
  //         'description': 'mock-transaction-id-123',
  //         'tipAmount': {
  //           'amount': '0.00',
  //           'currencyUnit': 'USD'
  //         }
  //       }
  //     },
  //     'properties': {
  //       'igVerificationCodeId': 33,
  //       'tenderId': 21
  //     }
  //   });
  // });

  // it('should build external payments with tip amount', () => {
  //   let mockPaymentData = {
  //     currencyDetails: {
  //       currencyCode: 'USD'
  //     },
  //     subtotal: '26.00',
  //     transactionId: 'mock-transaction-id-123',
  //     igSettings: {
  //       onDemandTenderId: 21,
  //       onDemandIgVerificationCodeId: 33
  //     },
  //     tipAmount: '10.00'
  //   };

  //   let results = paymentUtils.buildExternalPaymentType(mockPaymentData);

  //   expect(results).toEqual({
  //     'currencyUnit': 'USD',
  //     'overtenderOperation': 'NONE',
  //     'paymentForm': 'EXTERNAL',
  //     'paymentTransaction': {
  //       'paymentProviderId': 'external',
  //       'transactionData': {
  //         'amount': {
  //           'amount': '26.00',
  //           'currencyUnit': 'USD'
  //         },
  //         'description': 'mock-transaction-id-123',
  //         'tipAmount': {
  //           'amount': '10.00',
  //           'currencyUnit': 'USD'
  //         }
  //       }
  //     },
  //     'properties': {
  //       'igVerificationCodeId': 33,
  //       'tenderId': 21
  //     }
  //   });
  // });

  it('should build buy credit card payments', () => {
    let mockPaymentData = {
      // transactionId: 'mock-transaction-id-123',
      order: {
        orderId: 11,
        tenantId: 12,
        contextId: 13
      },
      currencyDetails: {
        currencyCode: 'MXN'
      },
      saleData: {
        paymentData: payPayload,
        payAgentRequest: payAgentRequest,
        tokenizedData: {
          paymentDetails: {
            cardHolderName: 'testuser',
            expirationYearMonth: '201912'
          }
        }
      }
    };

    let results = paymentUtils.buildBuyCreditCardPayment(mockPaymentData);

    expect(results).toMatchObject({
      'paymentData': {
        'paymentRequest': {
          'contextId': 13,
          'currencyUnit': 'MXN',
          'paymentAction': {
            'properties': {
              'rguest_buy_order_contextId': 13,
              'rguest_buy_order_orderId': 11,
              'rguest_buy_order_tenantId': 12
            },
            'type': 'CAPTURE'
          },
          'paymentProviderId': 'RGUESTPAY_CREDIT_CARD',
          'properties': {},
          'tenantId': 12,
          'transactionData': {
            'rguestPayAgentTransactionServiceRequest': {
              'configuration': [{
                'key': 'freedomPay.storeid',
                'value': '1417877014'
              }, {
                'key': 'freedomPay.terminalid',
                'value': '2417983014'
              }, {
                'key': 'freedomPay.tokenType',
                'value': '3'
              } ],
              'gatewayId': 'freedomPay',
              'industryType': 'retail',
              'invoiceData': {
                'invoiceDate': '2019-03-22T16:57:01.594Z',
                'invoiceId': '00264'
              },
              'offline': false,
              'transactionData': {
                'allowPartialTransactionAmount': true,
                'taxAmount': '0.30',
                'tipAmount': '0',
                'transactionAmount': '3.30',
                'transactionDate': '2019-03-22T16:57:01.594Z'
              }
            },
            'rguestPayAgentTransactionServiceResponse': {
              'cardInfo': {
                'accountNumberMasked': '411112xxxxxx2010',
                'cardHolderName': 'testuser',
                'cardIssuer': 'Visa',
                'cardType': 'credit',
                'expirationYearMonth': '201912'
              },
              'gatewayResponseData': {
                'authCode': 'OK1234',
                'avsCode': 'M',
                'batchId': '1',
                'code': '00',
                'decision': 'ACCEPT',
                'message': 'Approved',
                'processorAvsCode': 'M',
                'processorCode': '00',
                'processorMessage': 'APPROVED',
                'referenceCode': 'ABC12345'
              },
              'transactionReferenceData': {
                'token': 'UID:635726574799214095',
                'transactionId': '93ffb3c3-bba2-4bb5-a700-085251297623',
                'transactionState': 'Tm8gZHJhZ29ucyEgS2l0dGllcyBhbmQgdW5pY29ybnMh'
              },
              'transactionResponseData': {
                'authorizedAmount': 0,
                'subTotalAmount': 0,
                'tipAmount': 0,
                'totalAmount': 0
              }
            }
          }
        },
        'paymentResponse': {
          'paymentProviderId': 'RGUESTPAY_CREDIT_CARD',
          'paymentSupport': {
            'amount': {
              'amount': 0,
              'currencyUnit': 'MXN'
            },
            'offlineStatus': {
              'offline': false,
              'offlineScopeId': ''
            },
            'paymentForm': 'CREDIT_CARD',
            'paymentState': 'CAPTURED',
            'tipAmount': {
              'amount': '0.00',
              'currencyUnit': 'MXN'
            }
          },
          'properties': {},
          'transactionData': {}
        }
      }
    });
  });
  it('should getIframeConfiguration', () => {
    const mockDisplayProfile = {
      featureConfigurations: {
        sitePayments: {
          paymentConfigs: [
            {
              type: 'rGuestIframe'
            }
          ]
        }
      }
    };

    let payOption = paymentUtils.getIframeConfiguration(mockDisplayProfile);
    expect(mockDisplayProfile.featureConfigurations.sitePayments.paymentConfigs.find(pay => pay.type === 'rGuestIframe')).toEqual(payOption); // eslint-disable-line
  });

  it('should getIframeConfiguration undefined if paymentconfig not found', () => {
    const mockDisplayProfile = {
      featureConfigurations: {
        sitePayments: {}
      }
    };

    let payOption = paymentUtils.getIframeConfiguration(mockDisplayProfile);
    expect(undefined).toEqual(payOption); // eslint-disable-line
  });

  it('should getPaymentOptions', () => {
    const mockDisplayProfile = {
      featureConfigurations: {
        sitePayments: {
          paymentConfigs: [
            {
              type: 'rGuestIframe',
              paymentEnabled: true,
              config: {
                apiKey: 'sdfdsf4354gegre546'
              }
            }
          ]
        }
      }
    };

    let payOption = paymentUtils.getPaymentOptions(mockDisplayProfile);
    let resultData = mockDisplayProfile.featureConfigurations.sitePayments.paymentConfigs.map(pay => {
      const { config, ...prunedData } = pay;
      return prunedData;
    });
    expect(resultData).toEqual(payOption); // eslint-disable-line
  });

  it('should getPaymentOptions empty when payment config not found', () => {
    const mockDisplayProfile = {
      featureConfigurations: {
        sitePayments: {}
      }
    };

    let payOption = paymentUtils.getPaymentOptions(mockDisplayProfile);
    expect([]).toEqual(payOption); // eslint-disable-line
  });
});
