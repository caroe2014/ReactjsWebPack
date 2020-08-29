// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../pageActions/homePage.actions')();
const prepareBy = require('../pageActions/loginPage.actions')();
const conceptPage= require('../pageActions/conceptPage.actions')();
const categoryPage= require('../pageActions/categoriesPage.actions')();
const itemsPage= require('../pageActions/itemsPage.actions')();
const displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
const phoneNumberPage= require('../pageActions/phoneNumberCapturePage.actions')();
const paymentPage= require('../pageActions/paymentPage.actions')();

let phoneNumber = '123-456-7890';

describe('BUY-39381 verify if phone number capture page is hydrated on refresh', function() {

    beforeAll('Enable phone number capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(true);
    });

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
        let locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        let categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.selectAItem();
    });

    it('verify if you could get to phone number capture page', function() {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        phoneNumberPage.isPhoneNumberPageVisible();
    });

    it('verify if you can enter phone number and it stays after refresh too', function () {
        phoneNumberPage.enterPhoneNumber(phoneNumber);
        phoneNumberPage.clickContinueToPay();
        paymentPage.paymentMethodTileVisible();
        browser.refresh();
        paymentPage.paymentMethodTileVisible();
        paymentPage.clickBackToPreviousPage();
        phoneNumberPage.isPhoneNumberPageVisible();
        expect(phoneNumberPage.getPhoneNumber()).toBe(phoneNumber);
    });

    afterAll('disable phone number capture', async function () {
        await displayProfile.setPhoneNumberCaptureTo(false);
    });
});