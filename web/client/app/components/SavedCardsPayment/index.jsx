// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text, Button } from 'rebass';
import IconButton from 'web/client/app/components/IconButton';
import { Trans } from 'react-i18next';
import RadioButton from 'web/client/app/components/RadioButton';
import i18n from 'web/client/i18n';

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
  margin: 20px 20px 0px;
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
  margin-top: 36px;
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

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  padding: 0px 20px 0px 5px;
  width: auto;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const RadioButtonContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 20px 20px 0px;
  .input-field-wrapper .input-text {
    border-bottom: 1px solid #7d7d7d;
  }
  .input-field-wrapper {
    margin-bottom: 0px;
  }
  .radio-o {
    font-size: 20px;
    color: ${props => props.theme.colors.buttonControlColor} !important;
  }
`;

const ModalFooter = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  padding: 20px 20px 0px;
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.colors.buttonControlColor};
  border-radius: 0;
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  padding: 20px;
  text-transform: uppercase;
  width: 100%
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
`;

const AcceptButton = styled(props => <StyledButton {...props} />)`
  background-color: ${props => {
    if (props.selectedoption) return props.theme.colors.buttonControlColor;
    return '#D5D5D5';
  }};
  border-radius: 0;
  color: ${props => {
    if (props.selectedoption) return props.theme.colors.buttonTextColor;
    return '#FFFFFF';
  }};
  cursor: ${props => {
    if (props.selectedoption) return 'pointer';
    return 'default';
  }};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 500;
  padding: 20px;
  text-transform: uppercase;
  width: 100%
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 20px;
  padding: 15px 0;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class SavedCardsPayment extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.checkSelected = this.checkSelected.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.proceedWithPay = this.proceedWithPay.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      document.getElementById('saved-card-modal-title') && document.getElementById('saved-card-modal-title').focus();
    }
  }

  checkSelected (type) {
    const card = this.props.cardInfo.find(item => item.uniqueId === type);
    this.setState({ selectedOption: card });
  }

  onClickClose () {
    this.props.onCancel();
  }

  proceedWithPay () {
    const selectedCard = this.state.selectedOption;
    const tokenData = {
      uniqueId: selectedCard.uniqueId,
      ond_token: this.props.ondToken,
      paymentDetails: {
        'amount': `${this.props.order.taxIncludedTotalAmount.amount}`,
        'taxAmount': `${this.props.order.subTotalTaxAmount.amount}`,
        'invoiceId': `${this.props.order.orderNumber}`,
        'billDate': `${this.props.order.created}`,
        'transactionAmount': `${this.props.order.taxIncludedTotalAmount.amount}`,
        'tipAmount': `${this.props.tipAmount ? this.props.tipAmount : '0.00'}`,
        'cardEnding': `${(selectedCard.cardIssuer)} ${i18n.t('PROFILE_SAVED_CARD_ENDING_TEXT')} ${selectedCard.id}`,
        'cardHolderName': '',
        'expirationYearMonth': '',
        'cardIssuer': '',
        'multiPaymentAmount': this.props.multiPaymentEnabled && (this.props.remaining || this.props.totalWithTip)
      }
    };
    this.props.selectedCard(tokenData);
    this.props.onCancel();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  render () {
    const { open, cardInfo } = this.props;
    const { selectedOption } = this.state;
    return (
      open && (
        <Flex id='saved-card-modal' role='dialog'>
          <ModalBackground className='saved-card-payment-modal-background'/>
          <ModalContainer className='saved-card-payment-modal-parent' onKeyDown={this.onEscape}>
            <GuestIcon className='saved-card-icon'>
              <i className='fa fa-credit-card' />
            </GuestIcon>
            <ModalTitle className='modal-title' id='saved-card-modal-title'
              tabIndex={0} aria-label={i18n.t('PROFILE_SAVE_CARDS')}>
              <Trans i18nKey='PROFILE_SAVE_CARDS'/>
            </ModalTitle>
            <ModalContent className='modal-content'>
              {
                (!cardInfo || cardInfo.length === 0) &&
                <StyledText tabIndex={0} aria-label={i18n.t('PROFILE_NO_CARDS_AVAILABLE')}>
                  <Trans i18nKey='PROFILE_NO_CARDS_AVAILABLE'/></StyledText>
              }
              {cardInfo && cardInfo.length > 0 &&
              <RadioButtonContainer role='radiogroup' className='payment-saved-cards-radio-div'>
                {
                  cardInfo.map((card, index) => (
                    <React.Fragment key={`account-${index}`}>
                      <RadioButton
                        classDesc={`${card.uniqueId}`}
                        className={`${card.uniqueId}-radio`}
                        label={`${(card.cardIssuer)} ${i18n.t('PROFILE_SAVED_CARD_ENDING_TEXT')} ${card.id}`}
                        capacityText
                        ariaLabel={`${(card.cardIssuer)} ${i18n.t('PROFILE_SAVED_CARD_ENDING_TEXT')} ${card.id}`}
                        tabIndex={0}
                        type={card.uniqueId}
                        selectedOption={this.checkSelected}
                        selected={selectedOption && selectedOption.uniqueId === card.uniqueId}
                      />
                    </React.Fragment>
                  ))}
              </RadioButtonContainer> }
              <ModalFooter className='modal-footer'>
                <AcceptButton
                  onClick={this.proceedWithPay}
                  selectedoption={selectedOption}
                  tabIndex={selectedOption ? 0 : -1}
                  aria-label={i18n.t('SAVED_CARD_PROCEED_PAY')}
                >
                  <Trans i18nKey='SAVED_CARD_PROCEED_PAY'/>
                </AcceptButton>
              </ModalFooter>
            </ModalContent>
            <CloseButton children='&#10005;' role='button'
              aria-label={i18n.t('EXIT_DIALOG')} tabIndex={0} onClick={this.onClickClose} />
          </ModalContainer>
        </Flex>
      )
    );
  };
}

export default SavedCardsPayment;
