const loyaltyAccountInfo = 
{
  "status": 200,
  "data": {
    "tenantId": "662",
    "contextId": "3a58118c-8d48-408f-aad3-fbafe0af4ff5",
    "loyaltyAccountInquiryRequest": {
        "tenantId": "662",
        "contextId": "3a58118c-8d48-408f-aad3-fbafe0af4ff5",
        "accountIdentifier": {
            "type": "PHONE_NUMBER",
            "value": "9876543210"
        },
        "cardSource": "MANUAL",
        "properties": {
            "loyaltyProviderId": "cmp",
            "siteId": "CMP",
            "enterpriseId": "0",
            "disivisionId": "0",
            "storeId": "129",
            "profitCenterName": "PC 88"
        }
    },
    "loyaltyAccountTierData": {
        "accountIdentifier": {
            "type": "PHONE_NUMBER",
            "value": "9876543210"
        },
        "accountNumber": "888888888",
        "loyaltyAccountTiers": [
          {
                "accountNumber": "888888888",
                "name": "Hunt,Eathan",
                "tier": "Silver",
                "pointsSummaries": [{
                        "currencyAmount": "360.0",
                        "instrumentType": "PATRON" //LOYALTY/pointPatronTenderId
                    },
                    {
                        "currencyAmount": "88888888.88",
                        "instrumentType": "COMP" //LOYALTY/pointCompTenderId
                    },
                    {
                        "currencyAmount": "178.0",
                        "instrumentType": "PROMO"
                    }
                ],
                "voucherSummaries": [{
                        "currencyAmount": "75.0",
                        "description": "",
                        "expirationDate": "2020-12-31T08:29:59.000Z",
                        "voucherId": "@12RT75U",
                        "instrumentType": "OFFER",
                        "name": "$75 Food Offer"
                    },
                    {
                        "currencyAmount": "20.0",
                        "description": "",
                        "expirationDate": "2099-05-31T08:29:59.000Z",
                        "voucherId": "CricketT20-$20",
                        "instrumentType": "OFFER",
                        "name": "$20 offer for Food or beverages on each ICC Cricket T20 world cup match"
                    },
                    {
                        "currencyAmount": "20.0",
                        "description": "",
                        "expirationDate": "2020-05-31T08:29:59.000Z",
                        "voucherId": "NY2020",
                        "instrumentType": "OFFER",
                        "name": "New year offer for 2020"
                    },
                    {
                        "currencyAmount": "21.0",
                        "description": "",
                        "expirationDate": "2021-01-02T08:29:59.000Z",
                        "voucherId": "Welcome_2021",
                        "instrumentType": "OFFER",
                        "name": "21"
                    },
                    {
                        "currencyAmount": "100.0",
                        "description": "",
                        "expirationDate": "2020-03-31T10:29:59.000Z",
                        "voucherId": "@12SP100U",
                        "instrumentType": "OFFER",
                        "name": "$100 Food Offer"
                    }
                ]
            },
          {
                "accountNumber": "999999999",
                "name": "Waugh,Steve",
                "tier": "Bronze",
                "pointsSummaries": [{
                        "currencyAmount": "999999.99",
                        "instrumentType": "PATRON"
                    },
                    {
                        "currencyAmount": "25.0",
                        "instrumentType": "COMP"
                    },
                    {
                        "currencyAmount": "78.0",
                        "instrumentType": "PROMO"
                    }
                ],
                "voucherSummaries": [{
                        "currencyAmount": "75.0",
                        "description": "",
                        "expirationDate": "2020-12-31T08:29:59.000Z",
                        "voucherId": "@12RT75U",
                        "instrumentType": "OFFER",
                        "name": "$75 Food Offer"
                    },
                    {
                        "currencyAmount": "20.0",
                        "description": "",
                        "expirationDate": "2099-05-31T08:29:59.000Z",
                        "voucherId": "CricketT20-$20",
                        "instrumentType": "OFFER",
                        "name": "$20 offer for Food or beverages on each ICC Cricket T20 world cup match"
                    },
                    {
                        "currencyAmount": "20.0",
                        "description": "",
                        "expirationDate": "2020-05-31T08:29:59.000Z",
                        "voucherId": "NY2020",
                        "instrumentType": "OFFER",
                        "name": "New year offer for 2020"
                    },
                    {
                        "currencyAmount": "21.0",
                        "description": "",
                        "expirationDate": "2021-01-02T08:29:59.000Z",
                        "voucherId": "Welcome_2021",
                        "instrumentType": "OFFER",
                        "name": "21"
                    },
                    {
                        "currencyAmount": "100.0",
                        "description": "",
                        "expirationDate": "2020-03-31T10:29:59.000Z",
                        "voucherId": "@12SP100U",
                        "instrumentType": "OFFER",
                        "name": "$100 Food Offer"
                    }
                ]
            }
        ]
    },
    "properties": {
        "loyaltyProviderId": "cmp",
        "siteId": "CMP",
        "enterpriseId": "0",
        "disivisionId": "0",
        "storeId": "129",
        "profitCenterName": "PC 88",
        "callbackId": "9e5f684d-5a6f-482c-8a2d-5c5529ce442f"
    }
  }
 
};

