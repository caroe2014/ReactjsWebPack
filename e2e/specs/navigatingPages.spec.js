// (C) 2018 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';


let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let paymentPage= require('../pageActions/paymentPage.actions');

let locationName;

describe('Navigate to all pages and back to the main page for web ordering', function() {


    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
        expect(prepareBy().buyOnDemandLogoVisible()).toBe(true);
    });


    it('verify if you could land in concept page', function () {
        locationName = homePage().selectLocation();
        console.log("location name is  " + locationName);
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });


    it('verify if you could land in the categories page', function () {
        conceptPage().selectAConcept();
        expect(categoryPage().categoryPageVisible()).toBe(true);

    });


    it('verify if you could land in items page', function () {
        let categoryName = categoryPage().selectACategory();
        expect(itemsPage().fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage().itemsPageVisible()).toBe(true);
        itemsPage().selectAItem();
    });


    it('verify if you could click pay now from cart and land in payments page', function () {
        itemsPage().openCart();
        itemsPage().clickPayNow();
        expect(paymentPage().paymentPageVisible()).toBe(true);
    });


    it('verify if you could navigate back to items page', function () {
        paymentPage().clickBackToPreviousPage();
        expect(itemsPage().itemsPageVisible()).toBe(true);
    });


    it('verify if you could navigate back to category page', function () {
        itemsPage().getBackToCategoryPage();
        expect(categoryPage().categoryPageVisible()).toBe(true);
    });


    it('verify if you could navigate back to concepts page', function () {
        categoryPage().getBackToConceptPage();
        expect(conceptPage().fetchLocationFromConceptPage()).toBe(locationName);
    });

    it('verify if you could navigate back to main page', function () {
        conceptPage().clickChangeLocation();
        expect(prepareBy().locationPageVisible()).toBe(true);
    });

});