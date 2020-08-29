// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-35047, BUY-35049 CVV field minimum & maximun field is enforced, BUY-35051 Only numeric values in cvv', function() {

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

    it('verify if you could check CVV field maximum', function() {
        paymentPage.switchControlToiFrame();
        paymentPage.enterCVV("123456");
        expect(paymentPage.getCVVFromPaymentPage()).toBe("1234");
    });

    it('verify if you could check CVV field minimum', function() {
        paymentPage.enterCVV("12");
        paymentPage.clickPay();
        expect(paymentPage.isCVVValidationErrorVisible()).toBe(true);
    });

    it('verify if you could enter only numeric values in CVV field ', function() {
        paymentPage.enterCVV("12a$");
        expect(paymentPage.getCVVFromPaymentPage()).toBe("12");
    });
});