// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../pageActions/homePage.actions')();
const prepareBy = require('../pageActions/loginPage.actions')();
const conceptPage= require('../pageActions/conceptPage.actions')();
const categoryPage= require('../pageActions/categoriesPage.actions')();
const itemsPage= require('../pageActions/itemsPage.actions')();
const checkoutPage = require('../pageActions/checkoutPage.actions');
const paymentPage = require('../pageActions/paymentPage.actions')();
const displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
const gratuityPage= require('../pageActions/addGratuityPage.actions')();


describe('BUY-44937 Verify tip still stays after refreshing page, adding a new item and coming back to tip page', function() {

    beforeAll('Enable tip', async function () {
        await displayProfile.acceptTip(true);
    });

    it('verify if you could get to tip capture page', function () {
        prepareBy.OpenBrowser();
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        categoryPage.selectACategory();
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
    });

    it('verify if you could select tip and continue to checkout page', function () {
        let initialTip= gratuityPage.getTipAmount();
        gratuityPage.clickTipButton(0);
        let tip = gratuityPage.getTipAmount();
        expect(tip).not.toBe(initialTip);
        gratuityPage.clickPayButton();
        expect(checkoutPage.checkoutPageVisible()).toBe(true);
    });

    it('verify if you could go back to gratuity page', function () {
        paymentPage.clickBackToGratuityPage();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
    });

    it('refresh application , add item and verify if tip is already added', async  function () {
        paymentPage.clickBackToPreviousPage();
        itemsPage.openCart();
        itemsPage.closeCart();
        browser.refresh();
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
        expect(gratuityPage.getTipAmount()).not.toBe('$0.00');
    });

    afterAll('disable tip capture', async function () {
        await displayProfile.acceptTip(false);
    });
    
});