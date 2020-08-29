// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'web/client/app/components/Modal';
import { clearAppError, setTimeoutFlag } from 'web/client/app/modules/error/sagas';
import i18n from 'web/client/i18n';

class ErrorMessage extends Component {
  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  handleClose () {
    this.makeEverythingAccessible();
    if (this.props.goBackFlag) {
      this.props.history.goBack();
    } else if (this.props.sessionExpired) {
      this.props.history.push('/logout');
      this.props.setTimeoutFlag();
    }
    this.props.clearAppError();
  }

  makeEverythingAccessible () {
    // Accessibility for dialog
    const parent = document.querySelector('.parent');
    const children = parent.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'parent-modal') {
        child.inert = false;
      }
    });
  }

  onEscape (e) {
    if (e.which === 27) {
      this.handleClose();
    }
  }

  render () {
    const { showError, errorMessage, title, errorMessageKey, dynamicKey } = this.props;
    return (
      <Modal
        open={showError}
        showCancelButton={false}
        onCancel={this.handleClose}
        onContinue={this.handleClose}
        onEscape={this.onEscape}
        continueButtonText={i18n.t('ERROR_MESSAGE_GOT_IT')}
        title={title || i18n.t('ERROR_MESSAGE_OOPS')}
        textI18nKey={errorMessageKey}
        dynamicKey={dynamicKey}
        text={errorMessage ? errorMessage.message : i18n.t('ERROR_MESSAGE_OOPS')} // eslint-disable-line max-len
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  showError: state.error.showError,
  errorMessage: state.error.errorMessage,
  title: state.error.title,
  errorMessageKey: state.error.errorMessageKey,
  redirect: state.error.redirect,
  goBackFlag: state.error.goBackFlag,
  dynamicKey: state.error.dynamicKey,
  sessionExpired: state.error.sessionExpired,
  _props: props
});

const mapDispatchToProps = (dispatch, props) => ({
  clearAppError: () => {
    dispatch(clearAppError());
  },
  setTimeoutFlag: () => dispatch(setTimeoutFlag())
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorMessage);
