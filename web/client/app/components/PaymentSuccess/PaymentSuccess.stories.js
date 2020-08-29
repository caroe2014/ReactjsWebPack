// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';

import { storiesOf } from '@storybook/react';
import PaymentSuccess from '.';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import i18n from '../../../i18n';
import { I18nextProvider } from 'react-i18next';

storiesOf('PaymentSuccess', module)
  .addDecorator(story => <I18nextProvider i18n={i18n}>{story()}</I18nextProvider>)
  .add('PaymentSuccess', () => {
    const payment = {
      totalBillAmount: '58.50'
    };
    return (
      <div style={{ textAlign: '-webkit-center' }}>
        <Provider store={store}>
          <PaymentSuccess saleData={{
            'closedOrder': {
              'orderId': 'eaaa3bd5-e494-4b13-9c92-00ea173b94d1',
              'version': 3,
              'tenantId': '198',
              'contextId': 'b649362f-6e35-444f-9c8b-ef341421d39a',
              'created': '2019-09-24T17:35:20.957+05:30',
              'lastUpdated': '2019-09-24T17:35:20.957+05:30',
              'orderState': 'CLOSED',
              'orderNumber': '038440',
              'currencyUnit': 'USD',
              'lineItems': [
                {
                  'itemId': '5cac9f3c3c22f1000d5a513b',
                  'igItemId': '131',
                  'itemType': 'ITEM',
                  'lineItemId': 'a18b573b-9c36-482c-9546-5394dd25d240',
                  'soldByWeight': false,
                  'lineItemState': 'NORMAL',
                  'weight': 0,
                  'tareWeight': 0,
                  'quantity': 1,
                  'price': {
                    'currencyUnit': 'USD',
                    'amount': '10.00'
                  },
                  'lineItemGroups': [],
                  'lineItemTax': {
                    'id': '618c6379-4769-4edb-af28-7c12801c6c91',
                    'taxableAmount': {
                      'currencyUnit': 'USD',
                      'amount': '10.00'
                    },
                    'taxIncludedAmount': {
                      'currencyUnit': 'USD',
                      'amount': '11.00'
                    },
                    'totalTaxAmount': {
                      'currencyUnit': 'USD',
                      'amount': '1.00'
                    },
                    'taxEntries': [
                      {
                        'taxClass': 'Tax 10%',
                        'taxAmount': {
                          'currencyUnit': 'USD',
                          'amount': '1.00'
                        },
                        'taxableAmount': {
                          'currencyUnit': 'USD',
                          'amount': '10.00'
                        }
                      }
                    ],
                    'unitTaxableAmount': {
                      'currencyUnit': 'USD',
                      'amount': '0.00'
                    }
                  },
                  'properties': {
                    'mealPeriodId': '4'
                  }
                }
              ],
              'taxExcludedTotalAmount': {
                'currencyUnit': 'USD',
                'amount': '10.00'
              },
              'taxTotalAmount': {
                'currencyUnit': 'USD',
                'amount': '1.00'
              },
              'taxIncludedTotalAmount': {
                'currencyUnit': 'USD',
                'amount': '11.00'
              },
              'subTotalAmount': {
                'currencyUnit': 'USD',
                'amount': '10.00'
              },
              'subTotalTaxAmount': {
                'currencyUnit': 'USD',
                'amount': '1.00'
              },
              'totalPaymentAmount': {
                'currencyUnit': 'USD',
                'amount': '11.00'
              },
              'totalDueAmount': {
                'currencyUnit': 'USD',
                'amount': '0.00'
              },
              'paymentModel': 2,
              'payments': [],
              'payments2': [
                {
                  'paymentData': {
                    'id': '03c24040-6354-453a-a775-9d588cae8e0d',
                    'paymentRequest': {
                      'tenantId': '198',
                      'contextId': 'b649362f-6e35-444f-9c8b-ef341421d39a',
                      'paymentAction': {
                        'type': 'CAPTURE',
                        'properties': {
                          'rguest_buy_order_tenantId': '198',
                          'rguest_buy_order_contextId': 'b649362f-6e35-444f-9c8b-ef341421d39a',
                          'rguest_buy_order_orderId': 'eaaa3bd5-e494-4b13-9c92-00ea173b94d1'
                        }
                      },
                      'currencyUnit': 'USD',
                      'paymentProviderId': 'RGUESTPAY_CREDIT_CARD',
                      'transactionData': {
                        'rguestPayAgentTransactionServiceResponse': {
                          'transactionReferenceData': {
                            'transactionId': '20190924050000000255',
                            'token': '4412799023280119',
                            'transactionFollowOnData': 'dmVyc2lvbg==$MS4w&QmFua0F1dGhDb2Rl$MTQwNjE2&QmFua0F1dGhDb2RlS2V5$U2FsZQ==&VHJhbnNhY3Rpb25JZEtleQ==$MjAxOTA5MjQwNTAwMDAwMDAyNTU=&VG9rZW5LZXk=$NDQxMjc5OTAyMzI4MDExOQ==' // eslint-disable-line max-len
                          },
                          'transactionResponseData': {
                            'authorizedAmount': 11,
                            'subTotalAmount': 11,
                            'totalAmount': 11
                          },
                          'gatewayResponseData': {
                            'decision': 'A',
                            'code': '00',
                            'message': 'APPROVED',
                            'processorCode': '00',
                            'processorMessage': 'APPROVED',
                            'tokenCode': '4412799023280119',
                            'authCode': '140616',
                            'referenceId': '20190924050000000255',
                            'referenceCode': '48826'
                          },
                          'cardInfo': {
                            'accountNumberMasked': '476173xxxxxx0119',
                            'cardIssuer': 'visa',
                            'cardType': 'credit',
                            'entryMode': 'keyed',
                            'expirationYearMonth': '202212',
                            'cardHolderName': 'test'
                          },
                          'receiptData': {
                            'merchantReceiptText': [
                              '',
                              'Agilysys',
                              '',
                              '3372 Leudelange',
                              '----------------------------',
                              'MERCHANT COPY',
                              '----------------------------',
                              'DATE: 24/09/19 14:06',
                              '----------------------------',
                              'SALE',
                              'VISA',
                              'PAN: ************0119',
                              'CARD EXPY: 2212',
                              'CARD-ENTRY: KEYED',
                              '----------------------------',
                              'A P P R O V E D',
                              'AUTH CODE: 140616',
                              'TERMINAL ID:  ',
                              'MERCHANT ID:  123456',
                              'TRX.REF. NO.: 48826',
                              '----------------------------',
                              'ACCOUNT WILL BE DEBITED',
                              'TRANS.AMOUNT: GBP11.00',
                              'TOTAL AMOUNT: GBP11.00',
                              '============================',
                              'SIGNATURE REQUIRED',
                              '',
                              '',
                              '',
                              '----------------------------',
                              '',
                              '',
                              '',
                              '',
                              ''
                            ],
                            'customerReceiptText': [
                              '',
                              'Agilysys',
                              '',
                              '3372 Leudelange',
                              '----------------------------',
                              'CARDHOLDER COPY',
                              'PLEASE RETAIN THIS COPY',
                              'THANK YOU',
                              '----------------------------',
                              'DATE: 24/09/19 14:06',
                              '----------------------------',
                              'SALE',
                              'VISA',
                              'PAN: ************0119',
                              'CARD EXPY: ****',
                              'CARD-ENTRY: KEYED',
                              '----------------------------',
                              'A P P R O V E D',
                              'AUTH CODE: 140616',
                              'TERMINAL ID:  ',
                              'MERCHANT ID:  123456',
                              'TRX.REF. NO.: 48826',
                              '----------------------------',
                              'ACCOUNT WILL BE DEBITED',
                              'TRANS.AMOUNT: GBP11.00',
                              'TOTAL AMOUNT: GBP11.00',
                              '============================',
                              'SIGNATURE VERIFIED',
                              '----------------------------',
                              '',
                              '',
                              '',
                              '',
                              ''
                            ]
                          }
                        },
                        'rguestPayAgentTransactionServiceRequest': {
                          'requestId': '20190924050000000255',
                          'industryType': 'foodAndBeverage',
                          'gatewayId': '3C',
                          'configuration': [
                            {
                              'key': '3C.ValidationCode',
                              'value': 'VALIDATIONCODE'
                            },
                            {
                              'key': '3C.RequesterLocationId',
                              'value': '000780'
                            },
                            {
                              'key': 'payAtTableURL',
                              'value': 'http://localhost:8502'
                            },
                            {
                              'key': '3C.DeviceId',
                              'value': '000137'
                            },
                            {
                              'key': 'registerID',
                              'value': '1534'
                            },
                            {
                              'key': '3C.IntegraPort',
                              'value': '14601'
                            },
                            {
                              'key': '3C.ValidationId',
                              'value': 'VALIDATIONID'
                            }
                          ],
                          'invoiceData': {
                            'invoiceId': '038440',
                            'invoiceDate': '2019-09-24T17:35:20.957+05:30'
                          },
                          'transactionData': {
                            'transactionDate': '2019-09-24T17:35:20.957+05:30',
                            'transactionAmount': '11.00',
                            'taxAmount': '1.00',
                            'tipAmount': '0.00',
                            'allowPartialTransactionAmount': true,
                            'registerID': '1534'
                          },
                          'offline': false
                        }
                      },
                      'properties': {
                        'employeeId': '16441'
                      }
                    },
                    'paymentResponse': {
                      'paymentProviderId': 'RGUESTPAY_CREDIT_CARD',
                      'transactionData': {},
                      'paymentSupport': {
                        'amount': {
                          'currencyUnit': 'USD',
                          'amount': '11.00'
                        },
                        'tipAmount': {
                          'currencyUnit': 'USD',
                          'amount': '0.00'
                        },
                        'paymentForm': 'CREDIT_CARD',
                        'paymentState': 'CAPTURED',
                        'offlineStatus': {
                          'offline': false,
                          'offlineScopeId': ''
                        }
                      },
                      'properties': {
                        'employeeId': '16441'
                      }
                    }
                  }
                }
              ],
              'properties': {
                'profitCenterId': '788',
                'profitCenterName': '3C-OnDemand-PC',
                'openTerminalId': '1534',
                'mealPeriodId': '4',
                'closedTerminalId': '1534',
                'employeeId': '16441'
              }
            }
          }} printReceipt={{
            'orderData': {
              'terminalNumber': '1534',
              'storeInfo': {
                'businessContextId': 'b649362f-6e35-444f-9c8b-ef341421d39a',
                'tenantId': '198',
                'storeInfoId': '450',
                'storeName': 'Resto Cafe!! 007',
                'address1': '',
                'address2': '',
                'city': 'seattle',
                'state': '',
                'zipCode': '',
                'phoneNumber': '',
                'timezone': 'Asia/Kolkata',
                'receiptFooterText': 'Thank you from all of us at Cafe 198',
                'receiptConfigProperties': {
                  'showGaBalanceOnReceipt': 'true'
                }
              },
              'lineItems': [
                {
                  'quantity': 1,
                  'price': '10.00',
                  'displayText': 'OrderThrottlingItem3',
                  'lineItemGroups': []
                }
              ],
              'subtotalAmount': '10.00',
              'taxAmount': '1.00',
              'totalAmount': '11.00',
              'checkNumber': '038440',
              'orderMessage': 'Your order will be ready to pick up at Resto Cafe!! 007 in less than 6 minutes',
              'paymentInfo': [
                {
                  'paymentData': {
                    'id': '03c24040-6354-453a-a775-9d588cae8e0d',
                    'paymentRequest': {
                      'tenantId': '198',
                      'contextId': 'b649362f-6e35-444f-9c8b-ef341421d39a',
                      'paymentAction': {
                        'type': 'CAPTURE',
                        'properties': {
                          'rguest_buy_order_tenantId': '198',
                          'rguest_buy_order_contextId': 'b649362f-6e35-444f-9c8b-ef341421d39a',
                          'rguest_buy_order_orderId': 'eaaa3bd5-e494-4b13-9c92-00ea173b94d1'
                        }
                      },
                      'currencyUnit': 'USD',
                      'paymentProviderId': 'RGUESTPAY_CREDIT_CARD',
                      'transactionData': {
                        'rguestPayAgentTransactionServiceResponse': {
                          'transactionReferenceData': {
                            'transactionId': '20190924050000000255',
                            'token': '4412799023280119',
                            'transactionFollowOnData': 'dmVyc2lvbg==$MS4w&QmFua0F1dGhDb2Rl$MTQwNjE2&QmFua0F1dGhDb2RlS2V5$U2FsZQ==&VHJhbnNhY3Rpb25JZEtleQ==$MjAxOTA5MjQwNTAwMDAwMDAyNTU=&VG9rZW5LZXk=$NDQxMjc5OTAyMzI4MDExOQ=='// eslint-disable-line max-len
                          },
                          'transactionResponseData': {
                            'authorizedAmount': 11,
                            'subTotalAmount': 11,
                            'totalAmount': 11
                          },
                          'gatewayResponseData': {
                            'decision': 'A',
                            'code': '00',
                            'message': 'APPROVED',
                            'processorCode': '00',
                            'processorMessage': 'APPROVED',
                            'tokenCode': '4412799023280119',
                            'authCode': '140616',
                            'referenceId': '20190924050000000255',
                            'referenceCode': '48826'
                          },
                          'cardInfo': {
                            'accountNumberMasked': '476173xxxxxx0119',
                            'cardIssuer': 'visa',
                            'cardType': 'credit',
                            'entryMode': 'keyed',
                            'expirationYearMonth': '202212',
                            'cardHolderName': 'test'
                          },
                          'receiptData': {
                            'merchantReceiptText': [
                              '',
                              'Agilysys',
                              '',
                              '3372 Leudelange',
                              '----------------------------',
                              'MERCHANT COPY',
                              '----------------------------',
                              'DATE: 24/09/19 14:06',
                              '----------------------------',
                              'SALE',
                              'VISA',
                              'PAN: ************0119',
                              'CARD EXPY: 2212',
                              'CARD-ENTRY: KEYED',
                              '----------------------------',
                              'A P P R O V E D',
                              'AUTH CODE: 140616',
                              'TERMINAL ID:  ',
                              'MERCHANT ID:  123456',
                              'TRX.REF. NO.: 48826',
                              '----------------------------',
                              'ACCOUNT WILL BE DEBITED',
                              'TRANS.AMOUNT: GBP11.00',
                              'TOTAL AMOUNT: GBP11.00',
                              '============================',
                              'SIGNATURE REQUIRED',
                              '',
                              '',
                              '',
                              '----------------------------',
                              '',
                              '',
                              '',
                              '',
                              ''
                            ],
                            'customerReceiptText': [
                              '',
                              'Agilysys',
                              '',
                              '3372 Leudelange',
                              '----------------------------',
                              'CARDHOLDER COPY',
                              'PLEASE RETAIN THIS COPY',
                              'THANK YOU',
                              '----------------------------',
                              'DATE: 24/09/19 14:06',
                              '----------------------------',
                              'SALE',
                              'VISA',
                              'PAN: ************0119',
                              'CARD EXPY: ****',
                              'CARD-ENTRY: KEYED',
                              '----------------------------',
                              'A P P R O V E D',
                              'AUTH CODE: 140616',
                              'TERMINAL ID:  ',
                              'MERCHANT ID:  123456',
                              'TRX.REF. NO.: 48826',
                              '----------------------------',
                              'ACCOUNT WILL BE DEBITED',
                              'TRANS.AMOUNT: GBP11.00',
                              'TOTAL AMOUNT: GBP11.00',
                              '============================',
                              'SIGNATURE VERIFIED',
                              '----------------------------',
                              '',
                              '',
                              '',
                              '',
                              ''
                            ]
                          }
                        },
                        'rguestPayAgentTransactionServiceRequest': {
                          'requestId': '20190924050000000255',
                          'industryType': 'foodAndBeverage',
                          'gatewayId': '3C',
                          'configuration': [
                            {
                              'key': '3C.ValidationCode',
                              'value': 'VALIDATIONCODE'
                            },
                            {
                              'key': '3C.RequesterLocationId',
                              'value': '000780'
                            },
                            {
                              'key': 'payAtTableURL',
                              'value': 'http://localhost:8502'
                            },
                            {
                              'key': '3C.DeviceId',
                              'value': '000137'
                            },
                            {
                              'key': 'registerID',
                              'value': '1534'
                            },
                            {
                              'key': '3C.IntegraPort',
                              'value': '14601'
                            },
                            {
                              'key': '3C.ValidationId',
                              'value': 'VALIDATIONID'
                            }
                          ],
                          'invoiceData': {
                            'invoiceId': '038440',
                            'invoiceDate': '2019-09-24T17:35:20.957+05:30'
                          },
                          'transactionData': {
                            'transactionDate': '2019-09-24T17:35:20.957+05:30',
                            'transactionAmount': '11.00',
                            'taxAmount': '1.00',
                            'tipAmount': '0.00',
                            'allowPartialTransactionAmount': true,
                            'registerID': '1534'
                          },
                          'offline': false
                        }
                      },
                      'properties': {
                        'employeeId': '16441'
                      }
                    },
                    'paymentResponse': {
                      'paymentProviderId': 'RGUESTPAY_CREDIT_CARD',
                      'transactionData': {},
                      'paymentSupport': {
                        'amount': {
                          'currencyUnit': 'USD',
                          'amount': '11.00'
                        },
                        'tipAmount': {
                          'currencyUnit': 'USD',
                          'amount': '0.00'
                        },
                        'paymentForm': 'CREDIT_CARD',
                        'paymentState': 'CAPTURED',
                        'offlineStatus': {
                          'offline': false,
                          'offlineScopeId': ''
                        }
                      },
                      'properties': {
                        'employeeId': '16441'
                      }
                    }
                  },
                  'amount': '11.00',
                  'buyPaymentForm': 'CREDIT_CARD',
                  'cardInfo': {
                    'accountNumberMasked': '476173xxxxxx0119',
                    'cardIssuer': 'visa',
                    'cardType': 'credit',
                    'entryMode': 'keyed',
                    'expirationYearMonth': '202212'
                  },
                  'showAuthorizationInfoOnReceipt': true,
                  'authCode': '140616',
                  'tenderName': 'visa',
                  'account': '476173xxxxxx0119',
                  'transactionData': {
                    'authorizedAmount': 11,
                    'subTotalAmount': 11,
                    'totalAmount': 11
                  }
                }
              ],
              'currencyInfo': {
                'currencyCultureName': 'en-US',
                'currencyCode': 'USD',
                'currencyDecimalDigits': '2',
                'currencySymbol': '$'
              },
              'dateTime': '2019-09-24T17:36:18+05:30',
              'timezoneOffsetMinutes': -330,
              'printDateTime': '09/24/19 05:36 PM'
            },
            'templateName': 'OnDemandReceiptTemplate'
          }} keyProps={payment} />
        </Provider>
      </div>
    );
  }
  );
