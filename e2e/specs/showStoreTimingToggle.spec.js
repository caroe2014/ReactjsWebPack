// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';

let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi');
let mainPage = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');


describe('BUY-34713 BUY-34714 Verify show store timing toggle changes are reflected in ondemand', function() {

    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
        expect(prepareBy().buyOnDemandLogoVisible()).toBe(true);
    });

    it('set the show store timing toggle to false', async function () {
        await backOfficeCalls().setStoreShowTimingTo(false);
        console.log('saved show store timing is set to OFF successfully');
        browser.refresh();
    });

    it('verify store timings are not displayed in locations page', function () {
        expect(mainPage().isStoreTimingVisible()).toBe(false);
    });

    it('verify timings are not displayed in concept page', function () {
        homePage().selectLocation();
        expect(conceptPage().isStoreTimingVisibleConceptPage()).toBe(false);
        conceptPage().clickChangeLocation();
    });

    it('set the show store timing toggle to true', async function () {
        await backOfficeCalls().setStoreShowTimingTo(true);
        console.log('saved show store timing is set to ON successfully');
        browser.refresh();
    });

    it('verify store timings are not displayed', function () {
        expect(mainPage().isStoreTimingVisible()).toBe(true);
    });

    it('verify timings are displayed in concept page', function () {
        homePage().selectLocation();
        expect(conceptPage().isStoreTimingVisibleConceptPage()).toBe(true);
    });

});