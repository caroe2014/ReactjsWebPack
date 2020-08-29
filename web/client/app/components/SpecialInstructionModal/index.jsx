// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import IconButton from 'web/client/app/components/IconButton';
import SpecialInstructionInput from 'web/client/app/components/SpecialInstructionInput';
import i18n from 'web/client/i18n';
import Announcements from 'web/client/app/components/Announcements';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1200;
  width: 420px;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border-radius: 0px; height: 100%`};
  display: flex;
  flex-direction: column;
`;

const ModalBackground = styled(Fixed)`
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1200;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  opacity: 1;
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const ModalTitle = styled(Heading)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1em;
  font-weight: bold;
  text-align: left;
  padding: 15px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
const ItemPrice = styled(Text)`
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1em;
  font-weight: bold;
  text-align: left;
  padding: 0px 15px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalFooter = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
  ${props => props.theme.mediaBreakpoints.desktop`
    border-top: 0.5px solid lightgrey;
    padding: 5px 0px;
  `};
  ${props => props.theme.mediaBreakpoints.tablet`
    border-top: 0.5px solid lightgrey;
    padding: 5px 0px;
  `};
  ${props => props.theme.mediaBreakpoints.mobile`
    border: none;
  `};
  
`;

const MainButton = styled(props => <PrimaryButton {...props} />)`
border-radius: 6px;
font-size: 0.8rem;
  margin: 10px auto;
  padding: 10px 0;
  text-align: center;
  width: 75%;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  color: ${props => props.theme.colors.textGrey};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: bold;
  padding: 5px;
  margin: 0px !important;
  position: absolute;
  top: 5px;
  right: 10px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class SpecialInstructionModal extends Component {
  constructor (props) {
    super(props);
    this.specialInstructionInput = this.specialInstructionInput.bind(this);
    this.onAddToCart = this.onAddToCart.bind(this);
    this.state = {
      splInstruction: ''
    };
  }
  specialInstructionInput (splInstructionstext) {
    this.setState({ splInstruction: splInstructionstext });
  }

  onAddToCart () {
    const { splInstruction } = this.state;
    if (splInstruction !== undefined) {
      this.props.handleSplInstruction && this.props.handleSplInstruction(splInstruction);
    }
  }

  componentDidMount () {
    document.getElementById('spl-ins-title') &&
      document.getElementById('spl-ins-title').focus();
  }

  render () {
    const { headerText, open, instructionText, characterLimit, title, itemPrice,
      continueButtonText, onClose, showClose, onEscape } = this.props;
    return (
      <React.Fragment>
        {open && (
          <Flex id='special-instruction-modal'>
            <ModalBackground />
            <ModalContainer className='modal-container' role='dialog' onKeyDown={onEscape}>
              {(headerText || i18n.t('SPECIAL_INSTRUCTION_HEADER')) &&
              <Announcements message={headerText || i18n.t('SPECIAL_INSTRUCTION_HEADER')}/>}
              <ModalTitle className='modal-title' id='spl-ins-title'
                tabIndex={0} aria-label={title}>{title}</ModalTitle>
              <ItemPrice tabIndex={0} aria-label={itemPrice} >{itemPrice}</ItemPrice>
              <SpecialInstructionInput
                headerText={headerText}
                instructionText={instructionText}
                characterLimit={characterLimit}
                handleSplInstruction={this.specialInstructionInput}
              />
              <ModalFooter className='modal-footer'>
                <MainButton
                  className='modal-continue-button'
                  onClick={this.onAddToCart}
                  tabIndex={0}
                  ariaLabel={continueButtonText}>
                  {continueButtonText}
                </MainButton>
              </ModalFooter>
              {showClose &&
              <CloseButton
                className='close-button'
                children='&#10005;'
                tabIndex={0}
                aria-label={i18n.t('EXIT_DIALOG')}
                onClick={onClose} />
              }
            </ModalContainer>
          </Flex>
        )}
      </React.Fragment>
    );
  }
}

SpecialInstructionModal.propTypes = {
  open: PropTypes.bool,
  continueButtonText: PropTypes.string.isRequired,
  title: PropTypes.string,
  headerText: PropTypes.string.isRequired,
  instructionText: PropTypes.string,
  showClose: PropTypes.bool
};

export default SpecialInstructionModal;
