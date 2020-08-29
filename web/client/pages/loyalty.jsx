// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoyaltyCapture from 'web/client/app/components/LoyaltyCapture';
import { skipLoyaltyRewards, sendLoyaltyInquiry, getLoyalty, showLoyaltyPage, setCartLoyaltyInfo,
  onLoyaltyInfoModified } from 'web/client/app/modules/loyalty/sagas';
import { ConnectedLoader } from 'web/client/app/reduxpages/ConnectedComponents';
import { selectSite } from 'web/client/app/modules/site/sagas';
import { continueWithLoyaltyCheckout } from 'web/client/app/modules/guestProfile/sagas';
import get from 'lodash.get';

class Loyalty extends Component {

  constructor (props) {
    super(props);
    this.navigateConcept = this.navigateConcept.bind(this);
    this.closeLoyaltyModal = this.closeLoyaltyModal.bind(this);
  }

  componentWillMount () {
    this.props.showLoyaltyPage(false);
    if (this.props.showLoyaltyModal && !this.props.isLoyaltyEnabled) {
      this.props.getLoyalty(this.props.siteId, this.props.displayProfileId);
    }
  }

  navigateConcept () {
    this.props.showLoyaltyPage(false);
    if (this.props.checkoutFlag) {
      this.props.continueWithLoyaltyCheckout();
    } else {
      this.props.selectSite(this.props.siteId, this.props.displayProfileId);
    }
  }

  closeLoyaltyModal () {
    this.props.showLoyaltyPage(false);
  }

  render () {
    return (
      <ConnectedLoader Comp={() =>
        <LoyaltyCapture
          {...this.props}
          loyaltyDetails={this.props.loyaltyDetails}
          skipLoyalty={this.props.skipLoyaltyRewards}
          sendLoyalty={this.props.sendLoyaltyInquiry}
          closeModal={this.closeLoyaltyModal}
          navigateConcept={this.navigateConcept}
          showLoyaltyModal={this.props.showLoyaltyModal}
          onLoyaltyInfoModified={this.props.onLoyaltyInfoModified}
        />
      } />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.loyalty,
    isLoyaltyEnabled: state.sites.isLoyaltyEnabled,
    showLoyaltyModal: state.loyalty.showLoyaltyModal,
    loyaltyPaymentConfiguration: get(state, 'sites.orderConfig.pay.payOptions', []).find(payOption => payOption.type === 'loyalty'), // eslint-disable-line max-len
    cartItems: state.cart.items,
    skipSitesPage: state.sites.skipSitesPage,
    cartDiplayProfileId: state.cart.displayProfileId,
    _props: props };
};
const mapDispatchToProps = (dispatch) => ({
  skipLoyaltyRewards: (siteId, displayProfileId) => dispatch(skipLoyaltyRewards(siteId, displayProfileId)),
  sendLoyaltyInquiry: (loyaltyInfo, selectedOption, siteId, displayProfileId) => dispatch(sendLoyaltyInquiry(loyaltyInfo, selectedOption, siteId, displayProfileId)), // eslint-disable-line max-len
  getLoyalty: (siteId, displayProfileId) => dispatch(getLoyalty(siteId, displayProfileId)),
  selectSite: (siteId, displayProfileId) => dispatch(selectSite(siteId, displayProfileId)),
  showLoyaltyPage: (flag) => dispatch(showLoyaltyPage(flag)),
  setCartLoyaltyInfo: (siteId, displayProfileId, loyaltyInfo) =>
    dispatch(setCartLoyaltyInfo(siteId, displayProfileId, loyaltyInfo)),
  onLoyaltyInfoModified: () => dispatch(onLoyaltyInfoModified()),
  continueWithLoyaltyCheckout: () => dispatch(continueWithLoyaltyCheckout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Loyalty);
