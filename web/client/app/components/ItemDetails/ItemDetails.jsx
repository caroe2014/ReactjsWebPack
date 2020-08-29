// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import ItemCount from 'web/client/app/components/AddItem';
import PropTypes from 'prop-types';
import { Flex, Box, Text, Button } from 'rebass';
import ItemModifier from 'web/client/app/components/ItemModifier/ItemModifier';
import DynamicImage from 'web/client/app/components/DynamicImage';
import NotificationBar from 'web/client/app/components/NotificationBar';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import SpecialInstructionInput from 'web/client/app/components/SpecialInstructionInput';

const Container = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  margin: 0;
  width: 100%;
`;

const ChildBox = styled(Box)`
  max-width: 720px;
  border-bottom: none;
  border-top: none;
  margin-top: 120px;
  padding-top: 20px;
  width: 100%;
`;

const ItemDetailsContainer = styled(Box)`
  border: solid 1px ${props => props.theme.colors.itemBorder};
  padding: 20px;
  background-color: ${props => props.theme.colors.light};
  margin-bottom: 0px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TextContainer = styled(Text)`
  font-size: ${props => props.theme.fontSize.nm};
  padding-top: 15px;
  color:${props => props.theme.colors.textGrey};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const PrimaryTextContainer = styled(Text)`
  font-size: ${props => props.theme.fontSize.nm};
  padding-top: 15px;
  color:${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const DescriptionContainer = styled(Text)`
  font-size: ${props => props.theme.fontSize.nm};
  padding-top: 15px;
  color: ${props => props.theme.colors.secondaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const PriceText = styled(Text)`
  font-size: ${props => props.theme.fontSize.lg};
  padding-top: 12px;
  padding-left: 20px;
  font-weight:bold;
  color:${props => props.theme.colors.primaryTextColor};
`;

const TileContent = styled(Text)`
 color: ${props => props.theme.colors.secondaryTextColor};
 margin: 10px 10px
   ${props => props.theme.spacing.none} ${props => props.theme.spacing.none};
 font-size: 14px
 border: 0.5px solid lightgrey;
 border-radius: 12px;
 padding: 0px 5px;
 height:24px;
 white-space:nowrap;
 display: flex;
 align-items: center;
 ${props => props.theme.mediaBreakpoints.mobile`display: none;`};
 &:focus {
    outline: none;
    box-shadow: none;
  }
`;
TileContent.displayName = 'TileContent';

const CartContent = styled(Flex)`
  flex-direction: row;
  margin: ${props => props.theme.spacing.md} ${props => props.theme.spacing.none}
    ${props => props.theme.spacing.none} ${props => props.theme.spacing.none};
  justify-content: space-between;
`;

const QuantityContainer = styled(Flex)`
  visibility :hidden;
  opacity:0;
`;

const ImageContainer = styled(Box)`
  width: 100%;
  height: 15em;
  min-height: 15em;
  overflow-y: hidden;
`;

const TileContainer = styled(Flex)`
  flex-direction: row;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TagParent = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const IconTileBox = styled(Flex)`
  display: inline-block;
  vertical-align: middle;
  justify-contet:center;
  align-items: center;
  margin-right: 10px;
  margin-top: 10px;
  white-space: nowrap;
  color: ${props => props.theme.colors.secondaryTextColor};
  ${props => props.theme.mediaBreakpoints.desktop`display: none;`};
  ${props => props.theme.mediaBreakpoints.tablet`display: none;`};
  ${props => props.theme.mediaBreakpoints.mobile`display: block;`};
`;

const IconTileText = styled(Text)`
  color: ${props => props.theme.colors.itemTile};
  font-size: 14px;
  margin-top: 2px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const fontStyle = {
  fontSize: '1em',
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '8px'
};

const CartAmount = styled(Text)`
  flex-direction: row;
  color:${props => props.theme.colors.primaryTextColor};
  font-size: 18px;
  font-weight:bold;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModifierContainer = styled(Flex)`
  flex-direction: column;
  margin-left: -20px;
  margin-right: -20px;
  margin-top: 8px;
`;

const SpecialInstructionContainer = styled(Flex)`
  flex-direction: column;
  margin-left: -20px;
  margin-right: -20px;
  margin-top: 8px;
`;

const ModifierHeader = styled(Flex)`
  width: 100%;
  min-height: 40px;
  overflow-y: hidden;
  background-color:${props => props.theme.colors.disableBackground};
  font-weight:bold;
  align-items: center;
  padding-left:20px;
  color:${props => props.theme.colors.primaryTextColor};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonContainer = styled(Box)`
  margin:20px 0px 0px 0px;
`;

const AddcartButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  float: right;
  width: 100%;
  height: 50px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  ${props => {
    if (props.disablestate) {
      return `
      opacity: 0.5;
      visibility: visible;
      cursor: default;
      `;
    }
  }}
  text-align: center;
  margin: 0 auto;
  border: none;
  border-radius: 0;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ResetButton = styled(Button)`
  background: ${props => props.theme.colors.light};
  border: 0.5px solid ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  float: right;
  width: 100%;
  height: 50px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.nm};
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  text-align: center;
  margin: 0 auto;
  border-radius: 0;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class ItemDetails extends Component {

  constructor (props) {
    super(props);
    let initAmount = this.props.selectItem ? this.props.selectItem.amount : 0;
    this.state = {
      totalAmount: initAmount,
      displayTotal: initAmount,
      addonTotal: 0,
      totalQuantity: 1,
      resetKey: 0,
      selectedModifiers: [],
      showValidationState: false,
      modifiersAreValid: false,
      invalidModifiers: [],
      openNotification: false
    };
    this.onQuantityChange = this.onQuantityChange.bind(this);
    this.onResetDefault = this.onResetDefault.bind(this);
    this.onAddToCart = this.onAddToCart.bind(this);
    this.onAddModifier = this.onAddModifier.bind(this);
    this.setValidModifiersState = this.setValidModifiersState.bind(this);
    this.notify = this.notify.bind(this);
    this.specialInstructionInput = this.specialInstructionInput.bind(this);
  }
  componentWillUpdate (newProps) {
    if (newProps.selectItem && JSON.stringify(this.props.selectItem) !== JSON.stringify(newProps.selectItem)) {
      this.setState({ totalAmount: newProps.selectItem.amount, displayTotal: newProps.selectItem.amount });
    }
  }
  onQuantityChange (quantity) {
    const { selectItem } = this.props;
    let totalAmount = (quantity * selectItem.amount).toFixed(2);
    let displayTotal = this.calculateDisplayTotal(totalAmount, quantity, this.state.addonTotal);
    this.setState({ totalQuantity: quantity, totalAmount: totalAmount, displayTotal: displayTotal });
  }
  onResetDefault () {
    const { selectItem } = this.props;
    this.setState({
      totalQuantity: 1,
      totalAmount: selectItem.amount,
      displayTotal: selectItem.amount,
      addonTotal: 0,
      resetKey: this.state.resetKey + 1,
      selectedModifiers: []
    });
  }
  onAddModifier (modifierData) {
    let { totalAmount } = this.state;
    let { addOnAmount } = modifierData.modifiersList;
    let displayTotal = this.calculateDisplayTotal(totalAmount, this.state.totalQuantity, addOnAmount);
    this.setState({
      displayTotal: displayTotal,
      addonTotal: addOnAmount,
      selectedModifiers: modifierData.selectedModifiers
    });
  }
  onAddToCart () {
    this.setState({ showValidationState: true });
    if (this.state.modifiersAreValid || !this.props.selectItem.modifiers) {
      let item = { ...this.props.selectItem };
      item.count = this.state.totalQuantity;
      if (this.state.selectedModifiers && this.state.selectedModifiers.length > 0) {
        item.selectedModifiers = Object.assign([], this.state.selectedModifiers);
      }
      if (this.state.splInstruction !== undefined) {
        item.splInstruction = this.state.splInstruction;
      }
      this.props.handleClick && this.props.handleClick(item);
    } else {
      let invalidModifierNames = '';
      const appendModifierName = function (m, i, a) {
        invalidModifierNames += ` ${m.description}`;
        if (i === a.length - 2) {
          invalidModifierNames += i18n.t('ITEM_DETAILS_MISSING_REQUIRED_AND');
        } else if (i !== a.length - 1) {
          invalidModifierNames += ',';
        }
      };
      this.state.invalidModifiers.forEach(appendModifierName);
      this.notify(i18n.t('ITEM_DETAILS_MISSING_REQUIRED', { invalidModifierNames: invalidModifierNames, interpolation: { escapeValue: false } }));// eslint-disable-line max-len
      invalidModifierNames && document.getElementById('tab-list') && document.getElementById('tab-list').focus();
    }
  }
  setValidModifiersState (modifiersAreValid, invalidModifiers) {
    this.setState({ modifiersAreValid, invalidModifiers });
  }
  calculateDisplayTotal (totalAmount, quantity, addonTotal) {
    return (parseFloat(totalAmount) + parseFloat(quantity * addonTotal)).toFixed(2);
  }

  notify (notificationText) {
    this.setState({ notificationText });
  }

  specialInstructionInput (splInstructionstext) {
    this.setState({ splInstruction: splInstructionstext });
  }

  canShowAttribute (itemDisplayList, itemProperty) {
    return itemDisplayList.length === 0 ? true : (itemDisplayList.find(itemDisplayParam => itemDisplayParam === itemProperty)); // eslint-disable-line max-len
  }

  render () {
    const { selectItem, currencyDetails, disableAddToCart, specialInstructions, itemDisplayList } = this.props;
    const { notificationText } = this.state;

    const showDescription = this.canShowAttribute(itemDisplayList, 'description');
    const showLabels = this.canShowAttribute(itemDisplayList, 'labels');
    const showImage = this.canShowAttribute(itemDisplayList, 'image');
    const showPrice = this.canShowAttribute(itemDisplayList, 'price');

    return (
      <Container>
        {selectItem &&
          <ChildBox className='box-container' width={[1, 0.65]} >
            {selectItem.image && showImage &&
              <ImageContainer className='image-container'>
                <DynamicImage
                  className='image'
                  bgSize='cover'
                  style={{ width: '100%' }}
                  src={selectItem.image}
                />
              </ImageContainer>
            }
            <ItemDetailsContainer className='details-container'>
              {showDescription && selectItem.description &&
                <DescriptionContainer
                  className='description'
                  pt={[15]}
                  pb={[10]}
                  tabIndex={0}
                  aria-label={selectItem.description}
                >
                  {selectItem.description}
                </DescriptionContainer>
              }
              <TileContainer className='description-tab' flexWrap='wrap'>
                <TagParent className='tileTab' width={[1, 0.6, 0.6, 0.6]} alignItems='center'>
                  {showLabels && selectItem.tagNames && selectItem.tagNames.map((item) => (
                    <React.Fragment key={item}>
                      <TileContent className='icon-tile' role='img' tabIndex={0} aria-label={item}>
                        <i
                          className={`agilysys-icon-${item.toLowerCase().replace(/\s/g, '-')}`}
                          style={fontStyle}
                          alt=''
                        />
                        {item}
                      </TileContent>
                      <IconTileBox className='icon-tile'
                        role={item.id !== 'calories' && 'img'}
                        tabIndex={0} aria-label={item.id !== 'calories' ? item : item.value}>
                        {item.id === 'calories'
                          ? <IconTileText>{item.value}</IconTileText>
                          : <i
                            className={`agilysys-icon-${item.toLowerCase().replace(/\s/g, '-')}`}
                            style={fontStyle}
                            alt=''
                          />
                        }
                      </IconTileBox>
                    </React.Fragment>
                  ))}
                </TagParent>
                {showPrice &&
                  <TileContainer
                    width={[1, 0.4, 0.4, 0.4]}
                    alignItems='center'
                    justifyContent={['space-between', 'flex-end']}
                    tabIndex={0}
                    aria-label={`${i18n.t('ITEM_LABEL')}${i18n.t('ITEM_DETAILS_BASE_PRICE')} 
                    ${currencyLocaleFormat(selectItem.amount, currencyDetails)}`}
                  >
                    <PrimaryTextContainer
                      className='title base-price-label'
                      fontWeight='bold'
                      children={<Trans i18nKey='ITEM_DETAILS_BASE_PRICE' />}
                    />
                    <PriceText className='base-price-text'>
                      {currencyLocaleFormat(selectItem.amount, currencyDetails)}
                    </PriceText>
                  </TileContainer>
                }
              </TileContainer>
              {selectItem.modifiers && <ModifierContainer>
                <ModifierHeader className='header-text'
                  tabIndex={0}
                  aria-label={i18n.t('ITEM_DETAILS_CUSTOMIZE')}
                  children={<Trans i18nKey='ITEM_DETAILS_CUSTOMIZE' />} />
                <ItemModifier
                  key={this.state.resetKey}
                  modifiers={selectItem.modifiers}
                  handlerFromParent={this.onAddModifier}
                  showValidationState={this.state.showValidationState}
                  onValidate={this.setValidModifiersState}
                  onNotify={this.notify}
                  currencyDetails={currencyDetails}
                />
                <NotificationBar
                  text={notificationText}
                  actionButtonText={<Trans i18nKey='ITEM_DETAILS_GOT_IT' />}
                  onActionClick={() => { this.setState({ notificationText: undefined }); }}
                  open={notificationText !== undefined}
                />
              </ModifierContainer>
              }

              {specialInstructions && specialInstructions.featureEnabled &&
                <SpecialInstructionContainer>
                  <SpecialInstructionInput
                    key={this.state.resetKey}
                    headerText={specialInstructions.headerText}
                    instructionText={specialInstructions.instructionText}
                    characterLimit={specialInstructions.characterLimit}
                    handleSplInstruction={this.specialInstructionInput}
                  />
                </SpecialInstructionContainer>
              }
              <CartContent alignItems='center'>
                <QuantityContainer alignItems='center' >
                  <TextContainer
                    p={['0px 15px 0px 0px !important']}
                    children={<Trans i18nKey='ITEM_DETAILS_QUANTITY' />}
                  />
                  <ItemCount
                    key={this.state.resetKey}
                    min={1}
                    max={99}
                    width={100}
                    onInputChange={this.onQuantityChange}
                  />
                </QuantityContainer>
                <CartAmount className='total-amount-text' tabIndex={0}
                  aria-label={`${currencyLocaleFormat(this.state.displayTotal, currencyDetails)}`}>
                  {currencyLocaleFormat(this.state.displayTotal, currencyDetails)}
                </CartAmount>
              </CartContent>
              <TileContainer flexWrap='wrap'>
                <ButtonContainer width={[1, 1 / 2, 1 / 2, 1 / 2]} pr={[0, 2]}>
                  <ResetButton
                    className='reset-button button'
                    type='submit'
                    onClick={this.onResetDefault}
                    children={<Trans i18nKey='ITEM_DETAILS_RESET' />}
                    tabIndex={0}
                  />
                </ButtonContainer>
                <ButtonContainer width={[1, 1 / 2, 1 / 2, 1 / 2]} pl={[0, 2]}>
                  <AddcartButton
                    className='add-to-cart-button'
                    disablestate={disableAddToCart ? 1 : 0}
                    type='submit'
                    onClick={!disableAddToCart ? this.onAddToCart : undefined}
                    tabIndex={0}
                    children={<Trans i18nKey='ITEM_ADD_TO_CART' />}
                  />
                </ButtonContainer>
              </TileContainer>
            </ItemDetailsContainer>
          </ChildBox>
        }
      </Container>
    );
  }
}

ItemDetails.propTypes = {
  selectItem: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tagNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  }),
  currencyDetails: PropTypes.object.isRequired,
  itemDisplayList: PropTypes.array
};

export default ItemDetails;
