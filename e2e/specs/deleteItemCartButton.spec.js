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
	    expect(prepareBy().locationPageVisible()).toBe(true);
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


    it('verify if you could delete the item from the cart using delete button in cart', function () {
        itemsPage().openCart();
        itemsPage().deleteItemFromCart();
	    expect(itemsPage().isCartBadgeVisible()).toBe(false);
        expect(itemsPage().cartSummaryText()).toContain("There are no items in your cart");
    });
});