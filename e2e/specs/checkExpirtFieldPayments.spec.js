// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-35055 verify the expiry date allowed inputs', function() {

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
    });

    it('verify if you could click pay now from cart and land in payments page', function () {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
	    paymentPage.clickCreditCardOption();
    });

    it('verify expiry year field minimum 4 chars', function() {
        paymentPage.switchControlToiFrame();
        paymentPage.enterExpiryYear("123");
        paymentPage.clickPay();
        expect(paymentPage.isExpiryValidationErrorVisible()).toBe(true);
    });

    it('verify if you could enter only numeric values in exp year', function() {
        paymentPage.enterExpiryYear("12$a");
        expect(paymentPage.getExpiryYear()).toBe("12");
    });

    it('verify expiry month field maximum 2 chars', function() {
        paymentPage.enterExpiryMonth("1234");
        expect(paymentPage.getExpiryMonth()).toBe("12");
    });

    it('verify expiry month field chops invalid month', function() {
        paymentPage.enterExpiryMonth("8888");
        expect(paymentPage.getExpiryMonth()).toBe("08");
    });
});