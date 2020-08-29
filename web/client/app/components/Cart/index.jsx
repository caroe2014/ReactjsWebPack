// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import React, { Component } from 'react';
import { Flex, Text, Box, Divider, Button, Fixed } from 'rebass';
import PropTypes from 'prop-types';
// import IncrementInput from 'web/client/app/components/IncrementInput/IncrementInput';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import IconButton from 'web/client/app/components/IconButton';
import styled from 'styled-components';
import ReadyTime from 'web/client/app/components/ReadyTime';
import Loader from 'web/client/app/components/Loader/index';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import LoadingCircle from 'web/client/app/components/CircleBarLoader/loadingCircle';
import get from 'lodash.get';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import { getOrderConfigurationDetails } from 'web/client/app/utils/OrderConfig';
import Modal from 'web/client/app/components/Modal';

const Header = styled(Flex)`
  padding: 20px 0 20px 0;
  color: ${props => props.theme.colors.primaryTextColor};
  font-weight: 500;
  font-size: 22px;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StoreHeader = Header.extend`
  font-size: 26px;
  padding: 10px 0px;
  word-break: break-word;
  text-align: center;
  font-weight: 500;
  padding-right: 40px;
  padding-left: 20px;
  word-break: break-word;
  text-align: center;
  font-weight: 500;
  justify-content: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Border = styled(Divider)`
  border-bottom: 1px solid lightgray;
  margin: 0px 0px;
  margin-right: 20px;
  width: 95%;
`;

const Container = styled(Flex)`
  flex-direction: column;
  font-size: ${props => props.theme.fontSize.nm};
  height:100%;
  width:100%;
  margin: 0px !important;
  padding-left: 20px;
`;

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

const ItemsContainer = styled(Box)`
  align-items: center;
  flex-direction: row;
  padding-top: 20px;
  height:100%;
  width:100%;
  flex: 1;
  overflow-y: auto;
  padding-right: 20px;
  margin-bottom: 0px;
`;

const EmptyCartContainer = styled(Box)`
  color: ${props => props.theme.colors.secondaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ClearButton = styled(Button)`
  background-color: ${props => props.theme.colors.light};
  border-radius: 0;
  color: ${props => props.theme.colors.buttonControlColor};
  border: 1px solid ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 15px;
  ${props => props.theme.mediaBreakpoints.mobile`margin-bottom: 81px;`};
  text-transform: uppercase;
  width: 100%
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }`;

const ButtonGroup = styled(Flex)`
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  & > button {
    padding: 0px;
    height: 60px;
  }
  & > button:disabled{
    opacity: 0.6 !important;
    background: ${props => props.theme.colors.buttonControlColor};
    cursor: not-allowed;
  }
`;

const Summary = styled(Flex)`
  color: ${props => props.theme.colors.primaryText};
  flex-direction: column;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 14px;
