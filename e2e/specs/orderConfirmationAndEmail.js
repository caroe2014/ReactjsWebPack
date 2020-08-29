// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let paymentPage= require('../pageActions/paymentPage.actions');

let order;
let locationName;
describe('Payment confirmation & email confirmation pages of web ordering', function() {


    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
    });

    it('verify if you could select a location', function() {
        locationName = homePage().selectLocation();
        console.log("location selected!")
        console.log("location name is  "+locationName);
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });


    it('select a category, category & add item', function() {
        conceptPage().selectAConcept();
        expect(categoryPage().categoryPageVisible()).toBe(true);
        var categoryName = categoryPage().selectACategory();
        expect(itemsPage().fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage().itemsPageVisible()).toBe(true);
        itemsPage().selectAItem();
    });


    it('verify if you could click pay now from cart and land in payments page', function()
    {
        itemsPage().openCart();
        itemsPage().clickPayNow();
        expect(paymentPage().paymentPageVisible()).toBe(true);
	    paymentPage().clickCreditCardOption();
    });


    it('verify if you could make a payment and get receipt', function()
    {
        paymentPage().switchControlToiFrame();
        paymentPage().enterCardDetails();
        paymentPage().clickPay();

        paymentPage().switchToAppContainer();
        expect(paymentPage().isPaymentSuccessful()).toBe(true);
        order = paymentPage().getOrderNumber();
    });


    it('verify if you could enter email and send, verify info on email confirmation page', function()
    {
        paymentPage().enterEmailAndSend();
        expect(paymentPage().isEmailSent()).toBe(true);
        expect(order).toBe(paymentPage().getOrderFromEmailConfirmationPage());
        expect(paymentPage().getEmailId()).toBe(paymentPage().getEmailIdFromEmailConfirmationPage());
    });

    it('verify if you could land in concept page(home) from confirmation page', function()
    {
        paymentPage().clickHome();
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });

});
