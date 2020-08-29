// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let paymentPage= require('../pageActions/paymentPage.actions');


describe('Complete workflow of web ordering', function() {


    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
        expect(prepareBy().buyOnDemandLogoVisible()).toBe(true);
    });


    it('verify if you could select a location', function() {
        var locationName = homePage().selectLocation();
        console.log("location name is  "+locationName);
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });


    it('verify if you could select a concept', function() {
        conceptPage().selectAConcept();
        expect(categoryPage().categoryPageVisible()).toBe(true);

    });


    it('verify if you could select a category', function() {
        var categoryName = categoryPage().selectACategory(1);
        expect(itemsPage().fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage().itemsPageVisible()).toBe(true);

    });


    it('verify if you could customize and add an item to the cart', function()
    {
        itemsPage().selectAItem();
        itemsPage().customizeItem();
        itemsPage().clickAddToCartModifiersPage();
        expect(itemsPage().verifyTotalItemsCount()).toBe('1');
        itemsPage().openCart;

    });


});