// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-35052 verify the zip-postal code allowed inputs', function() {

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

    it('verify if you could check ZIP field maximum', function() {
        paymentPage.switchControlToiFrame();
        paymentPage.enterZIP("123456789012345");
        expect(paymentPage.getZIPFromPaymentPage()).toBe("123456789012");
    });

    it('verify if you could check ZIP field minimum', function() {
        paymentPage.enterZIP("12");
        paymentPage.clickPay();
        expect(paymentPage.isZIPValidationErrorVisible()).toBe(true);
    });

    it('verify if you could enter only alpha-numeric values in ZIP field, no special chars allowed ', function() {
        paymentPage.enterZIP("12$adAS&");
        expect(paymentPage.getZIPFromPaymentPage()).toBe("12adAS");
    });
});