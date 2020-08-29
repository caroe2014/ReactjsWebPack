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

describe('BUY-35550 verify sms notification page when tip capture is enabled', function() {

    beforeAll('Enable tip and phone number capture', async function () {
        await displayProfile.acceptTip(true);
        await displayProfile.setPhoneNumberCaptureTo(true);
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

    it('verify if you could get to phone number capture page from tip page', function () {
        gratuityPage.clickTipButton(0);
        gratuityPage.clickPayButton();
        expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
    });

    it('verify could you enter phone number & make payment', function() {
        phoneNumberPage.enterPhoneNumber("1234567890");
        phoneNumberPage.clickContinueToPay();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();
        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });

    afterAll('disable tip & phone number capture', async function () {
        await displayProfile.acceptTip(false);
        await displayProfile.setPhoneNumberCaptureTo(false);
    });
});
