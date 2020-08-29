// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let mainPage = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let prepareBy = require('../pageActions/loginPage.actions');


describe('Verify could you land in main page & verify its features', function() {


    it('verify could you get to mainpage', function () {
        mainPage().OpenBrowser();
	    expect(prepareBy().locationPageVisible()).toBe(true);
    });

    it('verify store name is displayed', function () {
        expect(mainPage().isStoreNameVisible()).toBe(true);
    });

    it('verify store address is displayed', function () {
        expect(mainPage().isStoreAddressVisible()).toBe(true);
    });

    it('verify store timings are displayed', function () {
        expect(mainPage().isStoreTimingVisible()).toBe(true);
    });

    it('verify store open/close status in the image overlay', function() {
        mainPage().hoverOverLocationTile();
        expect(mainPage().statusImageOverlay()).toBe("OPEN");
    });

    it('verify if you could select a location', function() {
        var locationName = homePage().selectLocation();
        console.log("location selected!")
        console.log("location name is  "+locationName);
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });



});