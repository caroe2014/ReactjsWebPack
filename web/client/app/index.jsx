// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSites, unsetSelectedSite, updateNearBySites, isSortNearBySites } from 'web/client/app/modules/site/sagas';
import { decryptSamlCookie, clearSavedUserPage } from 'web/client/app/modules/guestProfile/sagas';
import { ConnectedLoader } from 'web/client/app/reduxpages/ConnectedComponents';
import Location from 'web/client/pages/locations';
import TimeSelect from 'web/client/pages/time-select';
import OrderAtTable from 'web/client/pages/order-at-table';
import { getLocation, sortSitesList } from 'web/client/app/utils/LocationUtils';
import Cookies from 'universal-cookie';
import get from 'lodash.get';

// Effective app root
class App extends Component {
  constructor (props) {
    super(props);
    this.onLocationReceived = this.onLocationReceived.bind(this);
  }

  componentWillMount () {
    this.props.unsetSelectedSite();

    if (this.props.getSites) {
      this.props.getSites();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.enabledLocation && nextProps.list.length > 0 && this.props.isSortNearBy) {
      getLocation(this.onLocationReceived);
      this.props.isSortNearBySites();
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.siteAuthType !== prevProps.siteAuthType && this.props.siteAuthType === 'atrium') {
      const cookies = new Cookies();

      const samlCookie = cookies.get('hapi-corpsso-cookie');
      if (samlCookie) {
        this.props.decryptSamlCookie(samlCookie);
      }
      if (this.props.lastUserPage && this.props.lastUserPage !== '/') {
        this.props.history.push(this.props.lastUserPage);
        this.props.clearSavedUserPage();
      }
    }
  }

  onLocationReceived (position) {
    const nearBySites = sortSitesList(this.props.list, position.coords.latitude, position.coords.longitude); // eslint-disable-line max-len
    this.props.updateNearBySites(nearBySites);
  }

  render () {
    const { hideScheduleTime, isScheduleOrderEnabled, digitalMenuId, multiPassEnabled, history } = this.props;
    return (
      multiPassEnabled ? <OrderAtTable history={history}/> : digitalMenuId ? <Location digitalMenuId={digitalMenuId}/>
        : <ConnectedLoader Comp={() => isScheduleOrderEnabled && !hideScheduleTime
          ? <TimeSelect /> : <Location />} />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.sites,
    ...state.app.config,
    isScheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
    hideScheduleTime: state.scheduleorder.hideScheduleTime,
    multiPassEnabled: state.app.multiPassEnabled,
    lastUserPage: state.profile.lastUserPage,
    digitalMenuId: state.app.digitalMenuId,
    siteAuthType: get(state, 'app.config.siteAuth.type'),
    _props: props };
};
const mapDispatchToProps = (dispatch) => ({
  unsetSelectedSite: () => {
    dispatch(unsetSelectedSite());
  },
  getSites: () => {
    dispatch(getSites());
  },
  updateNearBySites: (sites) => dispatch(updateNearBySites(sites)),
  isSortNearBySites: () => dispatch(isSortNearBySites()),
  decryptSamlCookie: (samlCookie) => dispatch(decryptSamlCookie(samlCookie)),
  clearSavedUserPage: () => dispatch(clearSavedUserPage())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
