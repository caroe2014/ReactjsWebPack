// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();
const commonStrings = require('../../../wdioHelpers/commonStrings');

describe('BUY-42003, BUY-42005, BUY-42007 & BUY-45815 verify if GA payment is enabled and ga modal pops up after clicking on ga method and verify default instruction header and instruction text', function() {

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
        expect(prepareBy.locationPageVisible()).toBe(true);
        let locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        let categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
    });

    it('verify if you could add an item and get to payment page', function () {
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    //BUY-42007 Verify GA payment tile and the account details popup header reads the same
    it('verify if you could get to payment page and verify if GA payment option is visible and matches the text for the name set', function () {
        expect(paymentPage.gaPaymentOptionVisible()).toBe(true);
        expect(paymentPage.gaPaymentMethodName()).toBe(commonStrings.genericAuthorizationText.gaPaymentLabel);
    });

    //BUY-42007, BUY-42005 Verify GA payment option when clicked, opens a model to enter GA account details
    it('verify ga modal pops up after clicking on ga method and verify ga modal header is the same as payment label text', function () {
        paymentPage.clickGaOption();
        paymentPage.waitForGaModal();
        expect(paymentPage.gaPaymentModalHeader()).toBe(commonStrings.genericAuthorizationText.gaPaymentLabel);
    });

    //BUY-45815 Verify default instruction text for GA payment is reflected in application
    it('verify ga default instruction text in the ga payment modal', function () {
        expect(paymentPage.gaPaymentInstructionText()).toBe(commonStrings.genericAuthorizationText.gaModalInstructionText);
    });

});