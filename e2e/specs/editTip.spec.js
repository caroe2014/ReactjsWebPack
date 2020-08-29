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
let tip;

describe('BUY-35177 & BUY-35180 Verify can you edit tip', function() {

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

    it('verify if you could select tip and continue to payment page', function () {
        let initialTip= gratuityPage.getTipAmount();
        gratuityPage.clickTipButton(0);
        tip = gratuityPage.getTipAmount();
        expect(tip).not.toBe(initialTip);
        gratuityPage.clickPayButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('verify if you could go back to gratuity page and edit the gratuity/tip', function () {
        paymentPage.clickBackToGratuityPage();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
        gratuityPage.clickTipButton(1);
        expect(gratuityPage.getTipAmount()).not.toBe(tip);
    });

    it('Proceed to payments and make payment', async  function () {
        gratuityPage.clickPayButton();
	    paymentPage.clickCreditCardOption();
        expect(paymentPage.paymentPageVisible()).toBe(true);
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