const loyaltyAccountPaymentResponseByCapture = {
  "status": 200,
  "data": {
    "digitalSignature": {
      "dataEncoding": "UTF-8",
      "base64": "HxrwtJsXzLel\/m4SSMkLxLuhHllXrpld5CmV17PpWXB6NYhLaWnwaC51B3A681lY0ei70iNn6r1Xz1acnsbjv1xdCilAYy\/cEe2yeJDOcSWZR\/bVCzDgt17rRtIFWJEbaYn\/aaDKwdXOsLjSSQwrfIneJ8LVgGb4fM2e6HQGitWCuOkO7D5sh0FSxRX91LnLrur88t6GRpww60pUBaxz+eo6jp9+VUWRrBdPldZLhWoWYNXw6MJmOlhJKhxsSQ54IXqfTRF5KCzkqjAuJhaRgWg0c1h8RCmjDwuKS\/Szt4nugf5Uq56tGvq5YPPI9esFNYLDnCGpPoOXDagEr0HD5A=="
    },
    "paymentData": {
        "paymentResponse": {
            "paymentSupport": {
                "amount": {
                    "amount": "4.40",
                    "currencyUnit": "USD"
                },
                "paymentForm": "LOYALTY",
                "tipAmount": {
                    "amount": "0.00",
                    "currencyUnit": "USD"
                },
                "offlineStatus": {
                    "offline": false,
                    "offlineScopeId": "LOYALTY"
                },
                "paymentState": "CAPTURED"
            },
            "transactionData": {
                "loyaltyPaymentServiceRequest": {
                    "loyaltyPointsAccountIdentifierData": null,
                    "amount": {
                        "amount": "4.40",
                        "currencyUnit": "USD"
                    },
                    "orderNumber": "12345",
                    "pin": "1234",
                    "redeemType": "VOUCHER",
                    "accountIdentifierValue": "888888888",
                    "loyaltyVoucherAccountIdentifierData": {
                        "voucherType": "OFFER",
                        "voucherId": "@12RT75U",
                        "primaryAccountId": "888888888",
                        "accountType": "ACCOUNT_NUMBER"
                    },
                    "accountIdentifierType": "ACCOUNT_NUMBER",
                    "properties": {
                        "profitCenterName": "PC 88",
                        "loyaltyProviderId": "cmp",
                        "callbackId": "62da7ceb-0065-4b49-95ac-318b5a27f8a8",
                        "siteId": "CMP",
                        "enterpriseId": "0",
                        "storeId": "129",
                        "divisionId": "0"
                    }
                },
                "loyaltyPaymentServiceError": null,
                "loyaltyPaymentServiceResponse": {
                    "pointSummary": null,
                    "accountNumber": "888888888",
                    "transactionId": "10372600",
                    "voucherSummary": {
                        "amount": 75,
                        "voucherType": "OFFER"
                    }
                }
            },
            "paymentProviderId": "LOYALTY",
            "properties": {
                "profitCenterName": "PC 88",
                "loyaltyProviderId": "cmp",
                "callbackId": "62da7ceb-0065-4b49-95ac-318b5a27f8a8",
                "siteId": "CMP",
                "enterpriseId": "0",
                "storeId": "129",
                "divisionId": "0"
            }
        },
        "id": "246ca3aa-ff36-4275-84d3-57f0bd184c07",
        "paymentRequest": {
            "paymentAction": {
                "type": "CAPTURE",
                "properties": {
                }
            },
            "tenantId": "662",
            "transactionData": {
                "loyaltyPaymentServiceRequest": {
                    "loyaltyPointsAccountIdentifierData": null,
                    "amount": {
                        "amount": "4.40",
                        "currencyUnit": "USD"
                    },
                    "orderNumber": "12345",
                    "pin": "1234",
                    "redeemType": "VOUCHER",
                    "accountIdentifierValue": "888888888",
                    "loyaltyVoucherAccountIdentifierData": {
                        "voucherType": "OFFER",
                        "voucherId": "@12RT75U",
                        "primaryAccountId": "888888888",
                        "accountType": "ACCOUNT_NUMBER"
                    },
                    "accountIdentifierType": "ACCOUNT_NUMBER",
                    "properties": {
                        "profitCenterName": "PC 88",
                        "loyaltyProviderId": "cmp",
                        "callbackId": "62da7ceb-0065-4b49-95ac-318b5a27f8a8",
                        "siteId": "CMP",
                        "enterpriseId": "0",
                        "storeId": "129",
                        "disivisionId": "0"
                    }
                },
                "loyaltyPaymentServiceError": null,
                "loyaltyPaymentServiceResponse": null
            },
            "contextId": "3a58118c-8d48-408f-aad3-fbafe0af4ff5",
            "paymentProviderId": "LOYALTY",
            "currencyUnit": "USD",
            "properties": {
            }
        }
    }
  }
};

