// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable no-mixed-operators */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import PropTypes from 'prop-types';
import { modifyCartItem, cancelCart, setConceptOptions } from 'web/client/app/modules/cart/sagas';
import { modifyCommunalCartItem } from 'web/client/app/modules/communalCart/sagas';
import { getItem } from 'web/client/app/modules/itemdetails/sagas';
import { ConnectedLoader } from 'web/client/app/reduxpages/ConnectedComponents';
import ItemDetails from 'web/client/app/components/ItemDetails/ItemDetails';
import Modal from 'web/client/app/components/Modal';
import { setCurrencyForPay } from 'web/client/app/modules/site/sagas';
import { resetRemaining, removeAllMultiPayments } from 'web/client/app/modules/payOptions/sagas';
import { clearGAState } from 'web/client/app/modules/gaPayment/sagas';
import { removeCCPaymentCard } from 'web/client/app/modules/iFrame/sagas';
import { resetAtrium } from 'web/client/app/modules/atrium/sagas';
import i18n from 'web/client/i18n';
import get from 'lodash.get';

class ItemDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
      disableAddToCart: false,
      menuChangePopup: false,
      clearCartModalTitle: '',
      clearCartModalText: '',
      clearCartContinueButtonText: '',
      clearCartCancelButtonText: '',
      removePayments: this.props.removePayments
    };
    this.onAddToCart = this.onAddToCart.bind(this);
    this.handleCartClick = this.handleCartClick.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onModalContinue = this.onModalContinue.bind(this);
    this.addItemContinue = this.addItemContinue.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }
  componentWillMount () {
    if (this.props.getItem) {
      const { siteId, conceptId, itemId } = this.props.match.params;
      this.props.getItem(siteId, conceptId, itemId);
    }
  }

  handleCartClick (item) {
    const { cartItems, cartDisplayProfileId, setCurrencyForPay, conceptOptions, conceptConfig, useProfitCenterByConcept, conceptLevelIgPosConfig, setConceptOptions, remaining, multiPassEnabled, communalCartItems, fetchCommunalCart } = this.props; // eslint-disable-line max-len
    const currentCartItems = multiPassEnabled ? communalCartItems : cartItems;
    if (multiPassEnabled && fetchCommunalCart) {
      this.setState({
        showModal: true,
        clearCartModalTitle: i18n.t('MODAL_COMMUNAL_CART_PROCESS_HEADER'),
        clearCartModalText: i18n.t('MODAL_COMMUNAL_CART_PROCESS_MSG'),
        clearCartContinueButtonText: i18n.t('MODAL_OK'),
        clearCartCancelButtonText: i18n.t('MODAL_CANCEL'),
        showCancelButton: false,
        modalName: 'COMMUNAL_CART'
      });
    } else if (!multiPassEnabled && currentCartItems && currentCartItems.length > 0 && ((currentCartItems[0].contextId !== item.contextId) || (currentCartItems[0].contextId === item.contextId && cartDisplayProfileId !== this.props.match.params.displayProfileId))) { // eslint-disable-line max-len
      this.setState({
        showModal: true,
        currentItem: item,
        menuChangePopup: true,
        clearCartModalTitle: i18n.t('MODAL_CHANGE_LOCATION_HEADER'),
        clearCartModalText: i18n.t('MODAL_CHANGE_LOCATION_MSG'),
        clearCartContinueButtonText: i18n.t('MODAL_YES_PROCEED'),
        clearCartCancelButtonText: i18n.t('MODAL_CANCEL')
      });
    } else if ((useProfitCenterByConcept || conceptLevelIgPosConfig) && currentCartItems && currentCartItems.length > 0 && currentCartItems[0].conceptId !== item.conceptId) { // eslint-disable-line max-len
      this.setState({
        showModal: true,
        currentItem: item,
        menuChangePopup: true,
        clearCartModalTitle: i18n.t('MODAL_CHANGE_CONCEPT_HEADER'),
        clearCartModalText: i18n.t('MODAL_CHANGE_CONCEPT_MSG'),
        clearCartContinueButtonText: i18n.t('MODAL_CHANGE_CONCEPT_CONTINUE_TEXT'),
        clearCartCancelButtonText: i18n.t('MODAL_CHANGE_CONCEPT_CANCEL_TEXT')
      });
    } else if (!this.state.removePayments && remaining && remaining > 0) {
      this.setState({
        showModal: true,
        currentItem: item,
        menuChangePopup: false,
        clearCartModalTitle: i18n.t('MODAL_PAYMENT_REMOVE_HEADER'),
        clearCartModalText: i18n.t('MODAL_PAYMENT_REMOVE_MESSAGE'),
        clearCartContinueButtonText: i18n.t('MODAL_PAYMENT_REMOVE_CONTINUE_TEXT'),
        clearCartCancelButtonText: i18n.t('MODAL_PAYMENT_REMOVE_CANCEL_TEXT')
      });
    } else {
      if (!currentCartItems || currentCartItems.length === 0) {
        setCurrencyForPay(item.contextId, this.props.displayProfileId);
        setConceptOptions(conceptOptions, conceptConfig);
      }
      this.onAddToCart(item);
    }
  }

  onAddToCart (item) {
    const { siteId, displayProfileId, conceptId, categoryId } = this.props.match.params;
    const { multiPassEnabled, addItemToCart, addItemToCommunalCart } = this.props;
    this.setState({disableAddToCart: true});
    multiPassEnabled ? addItemToCommunalCart(item, siteId, displayProfileId, conceptId, categoryId)
      : addItemToCart(item, siteId, displayProfileId, conceptId, categoryId);
  }
  onModalClose () {
    const { cartItems, cartDisplayProfileId, useProfitCenterByConcept, conceptLevelIgPosConfig, history } = this.props;
    const { currentItem } = this.state;
    this.closePopup();
    (useProfitCenterByConcept || conceptLevelIgPosConfig) && cartItems && cartItems.length > 0 &&
    cartItems[0].contextId === currentItem.contextId && cartItems[0].conceptId !== currentItem.conceptId &&
     history.replace(`/concepts/${cartItems[0].contextId}/${cartDisplayProfileId}`);
  }
  closePopup () {
    this.setState({ showModal: false });
    this.makeEverythingAccessible();
  }
  onModalContinue (modalName) {
    this.closePopup();
    if (modalName === 'COMMUNAL_CART') return;
    this.props.cancelCart();
    this.props.resetRemaining();
    this.props.setCurrencyForPay(this.state.currentItem.contextId, this.props.displayProfileId);
    this.props.setConceptOptions(this.props.conceptOptions, this.props.conceptConfig);
    this.onAddToCart(this.state.currentItem);
    this.props.clearGAState();
    this.props.resetAtrium();
  }
  addItemContinue () {
    this.closePopup();
    this.props.removeAllMultiPayments(this.state.currentItem, 'ADD');
    this.setState({ removePayments: true });
    this.props.setCurrencyForPay(this.state.currentItem.contextId, this.props.displayProfileId);
    this.props.setConceptOptions(this.props.conceptOptions, this.props.conceptConfig);
  }

  makeDialogAloneAccessible () {
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = true;
    const children = bottomContainer.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'parent-modal') {
        child.inert = true;
      }
    });
  }

  makeEverythingAccessible () {
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = false;
    const children = bottomContainer.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'parent-modal') {
        child.inert = false;
      }
    });
  }

  onEscape (e) {
    if (e.which === 27) {
      this.closePopup();
    }
  }

  render () {
    const { selectItem, currencyDetails, specialInstructions, remaining, itemDisplayList } = this.props;
    const { showModal, disableAddToCart, clearCartModalTitle, clearCartModalText, modalName,
      clearCartContinueButtonText, clearCartCancelButtonText, removePayments, menuChangePopup } = this.state;
    if (showModal) {
      this.makeDialogAloneAccessible();
    }

    return (
      <ThemeProvider theme={theme}>
        <ConnectedLoader Comp={() =>
          <Fragment>
            <ItemDetails
              selectItem={selectItem}
              currencyDetails={currencyDetails}
              handleClick={this.handleCartClick}
              specialInstructions={specialInstructions}
              itemDisplayList={itemDisplayList}
              disableAddToCart={disableAddToCart} />
            {showModal &&
            <Modal
              open={showModal}
              showCancelButton
              showClose
              menuChangePopup={menuChangePopup}
              onCancel={this.onModalClose}
              onClose={this.closePopup}
              onEscape={this.onEscape}
              onContinue={!removePayments && remaining && remaining > 0 ? this.addItemContinue : this.onModalContinue}
              cancelButtonText={clearCartCancelButtonText}
              continueButtonText={clearCartContinueButtonText}
              title={clearCartModalTitle}
              textI18nKey={clearCartModalText}
              modalName={modalName}
            />}
          </Fragment>
        }
        />
      </ThemeProvider>
    );
  }
}

