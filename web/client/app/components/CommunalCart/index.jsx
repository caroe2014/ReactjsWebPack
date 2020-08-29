// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import React, { Component } from 'react';
import { Flex, Text, Box, Divider } from 'rebass';
import PropTypes from 'prop-types';
// import IncrementInput from 'web/client/app/components/IncrementInput/IncrementInput';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import IconButton from 'web/client/app/components/IconButton';
import styled from 'styled-components';
import Loader from 'web/client/app/components/Loader/index';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import LoadingCircle from 'web/client/app/components/CircleBarLoader/loadingCircle';
import get from 'lodash.get';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import { getOrderConfigurationDetails } from 'web/client/app/utils/OrderConfig';
import SnackBar from 'web/client/app/components/SnackBar';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';

const Header = styled(Flex)`
  padding: 20px 0 20px 0;
  color: ${props => props.theme.colors.primaryTextColor};
  font-weight: 500;
  font-size: 22px;
  width: 100%;
  justify-content: center;
  padding-right: 25px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Border = styled(Divider)`
  border-bottom: none;
  margin: 0px 0px;
  width: 100%;
  height: 6px;
  box-shadow: 0 4px 2px -2px gray;
`;

const Container = styled(Flex)`
  flex-direction: column;
  font-size: ${props => props.theme.fontSize.nm};
  height:100%;
  width:100%;
  margin: 0px !important;
  position: relative;
  .snack-bar {
    min-width: 100%;
    width: 100%;
  }
  .snack-bar .child-container{
    background-color: ${props => props.theme.colors.buttonControlColor};
    color: ${props => props.theme.colors.buttonTextColor};
  }
  .item-footer {
    position: relative;
  }
`;

const LoadingContainer = styled(Flex)`
  position: absolute;
  display:flex;
  flex-direction: column;
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
`;

const ItemsContainer = styled(Box)`
  align-items: center;
  flex-direction: row;
  padding: 20px;
  padding-bottom: 0px;
  height:100%;
  width:100%;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 0px;
  position: relative;
  ${props => props.theme.mediaBreakpoints.mobile`padding-bottom: 20px;`};
