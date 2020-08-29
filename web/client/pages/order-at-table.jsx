// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import OrderAtTable from 'web/client/app/components/OrderAtTable';
import { selectSite } from 'web/client/app/modules/site/sagas';

class OrderAtTablePage extends Component {
  render () {
    return (
      this.props.currentSite ? <OrderAtTable {...this.props}/> : null
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    currentSite: state.sites.list.length > 0 && state.sites.list[0],
    appConfig: state.app.config,
    igOrderProperties: state.communalCart.igOrderProperties,
    _props: props };
};
const mapDispatchToProps = (dispatch) => ({
  selectSite: (siteId, displayProfileId) => dispatch(selectSite(siteId, displayProfileId))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderAtTablePage);
