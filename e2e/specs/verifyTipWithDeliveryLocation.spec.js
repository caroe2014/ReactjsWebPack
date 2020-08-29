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

describe('BUY-34931 verify tip capture when delivery location is enabled', function() {

    beforeAll('Enable tip and delivery location pages', async function () {
        await displayProfile.acceptTip(true);
        await displayProfile.setDeliveryLocationsTo(true);
        await displayProfile.setDeliveryEntriesCountTo(2);
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

    it('verify if you could get to delivery location page from tip page', function () {
        gratuityPage.clickTipButton(0);
        gratuityPage.clickPayButton();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
    });

    it('verify could you enter phone number & make payment', function() {
        deliveryLocationPage.enterDeliveryDetails(0, 'AA');  //{field-position, value-to-enter}
        deliveryLocationPage.enterDeliveryDetails(1, '12');
        deliveryLocationPage.clickContinuePay();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });

    afterAll('disable tip & phone number capture', async function () {
        await displayProfile.acceptTip(false);
        await displayProfile.setDeliveryLocationsTo(false);
    });
});