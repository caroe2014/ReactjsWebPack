// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import get from 'lodash.get';

export const transformCartItemToOrderItem = (item, mealPeriodId, currencyDetails, storePriceLevel) => {
  let currencyUnit = get(currencyDetails, 'currencyCode', 'USD');
  let price = item.price ? ((item.priceLevels && item.priceLevels[storePriceLevel]) ? item.priceLevels[storePriceLevel].price : item.price)
    : {currencyUnit: currencyUnit, amount: item.baseAmount ? item.baseAmount : item.amount};

  let orderItem = {
    itemId: item.id,
    price: price,
    weight: 0.0,
    quantity: item.count || item.quantity || 1,
    properties: {
      splInstruction: item.splInstruction,
      mealPeriodId: mealPeriodId,
      priceLevelId: item.price ? ((item.priceLevels && item.priceLevels[storePriceLevel]) ? item.priceLevels[storePriceLevel].priceLevelId : item.defaultPriceLevelId)
        : item.childPriceLevelId,
      displayText: item.displayText || item.description || ''
    }
  };

  if (item.options) {
    orderItem.addLineItemGroups = transformToGroup(item.options);
  }
  if (item.selectedModifiers) {
    orderItem.addLineItemGroups = transformToGroup(item.selectedModifiers);
  }
  return orderItem;
};

function transformToGroup (items) {
  let groupCache = {};
  items.filter(option => option.selected).map(group => ({
    groupId: group.parentGroupId,
    addLineItemRequests: [transformCartItemToOrderItem(group)]
  })).forEach(group => {
    if (groupCache[group.groupId]) {
      groupCache[group.groupId].addLineItemRequests = [
        ...groupCache[group.groupId].addLineItemRequests,
        ...group.addLineItemRequests
      ];
    } else {
      groupCache[group.groupId] = group;
    }
  });
  return Object.keys(groupCache).map(key => groupCache[key]);
}

export const buildNewOrder = (item, currencyDetails, orderTimeZone, useIgOrderApi,
  onDemandTerminalId, orderProperties, mealPeriodId) => {

  const addLineItemRequests = Array.isArray(item) ? item : [item];

  let properties = {
    useIgOrderApi,
    openTerminalId: onDemandTerminalId,
    closedTerminalId: onDemandTerminalId,
    orderNumberNameSpace: onDemandTerminalId,
    orderNumberSequenceLength: 4,
    mealPeriodId,
    ...orderProperties
  };
  return {
    currencyUnit: get(currencyDetails, 'currencyCode', 'USD'),
    orderState: 'OPEN',
    timeZone: orderTimeZone,
    gratuityAmount: {
      currencyUnit: get(currencyDetails, 'currencyCode', 'USD'),
      amount: '0.00'
    },
    serviceAmount: {
      currencyUnit: get(currencyDetails, 'currencyCode', 'USD'),
      amount: '0.00'
    },
    addLineItemRequests,
    properties
  };
};

export const getOrderProperties = (orderData) => {
  const scheduledOrderTime = get(orderData, 'order.scheduledOrderTime');
  const deliveryLocation = getDeliveryLocation(orderData);
  return {
    orderSourceSystem: 'onDemand',
    openTerminalId: get(orderData, 'igSettings.onDemandTerminalId'),
    closedTerminalId: get(orderData, 'igSettings.onDemandTerminalId'),
    employeeId: get(orderData, 'igSettings.onDemandEmployeeId'),
    kioskId: get(orderData, 'igSettings.onDemandKioskId'),
    profitCenterId: get(orderData, 'profitCenterId'),
    fireOrderToKitchenByTransactionService: get(orderData, 'igSettings.fireOrderToKitchenByTransactionService'),
    checkTypeId: get(orderData, 'igSettings.check-type'),
    packageOption: scheduledOrderTime ? `${scheduledOrderTime} ${get(orderData, 'deliveryProperties.deliveryOption.kitchenText')}` : deliveryLocation,
    employeeName: deliveryLocation,
    mobileNumber: get(orderData, 'mobileNumber'),
    profitCenterName: get(orderData, 'profitCenterDetails.name'),
    mealPeriodId: get(orderData, 'order.lineItems[0].properties.mealPeriodId'),
    deliveryOption: get(orderData, 'deliveryProperties.deliveryOption.kitchenText'),
    pickupAddress: get(orderData, 'deliveryProperties.deliveryLocation'),
    purchaserName: get(orderData, 'deliveryProperties.nameString'),
    scheduledTime: scheduledOrderTime,
    useIgOrderApi: get(orderData, 'igSettings.useIgOrderApi', false),
    orderNumberNameSpace: get(orderData, 'order.properties.orderNumberNameSpace'),
    orderNumberSequenceLength: get(orderData, 'order.properties.orderNumberSequenceLength')
  };
};

const getDeliveryLocation = (orderData) => {
  if (orderData.deliveryProperties.deliveryOption.id === 'delivery') {
    return orderData.deliveryProperties.deliveryLocation;
  } else if (orderData.nameCapture) {
    return orderData.deliveryProperties.nameString;
  } else {
    return orderData.deliveryProperties.deliveryOption.kitchenText;
  }
};
