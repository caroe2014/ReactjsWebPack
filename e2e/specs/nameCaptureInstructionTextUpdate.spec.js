// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let nameCapturePage= require('../pageActions/nameCapturePage.actions')();

var instructionText = "Enter you name buddy";
describe('BUY-38743 verify could you disable name capture functionaly', function() {

    beforeAll('Enable name capture', async function () {
        await displayProfile.setNameCaptureTo(true);
        await displayProfile.setNameCaptureInstructionTextTo(instructionText);
    });

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        var categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
    });

    it('verify if you could get to name capture page and check instruction text', function () {
        expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
        expect(nameCapturePage.instructionText()).toBe(instructionText);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setNameCaptureTo(false);
    });

});