'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let paymentPage= require('../pageActions/paymentPage.actions');

var locationName;

describe('Complete workflow of web ordering', function() {


    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
	    expect(prepareBy().locationPageVisible()).toBe(true);
    });


    it('verify if you could select a location', function() {
        locationName = homePage().selectLocation();
        console.log("location name is  "+locationName);
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });


    it('verify if you could select a concept', function() {
        conceptPage().selectAConcept();
        expect(categoryPage().categoryPageVisible()).toBe(true);

    });


    it('verify if you could select a category', function() {
        var categoryName = categoryPage().selectACategory();
        expect(itemsPage().fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage().itemsPageVisible()).toBe(true);

    });


    it('verify if you could add an item to the cart', function()
    {
        itemsPage().selectAItem();
    });


    it('verify if you could click pay now from cart and land in payments page', function()
    {
        itemsPage().openCart();
        itemsPage().clickPayNow();
        expect(paymentPage().paymentPageVisible()).toBe(true);
	    paymentPage().clickCreditCardOption();
    });


    it('verify if you could make a payment and get receipt page', function()
    {
        paymentPage().switchControlToiFrame();
        paymentPage().enterCardDetails();
        paymentPage().clickPay();
        paymentPage().switchToAppContainer();
        expect(paymentPage().isPaymentSuccessful()).toBe(true);

    });


    it('click back to main page button from receipt page and verify you are on concepts page', function()
    {
        paymentPage().clickNoThanks();
	    expect(prepareBy().locationPageVisible()).toBe(true);
    });

});