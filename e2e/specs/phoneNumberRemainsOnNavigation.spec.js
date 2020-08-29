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

describe('BUY-35551 verify phone number entered remains on navigation', function() {

    beforeAll('Enable phone number capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(true);
        await displayProfile.setPhoneNumberCaptureRequiredTo(true);
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

    it('verify could you enter phone number & continue to payment', function() {
        itemsPage.clickPayNow();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        phoneNumberPage.enterPhoneNumber("1234567890");
        phoneNumberPage.clickContinueToPay();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('verify you still see phone number going back from payment page', function() {
        paymentPage.clickBackToPreviousPage();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        expect(phoneNumberPage.getPhoneNumber()).toBe("123-456-7890");
    });

    it('verify you still see phone number going back to items page and back', function() {
        phoneNumberPage.clickBackToItemsPage();
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        expect(phoneNumberPage.getPhoneNumber()).toBe("123-456-7890");
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(false);
    });
});