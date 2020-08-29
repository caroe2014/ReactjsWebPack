// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import styled from 'styled-components';
import LoyaltyActivity from 'web/client/app/components/LoyaltyActivity';

import IconButton from 'web/client/app/components/IconButton';
import { Flex, Text, Modal as ModalWindow } from 'rebass';
import { Trans } from 'react-i18next';
import i18n from 'web/client/i18n';
import { ModalBackground } from 'web/client/app/components/ModalComponents';

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
`;

const CancelButton = styled(Text)`
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

class LoyaltyPaymentModal extends Component {
  constructor (props) {
    super(props);

    this.handleLoyaltyInfo = this.handleLoyaltyInfo.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  handleLoyaltyInfo (loyaltyInfo, selectedOption) {
    const { siteId, displayProfileId, sendLoyaltyInquiry } = this.props;
    sendLoyaltyInquiry(loyaltyInfo, selectedOption, siteId, displayProfileId);
  }

  onClickClose () {
    this.props.closeModal();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  render () {
    const { loyaltyDetails } = this.props;
    return (
      <Flex className='container-parent' id='loyalty-modal' onKeyDown={this.onEscape}>
        <ModalBackground className='guest-profile-modal-background'/>
        <ModalContainer className='loyalty-container' role='dialog'>
          <LoyaltyActivity
            handleLoyaltyInfo={this.handleLoyaltyInfo}
            loyaltyDetails={loyaltyDetails}
            loyaltyDetailsAccounts={loyaltyDetails && loyaltyDetails.loyaltyDetailsAccounts}
            {...this.props}
          />
          <SkipButtonParent>
            <CancelButton className='cancel-button' tabIndex={0} role='button'
              aria-label={i18n.t('MODAL_CANCEL')} onClick={this.onClickClose}>
              <Trans i18nKey='MODAL_CANCEL'/>
            </CancelButton>
          </SkipButtonParent>
          <CloseButton children='&#10005;' tabIndex={0} role='button' aria-label={i18n.t('EXIT_DIALOG')}
            onClick={this.onClickClose} />
        </ModalContainer>
      </Flex>
    );
  }
}

export default LoyaltyPaymentModal;
