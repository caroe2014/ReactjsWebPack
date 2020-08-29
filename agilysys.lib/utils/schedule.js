// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import moment from 'moment-timezone';
import parser from 'cron-parser';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const getTodaysSchedule = (schedule, timezone) => schedule.tasks.filter(s => s.scheduledExpression.indexOf(days[moment().tz(timezone).day()]) >= 0); // eslint-disable-line max-len
export const getCustomDaySchedule = (schedule, timezone, daysToAdd) => schedule.tasks.filter(s => s.scheduledExpression.indexOf(moment().tz(timezone).add(daysToAdd, 'days').format('ddd').toUpperCase()) >= 0); // eslint-disable-line max-len
export const getConfiguredSchedule = (schedule, timezone, futureDays = 0, todaySchedulingEnabled) => {
  let availableList = [];
  for (let i = todaySchedulingEnabled ? 0 : 1; i <= futureDays; i++) {
    const day = moment().tz(timezone).add(i, 'days').format('ddd').toUpperCase();
    availableList.push({
      day,
      index: i,
      todaysSchedule: schedule.tasks.filter(s => s.scheduledExpression.indexOf(day) >= 0)
    });
  }
  return availableList;
};
export const getCurrentTime = (timezone) => moment().tz(timezone);
export const getSpecificTime = (timezone, day) => moment().tz(timezone).add(day, 'days');
export const getCustomTime = (timezone, timeString) => {
  const timeFormat = moment(timeString, 'hh:mm A');
  const momentTimeZone = moment().tz(timezone);
  momentTimeZone.set({
    hour: timeFormat.get('hour'),
    minute: timeFormat.get('minute')
  });
  return momentTimeZone.add(1, 'minutes');
};
export const getCustomFutureTime = (timezone, timeString, daysToAdd) => {
  const timeFormat = moment(timeString, 'hh:mm A');
  const momentTimeZone = moment().tz(timezone);
  momentTimeZone.set({
    hour: timeFormat.get('hour'),
    minute: timeFormat.get('minute')
  });
  return momentTimeZone.add(daysToAdd, 'days').add(1, 'minutes');
};
const getNextMidNight = (daysToAdd) => moment().add(1 + daysToAdd, 'days').startOf('day');

const getOpenCloseTimeWindows = (todaysSchedule, currentDate) => {
  let openTimeWindowFrame = {};
  let openTimeWindowFrameList = [];
  let nextIntervalIsOpen = true;

  todaysSchedule.forEach(interval => {
    const thisInterval = parser.parseExpression(interval.scheduledExpression, { currentDate }).next();

    if (interval['@c'] === '.DisplayProfileTask' && nextIntervalIsOpen) {
      openTimeWindowFrame['opens'] = moment(thisInterval._date).year(currentDate.year()).month(currentDate.month()).date(currentDate.date()).format('h:mm a');
      nextIntervalIsOpen = false;
    } else if (interval['@c'] === '.TransitionTask' && !nextIntervalIsOpen) {
      openTimeWindowFrame['closes'] = moment(thisInterval._date).year(currentDate.year()).month(currentDate.month()).date(currentDate.date()).format('h:mm a');
      nextIntervalIsOpen = true;
      openTimeWindowFrameList.push(openTimeWindowFrame);
      openTimeWindowFrame = {};
    }
  });

  // if final daypart closes at 11:59 PM
  if (!nextIntervalIsOpen) {
    openTimeWindowFrame['closes'] = '11:59 PM';
    openTimeWindowFrameList.push(openTimeWindowFrame);
  }

  return openTimeWindowFrameList;
};

const getOpenClose = (todaysSchedule, currentDate) => {
  let open = null;
  let close = null;

  todaysSchedule.forEach(interval => {
    const thisInterval = parser.parseExpression(interval.scheduledExpression, { currentDate }).next();
    if (interval['@c'] !== '.TransitionTask' &&
      (open
        ? (thisInterval._date.hour() < open.hour() ||
        (thisInterval._date.hour() === open.hour() &&
          thisInterval._date.minute() <= open.minute()))
        : true)) {
      open = moment(thisInterval._date).year(currentDate.year()).month(currentDate.month()).date(currentDate.date());
    }
    if (close
      ? (thisInterval._date.hour() > close.hour() ||
      (thisInterval._date.hour() === close.hour() &&
        thisInterval._date.minute() > close.minute()))
      : true) {
      close = moment(thisInterval._date).year(currentDate.year()).month(currentDate.month()).date(currentDate.date());
    }
  });

  return {
    open,
    close
  };
};

