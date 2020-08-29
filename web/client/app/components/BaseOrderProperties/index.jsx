// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React from 'react';
import { connect } from 'react-redux';
import { Fixed } from 'rebass';
import styled from 'styled-components';
import Loader from 'web/client/app/components/Loader/index';
import { getSites, setOrderConfig, setCurrencyForPay, getSiteTaxRuleData } from 'web/client/app/modules/site/sagas';
import { getOrderConfigurationDetails } from 'web/client/app/utils/OrderConfig';
import get from 'lodash.get';

const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BaseOrderWrapper = WrappedComponent => (props) => {
  class OrderProperties extends React.Component {
    componentDidUpdate () {
      this.onEmptyCart();
    }

    componentWillMount () {
      this.onEmptyCart();
    }

    componentDidMount () {
      if (this.props.storesList.length === 0) {
        this.props.getSites();
      }
    }

    componentWillReceiveProps (nextProps) {
      const { lastCartLocation, cartItems, storesList, history, vatEnabled, displayProfileId } = this.props;
      if (storesList.length !== nextProps.storesList.length && nextProps.storesList.length > 0) {
        const orderConfig = getOrderConfigurationDetails(cartItems, nextProps.storesList, displayProfileId);
        if (vatEnabled && !orderConfig.taxRuleData) {
          this.props.getSiteTaxRuleData(cartItems[0].contextId, displayProfileId, true);
        }
        this.props.setOrderConfig(orderConfig);
        this.props.setCurrencyForPay(cartItems[0].contextId, displayProfileId);
        if ((props.isDelivery && !get(orderConfig.deliveryDestination, 'deliverToDestinationEnabled', false)) ||
        (props.isName && !get(orderConfig.nameCapture, 'featureEnabled', false)) ||
        (props.isTip && !get(orderConfig.tip, 'acceptTips', false)) ||
        (props.isSms && !get(orderConfig.sms, 'isSmsEnabled', false))) {
          history.replace(lastCartLocation || '/');
        }
      }
      if ((this.props.taxError !== nextProps.taxError && nextProps.taxError) ||
        (this.props.siteError !== nextProps.siteError && nextProps.siteError)) {
        history.replace('/');
      }
    }

    onEmptyCart () {
      const { cartItems, lastCartLocation, history } = this.props;
      if (!cartItems || cartItems.length === 0) {
        history.replace(lastCartLocation || '/');
      }
    }

    render () {
      const {configFetching, siteFetching, fetchingTax, history} = this.props;
      return (
        (!configFetching && !siteFetching && !fetchingTax) ? <WrappedComponent {...props} history={history} />
          : <LoadingContainer><Loader /></LoadingContainer>
      );
    }
  };

  const mapStateToProps = (state, props) => ({
    cartItems: state.cart.items,
    displayProfileId: state.cart.displayProfileId,
    lastCartLocation: state.cart.lastCartLocation,
    storesList: state.sites.list,
    configFetching: state.app.fetching,
    siteFetching: state.sites.fetching,
    fetchingTax: state.sites.fetchingTax,
    siteError: state.sites.error,
    taxError: state.sites.taxError,
    vatEnabled: state.cart.vatEnabled,
    _props: props
  });

  const mapDispatchToProps = (dispatch) => ({
    getSites: () => dispatch(getSites()),
    setOrderConfig: (orderConfig) => dispatch(setOrderConfig(orderConfig)),
    setCurrencyForPay: (siteId, displayProfileId) => dispatch(setCurrencyForPay(siteId, displayProfileId)),
    getSiteTaxRuleData: (siteId, displayProfileId, showError) => dispatch(getSiteTaxRuleData(siteId, displayProfileId, showError)) // eslint-disable-line max-len
  });

  return connect(mapStateToProps, mapDispatchToProps)(OrderProperties);
};

export default BaseOrderWrapper;
