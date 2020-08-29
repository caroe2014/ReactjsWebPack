// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text } from 'rebass';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import SecondaryButton from 'web/client/app/components/SecondaryButton';
import IconButton from 'web/client/app/components/IconButton';
import i18n from 'web/client/i18n';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1200;
  width: 420px;
  padding: 15px;
  ${props => props.theme.mediaBreakpoints.mobile`
    ${props => { return props.menuChangePopup ? `width: 100%; height: 100%;` : 'width: 300px;'; }};
`};
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
  margin: 38px 0 30px;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1.5em;
  font-weight: 300;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 1em;
  text-align: center;
  padding: 0px 10px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalFooter = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  margin-top: 35px;
  ${props => {
    return props.menuChangePopup && `
    flex-direction: column;
    align-items: center;
    width: 100%;
    .modal-cancel-button, .modal-continue-button {
      width: 80%;
      background-color: ${props.theme.colors.buttonControlColor};
      color: ${props.theme.colors.buttonTextColor};
      margin-bottom: 10px;
    }
  `;
  }};
`;

const MainButton = styled(props => <PrimaryButton {...props} />)`
  border-radius: 4px;
  font-size: 0.8rem;
  margin: 5px;
  padding: 15px 0;
  text-align: center;
  width: 140px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CancelButton = styled(props => <SecondaryButton {...props} />)`
  border-radius: 4px;
  font-size: 0.8rem;
  margin: 5px;
  padding: 15px 0;
  text-align: center;
  width: 140px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const CloseButton = styled(props => <IconButton {...props} />)`
  color: ${props => props.theme.colors.textGrey};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: 300;
  position: absolute;
  top: 16px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

class Modal extends Component {

  constructor (props) {
    super(props);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      this.makeDialogAloneAccessible();
      document.getElementById('modal-title') && document.getElementById('modal-title').focus();
    }
  }

  makeDialogAloneAccessible () {
    // Accessibility for dialog
    const parent = document.querySelector('.parent');
    const children = parent.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'parent-modal') {
        child.inert = true;
      }
    });
  }

  onContinue () {
    this.props.onContinue(this.props.modalName);
  }

  render () {
    const { open, onEscape, title, textI18nKey, dynamicKey, text, showCancelButton, onCancel, cancelButtonText,
      continueButtonText, showClose, onClose, menuChangePopup } = this.props;
    return (
      <React.Fragment>
        {open && (
          <Flex id='parent-modal' role='alert'>
            <ModalBackground />
            <ModalContainer className='modal-container' onKeyDown={onEscape} menuChangePopup={menuChangePopup}>
              <ModalTitle className='modal-title' tabIndex={0} id='modal-title'
                aria-label={title}>{title}</ModalTitle>
              <ModalText className='modal-content'>
                {textI18nKey ? i18n.t(textI18nKey, dynamicKey).split('\n').map((item, i) => (
                  <Text className='modal-text' key={i} tabIndex={0} aria-label={item}>{item}</Text>
                ))
                  : text.split('\n').map((item, i) => (
                    <Text key={i} tabIndex={0} aria-label={item}>{item}</Text>
                  ))}
              </ModalText>
              <ModalFooter className='modal-footer' menuChangePopup={menuChangePopup}>
                {showCancelButton && (
                  <CancelButton
                    className='modal-cancel-button'
                    onClick={onCancel}
                    tabIndex={0}
                    aria-label={cancelButtonText}>
                    {cancelButtonText}
                  </CancelButton>
                )}
                <MainButton
                  className='modal-continue-button'
                  onClick={this.onContinue}
                  tabIndex={0}
                  ariaLabel={continueButtonText}>
                  {continueButtonText}
                </MainButton>
              </ModalFooter>
              {showClose &&
              <CloseButton className='close-button' tabIndex={0}
                aria-label={i18n.t('EXIT_ALERT')} children='&#10005;' onClick={onClose || onCancel} />
              }
            </ModalContainer>
          </Flex>
        )}
      </React.Fragment>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool,
  continueButtonText: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
  showCancelButton: PropTypes.bool,
  onContinue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  text: PropTypes.string
};

export default Modal;
