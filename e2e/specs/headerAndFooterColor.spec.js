// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi');
let VIOLET = '#c44dff';

describe('BUY-34922 Verify header and footer color change', function() {

    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
	    expect(prepareBy().locationPageVisible()).toBe(true);
    });


    it('Change the color of the header/footer', async function () {
        await backOfficeCalls().changeHeaderFooterColor(VIOLET);     //background color is changed to violet
        console.log('saved header and footer color successfully');
        browser.refresh();
    });

    it('verify header color changed is reflected in the locations page', function () {
        expect(homePage().getHeaderColor()).toBe(VIOLET);
    });

});