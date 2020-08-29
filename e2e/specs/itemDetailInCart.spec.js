// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let myCart = require('../pageActions/cart.actions');

var itemDetails;

describe('verify item details shown in item details page is shown in cart', function() {


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


    it('verify if you could select a category', function () {
        var categoryName = categoryPage().selectACategory();
        expect(itemsPage().fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage().itemsPageVisible()).toBe(true);

    });


    it('verify if you could add an item to the cart', function () {
        itemDetails = itemsPage().selectAItem();
        expect(itemsPage().verifyTotalItemsCount()).toBe('1');
    });


    it('verify item details in cart', function () {
        console.log('itemdetails -> ' +itemDetails);
        itemsPage().openCart();
        var item = myCart().getItemDetailsFromCart();
        expect(itemDetails).toContain(item.substring(0,14));
    });


});