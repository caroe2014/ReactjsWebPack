// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { combineReducers } from 'redux';

import app from 'web/client/app/modules/app/reducer';
import sites from 'web/client/app/modules/site/reducer';
import concept from 'web/client/app/modules/concept/reducer';
import menu from 'web/client/app/modules/menu/reducer';
import cart from 'web/client/app/modules/cart/reducer';
import stripepayments from 'web/client/app/modules/stripepay/reducer';
import payments from 'web/client/app/modules/iFrame/reducer';
import paymentOptions from 'web/client/app/modules/payOptions/reducer';
import itemdetails from 'web/client/app/modules/itemdetails/reducer';
import communication from 'web/client/app/modules/communication/reducer';
import error from 'web/client/app/modules/error/reducer';
import delivery from 'web/client/app/modules/deliverylocation/reducer';
import tip from 'web/client/app/modules/tip/reducer';
import smsnotification from 'web/client/app/modules/smsnotification/reducer';
import namecapture from 'web/client/app/modules/namecapture/reducer';
import scheduleorder from 'web/client/app/modules/scheduleorder/reducer';
import loyalty from 'web/client/app/modules/loyalty/reducer';
import gaPayment from 'web/client/app/modules/gaPayment/reducer';
import profile from 'web/client/app/modules/guestProfile/reducer';
import roomCharge from 'web/client/app/modules/roomCharge/reducer';
import memberCharge from 'web/client/app/modules/memberCharge/reducer';
import atrium from 'web/client/app/modules/atrium/reducer';
import platformGuestProfile from 'web/client/app/modules/platformGuestProfile/reducer';
import communalCart from 'web/client/app/modules/communalCart/reducer';

export default combineReducers({
  app,
  sites,
  concept,
  menu,
  cart,
  stripepayments,
  payments,
  paymentOptions,
  itemdetails,
  communication,
  error,
  delivery,
  tip,
  smsnotification,
  namecapture,
  scheduleorder,
  loyalty,
  gaPayment,
  profile,
  roomCharge,
  memberCharge,
  atrium,
  platformGuestProfile,
  communalCart
});