ItemDetailsPage.propTypes = {
  getItem: PropTypes.func,
  addItemToCart: PropTypes.func,
  selectItem: PropTypes.object
};

const mapStateToProps = (state, props) => ({
  ...state.itemdetails,
  conceptOptions: state.concept.conceptOptions,
  conceptConfig: state.concept.igPosConfig,
  cartItems: state.cart.items,
  communalCartItems: state.communalCart.items,
  fetchCommunalCart: state.communalCart.fetchCommunalCart,
  loyaltyInfo: state.loyalty,
  currencyDetails: state.sites.currencyDetails,
  specialInstructions: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'specialInstructions', false), // eslint-disable-line max-len
  useProfitCenterByConcept: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'profitCenter.useProfitCenterByConcept', false), // eslint-disable-line max-len
  conceptLevelIgPosConfig: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'conceptLevelIgPosConfig', false), // eslint-disable-line max-len
  remaining: state.paymentOptions.remaining,
  removePayments: state.cart.removePayments,
  multiPassEnabled: state.app.multiPassEnabled,
  displayProfileId: state.sites.displayProfileId,
  cartDisplayProfileId: state.cart.displayProfileId,
  itemDisplayList: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'itemDisplayList', []), // eslint-disable-line max-len
  _props: props
});
const mapDispatchToProps = (dispatch) => ({
  addItemToCart: (item, siteId, displayProfileId, conceptId, categoryId) => {
    dispatch(modifyCartItem(item, 'ADD', displayProfileId));
    setTimeout(() => dispatch(push(`/menu/${siteId}/${displayProfileId}/${conceptId}/${categoryId}`)), 500);
  },
  getItem: (siteId, conceptId, itemId) => {
    dispatch(getItem(siteId, conceptId, itemId));
  },
  cancelCart: () => {
    dispatch(cancelCart());
  },
  setCurrencyForPay: (siteId, displayProfileId) => dispatch(setCurrencyForPay(siteId, displayProfileId)),
  clearGAState: () => dispatch(clearGAState()),
  resetRemaining: () => dispatch(resetRemaining()),
  removeCCPaymentCard: () => dispatch(removeCCPaymentCard()),
  setConceptOptions: (conceptOptions, conceptConfig) => dispatch(setConceptOptions(conceptOptions, conceptConfig)),
  removeAllMultiPayments: (cartItem, actionType) => dispatch(removeAllMultiPayments(cartItem, actionType)),
  resetAtrium: () => dispatch(resetAtrium()),
  addItemToCommunalCart: (item, siteId, displayProfileId, conceptId, categoryId) => {
    dispatch(modifyCommunalCartItem(item, 'ADD'));
    setTimeout(() => dispatch(push(`/menu/${siteId}/${displayProfileId}/${conceptId}/${categoryId}`)), 500);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetailsPage);
