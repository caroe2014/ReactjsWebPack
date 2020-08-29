// Copyright © 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { ModalContainer, ModalBackground, ModalTitle, ModalText } from 'web/client/app/components/ModalComponents';
import React, { PureComponent } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';
import i18n from 'web/client/i18n';
import { Trans } from 'react-i18next';

const ParentContainer = styled(Flex)`
  .modal-container {
    justify-content: start;
    min-height: 300px;
    ${props => props.theme.mediaBreakpoints.mobile`min-height: 100%;`};
  }
`;

class InvalidOrderGuidModal extends PureComponent {
  render () {
    const { invalidScreen } = this.props;
    return (
      <ParentContainer id='invalid-guid-modal' role='dialog'>
        <ModalBackground />
        <ModalContainer className='modal-container'>
          <ModalTitle className='modal-title' tabIndex={0} id='invalid-guid-title'
            aria-label={invalidScreen.headerText || i18n.t('OAAT_INVALID_SCREEN_HEADER')}>
            {invalidScreen.headerText || <Trans i18nKey='OAAT_INVALID_SCREEN_HEADER'/>}
          </ModalTitle>
          <ModalText className='instruction-text' tabIndex={0}
            aria-label={invalidScreen.instructionText || i18n.t('OAAT_INVALID_SCREEN_INSTRUCTION_TEXT')}>
            {invalidScreen.instructionText || <Trans i18nKey='OAAT_INVALID_SCREEN_INSTRUCTION_TEXT'/>}
          </ModalText>
        </ModalContainer>
      </ParentContainer>
    );
  }
}

export default InvalidOrderGuidModal;
