'use strict';

import { setNameDetails, resetNameDetails } from './sagas';

describe('Delviery Location Saga', function () {

  it('should return setNameDetails with SET_NAME_DETAILS', function () {
    const expected = {'firstName': 'testFirst', 'lastInitial': 'testLast', 'type': 'SET_NAME_DETAILS'};
    expect(setNameDetails('testFirst', 'testLast')).toEqual(expected);
  });

  it('should resetNameDetails with RESET_NAME_DETAILS', function () {
    const expected = {'type': 'RESET_NAME_DETAILS'};
    expect(resetNameDetails()).toEqual(expected);
  });

});
