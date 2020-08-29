//(C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.


'use strict';

let homePage = require('../pageActions/homePage.actions');
let prepareBy = require('../pageActions/loginPage.actions');
let displayProfileCalls = require('../backOfficeApiCalls/displayProfileApiBasedOnID');
let conceptPage= require('../pageActions/conceptPage.actions');
let categoryPage= require('../pageActions/categoriesPage.actions');
let itemsPage= require('../pageActions/itemsPage.actions');
let paymentPage= require('../pageActions/paymentPage.actions');

describe('BUY-34702 Verify payment instruction text changes are reflected in ondemand ', function() {

    it('verify could you get to mainpage', function () {
        prepareBy().OpenBrowser();
        expect(prepareBy().buyOnDemandLogoVisible()).toBe(true);
    });

    it('change the payment instruction text', async function () {
        await displayProfileCalls().setPaymentInstructionTextTo('OnDemand Payment Types');
        console.log('saved payment instruction text successfully');
        browser.refresh();
    });

    it('verify if you could land in payment page', function() {
        homePage().selectLocation();
        conceptPage().selectAConcept();
        expect(categoryPage().categoryPageVisible()).toBe(true);
        categoryPage().selectACategory();
        expect(itemsPage().itemsPageVisible()).toBe(true);
        itemsPage().selectAItem();
        itemsPage().openCart();
        itemsPage().clickPayNow();
        expect(paymentPage().paymentPageVisible()).toBe(true);
    });

    it('verify if you could land in payment page', function() {
        expect(paymentPage().getPayText()).toBe('OnDemand Payment Types');
    });
    
    it('change the payment instruction text & verify it', async function () {
        await displayProfileCalls().setPaymentInstructionTextTo('Select Payment type');
        console.log('saved payment instruction text successfully');
    });

    it('verify if you could land in payment page & verify it', function() {
	    browser.refresh();
	    expect(paymentPage().paymentPageVisible()).toBe(true);
        expect(paymentPage().getPayText()).toBe('Select Payment type');
    });
});