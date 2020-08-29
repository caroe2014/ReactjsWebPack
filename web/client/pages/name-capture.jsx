
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import theme from 'web/client/theme';
import {ThemeProvider} from 'styled-components';
import NameCapture from 'web/client/app/components/NameCapture';
import { setNameDetails } from 'web/client/app/modules/namecapture/sagas';
import { setPlatformProfileNameDetails } from 'web/client/app/modules/platformGuestProfile/sagas';
import BaseOrderProperties from 'web/client/app/components/BaseOrderProperties';
import get from 'lodash.get';
import { getDeliveryEnabled } from 'web/client/app/utils/LocationUtils';

class NameCapturePage extends Component {

  constructor (props) {
    super(props);
    this.onContinuePay = this.onContinuePay.bind(this);
  }

  onContinuePay (firstName, lastInitial) {
    const { setNameDetails, setPlatformProfileNameDetails, isSmsEnabled, history, orderConfig } = this.props;
    setNameDetails(firstName, lastInitial);
    const guestProfileEnabled = get(orderConfig, 'platformGuestProfileConfig.enabled');
    if (guestProfileEnabled) {
      setPlatformProfileNameDetails(firstName, lastInitial);
    }
    history.push(isSmsEnabled ? '/smsNotification' : '/deliveryLocation');
  }

  render () {
    const deliveryEnabled = getDeliveryEnabled(this.props.orderConfig);
    const {history, firstName, lastInitial,
      isNameCaptureRequired, nameInstructionText, isSmsEnabled, getAliasName } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <NameCapture
            history={history}
            firstName={firstName}
            lastInitial={lastInitial}
            isNameCaptureRequired={isNameCaptureRequired}
            nameInstructionText={nameInstructionText}
            onContinuePay={this.onContinuePay}
            isSmsEnabled={isSmsEnabled}
            deliveryEnabled={deliveryEnabled}
            getAliasName={getAliasName} />
        </Fragment>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isNameCaptureRequired: get(state.sites.orderConfig, 'nameCapture.guestNameRequired'),
  nameInstructionText: get(state.sites.orderConfig, 'nameCapture.guestNameInstructionText'),
  getAliasName: get(state.sites.orderConfig, 'aliasNameCaptureEnabled', false),
  isSmsEnabled: get(state.sites.orderConfig, 'sms.isSmsEnabled'),
  firstName: state.namecapture.firstName,
  lastInitial: state.namecapture.lastInitial,
  orderConfig: state.sites.orderConfig,
  _props: props
});

const mapDispatchToProps = (dispatch) => ({
  setNameDetails: (firstName, lastInitial) => dispatch(setNameDetails(firstName, lastInitial)),
  setPlatformProfileNameDetails: (firstName, lastInitial) => dispatch(setPlatformProfileNameDetails(firstName, lastInitial)) // eslint-disable-line max-len
});

export default BaseOrderProperties(connect(mapStateToProps, mapDispatchToProps)(NameCapturePage))({isName: true}); // eslint-disable-line max-len
