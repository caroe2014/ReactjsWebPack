// Copyright © 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import moment from 'moment-timezone';
import { getCurrentTime } from './schedule';
import appConfig from 'app.config';
import path from 'path';

const logger = appConfig.logger.child({ component: path.basename(__filename) });

const iterationType = {
  FORWARD: 'forward',
  BACKWARD: 'backward'
};

const roundOffMinute = (minute, intervalTime) => {
  return Math.ceil(minute / intervalTime) * intervalTime;
};

const getDateTimeFromTimeString = (timeZone, timeString, isToBeFormatted = false, roundOff, intervalTime) => {
  const timeFormat = moment(timeString, 'hh:mm A');
  const momentTimeZone = moment().tz(timeZone);
  momentTimeZone.set({
    hour: timeFormat.get('hour'),
    minute: roundOff ? (roundOff === 'floor' ? (Math.floor(timeFormat.get('minute') / intervalTime) * intervalTime)
      : (Math.ceil(timeFormat.get('minute') / intervalTime) * intervalTime))
      : timeFormat.get('minute'),
    seconds: 0,
    milliseconds: 0
  });
  return isToBeFormatted ? momentTimeZone.format('h:mm A') : momentTimeZone;
};

export const getUtcDateTimeFromTimeString = (timeString, timeZone, daysToAdd) => {
  const currentDate = moment(new Date()).tz(timeZone).add(daysToAdd, 'days').format('DD-MM-YYYY');
  const currentDateWithTime = currentDate + ' ' + timeString;
  const formattedDate = 'DD-MM-YYYY hh:mm a';
  const utcTimeStamp = moment.tz(currentDateWithTime, formattedDate, timeZone).utc().format();
  return utcTimeStamp;
};

export const getThrottlingTimeSlots = (storeConfig, scheduleTime, daysToAdd) => {
  const [startSchedule, endSchedule] = scheduleTime.split('-');
  const currentTime = getCurrentTime(storeConfig.storeTimeZone);

  const startTime = getDateTimeFromTimeString(storeConfig.storeTimeZone, startSchedule).add(daysToAdd, 'days');
  const endTime = getDateTimeFromTimeString(storeConfig.storeTimeZone, endSchedule).add(daysToAdd, 'days');
  let timeSlotList = [];
  storeConfig.openWindowFrames.some(frame => {
    const scheduledOrderTimes = [];
    const openTime = getDateTimeFromTimeString(storeConfig.storeTimeZone, frame.opens).add(daysToAdd, 'days');
    const closeTime = getDateTimeFromTimeString(storeConfig.storeTimeZone, frame.closes).add(daysToAdd, 'days');
    if (startTime.isSameOrAfter(openTime) && endTime.isSameOrBefore(closeTime)) {
      openTime.set({minute: roundOffMinute(openTime.minute(), storeConfig.intervalTime)});
      const firstOrderReadyTimeWithoutIntervals = moment(currentTime).add(storeConfig.bufferTime, 'minutes');
      let firstOrderReadyTime = firstOrderReadyTimeWithoutIntervals.set({minute: roundOffMinute(firstOrderReadyTimeWithoutIntervals.minute(), storeConfig.intervalTime)}); // eslint-disable-line max-len
      if (firstOrderReadyTime.isBefore(openTime)) {
        firstOrderReadyTime = openTime;
      }
      let firstOrderEndTime = firstOrderReadyTime.clone().add(storeConfig.intervalTime, 'minutes');

      while (firstOrderReadyTime.isSameOrAfter(openTime) && firstOrderReadyTime.isSameOrBefore(closeTime) && firstOrderEndTime.isSameOrBefore(closeTime)) { // eslint-disable-line max-len
        const firstReadyTimeFormat = firstOrderReadyTime.format('h:mm A');
        const firstEndTimeFormat = firstOrderEndTime.format('h:mm A');
        const timeSlot = `${firstReadyTimeFormat}-${firstEndTimeFormat}`;
        if (scheduledOrderTimes.find(scheduleTime => scheduleTime === timeSlot) === undefined) {
          scheduledOrderTimes.push(timeSlot);
        }
        firstOrderReadyTime = moment(firstOrderReadyTime).add(storeConfig.intervalTime, 'minutes');
        firstOrderEndTime = firstOrderReadyTime.clone().add(storeConfig.intervalTime, 'minutes');
      }

      const offsetIndex = scheduledOrderTimes.findIndex(time => time === scheduleTime);
      if (offsetIndex >= 0) {
        timeSlotList = frameTimeSlotWindow(offsetIndex, scheduledOrderTimes);
      } else {
        return timeSlotList;
      }
      return true;
    }
  });
  return timeSlotList;
};

