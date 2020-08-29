'use strict';

import { setDeliveryDetails, resetDelivery, setAppError } from './sagas';

describe('Delviery Location Saga', function () {

  it('should return delviery details with SET_DELIVERY_DETAILS', function () {
    const expected = {'deliveryDetails': 'testDetails', 'kitchenString': 'testString', 'type': 'SET_DELIVERY_DETAILS'};
    expect(setDeliveryDetails('testDetails', 'testString')).toEqual(expected);
  });

  it('should return resetDelivery details with SET_APP_ERROR', function () {
    const expected = {'type': 'RESET_DELIVERY_DETAILS'};
    expect(resetDelivery()).toEqual(expected);
  });

  it('should return setAppError with SET_DELIVERY_DETAILS', function () {
    const expected = {'error': 'testError', 'key': 'testKey', 'type': 'SET_APP_ERROR'};
    expect(setAppError('testError', 'testKey')).toEqual(expected);
  });

});
