// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let nameCapturePage= require('../pageActions/nameCapturePage.actions')();
let paymentPage = require('../pageActions/paymentPage.actions')();

let firstName = 'Vikram';
let initial = 'P';

describe('BUY-39380 verify hydration of the name capture page after refresh', function () {

    beforeAll('Enable name capture', async function () {
        await displayProfile.setNameCaptureTo(true);
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
        itemsPage.openCart();
        itemsPage.clickPayNow();
    });

    it('verify if you could get to name capture page , enter name and continue to pay', function () {
        expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
        nameCapturePage.enterName(firstName, initial);
        nameCapturePage.clickContinueToPay();
    });

    it('should refresh and go back to name capture page', function () {
        expect(paymentPage.paymentPageVisible()).toBe(true);
        browser.refresh();
        paymentPage.paymentMethodTileVisible();
        paymentPage.clickBackToAddName();
    });

    it('verify if you could get to name capture page and check if guestname is still present and matches entered text', function () {
        expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
        nameCapturePage.verifyFirstNameText(firstName);
        nameCapturePage.verifyLastInitialText(initial);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setNameCaptureTo(false);
    });

});