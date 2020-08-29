// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let prepareBy = require('../../../pageActions/loginPage.actions')();
let scheduledOrderingPage = require('../../../pageActions/scheduledOrderingPage.actions');
let homePage = require('../../../pageActions/homePage.actions')();
let displayProfile = require('../../../backOfficeApiCalls/displayProfileApiBasedOnID')();


describe('BUY-40398, BUY-40386: verify find food button enable/disable functionality & timframe option list in scheduled ordering screen', function() {

    it('verify if you could get to scheduledOrderingPage', function () {
        prepareBy.OpenBrowser(true);
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(true);
    });

    it('verify if find food button is disabled when no option is selected', function () {
        scheduledOrderingPage.clickFindFood();
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(true);
    });

    // BUY-40386
    it('verify if ASAP and Later today options are available', function () {
        let timeFrameOptions = scheduledOrderingPage.getTimeFrameDropDownList();
        expect(timeFrameOptions[0].getText().toUpperCase()).toEqual("AS SOON AS POSSIBLE");
        expect(timeFrameOptions[1].getText().toUpperCase()).toEqual("LATER TODAY");
        scheduledOrderingPage.clickOutsideOfTimeFrameSelectBox();
    });

    it('verify later today workflow', function() {
        scheduledOrderingPage.selectLaterToday();
        expect(scheduledOrderingPage.isTimeSelectBoxVisible()).toBe(true);
        scheduledOrderingPage.clickFindFood();
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(true);

        scheduledOrderingPage.selectTime();
        scheduledOrderingPage.clickFindFood();
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(false);
        homePage.getBackToScheduledOrderingPage();
    });

    it('verify ASAP workflow', function() {
        scheduledOrderingPage.selectASAP();
        expect(scheduledOrderingPage.isTimeSelectBoxVisible()).toBe(false);

        scheduledOrderingPage.clickFindFood();
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(false);
    });

});