const frameTimeSlotWindow = (offsetIndex, scheduleTimeList, slotList = [], iteration = undefined) => {
  const scheduleListLength = scheduleTimeList.length;
  let startTime;
  let endTime;
  if (scheduleListLength === 0) {
    return slotList;
  }
  try {
    if (!iteration) {
      if (scheduleTimeList.length < 3) {
        startTime = scheduleTimeList[offsetIndex].split('-')[0];
        endTime = scheduleTimeList[scheduleTimeList.length - 1].split('-')[1];
        slotList.push({startTime, endTime});
        return slotList;
      } else {
        let currentOffsetIndex = offsetIndex === 0 ? 1 : offsetIndex;
        currentOffsetIndex = currentOffsetIndex === scheduleListLength - 1 ? currentOffsetIndex - 1 : currentOffsetIndex;
        startTime = scheduleTimeList[currentOffsetIndex - 1].split('-')[0];
        endTime = scheduleTimeList[currentOffsetIndex + 1].split('-')[1];
        slotList.push({startTime, endTime});
        scheduleTimeList.splice(currentOffsetIndex - 1, 3);
        if ((offsetIndex - 1) >= scheduleTimeList.length) {
          iteration = iterationType.BACKWARD;
          offsetIndex = scheduleTimeList.length - 1;
        } else {
          offsetIndex = offsetIndex - 1;
          offsetIndex = offsetIndex < 0 ? 0 : offsetIndex;
          iteration = iterationType.FORWARD;
        }
        return frameTimeSlotWindow(offsetIndex, scheduleTimeList, slotList, iteration);
      }
    } else if (iteration === iterationType.FORWARD) {
      startTime = scheduleTimeList[offsetIndex].split('-')[0];
      if (offsetIndex + 1 === scheduleTimeList.length) {
        endTime = scheduleTimeList[offsetIndex].split('-')[1];
        slotList.push({startTime, endTime});
      } else if (offsetIndex + 2 === scheduleTimeList.length) {
        endTime = scheduleTimeList[offsetIndex + 1].split('-')[1];
        slotList.push({startTime, endTime});
      } else {
        endTime = scheduleTimeList[offsetIndex + 2].split('-')[1];
        slotList.push({startTime, endTime});
      }
      scheduleTimeList.splice(offsetIndex, 3);
      offsetIndex = offsetIndex - 1;
      if (offsetIndex < 0) {
        offsetIndex = 0;
        iteration = iterationType.FORWARD;
      } else {
        iteration = iterationType.BACKWARD;
      }
      return frameTimeSlotWindow(offsetIndex, scheduleTimeList, slotList, iteration);
    } else if (iteration === iterationType.BACKWARD) {
      let indexToDelete = 1;
      if (offsetIndex - 1 < 0) {
        startTime = scheduleTimeList[offsetIndex].split('-')[0];
        endTime = scheduleTimeList[offsetIndex].split('-')[1];
      } else if (offsetIndex - 2 < 0) {
        startTime = scheduleTimeList[offsetIndex - 1].split('-')[0];
        endTime = scheduleTimeList[offsetIndex].split('-')[1];
        indexToDelete++;
      } else {
        startTime = scheduleTimeList[offsetIndex - 2].split('-')[0];
        endTime = scheduleTimeList[offsetIndex].split('-')[1];
        indexToDelete += 2;
      }
      slotList.push({startTime, endTime});
      scheduleTimeList.splice(offsetIndex - (indexToDelete - 1), indexToDelete);
      offsetIndex = offsetIndex - (indexToDelete - 1);
      if (offsetIndex >= scheduleTimeList.length) {
        offsetIndex = scheduleTimeList.length - 1;
        iteration = iterationType.BACKWARD;
      } else {
        iteration = iterationType.FORWARD;
      }
      return frameTimeSlotWindow(offsetIndex, scheduleTimeList, slotList, iteration);
    }
  } catch (error) {
    logger.fatal(error.message);
    throw error;
  }
};

