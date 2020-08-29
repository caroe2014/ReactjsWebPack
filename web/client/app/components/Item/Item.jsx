// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import { Flex, Text } from 'rebass';
import PropTypes from 'prop-types';
import Tile from 'web/client/app/components/Tile';
import { Trans } from 'react-i18next';
import { currencyLocaleFormat } from 'web/client/app/utils/NumberUtils';
import i18n from 'web/client/i18n';

const DetailsContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  flex: 1 1 auto;
  width: 100%;
`;

const DescriptionText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  width: 100%;
  font-size: ${props => props.theme.fontSize.nm};
  margin: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.none};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TopContainer = styled(Flex)`
  flex-direction: row;
`;

const TileContainer = styled(Flex)`
  flex-direction: row;
  margin: 0px 0px 8px 0px;
  ${props => props.theme.mediaBreakpoints.mobile`padding-left: 9px;`};
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  flex-wrap: wrap;
  ${props => props.theme.mediaBreakpoints.mobile`display: none;`};
`;

const BottomContainer = styled(Flex)`
  width: 100%;
  justify-content: ${props => { return props.digitalMenuId ? `flex-end;` : `space-between`; }};
  display: flex;
  ${props => props.theme.mediaBreakpoints.desktop`border-top: 0.5px solid lightgrey;`};
  ${props => props.theme.mediaBreakpoints.tablet`
    border-top: 0.5px solid lightgrey; 
    padding-top: 14px;
  `};
  ${props => props.theme.mediaBreakpoints.mobile`display: none`};
  margin-bottom: 10px;
`;

const TileContainerNoDescription = styled(Flex)`
  flex-direction: row;
  ${props => props.theme.mediaBreakpoints.mobile`padding-left: 9px;`};
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  flex-wrap: wrap;
  ${props => props.theme.mediaBreakpoints.mobile`display: none;`};
  margin-top: 10px;
`;

const MobileBottomContainer = styled(Flex)`
  width: 100%;
  justify-content: ${props => { return props.digitalMenuId ? `flex-end;` : `space-between`; }};
  display: flex;
  padding: 0px 10px;
  margin-bottom: 5px;
  margin-top: 5px;
  ${props => props.theme.mediaBreakpoints.desktop`display: none`};
  ${props => props.theme.mediaBreakpoints.tablet`display: none`};
  ${props => props.theme.mediaBreakpoints.mobile`display: flex`};
`;

const CartText = styled(Text)`
  color: ${props => props.theme.colors.buttonControlColor};
  font-size: ${props => props.theme.fontSize.nm};
  ${props => props.theme.mediaBreakpoints.desktop`margin-top: 14px;`};
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: none;
  };
  order: 1;
`;

const AmountText = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor}; 
  font-size: ${props => props.theme.fontSize.nm};
  font-weight: bold;
  ${props => props.theme.mediaBreakpoints.desktop`margin-top: 14px;`};
  &:focus {
    outline: none;
    box-shadow: none;
  };
  order: 2
`;

const Tag = styled(Flex)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 2px;
  white-space: nowrap;
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

const IconTileContainer = styled(Flex)`
  flex-direction: row;
  height: 24px;
  justify-content: center;
  display: flex;
  align-items: center;
  ${props => props.theme.mediaBreakpoints.desktop`display: none;`};
  ${props => props.theme.mediaBreakpoints.tablet`display: none;`};
  ${props => props.theme.mediaBreakpoints.mobile`
  display: block;
  `};
`;

const IconTileBox = styled(Flex)`
  display: inline-block;
  vertical-align: middle;
  justify-contet:center;
  align-items: center;
  margin-right: ${props => {
    if (props.iscart) return '4px;';
    return '9px;';
  }};
  white-space: nowrap;
  border: ${props => {
    if (props.iscart) return 'none';
    return '1px solid #C5C5C5;';
  }};
  border-radius: ${props => {
    if (props.iscart) return 'none';
    return '16px;';
  }};
    padding: ${props => {
    if (props.iscart) return 'none';
    return '0px 4px 2px 4px;';
  }};
  
  ${props => props.theme.mediaBreakpoints.mobile`
    border: none;
    border-radius: none;
    padding: none;
    margin-right: 4px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const IconTileText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  margin-top: 2px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const titleStyle = {
  fontSize: '16px',
  fontWeight: '500',
  wordBreak: 'break-word'
};

