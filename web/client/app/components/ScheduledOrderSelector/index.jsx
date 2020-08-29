// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
/* eslint-disable max-len */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'web/client/theme';
import { Flex, Button, Text } from 'rebass';
import { Trans } from 'react-i18next';
import moment from 'moment';
import i18n from 'web/client/i18n';
import { scheduleType, scheduleOrderConfig } from 'web/client/app/utils/constants';
import { convertTimeStringToMomentFormat } from 'web/client/app/utils/common';
import Modal from 'web/client/app/components/Modal';
import ReactSelect, { components } from 'react-select';

const Container = styled(Flex)`
  flex-direction: row;
  margin: 0px auto 0px auto;
  height: auto;
  max-width: 75em;
  width: 100%;
  padding: 0px;
  flex: 1 1 auto;
  align-items: center;
`;

const ChildBox = styled(Flex)`
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 0px 20px;
  ${props => props.theme.mediaBreakpoints.mobile`
    height: auto;
    justify-content: center;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
  `}
`;

const FindButton = styled(Button)`
  background: ${props => props.theme.colors.buttonControlColor};
  color: ${props => props.theme.colors.buttonTextColor};
  cursor: pointer;
  font-weight: 500;
  margin-right: 50px;
  font-size: ${props => props.theme.fontSize.nm};
  width: 160px;
  height: 40px;
  min-height: 40px;
  padding: 1px 0px 0px 0px;
  &:hover {
    box-shadow: 0px 0px 10px 2px lightgrey;
    -webkit-box-shadow: 0px 0px 10px 2px lightgrey;
    -moz-box-shadow: 0px 0px 10px 2px lightgrey;;
  }
  text-align: center;
  border: none;
  border-radius: 20px;
  outline: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
  ${props => props.theme.mediaBreakpoints.mobile`
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    font-style: normal !important;
  `}
`;

const DropDownParent = styled(Flex)`
  margin-bottom: 50px;
  &>:nth-child(2) { margin-left: 30px; }
  ${props => props.theme.mediaBreakpoints.mobile`
    flex-direction: column;
    &>:nth-child(2) { margin-left: 0px; margin-top: 20px; }
  `}
  .time-select .react-select__single-value,  .time-select .react-select__placeholder{
    padding-left: 30px;
  }
`;

const DropDown = styled(ReactSelect)`
  position: absolute !important;
  border: ${props => props.theme.colors.hint} solid 2px;
  border-radius: 4px;
  box-shadow: none;
  width: 280px;
  background-color: transparent;
  background-size: 0px;
  height: 40px !important;
  color: ${props => props.theme.colors.textGrey};
  left: 0px;
  top: 0px;
  &:disabled {
    opacity: 0.7;
  }
  ${props => props.theme.mediaBreakpoints.mobile`
    width: 100%;
  `};
  .react-select__indicators {
    display: none;
  }
  .react-select__control {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  .react-select__single-value, .react-select__placeholder {
    color: ${props => props.theme.colors.textGrey};
    padding-left: 55px;
    top: 45%;
  }
  .react-select__menu {
    margin-top: 4px;
    z-index: 1000;
    display: block;
  }
  .Select-menu-outer {
    z-index: 1000;
    position:relative;
  }
  .react-select__value-container {
    height: 39px;
  }
  .react-select__input {
    margin-left: 30px;
    margin-left: ${props => props.typeSelect ? '55px' : '30px'};
  }
`;

const CustomDropdown = styled(Flex)`
  position: relative;
  background-color: white;
  border-radius: 4px;
  align-items: center;
  height: 40px;
  width: 280px;
  ${props => props.theme.mediaBreakpoints.mobile`
    width: 100%;
  `};
`;

const DropdownHint = styled(Text)`
  padding-left: 10px;
  color: ${props => props.theme.colors.buttonControlColor};
`;

const HeaderText = styled(Text)`
  font-size: 60px;
  color: ${props => props.theme.colors.primaryTextColor};
  margin-bottom: 50px;
  font-weight: bold;
  word-break: break-word;
  ${props => props.theme.mediaBreakpoints.mobile`
    font-size: 40px;
    margin-top: 40px;
    margin-bottom: 70px;
    top: 70px;
    left: 0;
    right: 0;
    text-align: center;
  `};
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const FindButtonDiv = styled(Flex)`
  flex-direction: row;
  align-items: center;
  ${props => props.theme.mediaBreakpoints.mobile`
    align-self: center;
    display: block;
    padding-bottom: 200px;
`}
`;

const ErrorTextMob = styled(Flex)`
  flex-direction: row;
  margin-bottom: 70px;
  align-items: center;
  ${props => props.theme.mediaBreakpoints.desktop`display: none;`};
  ${props => props.theme.mediaBreakpoints.tablet`display: none;`};
  ${props => props.theme.mediaBreakpoints.mobile`display: block;`};
