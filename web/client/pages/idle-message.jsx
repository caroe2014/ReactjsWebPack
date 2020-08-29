// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'web/client/app/components/Modal';
import { clearIdleFlags } from 'web/client/app/modules/error/sagas';
import i18n from 'web/client/i18n';

class IdleMessage extends Component {
  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }

  componentDidUpdate (prevProps) {
    if (prevProps.showTimeout && !this.props.showTimeout) {
      this.makeEverythingAccessible();
    }
  }

  handleClose () {
    const { showTimeout, clearIdleFlags, history } = this.props;
    // clear idle and timeout flags
    this.makeEverythingAccessible();
    clearIdleFlags();
    if (showTimeout) {
      // redirect to siteList and reload fresh data
      history.replace('/');
      window.location.reload();
    }
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
    const { showIdle, showTimeout } = this.props;
    return (
      <React.Fragment>
        <Modal
          open={showIdle && !showTimeout}
          showCancelButton={false}
          onCancel={this.handleClose}
          onContinue={this.handleClose}
          onEscape={this.onEscape}
          continueButtonText={i18n.t('IDLE_MESSAGE_STILL_HERE')}
          title={i18n.t('IDLE_MESSAGE_INACTIVITY_WARNING')}
          text={i18n.t('IDLE_MESSAGE_ARE_YOU_STILL_THERE')} // eslint-disable-line max-len
        />
        <Modal
          open={showTimeout}
          showCancelButton={false}
          onCancel={this.handleClose}
          onEscape={this.onEscape}
          onContinue={this.handleClose}
          continueButtonText={i18n.t('IDLE_MESSAGE_REFRESH')}
          title={i18n.t('IDLE_MESSAGE_SESSION_EXPIRED')}
          text={i18n.t('IDLE_MESSAGE_REFRESH_TO_CONTINUE')} // eslint-disable-line max-len
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  showError: state.error.showError,
  showIdle: state.error.idleFlag,
  showTimeout: state.error.timeoutFlag,
  _props: props
});

const mapDispatchToProps = (dispatch, props) => ({
  clearIdleFlags: () => {
    dispatch(clearIdleFlags());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(IdleMessage);