`;

const EmptyCartContainer = styled(Box)`
  color: ${props => props.theme.colors.secondaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonGroup = styled(Flex)`
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
  & > button {
    padding: 0px;
    height: 40px;
    font-size: 16px;
    width: 85%;
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
  padding-left: 10px;
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
  opacity: ${props => props['disable-item'] ? '0.6' : '1'}
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

const DeleteButton = styled(IconButton)`
  color: ${props => props.theme.colors.tile};
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

const Footer = styled(Flex)`
  flex-direction: column;
  color: ${props => props.theme.colors.primaryTextColor};
  background-color: ${props => props.theme.colors.addonBg}
  padding: 15px 10px
  width: 112%;
  z-index: 1;
  align-items: center;
  .addtional-text {
    font-size: 12px;
    padding-top: 5px;
  }
  .table-check {
    font-size: 12px;
  }
  .table-check, .server-info {
    padding-bottom: 5px;
  }
`;

const FooterText = styled(Text)`
  font-size: 14px;
  max-width: 500px;
  text-align: center;
  ${props => props.theme.mediaBreakpoints.mobile`
    max-width: 100%;
  `}
`;

const StyledLoadingComponent = styled(LoadingComponent)`
  height: 40px;
  width: 40px; 
`;

const CartHeader = styled(Flex)`
  width: 100%;
  justify-content: center;
  align-items: center;
  & > i {
    color: ${props => props.theme.colors.buttonControlColor};
    font-size: 20px;
    padding-left: 20px
    -webkit-text-stroke: 1px #f0f0f3;
    cursor: pointer;
  }
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
  snackbarRef = React.createRef();
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
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.handlePay = this.handlePay.bind(this);
    this.showSnackbarHandler = this.showSnackbarHandler.bind(this);
    this.refreshCummunalCartItems = this.refreshCummunalCartItems.bind(this);
    this.isItemPending = this.isItemPending.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.orderModified !== this.props.orderModified && this.props.orderModified) {
      this.showSnackbarHandler(i18n.t('COMMUNAL_CART_ORDER_SENT'));
    }
    if (prevProps.error !== this.props.error && this.props.error) {
      this.showSnackbarHandler(i18n.t('COMMUNAL_CART_ORDER_FAIL_SENT'));
    }
    if (prevProps.newLineItemsInOrder !== this.props.newLineItemsInOrder) {
      this.showSnackbarHandler(i18n.t('COMMUNAL_CART_NEW_ITEMS_IN_ORDER'));
    }
    if (prevProps.noPendingItemsInOrder !== this.props.noPendingItemsInOrder) {
      this.showSnackbarHandler(i18n.t('COMMUNAL_CART_NO_NEW_ITEMS_IN_ORDER'));
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

  handleDelete (item) {
    this.props.removeItem(item);
  }

  handleCancel (itemId, uniqueId) {
    this.props.cancelCommunalCart(itemId, uniqueId);
  }

  refreshCummunalCartItems () {
    !this.props.fetchCommunalCart && this.props.fetchingCommunalCartByOrderGuid();
  }

  handlePay () {
    const {items, processAndUpadateCommunalCart, refreshCommunalCart} = this.props;
    const pendingItems = items.filter(item => this.isItemPending(item));
    if (pendingItems.length === 0) {
      return;
    }
    if (refreshCommunalCart) {
      this.refreshCummunalCartItems();
      return;
    }
    processAndUpadateCommunalCart(pendingItems);
  }

  handleLoader () {
    this.setState({ loader: false });
  }

  showSnackbarHandler (message) {
    this.snackbarRef && this.snackbarRef.current && this.snackbarRef.current.openSnackBar(message);
  }

  isItemPending (item) {
    return item.properties.isSentToKitchen === 'false';
  }

  render () {
    const { subTotal, tax, gratuity, serviceAmount, total, vatEnabled, items, fillContent, processCommunalCart, currencyDetails, storesList, fetchingTax, order, fetchCommunalCart, refreshCommunalCart, igOrderProperties } = this.props;
    const displayProfileId = storesList.find(list => list.id === order.contextId).displayProfileId;
    const orderConfig = getOrderConfigurationDetails(items, storesList, displayProfileId, order.contextId);
    const taxRuleData = items && get(orderConfig, 'taxRuleData', '');
    const cartScreen = items && get(orderConfig, 'cartScreen');
    const emptyPrice = <span>&#9866;.&#9867;</span>;
    const pendingItems = items.filter(item => this.isItemPending(item));
    const footer = items && get(orderConfig, 'footer');
    const payButtonDisabled = !total || processCommunalCart || (vatEnabled && !taxRuleData) || !orderConfig || pendingItems.length === 0;
    return (
      <Container
        className='cart-container'
        m={3}
        alignItems='center'
        width={fillContent ? 1 : [1, 2 / 3, 2 / 5]}
        flexDirection='column'
      >
        {(this.state.loader) && <LoadingContainer className='loader-container'>
          <Loader />
          <Trans i18nKey='CART_MY_CART'/>
        </LoadingContainer>}
        <React.Fragment>
          <CartHeader>
            <i className='fa fa-refresh' onClick={this.refreshCummunalCartItems}/>
            <Header className='my-cart-header' role='header' tabIndex={0}
              aria-label={i18n.t('CART_MY_CART')}>
              {(cartScreen && cartScreen.headerText) || <Trans i18nKey='CART_MY_CART'/>}
            </Header>
          </CartHeader>
          <Border className='horiz-border'/>
        </React.Fragment>
        {
          fetchCommunalCart ? <LoadingContainer className='loader-container'>
            <StyledLoadingComponent height='25px' width='25px' borderSize={2} />
            <Trans i18nKey='CUMMUNAL_CART_FETCH_ITEMS'/>
          </LoadingContainer>
            : items && items.length > 0 && (
              <ItemsContainer width={1}>
                {
                  items && items.map((item, index) => (
                    item && (
                      <React.Fragment key={`cart-item-` + item.properties.uniqueId}>
                        <ItemBaseContainer className='item-display-box' width={1} modifiers={item.selectedModifiers} disable-item={!this.isItemPending(item)}>
                          <PrimaryDescription className='item-display-name'
                            aria-label={item.displayText || item.properties.displayText}
                            tabIndex={0}
                          >{item.displayText || item.properties.displayText}</PrimaryDescription>
                          <ItemPriceContainer>
                            {this.isItemPending(item) && <DeleteButton
                              aria-label={i18n.t('CART_ITEM_DELETE')}
                              tabIndex={0}
                              classContext={`cart-delete-${index + 1}`}
                              className={`cart-delete-btn-${index + 1}`}
                              iconClassName='fa fa-times-circle'
                              onClick={() => {
                                this.handleDelete(item);
                              }}
                            />}
                            <Price className='item-base-price' style={basePriceStyle}
                              tabIndex={0}
                              aria-label={currencyLocaleFormat(item.amount || item.price.amount, currencyDetails)}
                            >{currencyLocaleFormat(item.amount || item.price.amount, currencyDetails)}</Price>
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
                        {
                          item.lineItemGroups && item.lineItemGroups.map((option, modifierIndex) => (
                            option.lineItems && option.lineItems.map(subOption => (
                              <React.Fragment key={modifierIndex}>
                                <ModifierBox className='modifier-box' width={1} mb={1}>
                                  <Description className='modifier-name'
                                    tabIndex={0}
                                    aria-label={subOption.properties.displayText}
                                  >{subOption.properties.displayText}</Description>
                                  {parseFloat(subOption.price.amount) > 0 ? subOption.price.amount && <Price className='modifier-price'
                                    tabIndex={0}
                                    aria-label={currencyLocaleFormat(subOption.price.amount, currencyDetails)}
                                  >{currencyLocaleFormat(subOption.price.amount, currencyDetails)}</Price> : <Price className='modifier-empty-price'/>}
                                </ModifierBox>
                              </React.Fragment>
                            ))
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
                      aria-label={processCommunalCart || refreshCommunalCart
                        ? emptyPrice : currencyLocaleFormat(subTotal, currencyDetails)}
                    >
                      { processCommunalCart || refreshCommunalCart ? emptyPrice
                        : currencyLocaleFormat(subTotal, currencyDetails)
                      }
                    </Price>
                  </SubTotalContainer>
                  {gratuity > 0 && <SubTotalContainer className='gratuity-container' width={1} mb={2}>
                    <TotalTypeDescription className='gratuity-label'
                      tabIndex={0}
                      aria-label={i18n.t('CART_GRATUITY')}
                    ><Trans i18nKey='CART_GRATUITY'/></TotalTypeDescription>
                    <Price className='gratuity-text'
                      tabIndex={0}
                      aria-label={processCommunalCart || refreshCommunalCart
                        ? emptyPrice : currencyLocaleFormat(gratuity, currencyDetails)}
                    >
                      { processCommunalCart || refreshCommunalCart ? emptyPrice
                        : currencyLocaleFormat(gratuity, currencyDetails)
                      }
                    </Price>
                  </SubTotalContainer>}
                  {serviceAmount > 0 && <SubTotalContainer className='serviceAmount-container' width={1} mb={2}>
                    <TotalTypeDescription className='serviceAmount-label'
                      tabIndex={0}
                      aria-label={i18n.t('CART_SERVICE_CHARGE')}
                    ><Trans i18nKey='CART_SERVICE_CHARGE'/></TotalTypeDescription>
                    <Price className='service-charge-text'
                      tabIndex={0}
                      aria-label={processCommunalCart || refreshCommunalCart
                        ? emptyPrice : currencyLocaleFormat(serviceAmount, currencyDetails)}
                    >
                      { processCommunalCart || refreshCommunalCart ? emptyPrice
                        : currencyLocaleFormat(serviceAmount, currencyDetails)
                      }
                    </Price>
                  </SubTotalContainer>}
                  {!vatEnabled && tax > 0 && <Box className='tax-container' width={1} mb={2} style={boxStyle}>
                    <TotalTypeDescription className='tax-label'
                      tabIndex={0}
                      aria-label={i18n.t('CART_TAX')}
                    ><Trans i18nKey='CART_TAX'/></TotalTypeDescription>
                    <Price className='tax-text'
                      tabIndex={0}
                      aria-label={processCommunalCart || refreshCommunalCart
                        ? emptyPrice : currencyLocaleFormat(tax, currencyDetails)}
                    >
                      { processCommunalCart || refreshCommunalCart ? emptyPrice
                        : currencyLocaleFormat(tax, currencyDetails)
                      }
                    </Price>
                  </Box>}
                  <BorderFlex className='net-payable-container' width={1} py={3}>
                    <TotalDescription className='net-label'
                      tabIndex={0}
                      aria-label={i18n.t('CART_NET_PAYABLE')}
                    ><Trans i18nKey='CART_NET_PAYABLE'/></TotalDescription>
                    <ItemPrice className='net-pay-text' ml={'auto'}
                      tabIndex={0}
                      aria-label={processCommunalCart || refreshCommunalCart
                        ? emptyPrice : currencyLocaleFormat(total, currencyDetails)}
                    >
                      { processCommunalCart || refreshCommunalCart ? emptyPrice
                        : currencyLocaleFormat(total, currencyDetails)
                      }
                    </ItemPrice>
                  </BorderFlex>
                </Summary>
                <SummaryFooter className='item-footer' width={1}>
                  {footer && footer.isEnabled && <Footer>
                    {/* {footer.showServerInfo && <FooterText className='server-info'>
                    {`${i18n.t('OATT_SERVER_LABEL')} Kumar`}
                  </FooterText>} */}
                    {(footer.showTableInfo || footer.showCheckInfo) && <FooterText className='table-check'>
                      {footer.showTableInfo && `${i18n.t('OATT_TABLE_LABEL')} ${(igOrderProperties && igOrderProperties.tableNumber) || '--'}${footer.showCheckInfo ? ' | ' : ''}`} {/* eslint-disable-line max-len */}
                      {footer.showCheckInfo && `${i18n.t('OATT_CHECK_LABEL')} ${(igOrderProperties && igOrderProperties.orderNumber) || '--'}`}
                    </FooterText>}
                    {footer.additionalFooterText && <FooterText className='addtional-text'>
                      {footer.additionalFooterText}
                    </FooterText>}
                  </Footer>
                  }
                  <SnackBar ref={this.snackbarRef}
                    displayPosition={'absolute'} bottom={'0'}/>
                </SummaryFooter>
                <ButtonGroup className='pay-button-group' width={1} mt={1}>
                  <PrimaryButton
                    classContext='pay-cart-button'
                    className='pay-cart-button'
                    disabled={payButtonDisabled}
                    onClick={this.handlePay}
                  >
                    {processCommunalCart || fetchingTax ? <LoadingCircle containerStyle={containerStyle} contentStyle={contentStyle} barStyle={barStyle} />
                      : <div
                        role='button'
                        style={{ outline: 'none', boxShadow: 'none' }}>
                        {refreshCommunalCart ? <Trans i18nKey='COMMUNAL_CART_REFRESH'/> : (cartScreen && cartScreen.buttonText) || <Trans i18nKey='COMMUNAL_CART_PLACE_ORDER'/>}
                      </div>
                    }
                  </PrimaryButton>
                </ButtonGroup>
              </ItemsContainer>
            )
        }
        { items && items.length === 0 && !fetchCommunalCart &&
        <SummaryFooter>
          <SnackBar ref={this.snackbarRef}
            displayPosition={'relative'} bottom={'0'}/>
          <EmptyCartContainer style={{ position: 'absolute', top: '50%', left: '0px', right: '0px', textAlign: 'center' }}
            tabIndex={1}
            aria-live='polite'
            aria-label={i18n.t('CART_EMPTY')}>
            <Trans i18nKey='CART_EMPTY'/>
          </EmptyCartContainer>
        </SummaryFooter>
        }
      </Container>
    );
  }
}

Cart.propTypes = {
  items: PropTypes.array.isRequired,
  currencyDetails: PropTypes.object.isRequired
};

export default Cart;
