'use strict';

import { ValidationError } from '.';

describe('ValidationError', function () {
  it('should return font size based on input', function () {
    const validationError = new ValidationError('testMessage', 'joiError');
    expect(validationError.response.message).toBe('testMessage');
    expect(validationError.response.data).toBe('joiError');
  });
});
