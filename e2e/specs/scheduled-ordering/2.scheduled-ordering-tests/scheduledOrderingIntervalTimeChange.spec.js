// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const prepareBy = require('../../../pageActions/loginPage.actions')();
const scheduledOrderingPage = require('../../../pageActions/scheduledOrderingPage.actions');
const configChange = require('../../../backOfficeApiCalls/backOfficeApi')();

const expectedIntervalTime = 5;

let timeSlot;
let intervalTime;

describe('BUY-40400 verify changing the interval time and see the new time on scheduled ordering page ', function () {
    it('land on browser and verify the interval time is not the same as expected time', function() {
        prepareBy.OpenBrowser(true);
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(true);
        scheduledOrderingPage.selectLaterToday();
        expect(scheduledOrderingPage.isTimeSelectBoxVisible()).toBe(true);
        timeSlot = scheduledOrderingPage.selectTime();
        intervalTime = scheduledOrderingPage.calculateIntervalTime(timeSlot);
        expect(intervalTime).not.toBe(expectedIntervalTime);
    });

    it('change the interval time', async function() {
        await configChange.setIntervalTimeForScheduledOrdering(5);
        console.log('set the interval time successfully');
        browser.refresh();
    });

    it('verify the interval time matches expected duration', function() {
        scheduledOrderingPage.waitForFindFoodButton();
        scheduledOrderingPage.selectLaterToday();
        expect(scheduledOrderingPage.isTimeSelectBoxVisible()).toBe(true);
        timeSlot = scheduledOrderingPage.selectTime();
        intervalTime = scheduledOrderingPage.calculateIntervalTime(timeSlot);
        expect(intervalTime).toBe(expectedIntervalTime);
    });

    it('set it to a different different time so that next time test case is run, we see a different interval time at the start', async function() {
        await configChange.setIntervalTimeForScheduledOrdering(15);
        console.log('set the time to a different interval time successfully');
        browser.refresh();
    });

    it('verify the interval is not the same as expected duration used for this test case ', function() {
        scheduledOrderingPage.waitForFindFoodButton();
        scheduledOrderingPage.selectLaterToday();
        expect(scheduledOrderingPage.isTimeSelectBoxVisible()).toBe(true);
        timeSlot = scheduledOrderingPage.selectTime();
        intervalTime = scheduledOrderingPage.calculateIntervalTime(timeSlot);
        expect(intervalTime).not.toBe(expectedIntervalTime);
    });
});