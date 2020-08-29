import { convertTimeStringToMomentFormat } from './common';

describe('convertTimeStringToMomentFormat', function () {
  it('should return specific moment with custom time', function () {
    const customMomentTime = convertTimeStringToMomentFormat('9:15 AM');
    expect(customMomentTime.hour()).toEqual(9);
    expect(customMomentTime.minute()).toEqual(15);
  });
});