export const getSlotListFromCapacityRange = (capacityWindows, storeTimeZone, intervalTime) => {
  let newOutputRange = [];
  capacityWindows.forEach(interval => {
    const startTime = moment.utc(interval.beginning).tz(storeTimeZone);
    const endTime = moment.utc(interval.end).tz(storeTimeZone);
    var duration = endTime.diff(startTime, 'minutes');
    if (duration <= intervalTime) {
      newOutputRange.push({
        scheduleRange: (`${getDateTimeFromTimeString(storeTimeZone, startTime, true)} - ${getDateTimeFromTimeString(storeTimeZone, endTime, true)}`),
        scheduledEndTime: (`${getDateTimeFromTimeString(storeTimeZone, endTime, true)}`),
        displayRange: (`${getDateTimeFromTimeString(storeTimeZone, startTime, true, 'floor', intervalTime)} - ${getDateTimeFromTimeString(storeTimeZone, endTime, true, 'ceil', intervalTime)}`)
      });
    } else {
      let firstOrderReadyTime = startTime;
      let flag = true;
      while (flag) {
        let newEndTime = moment(firstOrderReadyTime).add(intervalTime, 'minutes');
        if (newEndTime.isSameOrAfter(endTime)) {
          newOutputRange.push({
            scheduleRange: (`${getDateTimeFromTimeString(storeTimeZone, firstOrderReadyTime, true)} - ${getDateTimeFromTimeString(storeTimeZone, endTime, true)}`),
            scheduledEndTime: (`${getDateTimeFromTimeString(storeTimeZone, endTime, true)}`),
            displayRange: (`${getDateTimeFromTimeString(storeTimeZone, firstOrderReadyTime, true, 'floor', intervalTime)} - ${getDateTimeFromTimeString(storeTimeZone, endTime, true, 'ceil', intervalTime)}`)
          });
          flag = false;
        } else {
          newOutputRange.push({
            scheduleRange: (`${getDateTimeFromTimeString(storeTimeZone, firstOrderReadyTime, true)} - ${getDateTimeFromTimeString(storeTimeZone, newEndTime, true)}`),
            scheduledEndTime: (`${getDateTimeFromTimeString(storeTimeZone, newEndTime, true)}`),
            displayRange: (`${getDateTimeFromTimeString(storeTimeZone, firstOrderReadyTime, true, 'floor', intervalTime)} - ${getDateTimeFromTimeString(storeTimeZone, newEndTime, true, 'ceil', intervalTime)}`)
          });
        }
        firstOrderReadyTime = newEndTime;
      }
    }
  });
  return newOutputRange;
};

export const getScheduleTimeFromCapacityWindow = (scheduleTime, capacityWindows, storeTimeZone, daysToAdd) => {
  let scheduledEndTime;
  const [startSchedule, endSchedule] = scheduleTime.split('-');
  const startScheduleTime = getDateTimeFromTimeString(storeTimeZone, startSchedule).add(daysToAdd, 'days');
  const endScheduleTime = getDateTimeFromTimeString(storeTimeZone, endSchedule).add(daysToAdd, 'days');
  capacityWindows.some(interval => {
    const endTime = moment.utc(interval.end).tz(storeTimeZone);
    if (endTime.isSameOrAfter(startScheduleTime) && endTime.isSameOrBefore(endScheduleTime)) {
      scheduledEndTime = getDateTimeFromTimeString(storeTimeZone, endTime, true);
      return true;
    }
  });
  return scheduledEndTime;
};
