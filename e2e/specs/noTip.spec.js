// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();
let gratuityPage= require('../pageActions/addGratuityPage.actions')();

describe('BUY-35129 verify order when no gratuity selected', function() {

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

    it('Select no tip, make a payment', async function () {
        let initialTip= gratuityPage.getTipAmount();
        gratuityPage.clickNoTipButton();
        expect(gratuityPage.getTipAmount()).toBe(initialTip);
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