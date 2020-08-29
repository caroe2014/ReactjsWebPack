// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();

describe('BUY-42163, BUY-42164 Verify "X" button and "Cancel" button in GA account lookup popup dismisses the popup	', function() {

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

    it('verify if you could get to GA payment page and verify if modal pops up after clicking on ga method and show accounts button is not enabled', function () {
        expect(paymentPage.gaPaymentOptionVisible()).toBe(true);
        paymentPage.clickGaOption();
        paymentPage.waitForGaModal();
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(false);
    });

    it('verify if show accounts button is enabled after entering the values for account number & posting account', function () {
        paymentPage.enterValuesInGaAccountField('222222');
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(true);
    });

    //BUY-42163 Verify "Cancel" button in GA account lookup popup dismisses the popup
    it('verify cancel button dismisses the ga account lookup popup on click', function () {
        paymentPage.clickGaCancelButton();
        expect(paymentPage.isGaModalVisible()).toBe(false);
    });

    it('verify if you could get to GA payment page and verify if modal pops up after clicking on ga method and show accounts button is not enabled', function () {
        expect(paymentPage.gaPaymentOptionVisible()).toBe(true);
        paymentPage.clickGaOption();
        paymentPage.waitForGaModal();
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(false);
    });

    it('verify if show accounts button is enabled after entering the values for account number & posting account', function () {
        paymentPage.enterValuesInGaAccountField('222222');
        expect(paymentPage.isGaShowAccountsButtonEnabled()).toBe(true);
    });

     //BUY-42164 Verify "X" button in GA account lookup popup dismisses the popup
     it('verify "X" button dismisses the ga account lookup popup on click', function () {
        paymentPage.clickGaXButton();
        expect(paymentPage.isGaModalVisible()).toBe(false);
    });
      
});