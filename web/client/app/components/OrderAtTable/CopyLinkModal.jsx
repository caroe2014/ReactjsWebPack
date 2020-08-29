// Copyright © 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { ModalContainer, ModalBackground, ModalTitle, ModalText,
  CloseButton } from 'web/client/app/components/ModalComponents';
import React, { PureComponent } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';
import i18n from 'web/client/i18n';
import { Trans } from 'react-i18next';
import PrimaryButton from 'web/client/app/components/PrimaryButton';
import SnackBar from 'web/client/app/components/SnackBar';

const ParentContainer = styled(Flex)`
  .modal-title {
    margin-top: 35px;
  }
  .modal-container {
    justify-content: start;
    min-height: 325px;
    ${props => props.theme.mediaBreakpoints.mobile`min-height: 100%;`};
  }
  .instruction-text {
    padding: 0 20px;
  }
  .snack-bar {
    position: relative;
    min-width: 85%;
    width: 85%;
    margin: 20px auto;
  }
  .snack-bar .child-container{
    background-color: ${props => props.theme.colors.buttonControlColor};
    color: ${props => props.theme.colors.buttonTextColor};
  }
`;

const ButtonGroup = styled(Flex)`
  align-items: center;
  flex-direction: column;
  margin-top: 35px;
  margin-bottom: 20px;
  & > button {
    padding: 0px;
    height: 40px;
    font-size: 16px;
    width: 85%;
  }

`;

class CopyLinkModal extends PureComponent {
  snackbarRef = React.createRef();
  constructor (props) {
    super(props);
    this.onCopyLink = this.onCopyLink.bind(this);
  }
  onCopyLink () {
    this.textArea.type = 'text';
    this.textArea.select();
    document.execCommand('copy');
    this.textArea.type = 'hidden';
    this.showSnackbarHandler(i18n.t('COPY_LINK_MESSAGE'));
  }
  showSnackbarHandler (message) {
    this.snackbarRef && this.snackbarRef.current.openSnackBar(message);
  }
  render () {
    return (
      <ParentContainer id='copy-link-modal' role='dialog'>
        <ModalBackground />
        <ModalContainer className='modal-container'>
          <ModalTitle className='modal-title' tabIndex={0} id='invalid-guid-title'
            aria-label={i18n.t('OAAT_COPY_LINK_HEADER')}>
            <Trans i18nKey='OAAT_COPY_LINK_HEADER'/>
          </ModalTitle>
          <ModalText className='instruction-text' tabIndex={0}
            aria-label={i18n.t('OAAT_COPY_LINK_INSTRUCTION_TEXT')}>
            <Trans i18nKey='OAAT_COPY_LINK_INSTRUCTION_TEXT'/>
          </ModalText>

          <input type='hidden'
            ref={(textarea) => { this.textArea = textarea; }}
            value={this.props.linkAddress}
          />

          <ButtonGroup>
            <PrimaryButton
              classContext='copy-link-button'
              className='copy-link-button'
              onClick={this.onCopyLink}
            >
              <Trans i18nKey='OAAT_COPY_LINK_BUTTON_TEXT'/>
            </PrimaryButton>
          </ButtonGroup>
          <SnackBar ref={this.snackbarRef}
            displayPosition={'absolute'} bottom={'0'}/>
          <CloseButton children='&#10005;'
            onClick={this.props.toggleMultiPassCopyLink}
            aria-label={i18n.t('EXIT_DIALOG')}
            role='button'
          />
        </ModalContainer>
      </ParentContainer>
    );
  }
}

export default CopyLinkModal;
