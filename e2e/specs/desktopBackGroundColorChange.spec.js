// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi');
let conceptPage= require('../pageActions/conceptPage.actions');
const GREEN = '#66ff66';

describe('BUY-34712 Change desktop background color for ondemand', function() {

    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
	    expect(prepareBy().locationPageVisible()).toBe(true);
    });

    it('Change the color of the background', async function () {
        await backOfficeCalls().changeDesktopBGColor(GREEN);     //background color is changed to green
        console.log('saved back ground color successfully');
        browser.refresh();
    });

    it('verify color changed is reflected in the locations page', function () {
        let bgColorNew = homePage().getBackGroundColor();
        console.log(bgColorNew);
        expect(bgColorNew).toBe(GREEN);
    });

    it('verify color in the concepts page.', function() {
        homePage().selectLocation();
        expect(conceptPage().isConceptPageVisible()).toBe(true);
        let bgColorNew = conceptPage().getBackGroundColorConceptPage();
        expect(bgColorNew).toBe(GREEN);
    });
});