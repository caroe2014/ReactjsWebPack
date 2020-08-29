// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();
const checkoutPage = require('../../../pageActions/checkoutPage.actions');
const commonStrings = require('../../../wdioHelpers/commonStrings');

describe('BUY-42103, BUY-42104 and BUY-42106 verify if GA show accounts button is disabled when modal opens and enables when we enter the values and shows error for invalid account number', function() {

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
        expect(checkoutPage.checkoutPageVisible()).toBe(true);
        checkoutPage.clickOnPayButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('verify if you could get to GA payment page and verify if modal pops up after clicking on ga method and show accounts button is not enabled', function () {
        expect(paymentPage.gaPaymentOptionVisible()).toBe(true);
        paymentPage.clickGaOption();
        paymentPage.waitForGaModal();
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(false);
    });

    //BUY-42104
    it('verify if show accounts button is enabled after entering the values for account number', function () {
        paymentPage.enterValuesInGaAccountField('222222');
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(true);
    });

    //BUY-42106
    it('verify you see the error message when invalid number is used', function () {
        paymentPage.clickGaShowAccountsButton();
        expect(paymentPage.getGaErrorText()).toBe(commonStrings.genericAuthorizationText.gaAccountErrorText);
    });
});