// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const prepareBy = require('../pageActions/loginPage.actions')();
const itemsPage= require('../pageActions/itemsPage.actions')();
const homePage = require('../pageActions/homePage.actions')();
const conceptPage= require('../pageActions/conceptPage.actions')();
const categoryPage= require('../pageActions/categoriesPage.actions')();
const paymentPage= require('../pageActions/paymentPage.actions')();
const checkoutPage= require('../pageActions/checkoutPage.actions');


describe('BUY-41404 verify footer is not visible on all pages', function () {
    it('verify if you could select a location, concept, category and check theres no footer ', function () {
        prepareBy.OpenBrowser();
        expect(homePage.getFooter()).toBe(false);
        let locationName = homePage.selectLocation();
        expect(homePage.getFooter()).toBe(false);
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(homePage.getFooter()).toBe(false);
        expect(categoryPage.categoryPageVisible()).toBe(true);
        let categoryName = categoryPage.selectACategory();
        expect(homePage.getFooter()).toBe(false);
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
    });

    it('go to payment page, check theres no footer and click credit card option', function () {
        itemsPage.selectAItem();
        expect(homePage.getFooter()).toBe(false);
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(checkoutPage.checkoutPageVisible()).toBe(true);
        expect(homePage.getFooter()).toBe(false);
        checkoutPage.clickOnPayButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        expect(homePage.getFooter()).toBe(false);
        paymentPage.clickCreditCardOption();
    });

    it('verify if you could make a payment and land on confirmation page and check theres no footer', function() {
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();

        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
        expect(homePage.getFooter()).toBe(false);
    });

});