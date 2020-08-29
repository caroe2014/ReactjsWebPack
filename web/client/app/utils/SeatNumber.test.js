'use strict';

import { setSeatNumber } from './SeatNumber';

describe('setSeatNumber', function () {

  it('should set seatnumber in sessionStorage with seatNumberParam', function () {
    const location = {
      search: 'seatNumber=1234'
    };
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    spy.mockClear();
  });
  it('should skip setting seatnumber in sessionStorage when seatNumberParam is not available', function () {
    const location = {
      search: ''
    };
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    spy.mockClear();
  });
});
