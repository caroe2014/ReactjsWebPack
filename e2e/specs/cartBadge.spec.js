// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');


describe('Verify cart badge is updated when items are added or deleted', function() {


    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
        expect(prepareBy().locationPageVisible()).toBe(true);
    });


    it('verify if you could select a location', function() {
        var locationName = homePage().selectLocation();
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });


    it('select a category and category', function() {
        conceptPage().selectAConcept();
        expect(categoryPage().categoryPageVisible()).toBe(true);
        var categoryName = categoryPage().selectACategory();
        expect(itemsPage().fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage().itemsPageVisible()).toBe(true);
    });


    it('Verify cart badge is visible & item count is updated when items are added or deleted', function()
    {
        expect(itemsPage().isCartBadgeVisible()).toBe(false);
        itemsPage().selectAItem();
        itemsPage().openCart();
        expect(itemsPage().isCartBadgeVisible()).toBe(true);
        expect(itemsPage().verifyTotalItemsCount()).toBe('1');
        itemsPage().deleteItemFromCart();
        expect(itemsPage().isCartBadgeVisible()).toBe(false);
	    expect(itemsPage().cartSummaryText()).toContain("There are no items in your cart");
    });

});
