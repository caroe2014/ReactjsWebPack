// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let paymentPage= require('../pageActions/paymentPage.actions');
let prepareBy = require('../pageActions/loginPage.actions');

// BUY-30198
describe('Verify cancel button functionality on payment page', () => {

    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
        expect(prepareBy().buyOnDemandLogoVisible()).toBe(true);
    });


    it('verify if you could select a location', function () {
        var locationName = homePage().selectLocation();
        console.log("location name is  " + locationName);
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });


    it('verify if you could select a concept', function () {
        conceptPage().selectAConcept();
        expect(categoryPage().categoryPageVisible()).toBe(true);

    });


    it('verify if you could select a category and items page visible', function () {
        var categoryName = categoryPage().selectACategory();
        expect(itemsPage().fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage().itemsPageVisible()).toBe(true);

    });

    it('Add first item to the cart', function () {
        itemsPage().selectAItem();
        expect(itemsPage().verifyTotalItemsCount()).toBe('1');
    });

    it('should click pay now and be on payment page', function (){
        itemsPage().openCart();
        itemsPage().clickPayNow();
        expect(paymentPage().paymentPageVisible()).toBe(true);
        paymentPage().clickCreditCardOption();
    });

    it('should click the clear button and verify payment fields are cleared', function () {
        paymentPage().switchControlToiFrame();
        paymentPage().enterCardDetails();
        paymentPage().clickClear();
        paymentPage().verifyPaymentFieldsAreCleared();
    });

});