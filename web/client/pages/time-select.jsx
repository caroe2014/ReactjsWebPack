// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ScheduledOrderSelector from 'web/client/app/components/ScheduledOrderSelector';
import { setScheduleOrderData, resetScheduleOrderData } from 'web/client/app/modules/scheduleorder/sagas';
import { cancelCart } from 'web/client/app/modules/cart/sagas';
import get from 'lodash.get';
import { resetRemaining } from 'web/client/app/modules/payOptions/sagas';
import { clearGAState } from 'web/client/app/modules/gaPayment/sagas';
import { resetAtrium } from 'web/client/app/modules/atrium/sagas';
import { clearLoyaltyState } from 'web/client/app/modules/loyalty/sagas';
import { removeCCPaymentCard } from 'web/client/app/modules/iFrame/sagas'; // eslint-disable-line max-len
class TimeSelect extends Component {
  render () {
    return (
      <ScheduledOrderSelector {...this.props}
        resetScheduleOrderData={this.props.resetScheduleOrderData} />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    isScheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
    openWindowTimeFrames: state.scheduleorder.scheduledStoreConfig.openWindowTimeFrames,
    scheduleOrderData: state.scheduleorder.scheduleOrderData,
    isAsapOrderDisabled: state.scheduleorder.isAsapOrderDisabled,
    scheduleOrderConfig: get(state.app.config, 'properties.scheduledOrdering', {}),
    scheduledStoreConfigList: state.scheduleorder.scheduledStoreConfigList,
    cartItems: state.cart.items,
    storeOpenNow: state.scheduleorder.scheduledStoreConfig.storeOpenNow,
    storeOpenLater: state.scheduleorder.scheduledStoreConfig.storeOpenLater,
    _props: props };
};
const mapDispatchToProps = (dispatch) => ({
  setScheduleOrderData: (scheduleOrder) => dispatch(setScheduleOrderData(scheduleOrder)),
  resetScheduleOrderData: () => dispatch(resetScheduleOrderData()),
  cancelCart: () => dispatch(cancelCart()),
  clearGAState: () => dispatch(clearGAState()),
  resetRemaining: () => dispatch(resetRemaining()),
  resetAtrium: () => dispatch(resetAtrium()),
  clearLoyaltyState: () => dispatch(clearLoyaltyState()),
  removeCCPaymentCard: () => dispatch(removeCCPaymentCard())
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelect);
