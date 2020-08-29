// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
import moment from 'moment-timezone';

/* istanbul ignore file */
export default class MockAgilysys {

  tenantId = '424';

  siteResponse = [{'address': ['7 street test', 'chennai TN 600001'],
    // 'allAvailableList': [
    //   {
    //     'availableAt': {
    //       'availableNow': false,
    //       'closes': '',
    //       'closingIn': -1,
    //       'opens': ''
    //     },
    //     'day': moment().tz('America/Los_Angeles').format('ddd').toUpperCase(),
    //     'index': 0
    //   }
    // ],
    'aliasNameCaptureEnabled': false,
    'allAvailableList': [],
    'atriumConfig': undefined,
    'availableAt': {'availableNow': false, 'closes': '', 'closingIn': -1, 'opens': ''},
    'conceptLevelIgPosConfig': false,
    'dateTime': undefined,
    'deliveryDestination': undefined,
    'digitalMenuEnabled': undefined,
    'dineInConfig': undefined,
    'displayOptions': {'WELCOME/BodyImage': '23', 'conceptLogo': 'concept.jpg', 'logoFileName': 'testlogo.jpg', 'welcomeBackgroundImage': 'test.jpg'},
    'displayProfileId': undefined,
    'emailReceipt': undefined,
    'etf': undefined,
    'futureScheduledDays': 0,
    'id': 'mock-context-id',
    'image': 'application/api/image/undefined/mock-context-id/23',
    'isAsapOrderDisabled': false,
    'isFutureSchedulingEnabled': false,
    'isLoyaltyEnabled': undefined,
    'loyaltyAccrueEnabled': false,
    'paymentLoyaltyEnabled': undefined,
    'isScheduleOrderEnabled': false,
    'location': undefined,
    'loyaltyDetails': undefined,
    'memberChargeTenderId': undefined,
    'multiPaymentEnabled': undefined,
    'name': 'SB',
    'nameCapture': undefined,
    'navigation': undefined,
    'orderThrottling': undefined,
    'pay': {'clientId': undefined, 'headerText': undefined, 'iFrameApi': undefined, 'iFrameTenantID': undefined, 'instructionText': undefined, 'payOptions': [], 'paymentsEnabled': undefined, 'stripeConfig': undefined, 'subInstructionText': undefined},
    'pickUpConfig': undefined,
    'postCreditCardsAsExternalPayments': undefined,
    'printReceipt': undefined,
    'profitCenter': undefined,
    'profitCenterId': undefined,
    'roomChargeConfiguration': undefined,
    'memberChargeConfiguration': undefined,
    'roomChargeIds': '',
    'roomChargeTenderConfig': undefined,
    'sms': {'countryCode': '1', 'isMobileNumberRequired': false, 'isSmsEnabled': false, 'regionCode': 'US', 'smsComplianceText': undefined, 'smsHeaderText': undefined, 'smsInstructionText': undefined, 'countryCodeList': undefined},
    'specialInstructions': undefined,
    'limitItems': undefined,
    'storeAvailabeNow': undefined,
    'storeInfo': {
      'address': [
        '7 street test',
        'chennai TN 600001'
      ],
      'address1': '7 street',
      'address2': 'test',
      'city': 'chennai',
      'image': 'application/api/image/undefined/mock-context-id/23',
      'location': undefined,
      'logoDetails': {
        'RECEIPT_HEADER': {
          'fileName': '23'
        }
      },
      'state': 'TN',
      'storeName': 'SB',
      'taxIdentificationNumber': undefined,
      'timezone': 'America/Los_Angeles',
      'zipCode': '600001'
    },
    'storePriceLevel': undefined,
    'taxIdentificationNumber': undefined,
    'textReceipt': undefined,
    'textReceiptFormat': undefined,
    'timeZone': 'America/Los_Angeles',
    'todaySchedulingEnabled': false,
    'useIgOrderApi': false,
    'itemDisplayList': undefined,
    'cartScreen': undefined,
    'checkTypeId': undefined,
    'closedScreen': undefined,
    'footer': undefined,
    'gaAccountConfig': undefined,
    'homeScreen': undefined,
    'invalidScreen': undefined,
    'multiPassEnabled': undefined,
    'tip': undefined}]

