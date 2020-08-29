// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let itemPage= require('../pageActions/itemsPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let cartPage = require('../pageActions/cart.actions')();
let paymentPage = require('../pageActions/paymentPage.actions')();

let itemName;
let locationName;

const refreshBrowserAndCheckCart = () => {
    it('should refresh and verify items in cart still exist', function () {
        browser.refresh();
        expect(itemPage.verifyTotalItemsCount()).toBe('1');
        homePage.clickCart();
        expect(cartPage.getItemDisplayNameFromCart()).toBe(itemName);
        itemPage.closeCart();
    });
};

describe('BUY-36415 verify cart items on page refresh where cart is visible', function() {

    it('verify could you get to mainpage', function () {
        prepareBy.OpenBrowser();
	    expect(prepareBy.locationPageVisible()).toBe(true);
    });

    it('select an item', function () {
        locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        categoryPage.selectACategory();
        itemPage.selectAItem();
        itemName = itemPage.getItemDisplayNameText(0);
    });

    it('navigate to select location page', function () {
        itemPage.isCartBadgeVisible();
        itemPage.getBackToCategoryPage();
        categoryPage.getBackToConceptPage();
        conceptPage.clickChangeLocation();
        homePage.waitForSelectLocationPage();
    });

    describe('refresh and verify cart items still exist on select location page', function () {
        refreshBrowserAndCheckCart();
    });

    it('navigate to concpets page', function () {
        homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
    });

    describe('refresh and verify cart items still exist on select concept page', function () {
        refreshBrowserAndCheckCart();
    });

    it('navigate to categories page', function () {
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
    });

    describe('refresh and verify cart items still exist on select categories page', function () {
        refreshBrowserAndCheckCart();
    });

    it('navigate to items page', function () {
        categoryPage.selectACategory(1);
        expect(itemPage.itemsPageVisible()).toBe(true);
    });

    describe('refresh and verify cart items still exist on select items page', function () {
        refreshBrowserAndCheckCart();
    });

    it('navigate to items details page', function () {
        itemPage.selectAItem();
        itemPage.itemsModifierPageVisible();
    });

    describe('refresh and verify cart items still exist on select items details page', function () {
        refreshBrowserAndCheckCart();
    });

    it('open the cart and refresh the browser and verify items in cart still exist', function () {
        itemPage.itemsModifierPageVisible();
        itemPage.openCart();
        browser.refresh();
        expect(itemPage.verifyTotalItemsCount()).toBe('1');
        expect(cartPage.getItemDisplayNameFromCart()).toBe(itemName);
    });

    it('verify if you could click pay now from cart and land in payments page', function() {
        itemPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
	    paymentPage.clickCreditCardOption();
    });

    it('verify if you could make a payment and get receipt', function() {
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });
});