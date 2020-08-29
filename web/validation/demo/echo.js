// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import joi from 'joi';

export default {
  echo: joi.string().max(24).required()
};
