// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let cartPage = require('../pageActions/cart.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-31746 verify pay button text', function() {

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

    it('verify th pay button text from cart and in payment page', function () {
        itemsPage.openCart();
        var payable =itemsPage.getPayButtonText();
        expect(payable).toContain('CHECKOUT');
        var total = cartPage.getTotalPriceFromCart();
        expect(((total.indexOf('.')))).toBe(2);  //max 2 digits after decimal point in total price
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickCreditCardOption();
        paymentPage.switchControlToiFrame();
        expect(paymentPage.getPayBtnText()).toBe('PROCESS');
    });
});