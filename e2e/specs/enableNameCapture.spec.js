// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let nameCapturePage= require('../pageActions/nameCapturePage.actions')();

describe('BUY-37064 verify if name capture could be enabled', function() {

    beforeAll('Enable name capture', async function () {
        await displayProfile.setNameCaptureTo(true);
    });

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
	    expect(prepareBy.locationPageVisible()).toBe(true);
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        var categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.selectAItem();

    });

    it('verify if you could get to name capture page', function() {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setNameCaptureTo(false);
    });

});