  menuResponseSingleCategory = [{'categories': [{'id': '0', 'items': [{'amount': 10, 'attributes': [], 'conceptId': '12', 'description': 'Test', 'id': '234', 'image': 'application/api/image/23/mock-context-id/test.png', 'itemImages': [{'fileNames': ['test.png']}], 'longDescription': 'Test', 'modifiers': undefined, 'options': [], 'price': {'amount': 10}, 'thumbnail': 'application/api/image/23/mock-context-id/test.png'}], 'itemsListEmpty': true, 'itemsLoaded': true, 'name': ''}], 'id': '234', 'items': {'id': '234'}}];

  menuResponseMultipleCategory = [{'categories': [{'id': '0', 'image': 'application/api/image/23/mock-context-id/test-image-xl.jpg', 'items': {'id': '234'}, 'itemsLoaded': false, 'kioskImages': [{'fileNames': ['test-image-xl.jpg', 'test-image-md.jpg']}]}, {'id': '1', 'image': 'application/api/image/23/mock-context-id/test-image-xl.jpg', 'items': {'id': '235'}, 'itemsLoaded': false, 'kioskImages': [{'fileNames': ['test-image-xl.jpg', 'test-image-md.jpg']}]}], 'id': '234'}];

  menuResponseWithModifier = [{'categories': [{'id': '0', 'items': [{'amount': 10, 'attributes': [], 'childGroups': [{'displayName': 'choice1', 'id': 1, 'isAvailableToGuests': true, 'maximum': 1}, {'childItems': [{'childGroups': [{'displayText': 'sub-choice1', 'id': 3, 'price': {'amount': 10}}], 'displayText': 'sub-choice1', 'id': 3, 'isAvailableToGuests': true, 'price': {amount: 10}}], 'displayName': 'choice2', 'id': 1, 'isAvailableToGuests': true, 'maximum': 2}, {'isAvailableToGuests': false}], 'conceptId': '12', 'description': 'Test', 'id': '234', 'image': 'application/api/image/23/mock-context-id/test.png', 'itemImages': [{'fileNames': ['test.png']}], 'longDescription': 'Test', 'modifiers': undefined, 'options': [], 'price': {'amount': 10}, 'thumbnail': 'application/api/image/23/mock-context-id/test.png'}], 'itemsListEmpty': true, 'itemsLoaded': true, 'name': ''}], 'id': '234', 'items': {'childGroups': [{'displayName': 'choice1', 'id': 1, 'isAvailableToGuests': true, 'maximum': 1}, {'childItems': [{'childGroups': [{'displayText': 'sub-choice1', 'id': 3, 'price': {'amount': 10}}], 'displayText': 'sub-choice1', 'id': 3, 'isAvailableToGuests': true, 'price': {'amount': 10}}], 'displayName': 'choice2', 'id': 1, 'isAvailableToGuests': true, 'maximum': 2}, {'isAvailableToGuests': false}], 'id': '234'}}];

  categoryItemsResponse = [{'0': '2', 'amount': 10, 'attributes': [], 'conceptId': '123', 'description': 'Test', 'image': 'application/api/image/23/mock-context-id/test.png', 'itemImages': [{'fileNames': ['test.png']}], 'longDescription': 'Test', 'modifiers': undefined, 'options': [], 'price': {'amount': 10}, 'thumbnail': 'application/api/image/23/mock-context-id/test.png'}, {'0': '3', 'amount': 10, 'attributes': [], 'conceptId': '123', 'description': 'Test', 'image': 'application/api/image/23/mock-context-id/test.png', 'itemImages': [{'fileNames': ['test.png']}], 'longDescription': 'Test', 'modifiers': undefined, 'options': [], 'price': {'amount': 10}, 'thumbnail': 'application/api/image/23/mock-context-id/test.png'}];

