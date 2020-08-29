// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import theme from 'web/client/theme';
import { ThemeProvider } from 'styled-components';
import DeliveryLocation from 'web/client/app/components/DeliveryLocation';
import { resetDelivery, setDeliveryDetails, setDeliveryOption } from 'web/client/app/modules/deliverylocation/sagas';
import { shouldOptInProfile } from 'web/client/app/modules/platformGuestProfile/sagas';
import BaseOrderProperties from 'web/client/app/components/BaseOrderProperties';
import get from 'lodash.get';

class DeliveryLocationPage extends Component {

  constructor (props) {
    super(props);
    this.onContinuePay = this.onContinuePay.bind(this);
  }

  onContinuePay (deliveryDetails, kitchenString) {
    const { setDeliveryDetails, history } = this.props;
    setDeliveryDetails(deliveryDetails, kitchenString);
    history.push('/payment');
  }

  render () {
    const {deliveryDestination, deliveryDetails, resetDelivery, readyTime,
      kitchenString, orderConfig, scheduledTime, scheduledDay, deliveryOption,
      setDeliveryOption, shouldOptInProfile, history } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <DeliveryLocation
            className='delivery-location-parent'
            deliveryDestination={deliveryDestination}
            deliveryDetails={deliveryDetails}
            kitchenString={kitchenString}
            resetDelivery={resetDelivery}
            onContinuePay={this.onContinuePay}
            shouldOptInProfile={shouldOptInProfile}
            history={history}
            orderConfig={orderConfig}
            readyTime={readyTime}
            scheduledTime={scheduledTime}
            scheduledDay={scheduledDay}
            deliveryOption={deliveryOption}
            setDeliveryOption={setDeliveryOption} />
        </Fragment>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state, props) => ({
  deliveryDestination: get(state.sites.orderConfig, 'deliveryDestination'),
  orderConfig: state.sites.orderConfig,
  readyTime: state.cart.readyTime,
  scheduledTime: state.scheduleorder.scheduleOrderData.scheduleTime,
  scheduledDay: state.scheduleorder.scheduleOrderData.daysToAdd,
  ...state.delivery,
  _props: props
});

const mapDispatchToProps = (dispatch) => ({
  setDeliveryDetails: (deliveryDetails, kitchenString) => dispatch(setDeliveryDetails(deliveryDetails, kitchenString)),
  resetDelivery: () => dispatch(resetDelivery()),
  setDeliveryOption: (deliveryOption) => dispatch(setDeliveryOption(deliveryOption)),
  shouldOptInProfile: (shouldOptIn) => dispatch(shouldOptInProfile(shouldOptIn))
});

export default BaseOrderProperties(connect(mapStateToProps, mapDispatchToProps)(DeliveryLocationPage))({isDelivery: true}); // eslint-disable-line max-len
