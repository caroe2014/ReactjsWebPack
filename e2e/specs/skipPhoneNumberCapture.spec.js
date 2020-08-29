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

describe('BUY-35541 & BUY-35552 verify can you skip phone number capture, skip button functionality', function() {

    beforeAll('Enable phone number capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(true);
        await displayProfile.setPhoneNumberCaptureRequiredTo(false);
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

    it('verify if you could get to name capture page & skip button is visible', function() {
        itemsPage.clickPayNow();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        expect(phoneNumberPage.isSkipButtonVisible()).toBe(true);
    });

    it('verify could you continue to payment skipping phone number', function() {
        phoneNumberPage.clickSkipButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('verify you still skip phone number after entering phone number', function() {
        paymentPage.clickBackToPhoneNumberPage();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
        phoneNumberPage.enterPhoneNumber("1234567890");
        phoneNumberPage.clickSkipButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickBackToPhoneNumberPage();
        expect(phoneNumberPage.getPhoneNumber()).toBe("");
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(false);
    });
});