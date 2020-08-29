// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import theme from 'web/client/theme';
import {ThemeProvider} from 'styled-components';
import SmsNotification from 'web/client/app/components/SmsNotification';
import { setMobileNumber } from 'web/client/app/modules/smsnotification/sagas';
import BaseOrderProperties from 'web/client/app/components/BaseOrderProperties';
import get from 'lodash.get';
import { getDeliveryEnabled } from 'web/client/app/utils/LocationUtils';

class SmsNotificationPage extends Component {

  constructor (props) {
    super(props);
    this.onContinuePay = this.onContinuePay.bind(this);
  }

  onContinuePay (mobileNumber, regionCode) {
    const { setMobileNumber, history } = this.props;
    setMobileNumber(mobileNumber, regionCode);
    const deliveryEnabled = getDeliveryEnabled(this.props.orderConfig);
    history.push(deliveryEnabled ? '/deliveryLocation' : '/payment');
  }

  render () {
    const deliveryEnabled = getDeliveryEnabled(this.props.orderConfig);
    const {history, mobileNumber, isMobileNumberRequired, smsInstructionText, smsHeaderText, countryCode,
      regionCode, countryCodeList, selectedCountry} = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <SmsNotification
            history={history}
            mobileNumber={mobileNumber}
            isMobileNumberRequired={isMobileNumberRequired}
            smsInstructionText={smsInstructionText}
            smsHeaderText={smsHeaderText}
            onContinuePay={this.onContinuePay}
            deliveryDestination={deliveryEnabled}
            countryCode={countryCode}
            regionCode={regionCode}
            countryCodeList={countryCodeList}
            selectedCountry={selectedCountry}
          />
        </Fragment>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isMobileNumberRequired: get(state.sites.orderConfig, 'sms.isMobileNumberRequired'),
  smsInstructionText: get(state.sites.orderConfig, 'sms.smsInstructionText'),
  smsHeaderText: get(state.sites.orderConfig, 'sms.smsHeaderText'),
  countryCode: get(state.sites.orderConfig, 'sms.countryCode'),
  regionCode: get(state.sites.orderConfig, 'sms.regionCode'),
  countryCodeList: get(state.sites.orderConfig, 'sms.countryCodeList'),
  deliveryDestination: get(state.sites.orderConfig, 'deliveryDestination.deliverToDestinationEnabled'), // eslint-disable-line max-len
  mobileNumber: state.smsnotification.mobileNumber,
  selectedCountry: state.smsnotification.selectedCountry,
  orderConfig: state.sites.orderConfig,
  _props: props
});

const mapDispatchToProps = (dispatch) => ({
  setMobileNumber: (mobileNumber, selectedCountry) => dispatch(setMobileNumber(mobileNumber, selectedCountry))
});

export default BaseOrderProperties(connect(mapStateToProps, mapDispatchToProps)(SmsNotificationPage))({isSms: true}); // eslint-disable-line max-len
