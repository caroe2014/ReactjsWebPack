// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();
let gratuityPage= require('../pageActions/addGratuityPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();

let payable;

describe('BUY-35107 verify can add tip', function() {

    beforeAll('Enable tip', async function () {
        await displayProfile.acceptTip(true);
    });

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        categoryPage.selectACategory();
        itemsPage.selectAItem();
    });

    it('verify if you could click pay now from cart and land in gratuity page', function () {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
    });

    it('verify if you could select tip and continue to payment page', function () {
        let initialTip= gratuityPage.getTipAmount();
        gratuityPage.clickTipButton(0);
        expect(gratuityPage.getTipAmount()).not.toBe(initialTip);
        payable = gratuityPage.fetchAmountFromPayButton();
        gratuityPage.clickPayButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('verify if you could make payment that includes tip',async function () {
	    paymentPage.clickCreditCardOption();
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
        expect(payable).toContain(paymentPage.totalBillPaid());
    });

    afterAll('disable tip capture', async function () {
        await displayProfile.acceptTip(false);
    });
});