export const getCurrentAndFutureTask = (schedule = [], timezone, scheduleTime, daysToAdd) => {
  let currentSession = {};
  const currentDate = scheduleTime ? getCustomFutureTime(timezone, scheduleTime.startTime, daysToAdd) : getCurrentTime(timezone);
  schedule.forEach(interval => {
    const thisInterval = parser.parseExpression(interval.scheduledExpression, { currentDate }).next();
    if (thisInterval._date.hour() < currentDate.hour() ||
        (thisInterval._date.hour() === currentDate.hour() &&
          thisInterval._date.minute() <= currentDate.minute())) {
      currentSession.open = interval;
    }

    if (thisInterval._date.hour() > currentDate.hour() ||
      ((thisInterval._date.hour() === currentDate.hour()) &&
        thisInterval._date.minute() > currentDate.minute())) {
      currentSession.close = currentSession.close || interval;
      currentSession.nextSession = currentSession.nextSession || [];
      currentSession.nextSession.push(interval);
    }
  });
  return currentSession;
};

export const getLastScheduledTask = (schedule = [], timezone, scheduleTime, daysToAdd = 0) => {
  let lastRunCron;
  const currentDate = scheduleTime ? getCustomFutureTime(timezone, scheduleTime.startTime, daysToAdd) : getCurrentTime(timezone);
  schedule.forEach(task => {
    if (!lastRunCron) {
      lastRunCron = task;
    }
    const parsedInterval = parser.parseExpression(task.scheduledExpression, { currentDate }).prev();
    const parsedNextInterval = parser.parseExpression(lastRunCron.scheduledExpression, { currentDate }).prev();
    const interval = moment.duration(parsedInterval._date.diff(currentDate)).asSeconds();
    const lastInterval = moment.duration(parsedNextInterval._date.diff(currentDate)).asSeconds();
    if (interval < 0 && Math.abs(interval) < Math.abs(lastInterval)) {
      lastRunCron = task;
    }
  });
  return lastRunCron;
};

export const getTodaysAvailability = (todaysSchedule = [], timezone, conceptsAvailableNow, daysToAdd = 0) => {

  if (!todaysSchedule.length >= 1) {
    return {
      opens: '',
      closes: '',
      availableNow: false,
      closingIn: -1
    };
  }

  // const currentDate = getCurrentTime(timezone);
  const currentDate = getSpecificTime(timezone, daysToAdd);
  let openWindowTimeFrames = getOpenCloseTimeWindows(todaysSchedule, currentDate);
  let { open, close } = getOpenClose(todaysSchedule, currentDate);

  let toMidnight = false;
  // if the last schedule part isn't a transition to closed, assume the store stays open until 12am.
  if (todaysSchedule[todaysSchedule.length - 1]['@c'] !== '.TransitionTask') {
    toMidnight = true;
  }

  close = toMidnight ? getNextMidNight(daysToAdd) : close;

  return {
    opens: open.format('h:mm a'),
    closes: close.format('h:mm a'),
    availableNow: currentDate.isBetween(open, close) && close.diff(currentDate, 'minutes') !== 0,
    conceptsAvailableNow,
    closingIn: close.diff(currentDate, 'minutes') + 1,
    openWindowTimeFrames
  };
};

export const getCurrentConcepts = (schedule, concepts, timezone, daysToAdd) => {
  const lastRunCron = getLastScheduledTask(schedule, timezone, daysToAdd);
  if (lastRunCron && lastRunCron['@c'] !== '.TransitionTask') {
    return concepts.filter(concept => lastRunCron.displayProfileState.conceptStates.find(c => c.conceptId === concept.id) !== undefined);
  } else {
    return [];
  }
};

export const getAllDaysAvailability = (allDaysSchedule = [], timezone, siteConcepts) => {
  let allDaysAvailability = [];
  allDaysSchedule.forEach(schedule => {
    const todaysSchedule = schedule.todaysSchedule;
    const conceptsAvailableNow = getCurrentConcepts(todaysSchedule, siteConcepts, timezone, schedule.day);
    const availableAt = getTodaysAvailability(todaysSchedule, timezone, conceptsAvailableNow.length > 0, schedule.index);
    allDaysAvailability.push({
      day: schedule.day,
      index: schedule.index,
      availableAt
    });
  });
  return allDaysAvailability;
};
