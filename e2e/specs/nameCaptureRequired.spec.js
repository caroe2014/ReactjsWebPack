// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let nameCapturePage= require('../pageActions/nameCapturePage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-37068 Verify could you not skip the name capture when set to required', function() {
    
    beforeAll('Enable name capture', async function () {
        await displayProfile.setNameCaptureTo(true);
        await displayProfile.setNameCaptureRequiredTo(true);
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

    it('verify if you could get to name capture page and continue without entering name', function() {
        expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
        nameCapturePage.clickContinueToPay();
        expect(nameCapturePage.verifyIfNameRequired()).toBe(true);
        nameCapturePage.enterName('Vikram', 'P');
        nameCapturePage.clickContinueToPay();
    });

    it('verify if you could continue to payment and make payment', function() {
        expect(paymentPage.paymentPageVisible()).toBe(true);
	    paymentPage.clickCreditCardOption();
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setNameCaptureTo(false);
    });
});