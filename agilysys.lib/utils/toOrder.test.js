// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as agUtils from './toOrder';

import mockCartItem from './mocks/cartItem';

describe('Agilysys order Utils', () => {

  it('should transform a simple cart item to an order item', () => {

    let item = {
      id: '123',
      price: {
        amount: 10
      }
    };

    let orderItem = agUtils.transformCartItemToOrderItem(item, 'mock-meal-period-id');

    expect(orderItem).toEqual({
      itemId: '123',
      price: {
        amount: 10
      },
      weight: 0.0,
      quantity: 1,
      properties: {
        mealPeriodId: 'mock-meal-period-id',
        displayText: ''
      }
    });
  });

  it('should transform a nested cart item to an order item', () => {
    let orderItem = agUtils.transformCartItemToOrderItem(mockCartItem, 'mock-meal-period-id');

    expect(orderItem.itemId).toBe('LID-cheeseburger-1');
    expect(orderItem.addLineItemGroups.length).toBe(2);

    expect(orderItem.addLineItemGroups[0].groupId).toBe('GID-make-it-a-combo');
    expect(orderItem.addLineItemGroups[0].addLineItemRequests.length).toBe(1);

    expect(orderItem.addLineItemGroups[0].addLineItemRequests[0].itemId).toBe('LID-add-a-fit-side');
    expect(orderItem.addLineItemGroups[0].addLineItemRequests[0].addLineItemGroups.length).toBe(1);

    expect(orderItem.addLineItemGroups[0].addLineItemRequests[0].addLineItemGroups[0].groupId).toBe('GID-fit-combo');
    expect(orderItem.addLineItemGroups[0].addLineItemRequests[0].addLineItemGroups[0].addLineItemRequests.length).toBe(1);

    expect(orderItem.addLineItemGroups[0].addLineItemRequests[0].addLineItemGroups[0].addLineItemRequests[0].itemId).toBe('LID-fit-grain-salad');
  });

  it('should getOrderProperties', () => {
    const orderProperties = {
      igSettings: {
        onDemandTerminalId: '2',
        onDemandEmployeeId: '3',
        onDemandKioskId: '4'
      },
      deliveryLocation: 'test',
      mobileNumber: '1223223',
      profitCenterId: '5',
      profitCenterDetails: {
        name: 'test-profit'
      },
      deliveryProperties: {deliveryOption: {id: 'pickup', kitchenText: 'test'}},
      order: {
        lineItems: [{
          properties: {
            mealPeriodId: '6'
          }
        }
        ]
      }
    };
    const result = {
      orderSourceSystem: 'onDemand',
      openTerminalId: orderProperties.igSettings.onDemandTerminalId,
      closedTerminalId: orderProperties.igSettings.onDemandTerminalId,
      employeeId: orderProperties.igSettings.onDemandEmployeeId,
      kioskId: orderProperties.igSettings.onDemandKioskId,
      profitCenterId: orderProperties.profitCenterId,
      packageOption: orderProperties.deliveryLocation,
      mobileNumber: orderProperties.mobileNumber,
      employeeName: 'test',
      profitCenterName: orderProperties.profitCenterDetails.name,
      mealPeriodId: orderProperties.order.lineItems[0].properties.mealPeriodId,
      deliveryOption: 'test',
      pickupAddress: undefined,
      purchaserName: undefined,
      scheduledTime: undefined,
      useIgOrderApi: false
    };

    expect(agUtils.getOrderProperties(orderProperties)).toEqual(result);
  });

  // it('should buildNewOrder', () => {
  //   const lineItems = [
  //     {
  //       name: 'test'
  //     }
  //   ];

  //   const result = {
  //     currencyUnit: 'USD',
  //     orderState: 'OPEN',
  //     gratuityAmount: {
  //       currencyUnit: 'USD',
  //       amount: '0.00'
  //     },
  //     serviceAmount: {
  //       currencyUnit: 'USD',
  //       amount: '0.00'
  //     },
  //     addLineItemRequests: lineItems,
  //     properties: {}
  //   };

  //   expect(agUtils.buildNewOrder(lineItems)).toEqual(result);
  // });

  // it('should buildNewOrder lineitems as object', () => {
  //   const lineItems = {
  //     name: 'test'
  //   };

  //   const result = {
  //     currencyUnit: 'USD',
  //     orderState: 'OPEN',
  //     gratuityAmount: {
  //       currencyUnit: 'USD',
  //       amount: '0.00'
  //     },
  //     serviceAmount: {
  //       currencyUnit: 'USD',
  //       amount: '0.00'
  //     },
  //     addLineItemRequests: [lineItems],
  //     properties: {}
  //   };

  //   expect(agUtils.buildNewOrder(lineItems)).toEqual(result);
  // });

});