export {
  loyaltyAccountInfo,
  loyaltyAccountPaymentResponseByCapture
};

const addLoyaltyPaymentToOrderPayload = {
  "subTotalAmount": {
      "amount": "5.00",
      "currencyUnit": "USD"
  },
  "paymentModel": 2,
  "orderNumber": "010054",
  "orderId": "f6cb506a-5fe2-4899-bb0c-dd6a8f9ed310",
  "created": "2020-04-09T18:03:17.800Z",
  "payments": [
  ],
  "contextId": "07a72017-6679-49ff-92b7-e41461ed7a5a",
  "version": 2,
  "taxExcludedTotalAmount": {
      "amount": "5.00",
      "currencyUnit": "USD"
  },
  "orderState": "OPEN",
  "lineItems": [
      {
          "soldByWeight": false,
          "lineItemState": "NORMAL",
          "itemType": "ITEM",
          "quantity": 1,
          "lineItemId": "eb6909b7-669b-4fcf-819e-d78bdb5b44ff",
          "weight": 0.0,
          "lineItemGroups": [
          ],
          "igItemId": "65",
          "lineItemTax": {
              "unitTaxableAmount": {
                  "amount": "0.00",
                  "currencyUnit": "USD"
              },
              "taxableAmount": {
                  "amount": "5.00",
                  "currencyUnit": "USD"
              },
              "taxEntries": [
                  {
                      "taxClass": "Tax 10%",
                      "taxableAmount": {
                          "amount": "5.00",
                          "currencyUnit": "USD"
                      },
                      "taxAmount": {
                          "amount": "0.50",
                          "currencyUnit": "USD"
                      }
                  }
              ],
              "id": "052726fc-be49-4557-97c0-0e8ef4b0ef01",
              "totalTaxAmount": {
                  "amount": "0.50",
                  "currencyUnit": "USD"
              },
              "taxIncludedAmount": {
                  "amount": "5.50",
                  "currencyUnit": "USD"
              }
          },
          "itemId": "5da846034dd5f9000d821b9a",
          "price": {
              "amount": "5.00",
              "currencyUnit": "USD"
          },
          "tareWeight": 0.0,
          "properties": {
              "mealPeriodId": "1"
          }
      }
  ],
  "taxTotalAmount": {
      "amount": "0.50",
      "currencyUnit": "USD"
  },
  "lastUpdated": "2020-04-09T18:03:17.800Z",
  "payments2": [
      {
          "digitalSignature": {
              "dataEncoding": "UTF-8",
              "base64": "hNtTLyuA7xoAaVli7DUfUyukAlSHRifDdTrN6e4\/e0FJ8JNhmk7wiG2DX5zqB4+2IyIY1wrDUSEL\/UTzJ6pcSc7WEbtEhC6P7GqXavq2igEEGT\/vdCwX6QYGAKXQvmpHdj+0q9dhF5ZwEwrVZuVl6SA+dTragMQUZjc7a33T7HY9GxkLs28S6IbfjNoNdZrPepFbntGuocqSfwRAXqh77PPyApeVWDX8q5l56SRh1ImxDzJZGan5lYP6P8ncOcC0LVIFnWuIMmxt3+XZaIOjC8GjH3bsUoCQYeI9EQFruf02MegLZGdt12\/freiFyMG8vuPPdC7EleEbJb8zcI5QzQ=="
          },
          "paymentData": {
              "paymentResponse": {
                  "paymentSupport": {
                      "amount": {
                          "amount": "5.50",
                          "currencyUnit": "USD"
                      },
                      "paymentForm": "LOYALTY",
                      "tipAmount": {
                          "amount": "0.00",
                          "currencyUnit": "USD"
                      },
                      "offlineStatus": {
                          "offline": false,
                          "offlineScopeId": "null"
                      },
                      "paymentState": "CAPTURED"
                  },
                  "transactionData": {
                      "loyaltyPaymentError": null,
                      "loyaltyPaymentResponse": {
                          "pointSummary": {
                              "amount": "88888883.38",
                              "pointsType": "PATRON"
                          },
                          "accountNumber": "888888888",
                          "paymentState": "CAPTURED",
                          "transactionId": "13888800",
                          "voucherSummary": null
                      },
                      "loyaltyPaymentRequest": {
                          "loyaltyPointsAccountIdentifierData": {
                              "primaryAccountId": "888888888",
                              "pointsType": "COMP"
                          },
                          "amount": {
                              "amount": "5.50",
                              "currencyUnit": "USD"
                          },
                          "orderNumber": "12345",
                          "pin": "1234",
                          "redeemType": "POINTS",
                          "accountIdentifierValue": "888888888",
                          "tenantId": "424",
                          "loyaltyVoucherAccountIdentifierData": null,
                          "contextId": "07a72017-6679-49ff-92b7-e41461ed7a5a",
                          "properties": {
                              "profitCenterName": "PC 88",
                              "loyaltyProviderId": "cmp",
                              "loyaltyPaymentCaptureResponseToken": "cb1ab920-ccc6-4150-a7bc-4c4eb6ca5b02",
                              "siteId": "CMP",
                              "tenderId": "56"
                          }
                      }
                  },
                  "paymentProviderId": "LOYALTY",
                  "properties": {
                      "profitCenterName": "PC 88",
                      "loyaltyProviderId": "cmp",
                      "loyaltyPaymentCaptureResponseToken": "cb1ab920-ccc6-4150-a7bc-4c4eb6ca5b02",
                      "siteId": "CMP",
                      "tenderId": "56"
                  }
              },
              "id": "cb1ab920-ccc6-4150-a7bc-4c4eb6ca5b02",
              "paymentRequest": {
                  "paymentAction": {
                      "type": "CAPTURE",
                      "properties": {
                      }
                  },
                  "tenantId": "424",
                  "transactionData": {
                      "loyaltyPaymentError": null,
                      "loyaltyPaymentResponse": {
                          "pointSummary": {
                              "amount": "88888883.38",
                              "pointsType": "PATRON"
                          },
                          "accountNumber": "888888888",
                          "paymentState": "CAPTURED",
                          "transactionId": "13888800",
                          "voucherSummary": null
                      },
                      "loyaltyPaymentRequest": {
                          "loyaltyPointsAccountIdentifierData": {
                              "primaryAccountId": "888888888",
                              "pointsType": "COMP"
                          },
                          "amount": {
                              "amount": "5.50",
                              "currencyUnit": "USD"
                          },
                          "orderNumber": "12345",
                          "pin": "1234",
                          "redeemType": "POINTS",
                          "accountIdentifierValue": "888888888",
                          "tenantId": "424",
                          "loyaltyVoucherAccountIdentifierData": null,
                          "contextId": "07a72017-6679-49ff-92b7-e41461ed7a5a",
                          "properties": {
                              "profitCenterName": "PC 88",
                              "loyaltyProviderId": "cmp",
                              "loyaltyPaymentCaptureResponseToken": "cb1ab920-ccc6-4150-a7bc-4c4eb6ca5b02",
                              "siteId": "CMP",
                              "tenderId": "56"
                          }
                      }
                  },
                  "contextId": "07a72017-6679-49ff-92b7-e41461ed7a5a",
                  "paymentProviderId": "LOYALTY",
                  "currencyUnit": "USD",
                  "properties": {
                      "profitCenterName": "PC 88",
                      "loyaltyProviderId": "cmp",
                      "loyaltyPaymentCaptureResponseToken": "cb1ab920-ccc6-4150-a7bc-4c4eb6ca5b02",
                      "siteId": "CMP",
                      "tenderId": "56"
                  }
              }
          }
      }
  ],
  "taxIncludedTotalAmount": {
      "amount": "5.50",
      "currencyUnit": "USD"
  },
  "totalDueAmount": {
      "amount": "0.00",
      "currencyUnit": "USD"
  },
  "tenantId": "424",
  "totalPaymentAmount": {
      "amount": "5.50",
      "currencyUnit": "USD"
  },
  "currencyUnit": "USD",
  "subTotalTaxAmount": {
      "amount": "0.50",
      "currencyUnit": "USD"
  },
  "properties": {
      "openTerminalId": "1319",
      "mobileNumber": "123.456.7890",
      "closedTerminalId": "1319",
      "employeeId": "16432",
      "emailId": "foo@bar.com"
  }
}

