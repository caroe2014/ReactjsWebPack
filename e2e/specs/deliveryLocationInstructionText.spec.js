// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

var instructionText01 = "Enter below delivery details A12#$";
var instructionText02 = "Enter below delivery details BG67$*&";
describe('BUY-34196 verify if location delivery could be enabled', function() {

    beforeAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(true);
	    await displayProfile.setPickUpTo(false);
        await displayProfile.setDeliveryLocationsInstructionTextTo(instructionText01);
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
    });

    it('verify if you could get to delivery locations instruction text ', function () {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        expect(deliveryLocationPage.getDeliveryInstructionText()).toBe(instructionText01);
    });

    it('update location delivery instruction text', async function () {
        await displayProfile.setDeliveryLocationsInstructionTextTo(instructionText02);
    });

    it('verify if you could get updated delivery locations instruction text ', function () {
	    browser.refresh();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        expect(deliveryLocationPage.getDeliveryInstructionText()).toBe(instructionText02);
    });

    afterAll('disable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
	    await displayProfile.setPickUpTo(true);
    });
});