`;

const SummaryFooter = styled(Flex)`
  align-items: center;
  font-size: ${props => props.theme.fontSize.nm};
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const Description = styled(Text)`
  display: inline;
  float: left;
  font-weight: 300;
  word-break: break-word;
  font-size: 14px;
  padding-left: 10px;
  color: ${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TotalTypeDescription = styled(Text)`
  display: inline;
  float: left;
  font-weight: 300;
  word-break: break-word;
  font-size: 14px;
  color: ${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const PrimaryDescription = styled(Text)`
  display: inline;
  float: left;
  word-break: break-word;
  color: ${props => props.theme.colors.primaryTextColor};
  font-weight: 500;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SubDescription = styled(Text)`
  display: inline;
  float: left;
  padding-left: 18px;
  word-break: break-word;
  font-weight: 300;
  font-size: 14px;
  color: ${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TotalDescription = styled(Text)`
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: 500;
  color: ${props => props.theme.colors.primaryTextColor};
  display: inline;
  float: left;
  word-break: break-word;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Price = styled(Text)`
  display: inline;
  font-weight: 300;
  font-size: 14px;
  color: ${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BorderFlex = styled(Box)`
  align-items: center;
  font-weight: 600;
  padding-top:0px;
  padding-bottom:0px;
`;

const ItemPriceContainer = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ItemBaseContainer = styled(Flex)`
  align-items: center;
  font-weight: 500;
  justify-content: space-between;
  margin-bottom: ${props => {
    if (props.modifiers) return `-2px`;
    return '0px';
  }};
`;

const SubTotalContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

const ModifierBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 2px;
`;

const ItemPrice = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: ${props => props.theme.fontSize.nm};
  display: inline;
  float: right;
  font-weight: 500;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

// const Increment = styled(IncrementInput)`
//   font-size: ${props => props.theme.fontSize.nm};
//   transform: translate(-50%, 0);
//   position: absolute;
//   left: 50%;
//   visibility :hidden;
//   display: none;
//   opacity:0;
// `;

const DeleteButton = styled(IconButton)`
  color: ${props => props.theme.colors.buttonControlColor};
  &:hover {
    color: ${props => props.theme.colors.error};
  }
  font-weight: 300;
  & > i {
    font-size: ${props => props.theme.fontSize.md};
    margin: 5px;
  }
  height: 36px;
  width: 48px;
  & > i {
    font-size: ${props => props.theme.fontSize.nm};
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionText = styled(Text)`
  display: inline;
  float: left;
  font-weight: 300;
  word-break: break-word;
  font-size: 14px;
  text-transform: uppercase;
  padding-left: 10px;
  color: ${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const InstructionBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 2px;
`;
const barStyle = {
  transformOrigin: '19px 19px'
};

const contentStyle = {
  top: '0px',
  left: '18px',
  width: '2px',
  height: '9px',
  borderRadius: '20%',
  background: 'white'
};

const containerStyle = {
  width: '2em',
  height: '2em'
};

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

const basePriceStyle = {
  textAlign: 'right',
  width: '60px'
};

class Cart extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loader: false,
      showModal: false,
      clearCartModalTitle: '',
      clearCartModalText: '',
      clearCartContinueButtonText: '',
      clearCartCancelButtonText: '',
      removePayments: this.props.removePayments
    };
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onModalContinue = this.onModalContinue.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.saleData !== this.props.saleData) {
      this.props.closeCart(!this.props.closeFlag);
      this.redirectToSuccess();
    }
    if (prevProps.checkoutSaleErrorFlag !== this.props.checkoutSaleErrorFlag) {
      this.handleLoader();
      this.props.setAppError(new Error(i18n.t('CART_CHECKOUT_ERROR')));
    }
    if (prevProps.continueWithPay !== this.props.continueWithPay) {
      this.handleNavigation();
    }
    if (prevProps.continueLoyaltyCheckout !== this.props.continueLoyaltyCheckout) {
      this.handlePay();
    }
    if (prevProps.ondToken !== this.props.ondToken) {
      this.handleNavigation();
    }
  }

  makeDialogAloneAccessible (param) {
    let childId;
    let bottomContainer;
    let topContainer;

    if (param === 'showModal') {
      childId = 'parent-modal';
      bottomContainer = document.querySelector('.TopContainer .cart-container');
      topContainer = document.querySelector('.BottomContainer');
      topContainer.inert = true;
    } else if (param === 'loyaltyModal') {
      childId = 'container-parent';
      bottomContainer = document.querySelector('.parent');
    }

    const children = bottomContainer.children;

    Array.from(children).forEach(child => {
      if (child.id !== childId) {
        child.inert = true;
      }
    });
  }

  makeEverythingAccessible (param) {
    let childId;
    let bottomContainer;
    let topContainer;
    if (param === 'showModal') {
      childId = 'parent-modal';
      bottomContainer = document.querySelector('.TopContainer .cart-container');
      topContainer = document.querySelector('.BottomContainer');
      topContainer.inert = false;
    } else if (param === 'loyaltyModal') {
      childId = 'container-parent';
      bottomContainer = document.querySelector('.parent');
    }

    const children = bottomContainer.children;
    Array.from(children).forEach(child => {
      if (child.id !== childId) {
        child.inert = false;
      }
    });
  }
  onEscape (e) {
    if (e.which === 27) {
      this.closePopup();
    }
  }
  handleNavigation () {
    const { items, storesList, loyaltyInfo, cartDisplayProfileId } = this.props;
    if (items.length > 0) {
      const orderConfig = getOrderConfigurationDetails(items, storesList, cartDisplayProfileId);
      this.props.setOrderConfig(orderConfig);
      this.props.setCartLoyaltyInfo(items[0].contextId, cartDisplayProfileId, null, false);

      const siteId = items && get(orderConfig, 'siteId', '');
      const loyaltyAccountInfo = get(loyaltyInfo, `loyaltyInfo.formatNumber`);
      const skipLocationsPageIfPossible = items && storesList && storesList.length === 1 && get(orderConfig, 'navigation.skipLocationsPageIfPossible', false);
      const loyaltySite = storesList.find(site => site.id === siteId && site.displayProfileId === cartDisplayProfileId && site.isLoyaltyEnabled);
      skipLocationsPageIfPossible && loyaltySite && !(loyaltyAccountInfo) ? this.handleLoyalty(siteId, cartDisplayProfileId) : this.handlePay();
    }
  }

  handleIncrement (itemId, uniqueId) {
    this.props.incrementItemCount(itemId, uniqueId);
  }

  handleDecrement (itemId, uniqueId) {
    this.props.decrementItemCount(itemId, uniqueId);
  }

  handleDelete (item) {
    if (!this.state.removePayments && this.props.remaining && this.props.remaining > 0) {
      this.setState({
        showModal: true,
        currentItem: item,
        clearCartModalTitle: i18n.t('MODAL_PAYMENT_REMOVE_HEADER'),
        clearCartModalText: i18n.t('MODAL_PAYMENT_REMOVE_MESSAGE'),
        clearCartContinueButtonText: i18n.t('MODAL_PAYMENT_REMOVE_CONTINUE_TEXT'),
        clearCartCancelButtonText: i18n.t('MODAL_PAYMENT_REMOVE_CANCEL_TEXT')
      });
      this.makeDialogAloneAccessible('showModal');
    } else {
      this.props.removeItem(item);
    }
  }

  handleCancel (itemId, uniqueId) {
    this.props.cancelCart(itemId, uniqueId);
    this.props.resetTipData();
    this.props.clearGAState();
    this.props.resetRemaining();
    this.props.removeCCPaymentCard();
    this.props.clearLoyaltyState();
    this.props.resetAtrium();
  }

  closePopup () {
    this.setState({ showModal: false });
    this.makeEverythingAccessible('showModal');
  }
  onModalContinue () {
    this.props.removeAllMultiPayments(this.state.currentItem, 'REMOVE');
    this.setState({ removePayments: true });
    this.closePopup();
  }

  handleLogin = () => {
    this.props.showLoginPopup();
  }

  handleLoyalty = (siteId, displayProfileId) => {
    const loyaltySite = this.props.storesList.find(site => site.id === siteId && site.displayProfileId === displayProfileId && site.isLoyaltyEnabled);
    if (loyaltySite) {
      if (!loyaltySite.loyaltyAccrueEnabled) {
        const loyaltyPaymentConfiguration = loyaltySite.pay.payOptions.find(payOption => payOption.type === 'loyalty');
        loyaltySite.loyaltyDetails.header = loyaltyPaymentConfiguration.displayLabel || i18n.t('LOYALTY_PAYMENT_HEADER_LABEL'); // eslint-disable-line max-len
        loyaltySite.loyaltyDetails.instructionText = (loyaltyPaymentConfiguration.accountEntry && loyaltyPaymentConfiguration.accountEntry.instructionText) || i18n.t('LOYALTY_PAYMENT_INSTRUCTION_TEXT'); // eslint-disable-line max-len
      }
      this.props.loadLoyaltyPage(loyaltySite.id, loyaltySite.displayProfileId, true, loyaltySite.loyaltyDetails, true);
      this.makeDialogAloneAccessible('loyaltyModal');
    }
  }

  handlePay = () => {
    this.props.closeCart(!this.props.closeFlag);
    this.props.toggleCart(false);
    const {items, storesList, cartDisplayProfileId} = this.props;
    if (!items || items.length === 0) {
      return;
    }
    const orderConfig = getOrderConfigurationDetails(items, storesList, cartDisplayProfileId);
    this.props.setOrderConfig(orderConfig);
    this.props.setCartLoyaltyInfo(items[0].contextId, cartDisplayProfileId, null, false);
    if (this.props.location.pathname !== '/payment') {
      if (get(orderConfig.tip, 'acceptTips', false)) {
        if (this.props.location.pathname !== '/tip' && this.props.location.pathname !== '/deliveryLocation') {
          this.props.lastCartLocation(this.props.location.pathname);
          this.props.history.push('/tip');
        }
      } else if (get(orderConfig.nameCapture, 'featureEnabled', false)) {
        if (this.props.location.pathname !== '/nameCapture') {
          this.props.lastCartLocation(this.props.location.pathname);
          this.props.history.push('/nameCapture');
        }
      } else if (get(orderConfig.sms, 'isSmsEnabled', false)) {
        if (this.props.location.pathname !== '/smsNotification') {
          this.props.lastCartLocation(this.props.location.pathname);
          this.props.history.push('/smsNotification');
        }
      } else {
        this.props.lastCartLocation(this.props.location.pathname);
        this.props.history.push('/deliveryLocation');
      }
    }
  }

  redirectToSuccess () {
    this.props.closeCart(!this.props.closeFlag);
    this.setState({ loader: false });
    this.props.history.push('/paymentSuccess');
  }

  handleLoader () {
    this.setState({ loader: false });
  }

  render () {
    const { cboConfig, subTotal, tax, gratuity, serviceAmount, total, vatEnabled, items, fillContent, changePending, readyTime, currencyDetails, scheduledTime,
      scheduledDay, loginMode, storesList, fetchingTax, displayProfileId, cartDisplayProfileId, samlCookie } = this.props;
    const orderConfig = getOrderConfigurationDetails(items, storesList, cartDisplayProfileId || displayProfileId);
    const paymentsEnabled = items && (get(orderConfig, 'pay.payOptions', []).length > 0 || get(orderConfig, 'pay.stripeConfig.paymentEnabled', false));
    const storeName = items && get(orderConfig, 'storeName', '');
    const etfEnabled = items && get(orderConfig, 'etf.etfEnabled', '');
    const timeZone = orderConfig && get(orderConfig, 'timeZone', '');
    const taxRuleData = items && get(orderConfig, 'taxRuleData', '');
    const skipLocationsPageIfPossible = items && storesList && storesList.length === 1 && get(orderConfig, 'navigation.skipLocationsPageIfPossible', false);
    const emptyPrice = <span>&#9866;.&#9867;</span>;
    const guestProfileEnabled = cboConfig && cboConfig.siteAuth && (cboConfig.siteAuth.type === 'socialLogin' || cboConfig.siteAuth.type === 'atrium');
    const siteId = items && get(orderConfig, 'siteId', '');
    const loyaltySite = storesList && storesList.find(site => site.id === siteId && site.displayProfileId === (cartDisplayProfileId || displayProfileId) && site.isLoyaltyEnabled);
    const storeLoyalty = skipLocationsPageIfPossible && loyaltySite;

    const payButtonDisabled = !total || changePending || (vatEnabled && !taxRuleData) || !orderConfig || !paymentsEnabled;

    const { showModal, clearCartModalTitle, clearCartModalText,
      clearCartContinueButtonText, clearCartCancelButtonText } = this.state;

    return (
      <Container
        className='cart-container'
        m={3}
        alignItems='center'
        width={fillContent ? 1 : [1, 2 / 3, 2 / 5]}
        flexDirection='column'
      >
        {(this.state.loader) && <LoadingContainer className='loader-container'><Loader /></LoadingContainer>}
        <React.Fragment>
          <Header className='my-cart-header' role='header' tabIndex={0}
            aria-label={i18n.t('CART_MY_CART')}>
            <Trans i18nKey='CART_MY_CART'/>
          </Header>
          <Border className='horiz-border'/>
          {items && items.length > 0 &&
            <React.Fragment>
              <StoreHeader className='store-name'
                tabIndex={0}
                aria-label={storeName}
              >{storeName}</StoreHeader>
              <Border className='horiz-border'/>
            </React.Fragment>
          }
        </React.Fragment>
        {
          items && items.length > 0 && (
            <ItemsContainer width={1}>
              {
                items && items.map((item, index) => (
                  item && (
                    <React.Fragment key={`cart-item-` + item.cartItemId}>
                      <ItemBaseContainer className='item-display-box' width={1} modifiers={item.selectedModifiers}>
                        <PrimaryDescription className='item-display-name'
                          aria-label={item.displayText}
                          tabIndex={0}
                        >{item.displayText}</PrimaryDescription>
                        <ItemPriceContainer>
                          <DeleteButton
                            aria-label={i18n.t('CART_ITEM_DELETE')}
                            tabIndex={0}
                            classContext={`cart-delete-${index + 1}`}
                            className={`cart-delete-btn-${index + 1}`}
                            iconClassName='fa fa-times-circle'
                            onClick={() => {
                              this.handleDelete(item);
                            }}
                          />
                          {/* <Increment
                            className='increment'
                            mr={2}
                            value={item.count}
                            increment={() => {
                              this.handleIncrement(item.id, item.uniqueId);
                            }}
                            decrement={() => {
                              this.handleDecrement(item.id, item.uniqueId);
                            }}
                          /> */}
                          <Price className='item-base-price' style={basePriceStyle}
                            tabIndex={0}
                            aria-label={currencyLocaleFormat(item.amount, currencyDetails)}
                          >{currencyLocaleFormat(item.amount, currencyDetails)}</Price>
                        </ItemPriceContainer>
                      </ItemBaseContainer>
                      {item.splInstruction &&
                        <React.Fragment>
                          <InstructionBox className='modifier-box' width={1} mb={1}>
                            <InstructionText className='modifier-name'>{item.splInstruction}</InstructionText>
                          </InstructionBox>
                        </React.Fragment>
                      }
                      {
                        item.selectedModifiers && item.selectedModifiers.map((option, modifierIndex) => (
                          <React.Fragment key={modifierIndex}>
                            <ModifierBox className='modifier-box' width={1} mb={1}>
                              <Description className='modifier-name'
                                tabIndex={0}
                                aria-label={option.description}
                              >{option.description}</Description>
                              {parseFloat(option.baseAmount) > 0 ? option.baseAmount && <Price className='modifier-price'
                                tabIndex={0}
                                aria-label={currencyLocaleFormat(option.baseAmount, currencyDetails)}
                              >{currencyLocaleFormat(option.baseAmount, currencyDetails)}</Price> : <Price className='modifier-empty-price'/>}
                            </ModifierBox>
                            {
                              option.suboption && option.suboption.map((subOption, subIndex) => (
                                <React.Fragment key={'suboption' + subIndex}>
                                  <ModifierBox className='sub-modifier-box' width={1} mb={1}>
                                    <SubDescription className='sub-modifier-name'
                                      tabIndex={0}
                                      aria-label={subOption.description}
                                    >{subOption.description}</SubDescription>
                                    {parseFloat(subOption.amount) > 0 ? subOption.amount && <Price className='sub-modifier-price'
                                      tabIndex={0}
                                      aria-label={currencyLocaleFormat(subOption.amount, currencyDetails)}
                                    >{currencyLocaleFormat(subOption.amount, currencyDetails)}</Price> : <Price className='sub-modifier-empty-price'/>}
                                  </ModifierBox>
                                </React.Fragment>
                              ))
                            }
                          </React.Fragment>
                        ))
                      }
                    </React.Fragment>
                  )
                ))
              }
              <Summary className='summary-container' width={1}>
                <SubTotalContainer className='subtotal-container' width={1} mb={2}>
                  <TotalTypeDescription className='subtotal-label'
                    tabIndex={0}
                    aria-label={i18n.t('CART_SUBTOTAL')}
                  ><Trans i18nKey='CART_SUBTOTAL'/></TotalTypeDescription>
                  <Price className='subtotal-text'
                    tabIndex={0}
                    aria-label={changePending === 0
                      ? currencyLocaleFormat(subTotal, currencyDetails) : emptyPrice}
                  >
                    { changePending === 0 &&
                      currencyLocaleFormat(subTotal, currencyDetails)
                    }
                    { changePending > 0 && emptyPrice }
                  </Price>
                </SubTotalContainer>
                {gratuity > 0 && <SubTotalContainer className='gratuity-container' width={1} mb={2}>
                  <TotalTypeDescription className='gratuity-label'
                    tabIndex={0}
                    aria-label={i18n.t('CART_GRATUITY')}
                  ><Trans i18nKey='CART_GRATUITY'/></TotalTypeDescription>
                  <Price className='gratuity-text'
                    tabIndex={0}
                    aria-label={changePending === 0
                      ? currencyLocaleFormat(gratuity, currencyDetails) : emptyPrice}
                  >
                    { changePending === 0 &&
                      currencyLocaleFormat(gratuity, currencyDetails)
                    }
                    { changePending > 0 && emptyPrice }
                  </Price>
                </SubTotalContainer>}
                {serviceAmount > 0 && <SubTotalContainer className='serviceAmount-container' width={1} mb={2}>
                  <TotalTypeDescription className='serviceAmount-label'
                    tabIndex={0}
                    aria-label={i18n.t('CART_SERVICE_CHARGE')}
                  ><Trans i18nKey='CART_SERVICE_CHARGE'/></TotalTypeDescription>
                  <Price className='service-charge-text'
                    tabIndex={0}
                    aria-label={changePending === 0
                      ? currencyLocaleFormat(serviceAmount, currencyDetails) : emptyPrice}
                  >
                    { changePending === 0 &&
                      currencyLocaleFormat(serviceAmount, currencyDetails)
                    }
                    { changePending > 0 && emptyPrice }
                  </Price>
                </SubTotalContainer>}
                {!vatEnabled && tax > 0 && <Box className='tax-container' width={1} mb={2} style={boxStyle}>
                  <TotalTypeDescription className='tax-label'
                    tabIndex={0}
                    aria-label={i18n.t('CART_TAX')}
                  ><Trans i18nKey='CART_TAX'/></TotalTypeDescription>
                  <Price className='tax-text'
                    tabIndex={0}
                    aria-label={changePending === 0
                      ? currencyLocaleFormat(tax, currencyDetails) : emptyPrice}
                  >
                    { changePending === 0 &&
                      currencyLocaleFormat(tax, currencyDetails)
                    }
                    { changePending > 0 && emptyPrice }
                  </Price>
                </Box>}
                <BorderFlex className='net-payable-container' width={1} py={3}>
                  <TotalDescription className='net-label'
                    tabIndex={0}
                    aria-label={i18n.t('CART_NET_PAYABLE')}
                  ><Trans i18nKey='CART_NET_PAYABLE'/></TotalDescription>
                  <ItemPrice className='net-pay-text' ml={'auto'}
                    tabIndex={0}
                    aria-label={changePending === 0
                      ? currencyLocaleFormat(total, currencyDetails) : emptyPrice}
                  >
                    { changePending === 0 &&
                      currencyLocaleFormat(total, currencyDetails)
                    }
                    { changePending > 0 && emptyPrice }
                  </ItemPrice>
                </BorderFlex>
              </Summary>
              <SummaryFooter className='throttle-text' width={1}>
                {(etfEnabled || scheduledTime) &&
                  <ReadyTime readyTime={readyTime} cart timeZone={timeZone} tabIndex={0}
                    scheduledTime={scheduledTime} scheduledDay={scheduledDay}/> }
              </SummaryFooter>
              <ButtonGroup className='pay-button-group' width={1} mt={1}>
                <PrimaryButton
                  classContext='pay-cart-button'
                  className='pay-cart-button'
                  disabled={payButtonDisabled}
                  onClick={(guestProfileEnabled && !loginMode && !samlCookie) ? this.handleLogin : storeLoyalty ? () => { this.handleNavigation(); } : this.handlePay}
                >
                  {changePending > 0 || fetchingTax ? <LoadingCircle containerStyle={containerStyle} contentStyle={contentStyle} barStyle={barStyle} />
                    : <div
                      role='button'
                      style={{ outline: 'none', boxShadow: 'none' }}>
                      <Trans i18nKey='CART_CHECKOUT'/>
                    </div>
                  }
                </PrimaryButton>
              </ButtonGroup>
              <ClearButton
                className='clear-cart-button'
                onClick={this.handleCancel}
                tabIndex={0}
                role='button'
                aria-label={i18n.t('CART_CLEAR')}
              >
                <Trans i18nKey='CART_CLEAR'/>
              </ClearButton>
            </ItemsContainer>
          )
        }
        { items && items.length === 0 &&
        <SummaryFooter>
          <EmptyCartContainer style={{ position: 'absolute', top: '50%', left: '0px', right: '0px', textAlign: 'center' }}
            tabIndex={1}
            aria-live='polite'
            aria-label={i18n.t('CART_EMPTY')}>
            <Trans i18nKey='CART_EMPTY'/>
          </EmptyCartContainer>
        </SummaryFooter>
        }
        {showModal &&
        <Modal
          open={showModal}
          showCancelButton
          showClose
          onCancel={this.closePopup}
          onClose={this.closePopup}
          onEscape={this.onEscape}
          onContinue={this.onModalContinue}
          cancelButtonText={clearCartCancelButtonText}
          continueButtonText={clearCartContinueButtonText}
          title={clearCartModalTitle}
          textI18nKey={clearCartModalText}
        />}
      </Container>
    );
  }
}

Cart.propTypes = {
  items: PropTypes.array.isRequired,
  currencyDetails: PropTypes.object.isRequired
};

export default Cart;