// {
//   "tenantId": "662",
//   "contextId": "3a58118c-8d48-408f-aad3-fbafe0af4ff5",
//   "paymentAction": {"type": "CAPTURE","properties": {} },
//   "transactionData" :
//   {
//       "loyaltyPaymentServiceRequest":
//       {
//       "redeemType": "VOUCHER",
//       "amount":{
//           "currencyUnit":"USD",
//           "amount":"4.40"
//           },
//       "currencyUnit": "USD",
//       "orderNumber": "12345",
//       "pin": "1234",
//       "loyaltyVoucherAccountIdentifierData": {
//           "voucherId":"@12RT75U",
//           "primaryAccountId": "888888888",
//           "voucherType": "OFFER",
//           "accountType": "ACCOUNT_NUMBER"
//       },
//       "loyaltyPointsAccountIdentifierData": null,
//       "properties": {
//           "loyaltyProviderId": "cmp",
//           "siteId": "CMP",
//           "enterpriseId": "0",
//           "disivisionId": "0",
//           "storeId": "129",
//           "profitCenterName": "PC 88"
//       }
//   }
//   }
// }

const loyaltyPaymentConfig = {
  "name": "On Demand",
  "id": "45302",
  "workflowType": "ON_DEMAND",
  "workflowTypeList": [
    "on_demand", "loyalty_discounts"
  ],
  "featureConfigurations": {
    "loyaltyDiscounts": {
      "tenderLevelDiscount": true
    },
    "sitePayments": {
      "headerText": "Payment",
      "instructionText": "Select a method of payment.",
      "subInstructionText": "Your loyalty discount will be applied to credit and debit card transactions. Alcohol, tobacco, and tips are excluded from loyalty card tenders.",
      "paymentConfigs": [
        {
          "type": "loyalty",
          "paymentEnabled": true,
          "displayLabel": "Player card",
          "image": "Default_Loyalty_Account.png",
          "accountEntry": {
//             "instructionText": "Select a method to check your account.", //DON't NEED
            "pinLength": 4,
            "maxAttempts": 3,
            "resetMinutes": 2,
            "maxAttemptsReachedMessage": "Unavailable because of too many failed attempts. Try again in a few minutes.",
            "restrictBannedPlayers": true,
            "bannedPlayerMessage": "Please contact a loyalty representative.",
            "allowMultipleAccounts": false
          },
          "vouchers": {
            "instructionText": "Anything over the subtotal will not be refunded.",
            "image": "aa.png"
          },
          "hostComps": {
            "instructionText": "Anything over the subtotal will not be refunded.",
            "image": "aa.png"
          },
          "tenderComps": {
            "instructionText": "Anything over the subtotal will not be refunded.",
            "image": "aa.png",
            "ispromptPaymentEnabled": false
          }
        }
      ]
    },
    "loyaltyConfiguration": {
      "featureEnabled": true,
      "header": "Earn rewards points for qualifying purchases",
      "image": "test.jpg",
      "instructionText": "Select a method to check your account. Point accrual will be confirmed after purchase.",
      "loyaltyDetailsAccounts": [
        {
          "id": "phone",
          "enabled": true
        },
        {
          "id": "card",
          "enabled": false
        },
        {
          "id": "account",
          "enabled": false
        }
      ],
      "accountInquiryFailureText": "Sorry. We’re having trouble retrieving account information right now.Please contact guest services to ensure points are accrued."
    }
  }
}
  