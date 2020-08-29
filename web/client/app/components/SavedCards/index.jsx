// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text, Card } from 'rebass';
import IconButton from 'web/client/app/components/IconButton';
import { Trans } from 'react-i18next';
import { LoadingComponent } from 'web/client/app/components/Loader/ReusableLoader';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1101;
  width: 420px;
  padding: 15px;
  max-height: 400px;
  ${props => props.theme.mediaBreakpoints.mobile`
  width: 100%;
  border-radius: 0px; height: 100%
  max-height: 100%;`};
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

const ModalTitle = styled(Heading)`
  margin: 20px 20px 25px;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1.5em;
  font-weight: 500;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const GuestIcon = styled(Flex)`
  font-size: 2em;
  text-align: center;
  width: 100%;
  margin-top: 24px;
  justify-content: center;
  color: ${props => {
    if (props.theme.colors.primaryTextColor) return `${props.theme.colors.primaryTextColor}`;
    return 'transparent';
  }};
`;

const ModalContent = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  padding: 20px;
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

const CardView = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between
  width: 100%;
  margin-bottom: 10px;
`;

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  padding: 0px 20px 0px 5px;
  width: auto;
  ::first-letter {
    text-transform: uppercase;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.validationError};
  font-size: 12px;
  padding: 0px 20px 0px 20px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const LoadingContainer = styled(Flex)`
  position: absolute;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

class SavedCards extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.onClickClose = this.onClickClose.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      document.getElementById('saved-card-title') && document.getElementById('saved-card-title').focus();
    }
  }

  onClickClose () {
    this.props.onCancel();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  render () {
    const { open, deletingCard, deleteCardError, cardInfo, onDelete } = this.props;
    return (
      <React.Fragment>
        {open && (

          <Flex id='saved-card'>
            <ModalBackground className='guest-profile-modal-background'/>
            <ModalContainer className='guest-profile-modal-parent' role='dialog' onKeyDown={this.onEscape}>
              {deletingCard &&
                <Announcements message={i18n.t('PROCESSING_TEXT')} />}
              <GuestIcon className='guest-icon'>
                <i className='fa fa-credit-card' />
              </GuestIcon>
              <ModalTitle className='modal-title' id='saved-card-title'
                tabIndex={0} aria-label={i18n.t('PROFILE_SAVE_CARDS')}>
                <Trans i18nKey='PROFILE_SAVE_CARDS'/>
              </ModalTitle>
              {deleteCardError &&
              <ErrorText aria-live='polite' tabIndex={0} aria-label={i18n.t('PROFILE_DELETE_SAVED_CARDS')}>
                <Trans i18nKey='PROFILE_DELETE_SAVED_CARDS'/>
              </ErrorText>}
              <ModalContent className='modal-content'>
                {
                  cardInfo && cardInfo.length > 0 &&
                  cardInfo.map((card, index) => (
                    <React.Fragment key={`account-${index}`}>
                      <CardView>
                        <StyledText tabIndex={0}
                          aria-label={`${card.cardIssuer} ${i18n.t('PROFILE_SAVED_CARD_ENDING_TEXT')} ${card.id}`}>
                          {`${card.cardIssuer} ${i18n.t('PROFILE_SAVED_CARD_ENDING_TEXT')} ${card.id}`}
                        </StyledText>
                        <DeleteButton
                          aria-label={i18n.t('DELETE_CARD')}
                          tabIndex={0}
                          role='button'
                          classContext={`cart-delete-${index + 1}`}
                          className={`cart-delete-btn-${index + 1}`}
                          iconClassName='fa fa-trash'
                          onClick={() => { onDelete(card.uniqueId); }}
                        />
                      </CardView>
                    </React.Fragment>
                  ))}
                {
                  (!cardInfo || cardInfo.length === 0) &&
                  <StyledText tabIndex={0} aria-label={i18n.t('PROFILE_NO_CARDS_AVAILABLE')}>
                    <Trans i18nKey='PROFILE_NO_CARDS_AVAILABLE'/></StyledText>
                }
              </ModalContent>
              { deletingCard &&
                <LoadingContainer>
                  <LoadingComponent
                    color='#ababab'
                    containerHeight='100%'
                    containerWidth='100%'
                    aria-label={i18n.t('PROCESSING_TEXT')}
                    height='40px'
                    width='40px'
                    borderSize={4}
                    style={{ justifyContent: 'center', height: '60px' }}
                  />
                </LoadingContainer>}
              <CloseButton children='&#10005;' role='button' tabIndex={0}
                aria-label={i18n.t('EXIT_DIALOG')} onClick={this.onClickClose} />
            </ModalContainer>
          </Flex>
        )}
      </React.Fragment>
    );
  };
}

export default SavedCards;
