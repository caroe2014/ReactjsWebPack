// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { Flex, Text } from 'rebass';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const TopBox = styled(Flex)`
  Flex: 0.6 1 auto;
  width: 100%;
  padding: 15px 10px;
  margin: auto;
  flex-direction: column;
  align-items: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const BottomBox = styled(Flex)`
  Flex: 0.4 1 auto;
  width: 100%;
  height: 2em;
  margin: auto;
  flex-direction: row;
`;

const ItemName = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  margin: auto;
  text-align: center;
  word-break: break-word;
`;

const ToCartText = styled(Text)`
  font-size: 20px;
  color: ${props => props.theme.colors.primaryTextColor};
  font-weight: 400;
  margin: auto;
`;

const ButtonNotify = styled(Flex)`
  width: 100%;
  height: 100%;
  &:hover {
    color: ${props => props.theme.colors.buttonControlColor};
  }
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  margin: auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonText = styled(Text)`
  font-size: ${props => props.theme.fontSize.nm};
  text-transform: uppercase;
  margin: auto;
`;

const Container = styled(Flex)`
  flex-direction: column;
  font-size: ${props => props.theme.fontSize.nm};
  height:100%;
  width:100%;
  margin: 0px !important;
  padding: 10px;

`;

class CartNotification extends Component {

  handleDelete = () => {
    if (this.props.items) {
      var lastItem = this.props.items.find(item => {
        return item.uniqueId === this.props.lastItemAdded.uniqueId;
      });
      this.props.removeItem(lastItem);
    }
    this.props.closeCartNotification(!this.props.closeNotificationFlag);
  }

  handleClose = () => {
    this.props.closeCart(!this.props.closeFlag);
    this.props.toggleCart(true);
  }

  render () {
    const { lastItemAdded, fillContent } = this.props;
    return (
      lastItemAdded &&
      <Container
        className='cart-notification'
        m={3}
        alignItems='center'
        width={fillContent ? 1 : [1, 2 / 3, 2 / 5]}
        flexDirection='column'
      >
        <Flex className='outer-container' flexDirection='column' width={1}>
          <Announcements message={`${lastItemAdded.displayText} ${i18n.t('CART_NOTIFICATION_ADDED')}`} />
          <TopBox className='top-container' tabIndex={0}
            aria-label={`${lastItemAdded.displayText} ${i18n.t('CART_NOTIFICATION_ADDED')}`}>
            <ItemName className='item-text' >
              {lastItemAdded.displayText}</ItemName>
            <ToCartText className='item-added-text'>
              <Trans i18nKey='CART_NOTIFICATION_ADDED'/>
            </ToCartText>
          </TopBox>
          <BottomBox className='bottom-container'>
            <ButtonNotify
              className='undo-button'
              onClick={this.handleDelete}
              role='button'
              tabIndex={0}
              aria-label={i18n.t('CART_NOTIFICATION_UNDO')}
            >
              <ButtonText><Trans i18nKey='CART_NOTIFICATION_UNDO'/></ButtonText>
            </ButtonNotify>
            <ButtonNotify
              className='view-cart-button'
              role='button'
              tabIndex={0}
              aria-label={i18n.t('CART_NOTIFICATION_VIEW_CART')}
              onClick={this.handleClose}>
              <ButtonText><Trans i18nKey='CART_NOTIFICATION_VIEW_CART'/></ButtonText>
            </ButtonNotify>
          </BottomBox>
        </Flex>
      </Container>
    );
  }
}

export default CartNotification;
