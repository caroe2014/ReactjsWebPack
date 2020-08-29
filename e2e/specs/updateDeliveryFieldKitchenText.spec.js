// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-34149 verify if update delivery details field label', function() {

    beforeAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(true);
        await displayProfile.setDeliveryEntriesCountTo(2);
    });

    it('verify if you could get to deliver location page', function () {
        prepareBy.OpenBrowser();
        navigateThroughPages();
        itemsPage.clickPayNow();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
    });

    it('verify if you could pay and verify kitch display text in payment success page', function () {
        deliveryLocationPage.enterDeliveryDetails(0,'AB');  //{field-position, value-to-enter}
        deliveryLocationPage.clickContinuePay();
        makePayment();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
       // expect(paymentPage.getDeliveryLocationText()).toContain('Bld');
    });

    it('update location delivery kitchen text', async function () {
        await displayProfile.setDeliveryFieldKitchenTo(0,'KKK');  //{field-position, kitchen-text-to-enter}
    });

    it('verify if you could refresh, make payment and check updated kitchen text', function () {
        browser.refresh();
        navigateThroughPages();
        itemsPage.clickPayNow();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        deliveryLocationPage.enterDeliveryDetails(0,'AB');  //{field-position, value-to-enter}
        deliveryLocationPage.clickContinuePay();
        makePayment();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
        // expect(paymentPage.getDeliveryLocationText()).toContain('KKK');
    });

    afterAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
    });
});

function navigateThroughPages() {
    var locationName = homePage.selectLocation();
    expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
    conceptPage.selectAConcept();
    categoryPage.selectACategory();
    itemsPage.selectAItem();
    itemsPage.openCart();
}

function makePayment() {
    expect(paymentPage.paymentPageVisible()).toBe(true);
    paymentPage.switchControlToiFrame();
    paymentPage.enterCardDetails();
    paymentPage.clickPay();
    paymentPage.switchToAppContainer();
}