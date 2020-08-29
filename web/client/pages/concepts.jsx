// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getConcepts } from 'web/client/app/modules/concept/sagas';
import ConceptList from 'web/client/app/components/ConceptList';
import { ConnectedLoader } from 'web/client/app/reduxpages/ConnectedComponents';
import { shouldClearLoyaltyAccount } from 'web/client/app/modules/loyalty/sagas';

class Concept extends Component {
  constructor (props) {
    super(props);
    this.selectConcept = this.selectConcept.bind(this);
  }

  componentDidMount () {
    if (this.props.shouldClearAccount) {
      this.props.shouldClearLoyaltyAccount();
    }
  }

  componentWillMount () {
    if (this.props.getConcepts) {
      this.props.getConcepts(this.props.match.params.siteId, this.props.match.params.displayProfileId);
    }
  }
  selectConcept (conceptId) {
    this.props.selectConcept(this.props.match.params.siteId, this.props.match.params.displayProfileId, conceptId);
  }
  render () {
    const { list, showOperationTimes, isScheduleOrderEnabled, digitalMenuId, digitalMenuError, siteList } = this.props;
    return (
      <ConnectedLoader Comp={() =>
        <ConceptList
          keyProps={list}
          digitalMenuId={digitalMenuId}
          selectConcept={this.selectConcept}
          isScheduleOrderEnabled={isScheduleOrderEnabled}
          showOperationTimes={showOperationTimes}
          digitalMenuError={digitalMenuError}
          siteList={siteList} />
      } />
    );
  }
}

const mapStateToProps = (state, props) => ({
  ...state.concept,
  ...state.app.config,
  digitalMenuId: state.app.digitalMenuId,
  isScheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
  shouldClearAccount: state.loyalty.shouldClearAccount,
  siteList: state.sites.list,
  _props: props
});
const mapDispatchToProps = (dispatch, props) => ({
  getConcepts: (siteId, displayProfileId) => {
    dispatch(getConcepts(siteId, displayProfileId));
  },
  selectConcept: (siteId, displayProfileId, conceptId) => {
    dispatch(push(`/menu/${siteId}/${displayProfileId}/${conceptId}`));
  },
  shouldClearLoyaltyAccount: () => dispatch(shouldClearLoyaltyAccount())
});

export default connect(mapStateToProps, mapDispatchToProps)(Concept);