  get tenant () {
    return this.tenantId;
  }

  createOrder () {
    if (this.order instanceof Error) {
      throw this.order;
    }
    return this.order;
  }

  addItemToOrder () {
    if (this.order instanceof Error) {
      throw this.order;
    }
    return this.order;
  }

  deleteItemFromOrder () {
    if (!(this.order instanceof Error) && this.order && !this.order.orderDetails) {
      return undefined;
    } else if (!this.order) {
      throw Error('Somthing went wrong in delete order');
    } else if (this.order instanceof Error) {
      throw this.order;
    }
    return this.order;
  }

  postPayment (orderdata) {
    return orderdata;
  }

  closeOrder () {
    if (this.closeOrderData instanceof Error) {
      throw this.closeOrderData;
    } else if (!this.closeOrderData.data) {
      throw Error('close order data missing');
    }
    return this.closeOrderData;
  }

  getReceipt () {
    return this.receipt;
  }

  sendEmailReceipt () {
    return this.emailResponse;
  }

  sendSMSReceipt () {
    return this.smsResponse;
  }

  getStoreInfo () {
    return this.storeInfo;
  }

  getStoresWithDetails () {
    if (!this.sites) {
      let error = new Error('get sites failed');
      error.response = { status: 503 };
      throw error;
    }
    return this.sites;
  }

  getProfile (businessContext, profileId) {
    if (!(profileId && businessContext)) {
      let error = new Error('get concept failed');
      error.response = { status: 503 };
      throw error;
    }
    return this.concepts;
  }

  getDetails (businessContext, profileId) {
    if (!(profileId && businessContext)) {
      let error = new Error('get concept failed');
      error.response = { status: 503 };
      throw error;
    }
    return this.profile;
  }

  getSchedule () {
    return this.schedule;
  }

  getMenus (businessContext, conceptId) {
    if (!(conceptId && businessContext)) {
      let error = new Error('get menus failed');
      error.response = { status: 503 };
      throw error;
    }
    return this.menus;
  }

  getItems (businessContext, items) {

    if (items instanceof Array) {
      if (items.length === 0) {
        return undefined;
      }
      return items.map((item) => ({
        ...item,
        longDescription: 'Test',
        price: {
          amount: 10.00
        },
        itemImages: [
          {
            fileNames: [
              'test.png'
            ]
          }
        ]
      }));
    }

    return [{
      ...items,
      longDescription: 'Test',
      price: {
        amount: 10.00
      },
      itemImages: [
        {
          fileNames: [
            'test.png'
          ]
        }
      ]
    }];
  }

  getConfiguredStore (businessContext) {
    return {
      storeInfo: {
        timezone: 'America/Los_Angeles'
      }
    };
  }

  getItemDetails () {
    if (this.menus) {
      return {
        id: '234',
        menuId: '234',
        description: 'description',
        price: {amount: '100.00'},
        itemImages: [
          {
            fileNames: ['test-image-xl.jpg', 'test-image-md.jpg']
          }
        ],
        options: [],
        attributes: [],
        modifiers: undefined
      };
    } else {
      let error = new Error('get item details failed');
      error.response = { status: 503 };
      throw error;
    }
  }

  postPaymentToPaymentGateWay (values) {
    if (!values) {
      throw new Error('payment values not found');
    }
    return this.paymentData;
  }

  login () {
    return this.isApiKeyValid;
  }

  getWaitTimeForItems () {
    if (this.waitTimes instanceof Error) {
      throw this.waitTimes;
    } else if (this.waitTimes && this.waitTimes.minutes) {
      return this.waitTimes;
    } else {
      if (!this.waitTimes.minutes) {
        return undefined;
      } else {
        throw new Error('Error');
      }
    }
  }
}
