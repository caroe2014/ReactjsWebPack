// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import * as scheduleUtils from './schedule';
import envConfig from 'env.config';
import MockNow from '../../test/mockNow';

const MOCK_TIME_ZONE = 'America/Bogota';

envConfig.tenants = {
  2600: {
    stores: {
      'mock-context-id': {
        timezone: MOCK_TIME_ZONE
      }
    }
  }
};

let mockSchedule = {
  'tenantId': 2600,
  'contextId': 'mock-context-id',
  tasks: [
    {
      scheduledExpression: '0 0 5 * * SUN',
      properties: {}
    },
    {
      scheduledExpression: '0 0 10 * * SUN',
      properties: {}
    },
    {
      scheduledExpression: '0 0 22 * * SUN',
      properties: {}
    },
    {
      scheduledExpression: '0 0 23 * * SUN',
      properties: {
        TRANSITION_MESSAGE: 'hello'
      }
    }
  ]
};

let mockNow = new MockNow();
let schedule;

describe('Schedule Utils', () => {
  beforeEach(() => {
    schedule = JSON.parse(JSON.stringify(mockSchedule));
  });

  afterEach(() => {
    mockNow.reset();
  });

  describe('should getTodaysAvailability', () => {

    it('when store is open', () => {
      mockNow.setTime('2017-12-31T12:01:00-05:00');
      let availability = scheduleUtils.getTodaysAvailability(schedule.tasks, MOCK_TIME_ZONE, '');

      expect(availability).toEqual({
        opens: '5:00 am',
        closes: '12:00 am',
        availableNow: true,
        conceptsAvailableNow: '',
        openWindowTimeFrames: [],
        closingIn: availability.closingIn
      });
    });

    it('when store is closed', () => {
      mockNow.setTime('2017-12-31T23:01:00-05:00');
      let availability = scheduleUtils.getTodaysAvailability(schedule.tasks, MOCK_TIME_ZONE, '');
      expect(availability).toEqual({
        opens: '5:00 am',
        closes: '12:00 am',
        availableNow: true,
        conceptsAvailableNow: '',
        openWindowTimeFrames: [],
        closingIn: availability.closingIn
      });
    });

    it('before store is open', () => {
      mockNow.setTime('2017-12-31T04:00:00-05:00');
      let availability = scheduleUtils.getTodaysAvailability(schedule.tasks, MOCK_TIME_ZONE, '');
      expect(availability).toEqual({
        opens: '5:00 am',
        closes: '12:00 am',
        availableNow: false,
        conceptsAvailableNow: '',
        openWindowTimeFrames: [],
        closingIn: availability.closingIn
      });
    });

    it('and be ok if no schedule for current day', () => {
      mockNow.setTime('2017-12-30T04:00:00-05:00');
      let availability = scheduleUtils.getTodaysAvailability([], MOCK_TIME_ZONE);
      expect(availability).toEqual({
        opens: '',
        closes: '',
        availableNow: false,
        closingIn: -1
      });
    });

    it(`and assume the store stays open until 12am if last schedule part isn't a transition to closed`, () => {
      mockNow.setTime('2017-12-31T12:00:00-05:00');
      schedule.tasks.push({
        scheduledExpression: '0 30 23 * * SUN',
        properties: {}
      });
      let availability = scheduleUtils.getTodaysAvailability(schedule.tasks, MOCK_TIME_ZONE, '');
      expect(availability).toEqual({
        opens: '5:00 am',
        closes: '12:00 am',
        availableNow: true,
        conceptsAvailableNow: '',
        openWindowTimeFrames: [],
        closingIn: availability.closingIn
      });
    });
  });

  describe('should getLastScheduledTask', () => {
    it('happy path', () => {
      mockNow.setTime('2017-12-31T12:00:00-05:00');
      expect(scheduleUtils.getLastScheduledTask(schedule.tasks, MOCK_TIME_ZONE)).toBe(schedule.tasks[1]);
    });

    it('before first task is scheduled', () => {
      mockNow.setTime('2017-12-31T02:00:00-05:00');
      expect(scheduleUtils.getLastScheduledTask(schedule.tasks, MOCK_TIME_ZONE)).toBe(schedule.tasks[3]);
    });

    it('if no tasks for day', () => {
      mockNow.setTime('2017-12-30T12:00:00-05:00');
      const todaySchedule = scheduleUtils.getTodaysSchedule(schedule, MOCK_TIME_ZONE);
      expect(scheduleUtils.getLastScheduledTask(todaySchedule, MOCK_TIME_ZONE)).toBe(undefined);
    });
  });

  describe('should getCurrentAndFutureTask', () => {
    it('happy path', () => {
      mockNow.setTime('2017-12-31T12:00:00-05:00');
      let resultData = {
        close: schedule.tasks[2],
        nextSession: [
          schedule.tasks[2],
          schedule.tasks[3]
        ],
        open: schedule.tasks[1]
      };
      expect(scheduleUtils.getCurrentAndFutureTask(schedule.tasks, MOCK_TIME_ZONE)).toEqual(resultData);
    });

    it('before first task is scheduled', () => {
      mockNow.setTime('2017-12-31T02:00:00-05:00');
      let resultData = {
        close: schedule.tasks[0],
        nextSession: schedule.tasks
      };
      expect(scheduleUtils.getCurrentAndFutureTask(schedule.tasks, MOCK_TIME_ZONE)).toEqual(resultData);
    });

    it('if no tasks for day', () => {
      mockNow.setTime('2017-12-30T12:00:00-05:00');
      expect(scheduleUtils.getCurrentAndFutureTask([], MOCK_TIME_ZONE)).toEqual({});
    });
  });
});
