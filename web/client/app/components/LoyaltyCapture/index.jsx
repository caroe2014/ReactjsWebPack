// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import LoyaltyActivity from 'web/client/app/components/LoyaltyActivity';
import i18n from 'web/client/i18n';

import IconButton from 'web/client/app/components/IconButton';
import { Flex, Text, Modal as ModalWindow, Fixed } from 'rebass';
import { Trans } from 'react-i18next';
import 'wicg-inert';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1101;
  width: 420px;
  padding: 15px 15px 0px;
  height: 600px;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border-radius: 0px; height: 100%`};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ModalBackground = styled(Fixed)`
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1101;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  color: ${props => props.theme.colors.textGrey};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  top: 15px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SkipButtonParent = styled(Flex)`
  justify-content: center;
  max-width: 420px;
  width: 100%;
  margin-bottom: 10px;
`;

const SkipButton = styled(Text)`
  margin: 20px 0px;
  color: ${props => props.theme.colors.buttonControlColor};
  cursor: pointer;
  font-weight: 500;
  font-size: ${props => props.theme.fontSize.nm};
  text-transform: uppercase;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const MessageLabel = styled(Text)`
  width: 100%;
  word-break: break-word;
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.theme.colors.primaryTextColor};
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  ${props => props.theme.mediaBreakpoints.mobile`
    font-size: 18px;
    margin: 15px 0px;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class LoyaltyCapture extends Component {
  constructor (props) {
    super(props);

    this.state = {
      configureLoyaltyInput: true
    };
    this.onSkipLoyalty = this.onSkipLoyalty.bind(this);
    this.onShowActivity = this.onShowActivity.bind(this);
    this.handleLoyaltyInfo = this.handleLoyaltyInfo.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
  }

  makeEverythingAccessible () {
    const parent = document.querySelector('.parent');
    const children = parent.children;
    Array.from(children).forEach(child => {
      if (child !== 'container-parent') {
        child.inert = false;
      }
    });
  }

  onSkipLoyalty () {
    const { cartItems, cartDiplayProfileId } = this.props;
    this.makeEverythingAccessible();
    this.props.skipLoyalty(cartItems && cartItems.lenth > 0 && cartItems[0].contextId, cartDiplayProfileId);
    this.props.navigateConcept();
  }

  handleKeyDown (e) {
    // TODO: make this usable by all clickable elements,
    //  pass in caller's onclickhandler (13 is keycode for enter key, 32 is spacebar)
    if (e.which === 13 || e.which === 32) {
      this.makeEverythingAccessible();
      this.onSkipLoyalty();
    }
  }

  onShowActivity () {
    this.setState({ configureLoyaltyInput: true });
  }

  handleLoyaltyInfo (loyaltyInfo, selectedOption) {
    const { cartItems, skipSitesPage, displayProfileId } = this.props;
    let siteId = cartItems && cartItems.length > 0 && cartItems[0].contextId;
    let selectedDisplayProfileId;
    if (cartItems && cartItems.length > 0 && skipSitesPage) {
      siteId = cartItems[0].contextId;
      selectedDisplayProfileId = displayProfileId;
    }
    this.props.sendLoyalty(loyaltyInfo, selectedOption, siteId, selectedDisplayProfileId);
    this.props.navigateConcept();
    this.props.onLoyaltyInfoModified();
    this.makeEverythingAccessible();
  }

  onClickClose () {
    this.makeEverythingAccessible();
    this.props.closeModal();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  render () {
    const { configureLoyaltyInput } = this.state;
    const { loyaltyDetails, loyaltyInfoMap, siteId, showLoyaltyModal } = this.props;
    const loyaltyInfoDetails = loyaltyInfoMap && siteId && loyaltyInfoMap[siteId];

    return (
      <Fragment>
        {showLoyaltyModal && <Flex className='container-parent' id='container-parent' onKeyDown={this.onEscape}>
          <ModalBackground className='guest-profile-modal-background'/>
          <ModalContainer className='loyalty-container' role='dialog'
            showBg={configureLoyaltyInput || (loyaltyInfoDetails && loyaltyInfoDetails.loyaltyInfo)}>
            {this.props.showMessage &&
              <MessageLabel className='message-label' role='heading'
                aria-label={i18n.t('LOYALTY_CAPTURE_LABEL')} tabIndex={0}>
                <Trans i18nKey='LOYALTY_CAPTURE_LABEL'/></MessageLabel>
            }
            { (configureLoyaltyInput || (loyaltyInfoDetails && loyaltyInfoDetails.loyaltyInfo)) &&
              <LoyaltyActivity
                handleLoyaltyInfo={this.handleLoyaltyInfo}
                loyaltyDetails={loyaltyDetails}
                loyaltyDetailsAccounts={loyaltyDetails && loyaltyDetails.loyaltyDetailsAccounts}
                {...this.props}
              />
            }
            <SkipButtonParent
              showBg={configureLoyaltyInput || (loyaltyInfoDetails && loyaltyInfoDetails.loyaltyInfo)}>
              <SkipButton className='skip-button' onClick={this.onSkipLoyalty}
                aria-label={i18n.t('LOYALTY_CAPTURE_SKIP')}
                tabIndex={0}
                onKeyDown={this.handleKeyDown}
                role='button'>
                <Trans i18nKey='LOYALTY_CAPTURE_SKIP'/>
              </SkipButton>
            </SkipButtonParent>
            <CloseButton children='&#10005;' role='button'
              aria-label={i18n.t('EXIT_DIALOG')} tabIndex={0} onClick={this.onClickClose}
            />
          </ModalContainer>
        </Flex>}
      </Fragment>
    );
  }
}

export default LoyaltyCapture;
