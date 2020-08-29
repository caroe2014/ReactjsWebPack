// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import joi from 'joi';

export default {
  username: joi.string().required(),
  password: joi.string().required(),
  tenantId: joi.number()
};
