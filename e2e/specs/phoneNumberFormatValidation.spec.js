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

describe('BUY-35542 verify if phone number format and validations', function() {

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
        itemsPage.openCart();
    });

    it('verify if you could get to name capture page', function() {
        itemsPage.clickPayNow();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
    });

    it('verify phone number field takes max 10 characters', function() {
        phoneNumberPage.enterPhoneNumber("1234567890123");
        expect(phoneNumberPage.getPhoneNumber()).toBe("123-456-7890");
        phoneNumberPage.clearField();
    });

    it('verify phone number field should have minimum 10 characters', function() {
        phoneNumberPage.enterPhoneNumber("1234567");
        phoneNumberPage.clickContinueToPay();
        expect(phoneNumberPage.isValidationErrorVisible()).toBe(true);
        phoneNumberPage.clearField();
    });

    it('verify phone number field should not accept alphabets, special chars characters', function() {
        phoneNumberPage.enterPhoneNumber("12345ab$%^");
        expect(phoneNumberPage.getPhoneNumber()).toBe("123-45");
        phoneNumberPage.clearField();
    });

    it('verify could you continue to payment with valid phone number', function() {
        phoneNumberPage.enterPhoneNumber("1234567890");
        phoneNumberPage.clickContinueToPay();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(false);
    });
});