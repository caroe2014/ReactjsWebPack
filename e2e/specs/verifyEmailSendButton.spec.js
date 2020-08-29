// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let mainPage = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-30200 Verify send button functionality for email receipt', () => {

    it('verify could you get to mainpage', function () {
        mainPage.OpenBrowser();
        expect(mainPage.buyOnDemandLogoVisible()).toBe(true);
    });

    it('verify if you could select a location, concept, category', function () {
        expect(mainPage.buyOnDemandLogoVisible()).toBe(true);
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        var categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.selectAItem();
    });

    it('verify if you could click pay now from cart and land in payments page', function() {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickCreditCardOption();
    });

    it('verify if you could make a payment and get receipt', function() {
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });

    it('verify if you could enter email and send', function() {
        paymentPage.enterEmailAndSend();
        expect(paymentPage.isEmailSent()).toBe(true);
    });

});