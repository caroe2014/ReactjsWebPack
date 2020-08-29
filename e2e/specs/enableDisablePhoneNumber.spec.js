// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let phoneNumberPage= require('../pageActions/phoneNumberCapturePage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-35500 & BUY-35538 verify if phone number capture could be enabled and disabled', function() {

    beforeAll('Enable phone number capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(true);
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

    it('verify if you could get to name capture page', function() {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
    });

    it('disable name capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(false);
    });

    it('verify if you could get to items page on refresh', function () {
        browser.refresh();
	    expect(itemsPage.itemsPageVisible()).toBe(true);
	    itemsPage.selectAItem();
    });

    it('verify if you could get to name capture page', function() {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(false);
    });
});