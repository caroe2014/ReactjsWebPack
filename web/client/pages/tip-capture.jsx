// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Fixed } from 'rebass';
import theme from 'web/client/theme';
import styled, {ThemeProvider} from 'styled-components';
import Loader from 'web/client/app/components/Loader/index';
import TipCapture from 'web/client/app/components/TipCapture';
import { setTipData, resetTipData } from 'web/client/app/modules/tip/sagas';
import { setRemainingTipAmount, removeAllMultiPayments } from 'web/client/app/modules/payOptions/sagas';
import BaseOrderProperties from 'web/client/app/components/BaseOrderProperties';
import get from 'lodash.get';
import { getDeliveryEnabled } from 'web/client/app/utils/LocationUtils';

const LoadingContainer = styled(Fixed)`
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

class TipCapturePage extends Component {

  constructor (props) {
    super(props);
    this.handleSelectedTipProp = this.handleSelectedTipProp.bind(this);
    this.removeSelectedTipProp = this.removeSelectedTipProp.bind(this);
  }

  handleSelectedTipProp (tipSelected) {
    this.props.setTipData(tipSelected);
    const { tipAmount } = this.props;
    if (parseFloat(tipAmount) !== parseFloat(tipSelected.selectedTipAmount)) { // eslint-disable-line max-len
      this.props.setRemainingTipAmount(tipSelected.selectedTipAmount);
    }
  }

  removeSelectedTipProp () {
    const { tipAmount } = this.props;
    this.props.resetTipData(parseFloat(tipAmount) > 0);
  }

  render () {
    const {
      fetching,
      tipDetails,
      tipData,
      tipAmount, ...rest } = this.props;
    const deliveryEnabled = getDeliveryEnabled(this.props.orderConfig);

    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <TipCapture
            className='tip-capture-parent'
            tipDetails={tipDetails}
            {...rest}
            customTipFlag={tipDetails && tipDetails.acceptCustomTip}
            selectedTipProp={tipData}
            selectedTipAmountProp={tipAmount}
            handlerForTipProp={this.handleSelectedTipProp}
            handlerForResetTipProp={this.removeSelectedTipProp}
            deliveryEnabled={deliveryEnabled}
          />
          {(fetching) && <LoadingContainer><Loader /></LoadingContainer>}
        </Fragment>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state, props) => ({
  subTotal: state.cart.subTotal,
  total: state.cart.total,
  tax: state.cart.tax,
  gratuity: state.cart.gratuity,
  serviceAmount: state.cart.serviceAmount,
  tipDetails: state.sites.orderConfig.tip,
  currencyDetails: state.sites.currencyForPay,
  isSmsEnabled: get(state.sites.orderConfig, 'sms.isSmsEnabled'),
  nameCapture: get(state.sites.orderConfig, 'nameCapture.featureEnabled'),
  vatEnabled: state.cart.vatEnabled,
  orderConfig: state.sites.orderConfig,
  cartItems: state.cart.items,
  loyaltyInfo: state.loyalty,
  ...state.tip,
  loyaltyLinkedAccounts: state.loyalty.loyaltyProcess.loyaltyLinkedAccounts,
  hostCompVoucherPayments: state.loyalty.hostCompVoucherPayments,
  remaining: state.paymentOptions.remaining,
  removePayments: state.cart.removePayments,
  _props: props
});
const mapDispatchToProps = (dispatch) => ({
  setTipData: (data) => dispatch(setTipData(data)),
  resetTipData: (modifyTip) => dispatch(resetTipData(modifyTip)),
  setRemainingTipAmount: (tipAmount) => dispatch(setRemainingTipAmount(tipAmount)),
  removeAllMultiPayments: () => dispatch(removeAllMultiPayments())
});

export default BaseOrderProperties(connect(mapStateToProps, mapDispatchToProps)(TipCapturePage))({isTip: true}); // eslint-disable-line max-len
