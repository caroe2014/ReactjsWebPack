// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import { select } from 'redux-saga/effects';

export const SET_DELIVERY_DETAILS = 'SET_DELIVERY_DETAILS';
export const RESET_DELIVERY_DETAILS = 'RESET_DELIVERY_DETAILS';
export const SET_APP_ERROR = 'SET_APP_ERROR';
export const SET_DELIVERY_OPTION = 'SET_DELIVERY_OPTION';

const getKitchenString = (store) => store.delivery.kitchenString;
const getNameString = (store) => (store.namecapture.firstName || store.namecapture.lastInitial) &&
  `${store.namecapture.firstName} ${store.namecapture.lastInitial}`;
const getDeliveryOption = (store) => store.delivery.deliveryOption;

export const setDeliveryDetails = (deliveryDetails, kitchenString) => ({
  type: SET_DELIVERY_DETAILS,
  deliveryDetails,
  kitchenString
});

export const resetDelivery = () => ({
  type: RESET_DELIVERY_DETAILS
});

export const setDeliveryOption = (deliveryOption) => ({
  type: SET_DELIVERY_OPTION,
  deliveryOption
});

export const setAppError = (error, key) => ({
  type: SET_APP_ERROR,
  error,
  key
});

export function * getDeliveryProperties () {
  const kitchenString = yield select(getKitchenString);
  const nameString = yield select(getNameString);
  const deliveryOption = yield select(getDeliveryOption);
  let deliveryProperties = { deliveryOption };
  if (kitchenString) {
    deliveryProperties.deliveryLocation = kitchenString;
  }
  if (nameString) {
    deliveryProperties.nameString = nameString;
  }
  return deliveryProperties;
}
