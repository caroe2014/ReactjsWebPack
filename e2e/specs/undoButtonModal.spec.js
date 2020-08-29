// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let prepareBy = require('../pageActions/loginPage.actions');

// BUY-30206
describe('Verify undo button on the cart popup web ordering', () => {

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

    it('should click undo and remove the changes to the cart', function () {
        itemsPage().clickUndo();
        itemsPage().openCart();
        expect(itemsPage().isCartBadgeVisible()).toBe(false);
        expect(itemsPage().cartSummaryText()).toContain("There are no items in your cart");
    });

});