`;

const ErrorText = styled(Flex)`
  ${props => props.theme.mediaBreakpoints.desktop`display: block;`};
  ${props => props.theme.mediaBreakpoints.tablet`display: block;`};
  ${props => props.theme.mediaBreakpoints.mobile`display: none;`};
`;

const modalScheduleMap = {
  scheduleType: 'scheduleType',
  scheduleTime: 'scheduleTime'
};

const ScheduleTypeOption = props => {
  return (
    <components.Option {...props}>
      {renderCustomComponent(props)}
    </components.Option>
  );
};
const ScheduleTypeSingleValue = ({ children, ...props }) => {
  return (
    <components.SingleValue {...props}>
      {renderCustomComponent(props)}
    </components.SingleValue>
  );
};
const ScheduleTimeSingleValue = ({ children, ...props }) => {
  return (
    <components.SingleValue {...props}>
      <Text tabIndex={0} aria-label={children}>{children}</Text>
    </components.SingleValue>
  );
};

const renderCustomComponent = (props) => {
  return (
    <React.Fragment>
      { props.data.day === 0
        ? <React.Fragment>
          <span tabIndex={0} aria-label={i18n.t('SCHEDULE_LATER_TODAY')}><Trans i18nKey='SCHEDULE_LATER_TODAY'/></span>
          <span tabIndex={0} style={{ color: 'red' }} aria-label={props.data.listDay}>({props.data.listDay})</span>
        </React.Fragment>
        : <span tabIndex={0} aria-label={props.data.listDay}>{props.data.listDay}</span> }
      {props.data.closed && <span tabIndex={0} aria-label={i18n.t('SCHEDULE_LATER_CLOSED')}><Trans i18nKey='SCHEDULE_LATER_CLOSED'/></span>}
    </React.Fragment>
  );
};
class ScheduledOrderSelector extends Component {

  constructor (props) {
    super(props);

    this.scheduleTypeArray = this.getDay();
    this.state = {
      isScheduleDropdownOpen: false,
      selectedScheduleType: '',
      selectedScheduleTime: '',
      showTime: false,
      scheduleTimeData: []
    };

    this.onScheduleTypeChange = this.onScheduleTypeChange.bind(this);
    this.getScheduledOrderTimes = this.getScheduledOrderTimes.bind(this);
    this.onScheduleTimeChange = this.onScheduleTimeChange.bind(this);
    this.onFindFood = this.onFindFood.bind(this);
    this.onModalContinue = this.onModalContinue.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.setInitState = this.setInitState.bind(this);
    this.makeDialogAloneAccessible = this.makeDialogAloneAccessible.bind(this);
    this.makeEverythingAccessible = this.makeEverythingAccessible.bind(this);
    this.onEscape = this.onEscape.bind(this);
    this.getDay = this.getDay.bind(this);
  }

  componentDidMount () {
    this.setInitState(this.props);
  }

  componentWillReceiveProps (nextProps) {
    const { storeOpenNow, storeOpenLater } = this.props;
    if (nextProps.storeOpenNow !== storeOpenNow || nextProps.storeOpenLater !== storeOpenLater) {
      this.setInitState(nextProps);
    }
  }

  getDay () {
    const { isAsapOrderDisabled } = this.props;
    const dateList = isAsapOrderDisabled ? [] : [
      {value: 'asap',
        label: i18n.t('SCHEDULE_ASAP_LABEL'),
        listDay: i18n.t('SCHEDULE_ASAP_LABEL'),
        closed: !this.isASAPAvailableNow(this.props.openWindowTimeFrames)
      }
    ];
    const availabilityList = this.props.scheduledStoreConfigList;
    availabilityList.forEach(availability => {
      const listDay = moment().add(availability.day, 'day').format('dddd, MMMM D');
      const siteClosed = this.getScheduledOrderTimes(availability.openWindowTimeFrames, availability.day).length === 0;
      const label = `${availability.day === 0 ? `${i18n.t('SCHEDULE_LATER_TODAY')} (${listDay})` : listDay} ${siteClosed ? i18n.t('SCHEDULE_LATER_CLOSED') : ''}`;
      dateList.push({
        value: availability.day === 0 ? 'laterToday' : `later${availability.day}`,
        day: availability.day,
        label,
        listDay: listDay,
        closed: siteClosed
      });
    });
    return dateList;
  }

  setInitState (props) {
    let initState = {};
    const { scheduleOrderData, storeOpenNow, storeOpenLater, scheduledStoreConfigList, isAsapOrderDisabled } = props;

    if (scheduleOrderData.scheduleType) {
      if (storeOpenNow && scheduleOrderData.scheduleType === scheduleType.asap) {
        initState.selectedScheduleTime = '';
        if (isAsapOrderDisabled) {
          this.resetScheduleOrder(initState);
        } else {
          initState.selectedScheduleType = this.scheduleTypeArray[0];
        }
      } else if (storeOpenLater && scheduleOrderData.scheduleType === scheduleType.laterToday) {
        const scheduleTimeData = this.getScheduledOrderTimes(scheduledStoreConfigList[0].openWindowTimeFrames);
        if (scheduledStoreConfigList[0].day === 0 && scheduleTimeData && scheduleTimeData.find(data => data.value === scheduleOrderData.scheduleTime)) {
          initState.scheduleTimeData = scheduleTimeData;
          initState.selectedScheduleType = this.scheduleTypeArray[isAsapOrderDisabled ? 0 : 1];
          initState.selectedScheduleTime = {value: scheduleOrderData.scheduleTime, label: scheduleOrderData.scheduleTime};
          initState.showTime = true;
        } else {
          this.resetScheduleOrder(initState);
        }
      } else if (scheduleOrderData.scheduleType === 'futureSchedule') {
        const selectedScheduleAvailability = scheduledStoreConfigList.find(availability => availability.day === scheduleOrderData.daysToAdd);
        if (selectedScheduleAvailability) {
          const scheduleTimeData = this.getScheduledOrderTimes(selectedScheduleAvailability.openWindowTimeFrames, selectedScheduleAvailability.day);
          initState.scheduleTimeData = scheduleTimeData;
          initState.selectedScheduleType = this.scheduleTypeArray.find(scheduleType => scheduleType.day === scheduleOrderData.daysToAdd);
          initState.selectedScheduleTime = {value: scheduleOrderData.scheduleTime, label: scheduleOrderData.scheduleTime};
          initState.showTime = true;
        } else {
          this.resetScheduleOrder(initState);
        }
      }
    } else {
      this.resetScheduleOrder(initState);
    }
    this.setState({...initState});
  }

  resetScheduleOrder (initState) {
    initState.selectedScheduleType = '';
    initState.selectedScheduleTime = '';
    initState.showTime = false;
    this.props.resetScheduleOrderData();
  }

  setTimesState (selectedScheduleType) {
    const { scheduledStoreConfigList } = this.props;

    if (selectedScheduleType && selectedScheduleType.value !== scheduleType.asap) {
      const selectedSlotAvailability = scheduledStoreConfigList.find(availability => availability.day === selectedScheduleType.day);
      let scheduleTimeData = [];
      if (selectedSlotAvailability.openWindowTimeFrames) {
        scheduleTimeData = this.getScheduledOrderTimes(selectedSlotAvailability.openWindowTimeFrames, selectedScheduleType.day);
      }
      this.setState({ scheduleTimeData });
    }
  }

  isASAPAvailableNow (openWindowTimeFrames) {
    let storeAvailableNow = false;
    if (openWindowTimeFrames && openWindowTimeFrames.length > 0) {
      openWindowTimeFrames.map(availability => {
        if (availability.opens) {
          const currentDateTime = moment(moment.now()).second(0).millisecond(0);
          const { opens: openTime, closes: closeTime } = availability;
          const openTimeFormatted = convertTimeStringToMomentFormat(openTime);
          const closeTimeFormatted = convertTimeStringToMomentFormat(closeTime);
          const firstOrderReadyTime = moment(currentDateTime);
          if (firstOrderReadyTime.isSameOrAfter(openTimeFormatted) && firstOrderReadyTime.isSameOrBefore(closeTimeFormatted)) {
            storeAvailableNow = true;
          }
        }
      });
      return storeAvailableNow;
    }
  }

  getScheduledOrderTimes (openWindowTimeFrames, daysToAdd = 0) {
    let scheduledOrderTimes = [];

    if (openWindowTimeFrames && openWindowTimeFrames.length > 0) {
      let bufferTime = scheduleOrderConfig.bufferTime;
      if (this.props.scheduleOrderConfig.bufferTime || this.props.scheduleOrderConfig.bufferTime === 0) {
        bufferTime = this.props.scheduleOrderConfig.bufferTime;
      }
      const intervalTime = this.props.scheduleOrderConfig.intervalTime || scheduleOrderConfig.intervalTime;
      openWindowTimeFrames.map(availability => {
        if (availability.opens) {
          const currentDateTime = moment(moment.now()).second(0).millisecond(0);
          const { opens: openTime, closes: closeTime } = availability;

          const openTimeFormatted = convertTimeStringToMomentFormat(openTime).add(daysToAdd, 'days');
          const closeTimeFormatted = convertTimeStringToMomentFormat(closeTime).add(daysToAdd, 'days');

          openTimeFormatted.set({minute: this.roundOffMinute(openTimeFormatted.minute(), intervalTime)});

          const firstOrderReadyTimeWithoutIntervals = moment(currentDateTime).add(bufferTime, 'minutes');
          let firstOrderReadyTime = firstOrderReadyTimeWithoutIntervals.set({minute: this.roundOffMinute(firstOrderReadyTimeWithoutIntervals.minute(), intervalTime)}); // eslint-disable-line max-len

          if (firstOrderReadyTime.isBefore(openTimeFormatted)) {
            firstOrderReadyTime = openTimeFormatted;
          }
          let firstOrderEndTime = firstOrderReadyTime.clone().add(intervalTime, 'minutes');

          while (firstOrderReadyTime.isSameOrAfter(openTimeFormatted) && firstOrderReadyTime.isSameOrBefore(closeTimeFormatted) && firstOrderEndTime.isSameOrBefore(closeTimeFormatted)) { // eslint-disable-line max-len
            const firstReadyTimeFormat = firstOrderReadyTime.format('h:mm A');
            const firstEndTimeFormat = firstOrderEndTime.format('h:mm A');
            const timeSlot = `${firstReadyTimeFormat} - ${firstEndTimeFormat}`;
            if (scheduledOrderTimes.find(time => time.value === timeSlot) === undefined) {
              scheduledOrderTimes.push({label: timeSlot, value: timeSlot}); // eslint-disable-line max-len
            }
            // add intervalTime in minutes and check if it matches conditions again
            firstOrderReadyTime = moment(firstOrderReadyTime).add(intervalTime, 'minutes');
            firstOrderEndTime = firstOrderReadyTime.clone().add(intervalTime, 'minutes');
          }
        }
      });
    }

    scheduledOrderTimes = scheduledOrderTimes.sort((a, b) => {
      let momentA = moment(a.value.split('-')[0].trim(), 'h:mm A');
      let momentB = moment(b.value.split('-')[0].trim(), 'h:mm A');
      return moment(momentA).diff(moment(momentB));
    });

    return scheduledOrderTimes;
  }

  roundOffMinute (minute, intervalTime) {
    return Math.ceil(minute / intervalTime) * intervalTime;
  }

  onScheduleTypeChange (selectedOption) {
    const selectedScheduleType = selectedOption;
    if (selectedScheduleType === this.state.selectedScheduleType) {
      return;
    }
    const {scheduleOrderData, cartItems} = this.props;
    const showTime = selectedScheduleType.value !== scheduleType.asap;
    if (scheduleOrderData.scheduleType && selectedScheduleType.value !== scheduleOrderData.scheduleType && cartItems.length > 0) { // eslint-disable-line max-len
      this.setState({showModal: true,
        modalData: { type: modalScheduleMap.scheduleType, typeValue: selectedScheduleType }});
      this.makeDialogAloneAccessible();
    } else {
      this.setState({selectedScheduleType,
        showTime,
        selectedScheduleTime: ''
      });
      this.setTimesState(selectedScheduleType);
    }
  }

  onScheduleTimeChange (selectedOption) {
    const selectedScheduleTime = selectedOption;
    const {scheduleOrderData, cartItems} = this.props;
    if (scheduleOrderData.scheduleTime && selectedScheduleTime.value !== scheduleOrderData.scheduleTime && cartItems.length > 0) { // eslint-disable-line max-len
      this.setState({showModal: true,
        modalData: { type: modalScheduleMap.scheduleTime, typeValue: selectedScheduleTime }});
      this.makeDialogAloneAccessible();
    } else {
      this.setState({selectedScheduleTime});
    }
  }

  onFindFood () {
    if (this.state.selectedScheduleType.value !== scheduleType.nowLater) {
      if (this.state.selectedScheduleType.value !== scheduleType.asap &&
        this.state.selectedScheduleTime === '') {
        return;
      }
      let selectedScheduleType = this.state.selectedScheduleType.value === scheduleType.asap
        ? scheduleType.asap : this.state.selectedScheduleType.value === scheduleType.laterToday ? scheduleType.laterToday : 'futureSchedule';
      const scheduleOrder = {
        scheduleType: selectedScheduleType,
        scheduleTime: this.state.selectedScheduleTime.value,
        daysToAdd: selectedScheduleType === 'futureSchedule' ? this.state.selectedScheduleType.day : 0
      };
      this.props.setScheduleOrderData(scheduleOrder);
    }
  }

  onModalClose () {
    this.makeEverythingAccessible();
    this.setState({ showModal: false });
  }
  onModalContinue () {
    this.onModalClose();
    this.props.cancelCart();
    this.props.resetRemaining();
    this.props.clearGAState();
    this.props.resetAtrium();
    this.props.removeCCPaymentCard();
    this.props.clearLoyaltyState();
    const { type, typeValue } = this.state.modalData;
    if (type === modalScheduleMap.scheduleType) {
      const showTime = typeValue.value !== scheduleType.asap;
      this.setState({selectedScheduleType: typeValue,
        showTime,
        selectedScheduleTime: ''
      });
      this.setTimesState(this.scheduleTypeArray.find(type => type.value === typeValue.value));
    } else if (type === modalScheduleMap.scheduleTime) {
      this.setState({selectedScheduleTime: typeValue});
    }
  }

  makeDialogAloneAccessible () {
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer .schedule-order');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = true;
    const children = bottomContainer.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'parent-modal') {
        child.inert = true;
      }
    });
  }

  makeEverythingAccessible () {
    // Accessibility for dialog
    const bottomContainer = document.querySelector('.BottomContainer .schedule-order');
    const topContainer = document.querySelector('.TopContainer');
    topContainer.inert = false;
    const children = bottomContainer.children;
    Array.from(children).forEach(child => {
      if (child.id !== 'parent-modal') {
        child.inert = false;
      }
    });
  }

  onEscape (e) {
    if (e.which === 27) {
      this.onModalClose();
    }
  }

  isSiteOpen () {
    const { scheduledStoreConfigList, isAsapOrderDisabled, storeOpenNow } = this.props;

    let storesWithTimes = scheduledStoreConfigList.filter(availability =>
      availability.openWindowTimeFrames.length > 0);
    return (!isAsapOrderDisabled && storeOpenNow) || (scheduledStoreConfigList && scheduledStoreConfigList.length > 0 &&
        scheduledStoreConfigList[0].day === 0 && scheduledStoreConfigList[0].storeOpenNow) ||
       (storesWithTimes && storesWithTimes.length > 0);
  }

  render () {
    const { scheduleTimeData, showModal, selectedScheduleType, selectedScheduleTime } = this.state;
    const { storeOpenNow, isAsapOrderDisabled } = this.props;
    const siteClosed = !this.isSiteOpen();

    return (
      <ThemeProvider theme={theme}>
        <Container className='schedule-order'>
          <ChildBox>
            <HeaderText className='header-text'
              tabIndex={0}
              aria-label={this.props.scheduleOrderConfig.headerText ||
                i18n.t('SCHEDULE_ORDER_HEADER')}
              role='heading' aria-level='1'>
              {this.props.scheduleOrderConfig.headerText ||
              <Trans i18nKey='SCHEDULE_ORDER_HEADER'/>}</HeaderText>
            <DropDownParent className='schedule-dropdown'>
              <CustomDropdown className='type-select' role='listbox'>
                <DropdownHint style={{opacity: siteClosed ? 0.7 : 1}}>
                  <Trans i18nKey='SCHEDULE_WHEN_LABEL' />:
                </DropdownHint>
                <DropDown
                  className='type-select'
                  id='location'
                  name='location'
                  classNamePrefix='react-select'
                  menuPortalTarget={document.body}
                  onChange={this.onScheduleTypeChange}
                  value={selectedScheduleType}
                  isDisabled={siteClosed}
                  aria-disabled={siteClosed}
                  select={this.state.selectedScheduleType !== scheduleType.nowLater}
                  placeholder={i18n.t('SCHEDULE_NOW_LATER')}
                  aria-selected={selectedScheduleType}
                  options={this.scheduleTypeArray}
                  components={{ Option: ScheduleTypeOption, SingleValue: ScheduleTypeSingleValue }}
                  isSearchable={false}
                  typeSelect
                  aria-label={!selectedScheduleType && i18n.t('SCHEDULE_NOW_LATER')}
                  dropdownIndicator={false}
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999, marginTop: '-5px' }) }}
                  isOptionDisabled={(option) => (option.value === scheduleType.asap && (!storeOpenNow || option.closed || isAsapOrderDisabled)) ||
                  (option.value !== scheduleType.asap && option.closed)}
                />
              </CustomDropdown>
              {this.state.showTime
                ? <CustomDropdown role='listbox'
                  style={{visibility: this.state.showTime ? 'visible' : 'hidden'}}>
                  <DropdownHint><Trans i18nKey='SCHEDULE_AT_LABEL' />:</DropdownHint>
                  <DropDown
                    id='time-select'
                    className='time-select'
                    classNamePrefix='react-select'
                    menuPortalTarget={document.body}
                    onChange={this.onScheduleTimeChange}
                    options={scheduleTimeData}
                    components={{ SingleValue: ScheduleTimeSingleValue }}
                    value={selectedScheduleTime}
                    aria-selected={selectedScheduleTime}
                    select
                    isSearchable={false}
                    dropdownIndicator={false}
                    aria-label={!selectedScheduleTime && i18n.t('SCHEDULE_WHAT_TIME')}
                    placeholder={i18n.t('SCHEDULE_WHAT_TIME')}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999, marginTop: '-5px' }) }}
                  />
                </CustomDropdown> : undefined}
            </DropDownParent>
            {siteClosed &&
            <ErrorTextMob className='ErrorText-div' aria-live='polite'>
              <Text style={{textAlign: 'center', color: theme.colors.buttonControlColor}}
                aria-label={this.props.scheduleOrderConfig.errorText || i18n.t('SCHEDULE_ORDER_ERROR')}
                tabIndex={0}>
                {this.props.scheduleOrderConfig.errorText || <Trans i18nKey='SCHEDULE_ORDER_ERROR'/>}
              </Text>
            </ErrorTextMob>
            }
            <FindButtonDiv className='find-button-div'>
              <FindButton
                className='pay-button'
                children={<Trans i18nKey='FIND_FOOD'/>}
                onClick={this.onFindFood}
                role='button'
                aria-label={i18n.t('FIND_FOOD')}
                tabIndex={0}
                disabled={(siteClosed) || !selectedScheduleType || (selectedScheduleType.value === scheduleType.asap && selectedScheduleType.closed) ||
                (selectedScheduleType.value !== scheduleType.asap && !selectedScheduleTime)}
              />
              {siteClosed &&
                <ErrorText aria-live='polite'>
                  <Text
                    tabIndex={0}
                    aria-label={this.props.scheduleOrderConfig.errorText || i18n.t('SCHEDULE_ORDER_ERROR')}
                    style={{textAlign: 'center',
                      color: theme.colors.buttonControlColor,
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    {this.props.scheduleOrderConfig.errorText || <Trans i18nKey='SCHEDULE_ORDER_ERROR'/>}
                  </Text>
                </ErrorText>
              }
            </FindButtonDiv>
          </ChildBox>
          {showModal &&
          <Modal
            open={showModal}
            showCancelButton
            showClose
            onCancel={this.onModalClose}
            onEscape={this.onEscape}
            onContinue={this.onModalContinue}
            cancelButtonText={i18n.t('MODAL_CANCEL')}
            continueButtonText={i18n.t('IDLE_MESSAGE_STILL_HERE')}
            title={i18n.t('MODAL_CHANGE_SCHEDULE_HEADER')}
            textI18nKey={'MODAL_CHANGE_SCHEDULE_MSG'}
          />}
        </Container>
      </ThemeProvider>
    );
  }
}

export default ScheduledOrderSelector;
