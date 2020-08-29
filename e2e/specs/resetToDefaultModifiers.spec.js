// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let mainPage = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();

describe('BUY-30151 verify choice group modifiers are reset on reset to default', function() {

    it('verify could you get to mainpage', function () {
        mainPage.OpenBrowser();
        expect(mainPage.buyOnDemandLogoVisible()).toBe(true);
    });

    it('verify if you could select a location, concept, category', function () {
        expect(mainPage.buyOnDemandLogoVisible()).toBe(true);
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        var categoryName = categoryPage.selectACategory(1);
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
    });

    it('verify if you could open item with modifier and customize it', function() {
        itemsPage.selectAItem();
        itemsPage.customizeItem();
    });

    it('verify you cannot reset the modifier and add it', function() {
        itemsPage.clickResetToDefault();
        itemsPage.clickAddToCartModifiersPage();
        expect(itemsPage.isItemAdded()).toBe(false);
    });

});