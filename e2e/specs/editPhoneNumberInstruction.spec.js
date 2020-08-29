// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let phoneNumberPage= require('../pageActions/phoneNumberCapturePage.actions')();

var instructionText1 = "Enter phone buddy";
var instructionText2 = "Enter Ph number 123$%&";
var instructionText3 = "";
describe('BUY-35543 & BUY-35545 verify if phone number instruction text can be updated & deleted', function() {

    beforeAll('Enable phone number capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(true);
        await displayProfile.setPhoneNumberInstructionTextTo(instructionText1);
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
    });

    it('verify if you could get to name capture page & verify instruction text set', function() {
        itemsPage.clickPayNow();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        expect(phoneNumberPage.getPhonePageInstruction()).toBe(instructionText1);
    });

    it('update instruction text', async function () {
        await displayProfile.setPhoneNumberInstructionTextTo(instructionText2);
    });


    it('verify if you could refresh and verify updated instruction text set', function() {
	    browser.refresh();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        expect(phoneNumberPage.getPhonePageInstruction()).toBe(instructionText2);
    });

    it('delete instruction text', async function () {
        await displayProfile.setPhoneNumberInstructionTextTo(instructionText3);
    });

    it('verify if you could refresh and verify updated instruction text set', function() {
	    browser.refresh();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        expect(phoneNumberPage.isPhoneNumberInstructionVisible()).toBe(false);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(false);
    });

});