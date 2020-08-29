// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();
const commonStrings = require('../../../wdioHelpers/commonStrings');
const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();
const customGADisplayLabel = 'GA Account';
const customGAPaymentInstructionText = 'GA Account Custom Instruction';

describe('BUY-42015 Verify custom display label and instruction text for GA payment set is reflected in application', function() {

    beforeAll('Set Custom display label and Instruction', async function () {
        await displayProfileAPI.setGaMethodName(customGADisplayLabel);
        await displayProfileAPI.setGaInstructionTextTo(customGAPaymentInstructionText);
    });

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

    it('verify if you could get to payment page and verify if GA payment option is visible and matches the custom text set', function () {
        expect(paymentPage.gaPaymentOptionVisible()).toBe(true);
        expect(paymentPage.gaPaymentMethodName()).toBe(customGADisplayLabel);
    });

    it('verify ga modal pops up after clicking on ga method and verify ga modal header is the same as payment label text', function () {
        paymentPage.clickGaOption();
        paymentPage.waitForGaModal();
        expect(paymentPage.gaPaymentModalHeader()).toBe(customGADisplayLabel);
    });

    it('verify ga custom instruction text in the ga payment modal', function () {
        expect(paymentPage.gaPaymentInstructionText()).toBe(customGAPaymentInstructionText);
    });

    afterAll('Reverting back to default display label and instruction text', async function () {
        await displayProfileAPI.setGaMethodName(commonStrings.genericAuthorizationText.gaPaymentLabel);
        await displayProfileAPI.setGaInstructionTextTo(commonStrings.genericAuthorizationText.gaModalInstructionText);
    });

});