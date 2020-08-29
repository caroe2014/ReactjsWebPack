// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export const locationSeparator = {
  SPACE: ' ',
  COMMA: ','
};

export const PHONE_NUMBER_FORMAT_REGEX = /(\d{0,3})(\d{0,3})(\d{0,4})/;
export const CARD_NUMBER_FORMAT_REGEX = /(\d{0,20})/;

export const PHONE_NUMBER_PATTERN = '[0-9]{3}-[0-9]{3}-[0-9]{4}';
export const PHONE_NUMBER_PATTERN_INTL = '[0-9]*';
export const PIN_PATTERN = '[0-9]{4}';

export const FIRST_NAME_PATTERN = /^([a-z|A-Z][,.]?[ ]?|[a-z|A-Z]['-]?)*$/;
export const AVOID_ONLY_FIRST_SPACE = /^([\S\w*][ ]?)*$/;
export const CREDIT_LAST_FOUR_PATTERN = /^[0-9]{0,4}$/;

export const LAST_INITIAL_PATTERN = /^[a-z|A-Z][a-z|A-Z\s]{0}$/;
export const LESS_AMOUNT = 'amount_too_small';
export const countryCode = {
  US: '1'
};
export const STRIPE_COUNTRY = 'US';

export const scheduleType = {
  asap: 'asap',
  laterToday: 'laterToday'
};

export const fontType = {
  roboto: 'Roboto',
  adobeClean: 'Adobe Clean'
};

export const scheduleOrderConfig = {
  bufferTime: 30,
  intervalTime: 15
};

export const loyaltyConfig = {
  defaultLoyaltyWaitTime: 15, // seconds
  cardSource: 'MANUAL',
  maxAttempts: 2,
  retryCount: 2
};

export const paymentTypes = {
  IFRAME: 'iframe',
  STRIPE: 'stripe',
  GA: 'ga',
  MULTIPAYMENT: 'multiPayment',
  GA_LASTMULTIPAYMENT: 'gaLastMultiPayment',
  ROOM_CHARGE: 'roomCharge',
  MEMBER_CHARGE: 'memberCharge',
  LOYALTY_POINTS: 'loyaltyPoints',
  LOYALTY_POINTS_LASTMULTIPAYMENT: 'loyaltyPointsLastMultiPayment',
  LOYALTY_VOUCHER: 'loyaltyVoucher',
  LOYALTY_VOUCHER_LASTMULTIPAYMENT: 'loyaltyVoucherLastMultiPayment',
  LOYALTY_HOSTCOMPVOUCHER_LASTMULTIPAYMENT: 'loyaltyHostCompVoucherLastMultiPayment',
  LOYALTY_HOSTCOMPVOUCHER: 'loyaltyHostCompVoucher',
  LOYALTY: 'loyalty',
  ATRIUM_LASTPAYMENT: 'atriumLastPayment'
};

export const loyaltyTenderMappings = {
  'points/PATRON': {
    tenderIdKey: 'LOYALTY/pointPatronTenderId',
    displayLabel: 'LOYALTY/uiPtrnPointAccountBrandingLabel'
  },
  'points/COMP': {
    tenderIdKey: 'LOYALTY/pointCompTenderId',
    displayLabel: 'LOYALTY/uiCompPointAccountBrandingLabel'
  },
  'points/PROMO': {
    tenderIdKey: 'LOYALTY/pointSecondCompTenderId',
    displayLabel: 'LOYALTY/uiSecondPointAccountBrandingLabel'
  },
  'points/POINTS': {
    tenderIdKey: 'LOYALTY/pointsTenderId',
    displayLabel: 'LOYALTY/uiPointsAccountBrandingLabel'
  },
  'points/COMPS': {
    tenderIdKey: 'LOYALTY/pointCompsTenderId',
    displayLabel: 'LOYALTY/uiCompsPointAccountBrandingLabel'
  },
  'voucher/OFFER': {
    tenderIdKey: 'LOYALTY/voucherOfferTenderId'
  },
  'voucher/COUPON': {
    tenderIdKey: 'LOYALTY/voucherCouponTenderId'
  },
  'voucher/HOSTCOMP': {
    tenderIdKey: 'LOYALTY/hostCompTenderId',
    displayLabel: 'LOYALTY/uiHostCompBrandingLabel'
  },
  'voucher/CASH': {
    tenderIdKey: 'LOYALTY/voucherCashTenderId'
  },
  'voucher/PRIZE': {
    tenderIdKey: 'LOYALTY/voucherPrizeTenderId'
  },
  'voucher/COMP': {
    tenderIdKey: 'LOYALTY/voucherCompTenderId'
  }
};

export const DEFAULT_LOYALTY_PIN_LENGTH = 4;

export const MULTI_PASS_ORDER_GUID = 'orderGuid';

export const SAML_COOKIE_PASSWORD = '14523695874159852035.014523695874159852035.014523695874159852035.0';
export const SAML_COOKIE_TTL = 1000 * 60 * 60 * 24;

export const atriumAccountTypes = {
  'MEAL_COUNT': 'MEAL_COUNT',
  'CASH_EQUIVALENT': 'CASH_EQUIVALENT',
  'OTHER_FUNDS': 'OTHER_FUNDS'
};
