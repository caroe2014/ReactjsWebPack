// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import echo from 'web/validation/demo/echo';
import email from 'web/validation/login/email';
import userNamePassword from 'web/validation/login/userNamePassword';
import mobile from 'web/validation/mobile';

class ValidationError extends Error {
  constructor (message, joiError) {
    super(...arguments);
    Error.captureStackTrace(this, ValidationError);
    this.response = {
      status: 400,
      data: joiError,
      message
    };
  }
}

export {
  ValidationError,
  echo,
  email,
  userNamePassword,
  mobile
};
