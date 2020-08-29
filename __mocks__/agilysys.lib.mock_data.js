
const agMockData = {
  opts: {
    tenantId: 1,
    sessionToken: 'fake-session-toke',
    tenantConfig: {
      tenants: {
        '1': {
          stores: {
            '123': {
              businessContextId: '123',
              displayProfileId: ['1']
            },
            '456': {
              businessContextId: '456',
              displayProfileId: ['2']
            }
          }
        }
      },
      storeList: [
        {
          businessContextId: '123',
          displayProfileId: ['1']
        },
        {
          businessContextId: '456',
          displayProfileId: ['2']
        }
      ]
    }
  },

  businessContext: 'my-busines-context-123',
  profileId: '2600',
  tenantId: 1,

  tenantConfig: {
    tenants: {
      '1': {
        stores: {
          123: {},
          456: {}
        }
      }
    }
  },

  request: {
    config: {
      method: 'get',
      url: 'http:test.com/abc'
    },
    response: {
      status: '200'
    },
    status: '200'
  },

  getStoresResponse: [
    {depth: 3, businessContextId: '123'},
    {depth: 4, businessContextId: '456'},
    {depth: 1, businessContextId: '456'}
  ],

  getStoreInfoResponses: [
    {id: 1, name: 'storeOne'},
    {id: 2, name: 'storeTwo'}
  ],

  getStoreDetails: [
    {detailsId: '123', schedule: {}, name: 'Store123', id: '123', displayProfile: {displayProfileOptions: {'profit-center-id': 0}}},
    {detailsId: '456', schedule: {}, name: 'Store456', id: '456', displayProfile: {displayProfileOptions: {'profit-center-id': 1}}}
  ],

  getStoresWithDetails: [
    {'businessContextId': '123', 'profitCenterDetails': undefined, 'depth': 3, 'detailsId': '123', 'id': 1, 'name': 'storeOne', 'schedule': {'tenantId': '1'}, displayProfile: {displayProfileOptions: {'profit-center-id': 0}}},
    {'businessContextId': '456', 'profitCenterDetails': undefined, 'depth': 4, 'detailsId': '456', 'id': 2, 'name': 'storeTwo', 'schedule': {'tenantId': '1'}, displayProfile: {displayProfileOptions: {'profit-center-id': 1}}}
  ],

  getStoresWithDetailsResponse: [
    {businessContextId: '123', displayProfileId: ['1'], detailsId: '123', schedule: {tenantId: '1'}, displayProfile: {displayProfileOptions: {'profit-center-id': 0}}, profitCenterId: 0, storeAvailabeNow: true},
    {businessContextId: '456', displayProfileId: ['2'], detailsId: '456', schedule: {tenantId: '1'}, displayProfile: {displayProfileOptions: {'profit-center-id': 1}}, profitCenterId: 1, storeAvailabeNow: true}
  ],

  getItemDetailsResonses: {
    itemId: 0, isAvailableToGuests: true},

  getItemListResponse: {content: [
    {
      'id': '5b52587ad2f425000de21b48',
      'contextId': '2d085c5d-775b-4e91-9beb-0209063a3dbc',
      'tenantId': '424',
      'itemId': '2',
      'name': '$1 Base Price',
      'isDeleted': false,
      'isActive': false,
      'lastUpdateTime': '2019-04-12T06:38:50.701Z',
      'revenueCategoryId': '1',
      'productClassId': '34',
      'kpText': '$1 Base Price KP',
      'kitchenDisplayText': '$1 Base Price KP',
      'receiptText': '$1 Base Price',
      'price': {
        'currencyUnit': 'USD',
        'amount': '1.00'
      },
      'defaultPriceLevelId': '1',
      'isSoldByWeight': false,
      'isTaxIncluded': false,
      'taxClasses': [
        'No Tax',
        'Tax 10%'
      ],
      'kitchenVideoLabel': '$1 Base Price KV',
      'kitchenCookTimeSeconds': 0,
      'skus': [
        '703001000100H01(G)HK'
      ],
      'itemType': 'ITEM',
      'childGroups': [

      ],
      'displayText': '$1 Base Price',
      'isAvailableToGuests': true,
      'tagNames': [

      ],
      'amount': '1.00',
      'image': 'application/api/image/424/2d085c5d-775b-4e91-9beb-0209063a3dbc/burger2_xl.jpg',
      'thumbnail': 'application/api/image/424/2d085c5d-775b-4e91-9beb-0209063a3dbc/burger2_md.jpg',
      'options': [

      ],
      'attributes': [

      ]
    }
  ]
  },

  profileResponse: {
    profileId: '2600',
    prodileName: 'test'
  },

  menuResponse: [
    {
      id: '1',
      conceptName: 'Test',
      menus: [
        '123',
        '234'
      ]
    }
  ],

  scheduleResponse: {
    schedule: {
      'contextId': 'mock-context-id',
      tasks: [
        {
          scheduledExpression: '0 0 5 * * SUN',
          properties: {}
        },
        {
          scheduledExpression: '0 0 10 * * SUN',
          properties: {}
        }
      ]
    }
  },
  transformCartItems: [{
    name: 'test',
    id: 2,
    mealPeriodId: 1
  }],
  orderData: {
    item: {
      lineItems: [
        {
          name: 'test',
          id: 2,
          mealPeriodId: 1
        }
      ]
    }
  },
  waitTimeCartItems: {
    varianceEnabled: 'true',
    variancePercentage: 10,
    cartItems: [{
      name: 'test',
      id: 2,
      mealPeriodId: 1,
      kitchenVideoId: 123,
      kitchenCookTimeSeconds: 123
    },
    {
      name: 'test1',
      id: 3,
      mealPeriodId: 1
    },
    {
      name: 'test2',
      id: 3,
      mealPeriodId: 1,
      kitchenVideoId: 123
    }]
  },
  displayProfile: {
    displayProfile: {
      featureConfigurations: {
        sitePayments: {
          paymentConfigs: [
            {type: 'stripe', config: {secretKey: 'sk_test_123'}},
            {type: 'mock', config: {secretKey: 'sk_test_456'}},
            {type: 'stripe', config: {secretKey: 'sk_test_789'}}
          ]
        }
      }
    }
  },
  makeStripeTransactionValues: {
    chargeData: {
      businessContextId: '123',
      profileId: '2600',
      currency: 'US dollar',
      label: 'label',
      token: '123'
    },
    order: {
      orderNumber: '123'
    }
  },
  makeStripeRefundValues: {
    businessContextId: '123',
    profileId: '2600',
    transactionId: '123'
  },
  postPaymentData: {
    profitCenterDetails: {
      paymentProcessorProperties: {
        configuration: {
          id: 123,
          payKey: '1234456'
        }
      }
    },
    tokenizedData: {
      token: 123,
      paymentDetails: {
        invoiceId: 123,
        billDate: '02/02.2019',
        transactionAmount: '144.00',
        taxAmount: '12.00',
        tipAmount: '10.00'
      }
    }
  },
  postPaymentPayload: { gatewayId: 'freedompay',
    industryType: 'retail',
    configuration:
       [ { key: 'id', value: 123 },
         { key: 'payKey', value: '1234456' } ],
    invoiceData: { invoiceId: 123, invoiceDate: '02/02.2019' },
    transactionData:
       { transactionDate: '02/02.2019',
         transactionAmount: '144.00',
         taxAmount: '12.00',
         tipAmount: '10.00',
         allowPartialTransactionAmount: true } },
  makeTransaction: {
    paymentData: {name: 'test data'},
    payAgentRequest: { gatewayId: 'freedompay',
      industryType: 'retail',
      configuration:
        [ { key: 'id', value: 123 },
          { key: 'payKey', value: '1234456' } ],
      invoiceData: { invoiceId: 123, invoiceDate: '02/02.2019' },
      transactionData:
        { transactionDate: '02/02.2019',
          transactionAmount: '144.00',
          taxAmount: '12.00',
          tipAmount: '10.00',
          allowPartialTransactionAmount: true } },
    tokenizedData: {
      token: 123,
      paymentDetails: {
        invoiceId: 123,
        billDate: '02/02.2019',
        transactionAmount: '144.00',
        taxAmount: '12.00',
        tipAmount: '10.00'
      }
    }
  },
  authorizeGAPaymentPayload: {tenantId: '1', contextId: '222', subtotal: 333, tipAmount: 444, verificationCode: '555', accountNumber: '666', profitCenterId: '777', currencyUnit: '$', tenderId: '1', gaPostingAccountNumber: '888', gaAccountName: '222'},
  authorizeGAPaymentformattedPayload: {
    tenantId: '1',
    contextId: '222',
    paymentAction: {
      type: 'AUTHORIZE'
    },
    paymentProviderId: 'IG_GENERIC_AUTHORIZATION',
    transactionData: {
      amount: {
        currencyUnit: '$',
        amount: 333
      },
      tipAmount: {
        currencyUnit: '$',
        amount: 444
      },
      profitCenterId: '777',
      verificationCode: '555',
      accountNumber: '666'
    },
    properties: {
      tenderId: '1',
      gaAccountName: '222',
      gaPostingAccountNumber: '888'
    }
  },
  voidLoyaltyPaymentPayload: {
    contextId: '1',
    paymentResponse: {
      paymentData: {
        paymentResponse: {
          transactionData: {
            loyaltyPaymentRequest: {
              requestId: '123',
              requestToken: '123',
              requestHeader: {
                contentType: 'application/json'
              }
            },
            loyaltyPaymentResponse: {
              transactionId: '456'
            }
          }
        }
      }
    }
  },
  voidPaymentPayload: {
    requestId: '123',
    requestToken: '123',
    requestHeader: {
      contentType: 'application/json'
    },
    transactionId: '456'
  }
};

export default agMockData;
