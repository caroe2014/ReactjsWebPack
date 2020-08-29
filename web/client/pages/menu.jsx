// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable no-mixed-operators */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getMenu, getItems } from 'web/client/app/modules/menu/sagas';
import CategoryList from 'web/client/app/components/CategoryList';
import ItemList from 'web/client/app/components/ItemList/ItemList';
import Modal from 'web/client/app/components/Modal';
import SpecialInstructionModal from 'web/client/app/components/SpecialInstructionModal';
import { ConnectedLoader } from 'web/client/app/reduxpages/ConnectedComponents';
import { Trans } from 'react-i18next';
import { cancelCart, modifyCartItem, setConceptOptions } from 'web/client/app/modules/cart/sagas';
import { modifyCommunalCartItem } from 'web/client/app/modules/communalCart/sagas';
import { setCurrencyForPay } from 'web/client/app/modules/site/sagas';
import { resetDelivery } from 'web/client/app/modules/deliverylocation/sagas';
import { resetSmsDetails } from 'web/client/app/modules/smsnotification/sagas';
import { resetTipData } from 'web/client/app/modules/tip/sagas';
import { resetNameDetails } from 'web/client/app/modules/namecapture/sagas';
import { resetRemaining, removeAllMultiPayments } from 'web/client/app/modules/payOptions/sagas';
import { clearGAState } from 'web/client/app/modules/gaPayment/sagas';
import { removeCCPaymentCard } from 'web/client/app/modules/iFrame/sagas';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import { resetAtrium } from 'web/client/app/modules/atrium/sagas';
import i18n from 'web/client/i18n';
import get from 'lodash.get';

