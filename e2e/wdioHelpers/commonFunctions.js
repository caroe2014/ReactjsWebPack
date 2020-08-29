// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../pageActions/homePage.actions')();
const conceptPage= require('../pageActions/conceptPage.actions')();
const categoryPage= require('../pageActions/categoriesPage.actions')();
const itemsPage= require('../pageActions/itemsPage.actions')();

class commonFunctions {

    addAnItem() {
        let locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        let categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.selectAItem();
    }
}

module.exports = new commonFunctions();