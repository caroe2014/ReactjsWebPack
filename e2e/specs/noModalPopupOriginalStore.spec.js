// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-33730 verify no modal popup after changing to the original store', function() {

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
        navigateThroughMenu();
        itemsPage.selectAItem();
        backToLocationsPage();
    });

    it('verify if you could navigate in other location without modal popup', function () {
        var locationName = homePage.selectLocation(1);
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        categoryPage.selectACategory();
        expect(itemsPage.itemsPageVisible()).toBe(true);
    });

    it('verify if you could navigate to original store and see no popup, pay for the order', function () {
        backToLocationsPage();
        navigateThroughMenu();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
	    paymentPage.clickCreditCardOption();
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });
});

function navigateThroughMenu(){
    var locationName = homePage.selectLocation();
    expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
    conceptPage.selectAConcept();
    expect(categoryPage.categoryPageVisible()).toBe(true);
    categoryPage.selectACategory();
    expect(itemsPage.itemsPageVisible()).toBe(true);
}

function backToLocationsPage(){
    itemsPage.getBackToCategoryPage();
    categoryPage.getBackToConceptPage();
    conceptPage.clickChangeLocation();
    expect(prepareBy.locationPageVisible()).toBe(true);
}