import * as saga from './sagas';
import { cloneableGenerator } from 'redux-saga/utils';

const getScheduleOrderEnabled = require('./sagas').__get__('getScheduleOrderEnabled');
const getScheduleOrderData = require('./sagas').__get__('getScheduleOrderData');

describe('schedule order Saga', () => {
  describe('get Schedule Time', () => {
    const generator = cloneableGenerator(saga.getScheduleTime)();
    let clone;
    beforeEach(() => {
      clone = generator.clone();
      clone.next();
    });
    // it('return schedule time if schedule order enabled', () => {
    //   let scheduleOrderEnabled = true;
    //   const scheduleOrderData = {scheduleType: 'laterToday', scheduleTime: '12:15 PM'};
    //   clone.next(scheduleOrderEnabled);
    //   expect(clone.next(scheduleOrderData).value).toEqual('12:15 PM');
    //   expect(clone.next().done).toEqual(true);
    // });
    // it('return undefined if schedule order enabled', () => {
    //   let scheduleOrderEnabled = false;
    //   const scheduleOrderData = {scheduleType: 'asap', scheduleTime: ''};
    //   clone.next(scheduleOrderEnabled);
    //   expect(clone.next(scheduleOrderData).value).toEqual(undefined);
    //   expect(clone.next().done).toEqual(true);
    // });
  });

  describe('unit test for non export functions', () => {
    const payload = {
      scheduleorder: {
        isScheduleOrderEnabled: true,
        scheduleOrderData: {}
      }
    };
    it('should get schedule order enabled', () => {
      expect(getScheduleOrderEnabled(payload)).toEqual(payload.scheduleorder.isScheduleOrderEnabled);
    });
    it('should get schedule order data', () => {
      expect(getScheduleOrderData(payload)).toEqual(payload.scheduleorder.scheduleOrderData);
    });
    it('should set schedule order config', () => {
      expect(saga.setScheduledStoreConfig({scheduledStoreConfig: {}, enabled: true})).toEqual(
        {'enabled': true, 'scheduledStoreConfig': {}, 'type': 'SCHEDULE_STORE_CONFIG'});
    });
    it('should set schedule order data', () => {
      const scheduleOrderData = {};
      expect(saga.setScheduleOrderData(scheduleOrderData)).toEqual(
        {'scheduleOrderData': {}, 'type': 'SCHEDULE_ORDER_DATA'});
    });
    it('should reset schedule order data', () => {
      expect(saga.resetScheduleOrderData()).toEqual({'type': 'RESET_SCHEDULE_ORDER_DATA'});
    });
    it('should reset schedule order', () => {
      expect(saga.resetScheduleOrder()).toEqual({'type': 'RESET_SCHEDULE_ORDER'});
    });
  });
});
