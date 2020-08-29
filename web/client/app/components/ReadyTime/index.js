// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import React, { Component } from 'react';
import { Box } from 'rebass';
import styled from 'styled-components';
import get from 'lodash.get';
import i18n from 'web/client/i18n';
import moment from 'moment-timezone';

const ReadyTimeContainer = styled(Box)`
    text-align: center;
    &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const TextContainer = styled(Box)`
  color: ${props => props.theme.colors.primaryTextColor};
`;

const GetReadyTimeContainer = styled(Box)`
  color: ${props => props.theme.colors.primaryTextColor};
  margin-top: 3px;
`;

class ReadyTime extends Component {

  getReadyTime () {
    const readyTime = get(this.props, 'readyTime.etf')
      ? get(this.props, 'readyTime.etf.minutes')
      : get(this.props, 'readyTime.minutes');
    const minTime = get(this.props, 'readyTime.minTime.minutes');
    const maxTime = get(this.props, 'readyTime.maxTime.minutes');
    const scheduledTime = get(this.props, 'scheduledTime');
    let readyText = '_ _ _';
    if (!scheduledTime) {
      if (readyTime >= 0) {
        if (readyTime === 0) {
          readyText = i18n.t('CART_LESS_MINUTE');
        } else if (readyTime === 1) {
          readyText = i18n.t('CART_IN_A_MINUTE');
        } else {
          readyText = readyTime > 60
            ? i18n.t('CART_IN_ABS_MINUTES', { readyTime: this.getAbsoluteReadyTime(readyTime) })
            : i18n.t('CART_IN_N_MINUTES', { readyTime: readyTime });
        }
      } else if (minTime >= 0 && maxTime >= 0) {
        if (minTime === 0 && maxTime === 0) {
          readyText = i18n.t('CART_LESS_MINUTE');
        } else if (minTime === maxTime && minTime !== 0) {
          readyText = minTime > 60
            ? i18n.t('CART_IN_ABS_MINUTES', { readyTime: this.getAbsoluteReadyTime(minTime) })
            : i18n.t(minTime === 1 ? 'CART_IN_A_MINUTE' : ('CART_IN_N_MINUTES', { readyTime: minTime }));
        } else if (minTime === 0 && maxTime === 1) {
          readyText = i18n.t('CART_IN_A_MINUTE');
        } else if (minTime === 0 && maxTime > 1) {
          readyText = maxTime > 60
            ? i18n.t('CART_IN_ABS_MINUTES', { readyTime: this.getAbsoluteReadyTime(maxTime) })
            : i18n.t('CART_LESS_THAN_N_MINUTES', { maxTime: maxTime });
        } else {
          readyText = maxTime > 60
            ? i18n.t('CART_IN_BETWEEN_MINUTES',
              { minTime: this.getAbsoluteReadyTime(minTime),
                maxTime: this.getAbsoluteReadyTime(maxTime)})
            : i18n.t('CART_M_TO_N_MINUTES', { minTime: minTime, maxTime: maxTime });
        }
      }
      return readyText;
    } else {
      return scheduledTime;
    }
  };

  getAbsoluteReadyTime (etf) {
    const {orderTime, timeZone, cart} = this.props;
    const timeWithEtf = cart ? moment() : moment(orderTime);
    timeWithEtf.add(etf, 'minutes').locale('en-US').tz(timeZone);
    timeWithEtf.set({
      minute: Math.ceil(timeWithEtf.get('minute') / 5) * 5
    });
    return moment(timeWithEtf).locale('en-US').format('LT');
  }

  getReadyText () {
    const { scheduledTime, scheduledDay } = this.props;
    return scheduledTime ? scheduledDay
      ? i18n.t('CART_SCHEDULE_TEXT_WITH_DAY',
        { scheduledDay: moment().add(scheduledDay, 'days').format('dddd, MMMM D') })
      : i18n.t('CART_SCHEDULE_TEXT') : i18n.t('CART_READY_TEXT');
  }

  render () {
    const readyTime = this.getReadyTime();
    const { scheduledTime, scheduledDay } = this.props;
    return (
      <ReadyTimeContainer
        className='ready-time-container'
        tabIndex={0}
        aria-label={i18n.t(`${scheduledTime ? 'CART_SCHEDULE_TEXT' : 'CART_READY_TEXT'}`) + readyTime} >
        <TextContainer>
          {scheduledTime ? scheduledDay
            ? i18n.t('CART_SCHEDULE_TEXT_WITH_DAY', { scheduledDay: moment().add(scheduledDay, 'days').format('dddd, MMMM D') }) // eslint-disable-line max-len
            : i18n.t('CART_SCHEDULE_TEXT') : i18n.t('CART_READY_TEXT')}
        </TextContainer>
        <GetReadyTimeContainer><strong className='ready-time'>{readyTime}</strong></GetReadyTimeContainer>
      </ReadyTimeContainer>
    );
  }
}

export default ReadyTime;
