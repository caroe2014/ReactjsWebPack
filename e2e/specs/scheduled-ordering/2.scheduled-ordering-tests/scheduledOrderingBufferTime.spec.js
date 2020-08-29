// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const prepareBy = require('../../../pageActions/loginPage.actions')();
const scheduledOrderingPage = require('../../../pageActions/scheduledOrderingPage.actions');
const backOfficeApi = require('../../../backOfficeApiCalls/backOfficeApi')();
const utils = require('../../../wdioHelpers/utils.js');


let intervalTime = 10;
let bufferTime = 10;
let timeSlots;
let firstTimeSlot;
let expectedFirstTimeSlot;


describe('BUY-40402: OnDemand: Verify buffer time of the time slots in scheduled ordering screen', function() {

    it('land on browser and verify the buffer time is not the same as expected time', function() {
        prepareBy.OpenBrowser(true);
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(true);
        scheduledOrderingPage.selectLaterToday();
        expect(scheduledOrderingPage.isTimeSelectBoxVisible()).toBe(true);
        timeSlots = scheduledOrderingPage.getTimeDropDownList();
        firstTimeSlot = utils.getTimeObjectFromString(timeSlots[0].getText());
        expectedFirstTimeSlot = utils.getExpectedFirstTimeSlot(bufferTime, intervalTime);
        expect(firstTimeSlot.getMinutes()).not.toEqual(expectedFirstTimeSlot.getMinutes());
    });

    it('change the buffer time', async function() {
        await backOfficeApi.setBufferTimeForScheduledOrdering(bufferTime);
        console.log('set the buffer time successfully');
        browser.refresh();
    });

    it('verify if buffer time of time slots is respected in scheduled ordering screen', function() {
        scheduledOrderingPage.waitForFindFoodButton();
        scheduledOrderingPage.selectLaterToday();
        timeSlots = scheduledOrderingPage.getTimeDropDownList();
        var firstTimeSlot = utils.getTimeObjectFromString(timeSlots[0].getText());
        var expectedFirstTimeSlot = utils.getExpectedFirstTimeSlot(bufferTime, intervalTime);
        expect(firstTimeSlot.getHours()).toEqual(expectedFirstTimeSlot.getHours());
        expect(firstTimeSlot.getMinutes()).toEqual(expectedFirstTimeSlot.getMinutes());
    });

    it('set it to a different time so that next time test case is run, we see a different buffer time at the start', async function() {
        await backOfficeApi.setBufferTimeForScheduledOrdering(20);
        console.log('set the time to a different buffer time successfully');
        browser.refresh();
        scheduledOrderingPage.waitForFindFoodButton();
    });
});