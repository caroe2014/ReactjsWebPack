// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* istanbul ignore file */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal as ModalWindow, Flex, Fixed, Heading, Text, Button } from 'rebass';
import IconButton from 'web/client/app/components/IconButton';
import { Trans } from 'react-i18next';
import get from 'lodash.get';
import i18n from 'web/client/i18n';

const ModalContainer = styled(ModalWindow)`
  border-radius: 4px;
  z-index: 1101;
  width: 420px;
  padding: 15px;
  ${props => props.theme.mediaBreakpoints.mobile`width: 100%; border-radius: 0px; height: 100%`};
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
  margin: 48px 20px 25px;
  color: ${props => props.theme.colors.primaryTextColor};
  font-size: 1.5em;
  font-weight: 500;
  text-align: center;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalText = styled(Text)`
  color: ${props => props.theme.colors.secondaryTextColor};
  font-size: 14px;
  text-align: center;
  padding: 0px 40px 16px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ModalFooter = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  padding: 24px 40px 0px;
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.colors.buttonControlColor};
  border-radius: 0;
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  padding: 20px;
  text-transform: uppercase;
  font-size: 16px;
  width: 100%
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;
  }
`;

const AcceptButton = styled(props => <StyledButton {...props} />)`
  background-color: ${props => {
    if (props.login_Color) return props.login_Color;
    return props.theme.colors.buttonControlColor;
  }};
  border-radius: 0;
  color: ${props => {
    if (props.selectedoption) return props.theme.colors.buttonTextColor;
    return '#FFFFFF';
  }};
  cursor: ${props => {
    if (props.login_method) return 'pointer';
    return 'default';
  }};
  font-size: 16px;
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

