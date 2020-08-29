// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

const errorCodes = [
  {
    id: 9000,
    reason: 'CLIENT_INVALID_REQUEST',
    message: 'The request is not valid.',
    type: 'gatewayError'
  },
  {
    id: 9001,
    reason: 'CLIENT_INVALID_CONFIGURATION',
    message: 'The configuration in the request is not invalid.',
    type: 'gatewayError'
  },
  {
    id: 9100,
    reason: 'HANDLER_INTERNAL_ERROR',
    message: 'An internal error has occurred in the gateway handler.',
    type: 'gatewayError'
  },
  {
    id: 9102,
    reason: 'HANDLER_INVALID_CONFIGURATION',
    message: 'The gateway handler has invalid configuration.',
    type: 'gatewayError'
  },
  {
    id: 9300,
    reason: 'GATEWAY_ERROR',
    message: 'The gateway has returned an error.',
    type: 'gatewayError'
  },
  {
    id: 9301,
    reason: 'GATEWAY_AUTHENTICATION_FAILED',
    message: 'The gateway authentication failed.',
    type: 'gatewayError'
  },
  {
    id: 9302,
    reason: 'GATEWAY_UNAVAILABLE',
    message: 'The gateway is not available.',
    type: 'gatewayError'
  },
  {
    id: 9303,
    reason: 'GATEWAY_PROCESSOR_UNAVAILABLE',
    message: 'The processor used by the gateway is not available.',
    type: 'gatewayError'
  },
  {
    id: 9304,
    reason: 'GATEWAY_UNSUPPORTED_REQUEST',
    message: 'The gateway does not support the specified request.',
    type: 'gatewayError'
  },
  {
    id: 9305,
    reason: 'GATEWAY_PROCESSOR_UNSUPPORTED_REQUEST',
    message: 'Processor or issuing bank does not support this transaction.',
    type: 'gatewayError'
  },
  {
    id: 9500,
    reason: 'CARD_ERROR',
    message: 'The card has an error.',
    type: 'iFrameError'
  },
  {
    id: 9502,
    reason: 'CARD_INVALID_ACCOUNT_NUMBER',
    message: 'The card has an invalid account number.',
    type: 'iFrameError'
  },
  {
    id: 9503,
    reason: 'CARD_INVALID_EXPIRATION_DATE',
    message: 'The card has an invalid expiration date.',
    type: 'iFrameError'
  },
  {
    id: 9504,
    reason: 'CARD_UNSUPPORTED_CARD_ISSUER',
    message: 'The card issuer is not supported.',
    type: 'iFrameError'
  },
  {
    id: 9600,
    reason: 'CARD_DECLINED',
    message: 'The card is declined.',
    type: 'iFrameError'
  },
  {
    id: 9601,
    reason: 'CARD_DECLINED_EXPIRED',
    message: 'The card is declined because the card is expired.',
    type: 'iFrameError'
  },
  {
    id: 9602,
    reason: 'CARD_DECLINED_LIMIT',
    message: 'The card is declined because the card is over limit.',
    type: 'iFrameError'
  },
  {
    id: 9604,
    reason: 'CARD_DECLINED_CVV',
    message: 'The card is declined because the CVV is invalid.',
    type: 'iFrameError'
  },
  {
    id: 9605,
    reason: 'CARD_DECLINED_AVS',
    message: 'The card is declined because the AVS is invalid.',
    type: 'iFrameError'
  },
  {
    id: 9603,
    reason: 'CARD_DECLINED_REFERRAL',
    message: 'The card is declined because referral for voice authorization.',
    type: 'iFrameError'
  }
];

export default class ErrorCodes {
  constructor () {
    this.errorCodes = errorCodes.slice();
  }

  getItem (id) {
    return this.errorCodes.find(item => item.id === id);
  }

  get data () {
    return this.errorCodes;
  }
};
