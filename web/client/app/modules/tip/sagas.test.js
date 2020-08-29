'use strict';

import { setTipData, resetTipData } from './sagas';

describe('Delviery Location Saga', function () {

  it('should setTipData details with SET_TIP_DATA', function () {
    const data = {
      selectedTip: 10,
      selectedTipAmount: 10
    };

    const expected = {'tipData': 10, 'tipAmount': 10, 'type': 'SET_TIP_DATA'};
    expect(setTipData(data)).toEqual(expected);
  });

  // it('should return resetTipData details with SET_APP_ERROR', function () {
  //   const expected = {'type': 'RESET_TIP_DATA'};
  //   expect(resetTipData()).toEqual(expected);
  // });

});
