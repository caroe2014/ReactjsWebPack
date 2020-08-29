'use strict';

import { setMobileNumber, resetSmsDetails } from './sagas';

describe('Delviery Location Saga', function () {

  it('should setMobileNumber with SET_MOBILE_NUMBER', function () {
    const expected = {'mobileNumber': 1234567890, 'type': 'SET_MOBILE_NUMBER'};
    expect(setMobileNumber(1234567890)).toEqual(expected);
  });

  it('should resetSmsDetails details with RESET_SMS_DETAILS', function () {
    const expected = {'type': 'RESET_SMS_DETAILS'};
    expect(resetSmsDetails()).toEqual(expected);
  });

});
