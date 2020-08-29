import ErrorCodes from './error-codes';

// beforeEach(() => {
//   // Clear all instances and calls to constructor and all methods:
//   ErrorCodes.mockClear();
// });
describe('ErrorCodes', () => {
  it('should return item when id is passed', () => {
    const expected = {
      id: 9001,
      reason: 'CLIENT_INVALID_CONFIGURATION',
      message: 'The configuration in the request is not invalid.',
      type: 'gatewayError'
    };
    const errorCodes = new ErrorCodes();
    expect(errorCodes.getItem(9001)).toEqual(expected);
  });
});

describe('ErrorCodes', () => {
  it('should return data when it is called', () => {
    const errorCodes = new ErrorCodes();
    jest.spyOn(errorCodes, 'data', 'get').mockReturnValue(false);
    expect(errorCodes.data).toEqual(false);
  });
});
