// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../pageActions/homePage.actions')();
const prepareBy = require('../pageActions/loginPage.actions')();
const conceptPage= require('../pageActions/conceptPage.actions')();
const categoryPage= require('../pageActions/categoriesPage.actions')();
const itemsPage= require('../pageActions/itemsPage.actions')();
const displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
const nameCapturePage= require('../pageActions/nameCapturePage.actions')();
const paymentPage = require('../pageActions/paymentPage.actions')();
const checkoutPage = require('../pageActions/checkoutPage.actions');

let firstName = 'Push';
let initial = 'P';

describe('BUY-39674 verify the name capture page after clearing cart', function () {

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
        expect(checkoutPage.checkoutPageVisible()).toBe(true);
        paymentPage.clickBackToAddName();
    });

    it('verify if you dont see name already saved on name captue page after clearing cart', function () {
        expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
        paymentPage.clickBackToPreviousPage();
        itemsPage.openCart();
        itemsPage.clearCart();
        itemsPage.closeCart();
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
        nameCapturePage.verifyFirstNameText(firstName);
        nameCapturePage.verifyLastInitialText(initial);
    });

    afterAll('disable name capture', async function () {
        await displayProfile.setNameCaptureTo(false);
    });

});