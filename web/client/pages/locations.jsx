// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectSite, setOrderConfig } from 'web/client/app/modules/site/sagas';
import { loadLoyaltyPage, shouldClearLoyaltyAccount } from 'web/client/app/modules/loyalty/sagas';
import SiteSelectList from 'web/client/app/components/SiteSelectList/SiteSelectList';
import { scheduleType } from 'web/client/app/utils/constants';
import { convertTimeStringToMomentFormat } from 'web/client/app/utils/common';
import { setDeliveryOption } from 'web/client/app/modules/deliverylocation/sagas';
import i18n from 'web/client/i18n';
import _ from 'lodash';

class Location extends Component {

  constructor (props) {
    super(props);
    this.state = {
      siteList: this.props.list || []
    };
    this.onStoreSelect = this.onStoreSelect.bind(this);
    this.siteFilterByScheduleEnabled = this.siteFilterByScheduleEnabled.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
  }

  componentWillMount () {
    this.siteFilterByScheduleEnabled(this.props);
    this.props.list && this.props.list.length > 0 && this.props.digitalMenuId &&
      this.onStoreSelect(this.props.digitalMenuId);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.list !== nextProps.list && nextProps.list.length > 0) {
      this.siteFilterByScheduleEnabled(nextProps);
    }
  }

  makeDialogAloneAccessible () {
    // Accessibility for dialog
    const parent = document.querySelector('.parent');
    const children = parent.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'container-parent') {
        child.inert = true;
      }
    });
  }

  siteFilterByScheduleEnabled (props) {
    const { scheduleOrderData, scheduleOrderEnabled, list } = props;
    const siteList = _.cloneDeep(list);
    if (scheduleOrderEnabled && scheduleOrderData.scheduleType !== scheduleType.asap) {
      const scheduleTimeFormatted = convertTimeStringToMomentFormat(scheduleOrderData.scheduleTime);
      const filterSiteList = siteList.filter(site => {
        const currentSchedule = site.allAvailableList.find(availabity => availabity.index === scheduleOrderData.daysToAdd); // eslint-disable-line max-len
        const isAvailable = currentSchedule && currentSchedule.availableAt.openWindowTimeFrames && currentSchedule.availableAt.openWindowTimeFrames.find(timeFrame => { // eslint-disable-line max-len
          const { opens: timeFrameOpens, closes: timeFrameCloses } = timeFrame;

          const timeFrameOpensFormatted = convertTimeStringToMomentFormat(timeFrameOpens);
          const timeFrameClosesFormatted = convertTimeStringToMomentFormat(timeFrameCloses);

          return scheduleTimeFormatted.isSameOrAfter(timeFrameOpensFormatted) &&
            scheduleTimeFormatted.isSameOrBefore(timeFrameClosesFormatted);
        });
        let isScheduleAvailable = isAvailable && site.isScheduleOrderEnabled;
        if (scheduleOrderData.daysToAdd === 0) {
          isScheduleAvailable = isAvailable && !!site.todaySchedulingEnabled;
        }
        if (isScheduleAvailable) {
          site.availableAt.availableNow = true;
          site.availableAt.conceptsAvailableNow = true;
          site.availableAt.opens = currentSchedule.availableAt.opens;
          site.availableAt.closes = currentSchedule.availableAt.closes;
        }
        return isScheduleAvailable;
      });
      this.setState({ siteList: filterSiteList });
    } else {
      this.setState({ siteList });
    }
  }

  onStoreSelect (selectedSite) {
    const { selectSite, loadLoyaltyPage, shouldClearLoyaltyAccount, skipSitesPage, digitalMenuId } = this.props;
    const { siteList } = this.state;
    const loyaltySite = siteList.find(site => (site.id === selectedSite.id && site.displayProfileId === selectedSite.displayProfileId) && site.isLoyaltyEnabled); // eslint-disable-line max-len
    if (this.props.shouldClearAccount) {
      shouldClearLoyaltyAccount();
    }
    if (!digitalMenuId && loyaltySite && !skipSitesPage) {
      if (!loyaltySite.loyaltyAccrueEnabled) {
        const loyaltyPaymentConfiguration = loyaltySite.pay.payOptions.find(payOption => payOption.type === 'loyalty');
        loyaltySite.loyaltyDetails.header = loyaltyPaymentConfiguration.displayLabel || i18n.t('LOYALTY_PAYMENT_HEADER_LABEL'); // eslint-disable-line max-len
        loyaltySite.loyaltyDetails.instructionText = (loyaltyPaymentConfiguration.accountEntry && loyaltyPaymentConfiguration.accountEntry.instructionText) || i18n.t('LOYALTY_PAYMENT_INSTRUCTION_TEXT'); // eslint-disable-line max-len
      }
      loadLoyaltyPage(loyaltySite.id, loyaltySite.displayProfileId, true, loyaltySite.loyaltyDetails, false, loyaltySite); // eslint-disable-line max-len
      this.makeDialogAloneAccessible();
    } else {
      loadLoyaltyPage(selectedSite.id, loyaltySite && loyaltySite.displayProfileId, false, undefined, false, (loyaltySite && !skipSitesPage ? loyaltySite : undefined)); // eslint-disable-line max-len
      selectSite(digitalMenuId || selectedSite.id, selectedSite.displayProfileId);
    }
  }

  render () {
    const { theme, showOperationTimes, scheduleOrderEnabled, setDeliveryOption,
      scheduleOrderData, setOrderConfig, skipSitesPage } = this.props;

    return (
      <SiteSelectList keyProps={this.state.siteList} selectSite={this.onStoreSelect} apptheme={theme}
        skipSitesPage={skipSitesPage}
        showOperationTimes={showOperationTimes}
        scheduleOrderEnabled={scheduleOrderEnabled}
        isAsapOrder={scheduleOrderData.scheduleType ? scheduleOrderData.scheduleType === 'asap' : true}
        setDeliveryOption={setDeliveryOption}
        setOrderConfig={setOrderConfig}/>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.sites,
    ...state.app.config,
    scheduleOrderEnabled: state.scheduleorder.isScheduleOrderEnabled,
    scheduledStoreConfigList: state.scheduleorder.scheduledStoreConfigList,
    scheduleOrderData: state.scheduleorder.scheduleOrderData,
    shouldClearAccount: state.loyalty.shouldClearAccount,
    _props: props
  };
};
const mapDispatchToProps = (dispatch) => ({
  selectSite: (siteId, displayProfileId) => {
    dispatch(selectSite(siteId, displayProfileId));
  },
  setOrderConfig: (orderConfig) => dispatch(setOrderConfig(orderConfig)),
  loadLoyaltyPage: (site, displayProfileId, isLoyaltyEnabled, loyaltyDetails, checkoutFlag, loyaltySite) =>
    dispatch(loadLoyaltyPage(site, displayProfileId, isLoyaltyEnabled, loyaltyDetails, checkoutFlag, loyaltySite)),
  setDeliveryOption: (deliveryOption) => dispatch(setDeliveryOption(deliveryOption)),
  shouldClearLoyaltyAccount: () => dispatch(shouldClearLoyaltyAccount())
});

export default connect(mapStateToProps, mapDispatchToProps)(Location);