const ContinueButton = styled(props => <StyledButton {...props} />)`
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 20px;
  padding: 12px 0;
  text-align: center;
  width: 100%;
  text-transform: uppercase;
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
  top: 15px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const defaultButtonMap = {
  facebook: {
    'text': 'GUEST_PROFILE_LOGIN_FB_TEXT',
    'color': '#3b5998'
  },
  google: {
    'text': 'GUEST_PROFILE_LOGIN_GOOGLE_TEXT',
    'color': '#df4930'
  }
};

class GuestProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.checkSelected = this.checkSelected.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.open && this.props.open) {
      this.makeDialogAloneAccessible();
      document.getElementById('guest-profile-title') && document.getElementById('guest-profile-title').focus();
    } else if (prevProps.open && !this.props.open) {
      this.onClickClose();
    }
  }

  checkSelected (option) {
    this.props.selectedLoginMethod(option);
  }

  onClickClose () {
    this.props.onCancel();
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onClickClose();
    }
  }

  makeDialogAloneAccessible () {
    const parent = document.querySelector('.parent');
    const children = parent.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'guest-login-modal') {
        child.inert = true;
      }
    });
  }

  getDisplayText () {
    const { profileConfig, authType } = this.props;
    if (authType === 'socialLogin') {
      return {
        titleText: (profileConfig && profileConfig.titleText) || <Trans i18nKey='GUEST_PROFILE_TITLE_TEXT'/>,
        instructionText: (profileConfig && profileConfig.loginMessage) || <Trans i18nKey='GUEST_PROFILE_LOGIN_MESSAGE'/>,
        skipButtonText: (profileConfig && profileConfig.skipButtonText) || <Trans i18nKey='GUEST_PROFILE_LOGIN_GUEST'/>
      };
    } else {
      return {
        titleText: (profileConfig && profileConfig.signIn && profileConfig.signIn.headerText) || <Trans i18nKey='GUEST_PROFILE_TITLE_TEXT_ATRIUM'/>,
        instructionText: (profileConfig && profileConfig.signIn && profileConfig.signIn.instructionText) || <Trans i18nKey='GUEST_PROFILE_LOGIN_MESSAGE_ATRIUM'/>,
        skipButtonText: (profileConfig && profileConfig.signIn && profileConfig.signIn.skipButtonText) || <Trans i18nKey='GUEST_PROFILE_LOGIN_GUEST_ATRIUM'/>
      };
    }
  }

  render () {
    const { profileConfig, open, authType } = this.props;
    const {titleText, instructionText, skipButtonText} = this.getDisplayText();
    return (
      <div className='login-modal' id='guest-login-modal' role='dialog' onKeyDown={this.onEscape}>
        {open && (
          <Flex className='container-parent'>
            <ModalBackground className='guest-profile-modal-background'/>
            <ModalContainer className='guest-profile-modal-parent'>
              <ModalTitle className='modal-title' tabIndex={0} id='guest-profile-title'
                aria-label={authType === 'socialLogin' ? (profileConfig && profileConfig.titleText) || i18n.t('GUEST_PROFILE_TITLE_TEXT')
                  : (profileConfig && profileConfig.signIn && profileConfig.signIn.headerText) || i18n.t('GUEST_PROFILE_TITLE_TEXT_ATRIUM')}>
                {titleText}
              </ModalTitle>
              <ModalText className='modal-text'
                tabIndex={0}
                aria-label={authType === 'socialLogin' ? (profileConfig && profileConfig.loginMessage) || i18n.t('GUEST_PROFILE_LOGIN_MESSAGE')
                  : (profileConfig && profileConfig.signIn && profileConfig.signIn.instructionText) || i18n.t('GUEST_PROFILE_LOGIN_MESSAGE_ATRIUM')}>
                {instructionText}
              </ModalText>
              <ModalFooter className='modal-footer'>
                {authType === 'socialLogin' &&
                  profileConfig && profileConfig.loginMethods &&
                  profileConfig.loginMethods.map((loginMethod, index) => (
                    <React.Fragment key={`account-${index}`}>
                      <AcceptButton
                        className={`login-btn-${loginMethod.name}`}
                        aria-label={(loginMethod.buttonTheme && loginMethod.buttonTheme.text) || i18n.t(defaultButtonMap[loginMethod.type].text)}
                        tabIndex={0}
                        login_method={loginMethod.type}
                        login_Color={(loginMethod.buttonTheme && loginMethod.buttonTheme.color) || defaultButtonMap[loginMethod.type].color}
                        role='button'
                        onClick={() => {
                          this.checkSelected(loginMethod);
                        }}
                      >
                        {(loginMethod.buttonTheme && loginMethod.buttonTheme.text) || i18n.t(defaultButtonMap[loginMethod.type].text)}
                      </AcceptButton>
                    </React.Fragment>
                  ))
                }
                {authType === 'atrium' &&
                  profileConfig && profileConfig.atriumKey &&
                  <React.Fragment key={`atrium-account`}>
                    <AcceptButton
                      className={`login-btn-atrium`}
                      aria-label={get(profileConfig, 'signIn.buttonText') || i18n.t('GUEST_PROFILE_TITLE_ATRIUM_ACCEPT')}
                      tabIndex={0}
                      login_method='atrium'
                      login_Color={get(profileConfig, 'signIn.buttonColor')}
                      onClick={() => {
                        this.checkSelected({type: 'atrium'});
                      }}
                    >
                      { get(profileConfig, 'signIn.buttonText') || <Trans i18nKey='GUEST_PROFILE_TITLE_ATRIUM_ACCEPT'/> }
                    </AcceptButton>
                  </React.Fragment>
                }
                {!this.props.hideGuestOption && <ContinueButton
                  className='continue-as-guest-btn'
                  aria-label={authType === 'socialLogin' ? (profileConfig && profileConfig.skipButtonText) || i18n.t('GUEST_PROFILE_LOGIN_GUEST')
                    : (profileConfig && profileConfig.signIn && profileConfig.signIn.skipButtonText) || i18n.t('GUEST_PROFILE_LOGIN_GUEST_ATRIUM')}
                  tabIndex={0}
                  role='button'
                  onClick={() => {
                    this.checkSelected({type: 'guest'});
                  }}
                >
                  {skipButtonText}
                </ContinueButton> }
              </ModalFooter>
              <CloseButton children='&#10005;' role='button' tabIndex={0}
                aria-label={i18n.t('EXIT_DIALOG')} onClick={this.onClickClose} />
            </ModalContainer>
          </Flex>
        )}
      </div>
    );
  };
}

export default GuestProfile;
