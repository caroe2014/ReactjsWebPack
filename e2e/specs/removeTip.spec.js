// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let gratuityPage= require('../pageActions/addGratuityPage.actions')();
let initialTip;

describe('BUY-35179 & BUY-35181 verify can remove tip after selecting', function() {

    beforeAll('Enable tip', async function () {
        await displayProfile.acceptTip(true);
    });

    it('verify if you could select a location, concept, category, item and land in gratuity page', function () {
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

    it('verify if you could select a tip and continue to payment page', function () {
        initialTip = gratuityPage.getTipAmount();
        gratuityPage.clickTipButton(0);
        expect(gratuityPage.getTipAmount()).not.toBe(initialTip);
        gratuityPage.clickPayButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('verify if you could go back to gratuity page and remove tip', function () {
        paymentPage.clickBackToGratuityPage();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
        gratuityPage.clickNoTipButton();
        expect(gratuityPage.getTipAmount()).toBe(initialTip);
    });

    it('verify if you could go to payment page and make payment',async function () {
        gratuityPage.clickPayButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickCreditCardOption();
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });

    afterAll('disable tip capture', async function () {
        await displayProfile.acceptTip(false);
    });
});