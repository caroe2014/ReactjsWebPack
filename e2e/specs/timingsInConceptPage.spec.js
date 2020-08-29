// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let mainPage = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');

let storeTiming;

describe('Verify store time in main page & concept pages are same', function() {


    it('verify could you get to mainpage', function () {
        mainPage().OpenBrowser();
        expect(mainPage().buyOnDemandLogoVisible()).toBe(true);
        storeTiming = mainPage().getStoreTimingFromMainPage();
    });


    it('Land in concepts page, fetch & verify store timings', function() {
        homePage().selectLocation();
        expect(conceptPage().getStoreTimingConceptPage()).toBe(storeTiming);
    });



});