class Menu extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentCategory: props.match.params.categoryId || undefined,
      showModal: false,
      showSpecialInstruction: false,
      menuChangePopup: false,
      clearCartModalTitle: '',
      clearCartModalText: '',
      clearCartContinueButtonText: '',
      clearCartCancelButtonText: '',
      modalName: '',
      showCancelButton: false,
      removePayments: this.props.removePayments
    };

    this.onCategorySelected = this.onCategorySelected.bind(this);
    this.onItemSelected = this.onItemSelected.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onModalContinue = this.onModalContinue.bind(this);
    this.addItemContinue = this.addItemContinue.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.closeInstructionModal = this.closeInstructionModal.bind(this);
    this.specialInstructionInput = this.specialInstructionInput.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.checkSpecialInstructionAndAddItem = this.checkSpecialInstructionAndAddItem.bind(this);
    this.onPopupContinue = this.onPopupContinue.bind(this);
  }

  componentWillMount () {
    if (this.props.getMenu) {
      const { siteId, conceptId, categoryId, displayProfileId } = this.props.match.params;
      if (categoryId) {
        this.props.selectCategory(siteId, displayProfileId, conceptId, categoryId);
      } else {
        this.props.getMenu(siteId, displayProfileId, conceptId);
      }
    }
  }

  componentWillUpdate (newProps) {
    if (JSON.stringify(this.props.match.params) !== JSON.stringify(newProps.match.params)) {
      this.setState({ currentCategory: newProps.match.params.categoryId });
    }
  }

  onCategorySelected (categoryId) {
    const { siteId, conceptId, displayProfileId } = this.props.match.params;
    this.props.selectCategory(siteId, displayProfileId, conceptId, categoryId);
  }

  onItemSelected (item) {
    const { limitItems, cartItems, multiPassEnabled, fetchCommunalCart, communalCartItems } = this.props;
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
    } else if (limitItems && limitItems.featureEnabled && (currentCartItems.length === limitItems.maxItems)) { // eslint-disable-line max-len
      this.setState({
        showModal: true,
        currentItem: item,
        clearCartModalTitle: i18n.t('MODAL_LIMIT_ITEM_HEADER'),
        clearCartModalText: limitItems.errorMessage || i18n.t('MODAL_LIMIT_ITEM_MESSAGE'),
        clearCartContinueButtonText: i18n.t('MODAL_LIMIT_ITEM_CLOSE_TEXT'),
        showCancelButton: false,
        modalName: 'LIMIT_ITEM'
      });
    } else if (item.childGroups && item.childGroups.length !== 0 &&
      item.childGroups.some(childGroup => childGroup.isAvailableToGuests === true)) {

      const { siteId, conceptId, displayProfileId } = this.props.match.params;
      const itemUrl = `/menu/${siteId}/${displayProfileId}/${conceptId}/${this.state.currentCategory}/${item.id}`;
      this.props.selectItem(itemUrl);
    } else {
      const { useProfitCenterByConcept, conceptLevelIgPosConfig, remaining, multiPassEnabled, communalCartItems, cartDisplayProfileId } = this.props; // eslint-disable-line max-len
      const { removePayments } = this.state;
      const currentCartItems = multiPassEnabled ? communalCartItems : cartItems;
      if (!multiPassEnabled && currentCartItems && currentCartItems.length > 0 && (currentCartItems[0].contextId !== item.contextId || (currentCartItems[0].contextId === item.contextId && cartDisplayProfileId !== this.props.match.params.displayProfileId))) { // eslint-disable-line max-len
        this.setState({
          showModal: true,
          currentItem: item,
          menuChangePopup: false,
          clearCartModalTitle: i18n.t('MODAL_CHANGE_LOCATION_HEADER'),
          clearCartModalText: i18n.t('MODAL_CHANGE_LOCATION_MSG'),
          clearCartContinueButtonText: i18n.t('MODAL_YES_PROCEED'),
          clearCartCancelButtonText: i18n.t('MODAL_CANCEL'),
          showCancelButton: true,
          modalName: 'CHANGE_LOCATION'
        });
      } else if ((useProfitCenterByConcept || conceptLevelIgPosConfig) && currentCartItems && currentCartItems.length > 0 && currentCartItems[0].conceptId !== item.conceptId) { // eslint-disable-line max-len
        this.setState({
          showModal: true,
          currentItem: item,
          menuChangePopup: true,
          clearCartModalTitle: i18n.t('MODAL_CHANGE_CONCEPT_HEADER'),
          clearCartModalText: i18n.t('MODAL_CHANGE_CONCEPT_MSG'),
          clearCartContinueButtonText: i18n.t('MODAL_CHANGE_CONCEPT_CONTINUE_TEXT'),
          clearCartCancelButtonText: i18n.t('MODAL_CHANGE_CONCEPT_CANCEL_TEXT'),
          showCancelButton: true,
          modalName: 'CHANGE_CONCEPT'
        });
      } else if (!removePayments && remaining && remaining > 0) {
        this.setState({
          showModal: true,
          currentItem: item,
          menuChangePopup: false,
          clearCartModalTitle: i18n.t('MODAL_PAYMENT_REMOVE_HEADER'),
          clearCartModalText: i18n.t('MODAL_PAYMENT_REMOVE_MESSAGE'),
          clearCartContinueButtonText: i18n.t('MODAL_PAYMENT_REMOVE_CONTINUE_TEXT'),
          clearCartCancelButtonText: i18n.t('MODAL_PAYMENT_REMOVE_CANCEL_TEXT'),
          showCancelButton: true,
          modalName: 'PAYMENT_REMOVE'
        });
      } else {
        this.checkSpecialInstructionAndAddItem(item);
      }
    }
  }

  checkSpecialInstructionAndAddItem (item) {
    const { cartItems, setCurrencyForPay, specialInstructions, conceptConfig,
      conceptOptions, setConceptOptions, multiPassEnabled } = this.props;
    if (specialInstructions && specialInstructions.featureEnabled) {
      this.setState({
        showSpecialInstruction: true,
        currentItem: item
      });
      this.makeDialogAloneAccessible('showSpecialInstruction');
    } else {
      if (!cartItems || cartItems.length === 0) {
        setCurrencyForPay(item.contextId, this.props.displayProfileId);
        setConceptOptions(conceptOptions, conceptConfig);
      }
      multiPassEnabled ? this.props.addItemToCommunalCart(item) : this.props.addItemToCart(item, this.props.displayProfileId); // eslint-disable-line max-len
    }
  }

  specialInstructionInput (splInstructionstext) {
    this.closeInstructionModal();
    const { cartItems, conceptOptions, conceptConfig, setCurrencyForPay, setConceptOptions, communalCartItems, multiPassEnabled, displayProfileId } = this.props; // eslint-disable-line max-len
    const { currentItem } = this.state;
    const currentCartItems = multiPassEnabled ? communalCartItems : cartItems;
    if (!currentCartItems || currentCartItems.length === 0) {
      setCurrencyForPay(currentItem.contextId, displayProfileId);
      setConceptOptions(conceptOptions, conceptConfig);
    }
    if (splInstructionstext !== undefined) {
      currentItem.splInstruction = splInstructionstext;
    }
    multiPassEnabled ? this.props.addItemToCommunalCart(currentItem) : this.props.addItemToCart(currentItem, displayProfileId); // eslint-disable-line max-len
  }

  closeInstructionModal () {
    this.setState({ showSpecialInstruction: false });
    this.makeEverythingAccessible('showSpecialInstruction');
  }

  onModalClose () {
    const { cartItems, useProfitCenterByConcept, conceptLevelIgPosConfig, multiPassEnabled, history,
      displayProfileId } = this.props;
    const { currentItem } = this.state;
    this.closePopup();
    if (multiPassEnabled) return;
    (useProfitCenterByConcept || conceptLevelIgPosConfig) && cartItems && cartItems.length > 0 &&
    cartItems[0].contextId === currentItem.contextId && cartItems[0].conceptId !== currentItem.conceptId &&
    history.replace(`/concepts/${cartItems[0].contextId}/${displayProfileId}`);
  }

  closePopup () {
    this.setState({ showModal: false });
    this.makeEverythingAccessible('parent-modal');
  }

  onModalContinue (modalName) {
    const { currentItem } = this.state;
    this.closePopup();
    if (modalName === 'COMMUNAL_CART') return;
    this.props.cancelCart();
    this.props.resetRemaining();
    this.props.setConceptOptions(this.props.conceptOptions, this.props.conceptConfig);
    this.props.setCurrencyForPay(currentItem.contextId, this.props.displayProfileId);
    this.checkSpecialInstructionAndAddItem(currentItem);
    this.props.resetDelivery();
    this.props.resetSmsDetails();
    this.props.resetTipData();
    this.props.resetNameDetails();
    this.props.clearGAState();
    this.props.resetAtrium();
  }

  makeDialogAloneAccessible (param) {
    let childId;
    if (param === 'showModal') {
      childId = 'parent-modal';
    } else if (param === 'showSpecialInstruction') {
      childId = 'special-instruction-modal';
    }
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = true;
    const children = bottomContainer.children;

    Array.from(children).forEach(child => {
      if (child.id !== childId) {
        child.inert = true;
      }
    });
  }

  addItemContinue () {
    this.closePopup();
    this.props.removeAllMultiPayments(this.state.currentItem, 'ADD');
    this.setState({ removePayments: true });
    this.props.setConceptOptions(this.props.conceptOptions, this.props.conceptConfig);
    this.props.setCurrencyForPay(this.state.currentItem.contextId, this.props.displayProfileId);
  }

  makeEverythingAccessible (param) {
    let childId;
    if (param === 'showModal') {
      childId = 'parent-modal';
    } else if (param === 'showSpecialInstruction') {
      childId = 'special-instruction-modal';
    }
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = false;
    const children = bottomContainer.children;
    Array.from(children).forEach(child => {
      if (child.id !== childId) {
        child.inert = false;
      }
    });
  }
  onPopupContinue () {
    const { removePayments, modalName } = this.state;
    const { remaining } = this.props;
    if (modalName === 'LIMIT_ITEM') {
      this.closePopup();
    } else if (!removePayments && remaining && remaining > 0) {
      this.addItemContinue();
    } else {
      this.onModalContinue();
    }
  }
  onEscape (e, param) {
    if (e.which === 27) {
      if (param === 'modal') {
        this.closePopup();
      } else if (param === 'splInstruction') {
        this.closeInstructionModal();
      }

    }
  }

  render () {
    const { current, addItemToCart, currencyDetails, specialInstructions, digitalMenuId, itemDisplayList } = this.props;
    const { currentCategory, showModal, clearCartModalTitle, clearCartModalText,
      clearCartContinueButtonText, clearCartCancelButtonText, showSpecialInstruction, showCancelButton,
      currentItem, menuChangePopup, modalName } = this.state;
    const items = currentCategory && current && current.categories
      ? current.categories.find((category) => category.id === currentCategory).itemsLoaded
        ? current.categories.find((category) => category.id === currentCategory).items
        : undefined
      : undefined;
    const validList = currentCategory && current && current.categories &&
      current.categories.find((category) => category.id === currentCategory).itemsListEmpty;
    if (showModal) {
      this.makeDialogAloneAccessible('showModal');
    }
    return (
      <ConnectedLoader Comp={() =>
        <Fragment>
          {(!current || (!current.categories && !current.items)) &&
            <h1 style={{ textAlign: 'center', margin: '0.67em auto' }}><Trans i18nKey='MENU_PAGE_UNAVAILABLE' /></h1>
          }
          {current && current.categories && !items &&
            <CategoryList
              keyProps={current.categories}
              selectCategory={this.onCategorySelected}
              digitalMenuId={digitalMenuId}
            />}
          {items &&
            <ItemList keyProps={items}
              selectItem={this.onItemSelected}
              validList={validList}
              currencyDetails={currencyDetails}
              addItemToCart={addItemToCart}
              digitalMenuId={digitalMenuId}
              showAddButton
              itemDisplayList={itemDisplayList} />}
          {showModal &&
            <Modal
              open={showModal}
              showCancelButton={showCancelButton}
              showClose
              menuChangePopup={menuChangePopup}
              onCancel={this.onModalClose}
              onEscape={(e) => { this.onEscape(e, 'modal'); }}
              onClose={this.closePopup}
              onContinue={this.onPopupContinue}
              cancelButtonText={clearCartCancelButtonText}
              continueButtonText={clearCartContinueButtonText}
              title={clearCartModalTitle}
              textI18nKey={clearCartModalText}
              modalName={modalName}
            />}
          {showSpecialInstruction &&
            <SpecialInstructionModal
              open={showSpecialInstruction}
              headerText={specialInstructions.headerText}
              instructionText={specialInstructions.instructionText}
              characterLimit={specialInstructions.characterLimit}
              handleSplInstruction={this.specialInstructionInput}
              showClose
              onEscape={(e) => { this.onEscape(e, 'splInstruction'); }}
              onClose={this.closeInstructionModal}
              continueButtonText='Add to cart'
              title={currentItem.displayText}
              itemPrice={currencyLocaleFormat(currentItem.amount, currencyDetails)}
            />}
        </Fragment>
      }
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  ...state.menu,
  digitalMenuId: state.app.digitalMenuId,
  conceptOptions: state.concept.conceptOptions,
  conceptConfig: state.concept.igPosConfig,
  cartItems: state.cart.items,
  communalCartItems: state.communalCart.items,
  fetchCommunalCart: state.communalCart.fetchCommunalCart,
  loyaltyInfo: state.loyalty,
  currencyDetails: state.sites.currencyDetails,
  limitItems: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'limitItems', false), // eslint-disable-line max-len
  showPrice: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'showPrice'), // eslint-disable-line max-len
  specialInstructions: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'specialInstructions', false), // eslint-disable-line max-len
  useProfitCenterByConcept: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'profitCenter.useProfitCenterByConcept', false), // eslint-disable-line max-len
  conceptLevelIgPosConfig: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'conceptLevelIgPosConfig', false), // eslint-disable-line max-len
  itemDisplayList: get(state.sites.list.find(site => site.id === state.sites.selectedId && site.displayProfileId === state.sites.displayProfileId), 'itemDisplayList', []), // eslint-disable-line max-len
  remaining: state.paymentOptions.remaining,
  removePayments: state.cart.removePayments,
  multiPassEnabled: state.app.multiPassEnabled,
  displayProfileId: state.sites.displayProfileId,
  cartDisplayProfileId: state.cart.displayProfileId,
  _props: props
});
const mapDispatchToProps = (dispatch) => ({
  getMenu: (siteId, displayProfileId, menuId) => {
    dispatch(getMenu(siteId, displayProfileId, menuId));
  },
  getCategoryItems: (categoryId) => {
    dispatch(getItems(categoryId));
  },
  selectItem: (itemUrl) => {
    dispatch(push(itemUrl));
  },
  selectCategory: (siteId, displayProfileId, menuId, categoryId) => {
    dispatch(getItems(siteId, displayProfileId, menuId, categoryId));
  },
  addItemToCart: (item, displayProfileId) => {
    dispatch(modifyCartItem(item, 'ADD', displayProfileId));
  },
  cancelCart: () => {
    dispatch(cancelCart());
  },
  setCurrencyForPay: (siteId, displayProfileId) => dispatch(setCurrencyForPay(siteId, displayProfileId)),
  resetDelivery: () => dispatch(resetDelivery()),
  resetSmsDetails: () => dispatch(resetSmsDetails()),
  resetTipData: () => dispatch(resetTipData()),
  resetNameDetails: () => dispatch(resetNameDetails()),
  clearGAState: () => dispatch(clearGAState()),
  resetRemaining: () => dispatch(resetRemaining()),
  removeCCPaymentCard: () => dispatch(removeCCPaymentCard()),
  setConceptOptions: (conceptOptions, conceptConfig) => dispatch(setConceptOptions(conceptOptions, conceptConfig)),
  removeAllMultiPayments: (cartItem, actionType) => dispatch(removeAllMultiPayments(cartItem, actionType)),
  resetAtrium: () => dispatch(resetAtrium()),
  addItemToCommunalCart: (item) => dispatch(modifyCommunalCartItem(item, 'ADD'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
