// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import SavedCards from 'web/client/app/components/SavedCards';
import SavedCardsPayment from 'web/client/app/components/SavedCardsPayment';
import { setTokenizedData, setCCPaymentCard } from 'web/client/app/modules/iFrame/sagas';
import { showSavedCardsPopup, deleteSavedCard } from 'web/client/app/modules/guestProfile/sagas';
import { setPaymentsAmount } from 'web/client/app/modules/payOptions/sagas';

class SavedCardsPage extends Component {
  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.selectedPaymentCard = this.selectedPaymentCard.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
  }

  handleClose () {
    this.makeEverythingAccessible(this.props.location.pathname === `/payment` ? 'payment' : 'profile');
    this.props.showSavedCardsPopup(false);
  }

  handleDelete (uniqueId) {
    this.props.deleteSavedCard(uniqueId);
  }

  selectedPaymentCard (card) {
    this.props.setTokenizedData(card);
    if (this.props.multiPaymentEnabled) {
      this.props.setPaymentsAmount(this.props.remaining ||
        parseFloat(this.props.totalWithTip), parseFloat(this.props.totalWithTip), 0);
      this.props.setCCPaymentCard(card.paymentDetails);
    }
  }

  makeEverythingAccessible (param) {
    if (param === 'payment') {
      const bottomContainer = document.querySelector('.BottomContainer');
      bottomContainer.inert = false;
      const topContainer = document.querySelector('.TopContainer');
      const topContainerChildren = topContainer.children;
      Array.from(topContainerChildren).forEach(child => {
        if (child.id !== 'saved-card-modal') {
          child.inert = false;
        }
      });
    } else if (param === 'profile') {
      const parent = document.querySelector('.parent');
      const children = parent.children;
      Array.from(children).forEach(child => {
        if (child.id !== 'saved-card') {
          child.inert = false;
        }
      });
    }
  }

  makeDialogAloneAccessible () {
    const parent = document.querySelector('.parent');
    const children = parent.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'saved-card') {
        child.inert = true;
      }
    });
  }

  render () {
    const { showSavedCards, location, multiPaymentEnabled, remaining, totalWithTip } = this.props;
    if (showSavedCards && location.pathname !== '/payment') {
      this.makeDialogAloneAccessible();
    }
    return (
      <Fragment>
        { location.pathname === `/payment`
          ? <SavedCardsPayment
            open={showSavedCards}
            onCancel={this.handleClose}
            onSelect={this.handleSelection}
            selectedCard={this.selectedPaymentCard}
            multiPaymentEnabled={multiPaymentEnabled}
            remaining={remaining}
            totalWithTip={totalWithTip}
            {...this.props}
          />
          : <SavedCards
            open={showSavedCards}
            onCancel={this.handleClose}
            onDelete={this.handleDelete}
            {...this.props}
          />
        }
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  ...state.profile,
  tipAmount: state.tip.tipAmount,
  order: state.cart.order,
  remaining: state.paymentOptions.remaining,
  totalWithTip: state.cart.total + parseFloat(state.tip.tipAmount),
  multiPaymentEnabled: state.sites.orderConfig && state.sites.orderConfig.multiPaymentEnabled,
  _props: props
});

const mapDispatchToProps = (dispatch, props) => ({
  showSavedCardsPopup: (flag) => dispatch(showSavedCardsPopup(flag)),
  deleteSavedCard: (data) => dispatch(deleteSavedCard(data)),
  setTokenizedData: (data) => dispatch(setTokenizedData(data)),
  setPaymentsAmount: (amount, total, oldAmount) => dispatch(setPaymentsAmount(amount, total, oldAmount)),
  setCCPaymentCard: (obj) => dispatch(setCCPaymentCard(obj))
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedCardsPage);
