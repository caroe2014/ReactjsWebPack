// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-33732 & BUY-33727 verify store change model popup appears only on adding cart from other store', function() {

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

        //go back to locations page
        itemsPage.getBackToCategoryPage();
        categoryPage.getBackToConceptPage();
        conceptPage.clickChangeLocation();
        expect(prepareBy.locationPageVisible()).toBe(true);
    });

    it('verify if you could navigate in other location without modal popup', function () {
        var locationName = homePage.selectLocation(1);
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        categoryPage.selectACategory();
        expect(itemsPage.itemsPageVisible()).toBe(true);
    });

    it('verify if you could see modal popup on adding item to cart from other store', function () {
        itemsPage.selectAItem(1);
        expect(itemsPage.isModalPopupVisible()).toBe(true);
    });

});