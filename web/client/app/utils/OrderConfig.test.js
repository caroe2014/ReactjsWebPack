'use strict';

import { getOrderConfigurationDetails } from './OrderConfig';

describe('getOrderConfigurationDetails', function () {
  let items = [];
  let storesList = [];
  storesList = [
    {
      id: 1001,
      deliveryDestination: {},
      tip: {},
      pay: {},
      sms: {},
      nameCapture: {},
      name: {}
    }
  ];
  it('should return undefined if items is empty', function () {
    expect(getOrderConfigurationDetails(items, storesList)).toEqual(undefined);
  });
  it('should return if items has value', function () {
    items = [
      {
        id: 1001,
        contextId: 1001
      }
    ];
    const expected = {'siteId': 1001, 'deliveryDestination': {}, 'nameCapture': {}, 'pay': {}, 'sms': {}, 'storeName': {}, 'tip': {}};
    expect(getOrderConfigurationDetails(items, storesList)).toEqual(expected);
  });
});
