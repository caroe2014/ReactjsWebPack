// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();
const checkoutPage = require('../../../pageActions/checkoutPage.actions');
const displayProfileAPI = require("../../../backOfficeApiCalls/displayProfileApiBasedOnID")();

describe('BUY-42105 verify if GA show accounts button is enabled when we enter the values for posting account & account number', function() {

    beforeAll('Enable secondary verification posting account', async function () {
        await displayProfileAPI.enablePostingAccount('POSTING_ACCOUNT');
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

    it('verify if show accounts button is enabled after entering the values for account number & posting account', function () {
        paymentPage.enterValuesInGaAccountField('222222');
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(false);
        paymentPage.enterValueInSecondaryVerfField('222222');
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(true);
    });

    afterAll('disable posting account', async function () {
        await displayProfileAPI.enablePostingAccount("NONE");
    });
});