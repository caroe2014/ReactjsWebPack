// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as actions from './sagas';
import get from 'lodash.get';
import { getCurrentCurrency } from 'web/client/app/utils/common';

const initialState = {
  fetching: false,
  isSortNearBy: true,
  lastUpdated: null,
  list: [],
  selectedId: -1,
  displayProfileId: -1,
  currencyDetails: {},
  shouldPostCreditCardsAsExternalPayments: false, // To be removed OND-294
  error: null,
  currencyForPay: {},
  orderConfig: {},
  isLoyaltyEnabled: false,
  fetchingTax: false
};

const SiteReducer = (state = initialState, action) => {

  // To be removed OND-294
  const getPostCreditCardsAsExternalPayments = (selectedSite) => get(selectedSite, 'postCreditCardsAsExternalPayments', false) === 'true'; // eslint-disable-line max-len

  switch (action.type) {
    case actions.GET_SITES:
      return {
        ...state
      };
    case actions.RESET_SITES:
      return {
        ...initialState
      };
    case actions.FETCHING_SITES:
      return {
        ...state,
        list: [],
        error: null,
        fetching: true,
        isSortNearBy: true
      };
    case actions.UPDATE_NEARBY_SITES:
      return {
        ...state,
        list: action.sites
      };
    case actions.IS_SORT_NEARBY_SITES:
      return {
        ...state,
        isSortNearBy: action.value
      };
    case actions.GET_SITES_SUCCEEDED:
      return {
        ...state,
        lastUpdated: Date.now(),
        fetching: false,
        raw: action.sites,
        list: action.sites.map((site) => ({ ...site, selected: false })),
        skipSitesPage: action.sites.length === 1 &&
         get(action.sites[0], 'navigation.skipLocationsPageIfPossible', false),
        error: null
      };
    case actions.GET_SITES_FAILED:
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    case actions.SELECT_SITE:
      const selectedSite = state.list.find((site) => site.id.toString() === action.siteId.toString() &&
        site.displayProfileId === action.displayProfileId);
      return {
        ...state,
        list: state.list.map((site) => ({ ...site,
          selected: site.id === action.siteId &&
          site.displayProfileId === action.displayProfileId && !site.selected })),
        selectedId: selectedSite ? action.siteId : -1,
        displayProfileId: selectedSite ? action.displayProfileId : -1,
        currencyDetails: getCurrentCurrency(selectedSite),
        shouldPostCreditCardsAsExternalPayments: getPostCreditCardsAsExternalPayments(selectedSite)
      };
    case actions.UPDATE_PROFIT_CENTER:
      return {
        ...state,
        list: state.list.map((site) => {
          if (site.id === action.siteId && site.displayProfileId === action.displayProfileId) {
            site[action.key] = action.profitCenterDetails;
          }
          return site;
        })
      };
    case actions.UNSET_SELECTED_SITE:
      return {
        ...state,
        selectedId: -1,
        displayProfileId: -1
      };
    case actions.SET_CURRENCY_PAY:
      const cartSite = state.list.find((site) => site.id.toString() === action.siteId.toString() &&
        site.displayProfileId === action.displayProfileId);
      return {
        ...state,
        currencyForPay: getCurrentCurrency(cartSite)
      };
    case actions.SET_ORDER_CONFIG:
      return {
        ...state,
        orderConfig: action.orderConfig
      };
    case actions.SET_LOYALTY_ENABLED:
      return {
        ...state,
        isLoyaltyEnabled: action.loyaltyEnabled
      };
    case actions.FETCHING_TAX_RULE_DATA:
      return {
        ...state,
        fetchingTax: true,
        taxError: null,
        list: state.list.map((site) => {
          if (site.id === action.siteId) {
            site.taxRuleData = null;
          }
          return site;
        })
      };
    case actions.FETCH_TAX_RULE_DATA_SUCCEEDED:
      return {
        ...state,
        fetchingTax: false,
        list: state.list.map((site) => {
          if (site.id === action.siteId) {
            site.taxRuleData = action.taxRuleData;
          }
          return site;
        })
      };
    case actions.FETCH_TAX_RULE_DATA_FAILED:
      return {
        ...state,
        fetchingTax: false,
        taxError: action.error
      };
    default:
      return state;
  }
};

export default SiteReducer;