class Item extends Component {
  constructor (props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.canShowAttribute = this.canShowAttribute.bind(this);
  }
  onItemClick () {
    if (this.props.selectItem) {
      this.props.selectItem(this.props.keyProps);
    }
  }
  handleKeyDown (e) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (e.which === 13 || e.which === 32) {
      this.onItemClick();
    }
  }

  canShowAttribute (itemDisplayList, itemProperty) {
    return itemDisplayList.length === 0 ? true : (itemDisplayList.find(itemDisplayParam => itemDisplayParam === itemProperty)); // eslint-disable-line max-len
  }

  render () {

    const { keyProps, showAddButton, addItemToCart, selectItem, iscart, ariaLabel, tabIndex,
      currencyDetails, digitalMenuId, itemDisplayList, ...rest } = this.props;

    const showDescription = this.canShowAttribute(itemDisplayList, 'description');
    const showLabels = this.canShowAttribute(itemDisplayList, 'labels');
    const showImage = this.canShowAttribute(itemDisplayList, 'image');
    const showPrice = this.canShowAttribute(itemDisplayList, 'price');

    const mobileFooter = showAddButton &&
      <MobileBottomContainer digitalMenuId={digitalMenuId}>
        {showPrice && keyProps.amount && <AmountText className='amount' tabIndex={0}>
          {currencyLocaleFormat(keyProps.amount, currencyDetails)}
        </AmountText>}
        {!digitalMenuId &&
          <CartText className='add-to-cart-text' onClick={this.onItemClick}
            aria-label={i18n.t('ADD_CART_TEXT')} role='button' tabIndex={0}>
            <Trans i18nKey='ITEM_ADD_TO_CART' />
          </CartText>
        }
      </MobileBottomContainer>;
    return (
      <Tile
        classContext={`tile item_${keyProps.id}`}
        {...rest}
        title={keyProps.displayText}
        image={showImage && keyProps.thumbnail}
        titleStyle={titleStyle}
        footer={mobileFooter}
        imageresponsive='true'
        iscart={iscart ? 1 : 0}
        ariaLabel={ariaLabel}
        tabIndex={tabIndex}
      >
        <DetailsContainer className='box-container' image={showImage && keyProps.image} >
          {showDescription && keyProps.description &&
            <TopContainer>
              <DescriptionText className='description'
                aria-label={`${i18n.t('ITEM_DESCRIPTION')}${keyProps.description}`} tabIndex={0}>
                {keyProps.description}</DescriptionText>
            </TopContainer>
          }
          <span>
            {showDescription && keyProps.description
              ? <TileContainer>
                {showLabels && keyProps.tagNames && keyProps.tagNames.map((tag) => (
                  <React.Fragment key={`itemTile_noImage_${tag}`}>
                    <IconTileBox iscart={iscart ? 1 : 0} className='icon-tile'
                      aria-label={tag}
                      role={tag.id !== 'calories' && 'img'}
                      tabIndex={0}>
                      {tag.id !== 'calories' &&
                        <i className={`agilysys-icon-${tag.toLowerCase().replace(/\s/g, '-')}`}
                          alt='' style={fontStyle}
                        />}
                      {!iscart
                        ? <Tag className='tag'>{tag}</Tag> : null}
                    </IconTileBox>
                  </React.Fragment>
                ))}
              </TileContainer>
              : <TileContainerNoDescription className='tile-container-no-description'>
                {showLabels && keyProps.tagNames && keyProps.tagNames.map((tag) => (
                  <React.Fragment key={`itemTile_noImage_${tag}`}>
                    <IconTileBox className='icon-tile' aria-label={tag}
                      role={tag.id !== 'calories' && 'img'}
                      tabIndex={0}>
                      {tag.id !== 'calories' &&
                        <i className={`agilysys-icon-${tag.toLowerCase().replace(/\s/g, '-')}`}
                          alt='' style={fontStyle} />}
                      {!iscart ? <Tag className='tag'>{tag}</Tag> : null}
                    </IconTileBox>
                  </React.Fragment>
                ))}
              </TileContainerNoDescription>
            }
            {showLabels && keyProps.tagNames && keyProps.tagNames.length > 0 && <IconTileContainer>
              {keyProps.tagNames.map((tag) => (
                <React.Fragment key={`itemTile-${tag}`} >
                  <IconTileBox className='icon-tile-mobile'
                    role={tag.id !== 'calories' && 'img'}
                    tabIndex={0} aria-label={tag.id !== 'calories' ? tag : tag.value}>
                    {tag.id === 'calories'
                      ? <IconTileText>{tag.value}</IconTileText>
                      : <i className={`agilysys-icon-${tag.toLowerCase().replace(/\s/g, '-')}`} style={fontStyle}
                        alt='' />
                    }
                  </IconTileBox>
                </React.Fragment>
              ))}
            </IconTileContainer>
            }
          </span>
        </DetailsContainer>
        {
          showAddButton &&
          <BottomContainer digitalMenuId={digitalMenuId}>
            {showPrice && keyProps.amount &&
              <AmountText
                className='amount'
                tabIndex={0}
                aria-label={`${i18n.t('ITEM_PRICE')}${currencyLocaleFormat(keyProps.amount, currencyDetails)}`}>
                {currencyLocaleFormat(keyProps.amount, currencyDetails)}
              </AmountText>}
            {!digitalMenuId && <CartText className='add-to-cart-text'
              onClick={this.onItemClick}
              onKeyDown={this.handleKeyDown}
              aria-label={i18n.t('ADD_CART_TEXT')} role='button' tabIndex={0}>
              <Trans i18nKey='ITEM_ADD_TO_CART' />
            </CartText>
            }
          </BottomContainer>
        }
      </Tile>
    );
  }
}

Item.propTypes = {
  keyProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      }))
  }).isRequired,
  currencyDetails: PropTypes.object
};

export default Item;
