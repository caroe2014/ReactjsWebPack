// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
import queryString from 'query-string';
import { MULTI_PASS_ORDER_GUID } from './constants';
export const setAppQueryParams = (location) => {
  let pathParams;
  if (location) {
    pathParams = queryString.parse(location);
    let queryStringKeys = Object.keys(pathParams);
    for (var i = 0; i < queryStringKeys.length; i++) {
      sessionStorage.setItem(queryStringKeys[i].replace(/_/g, ' '), pathParams[queryStringKeys[i]]); // eslint-disable-line no-undef
    }
  }
};

/* eslint-disable no-undef */
export const resetDeliveryInfo = () => {
  const multipassOrderGuid = sessionStorage.getItem(MULTI_PASS_ORDER_GUID);
  sessionStorage.clear();
  sessionStorage.setItem(MULTI_PASS_ORDER_GUID, multipassOrderGuid);
  return sessionStorage.clear();
};
