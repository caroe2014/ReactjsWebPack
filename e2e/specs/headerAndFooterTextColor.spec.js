// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi');
let YELLOW = '#ffff33';

describe('BUY-34923 Verify header and footer text color change', function() {

    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
	    expect(prepareBy().locationPageVisible()).toBe(true);
    });


    it('Change the color of the header/footer', async function () {
        await backOfficeCalls().changeHeaderFooterTextColor(YELLOW);     //background color is changed to yellow
        console.log('saved header and footer text color successfully');
        browser.refresh();
    });

    it('verify header color changed is reflected in the locations page', function () {
        expect(homePage().getHeaderTextColor()).toBe(YELLOW);
    });

});