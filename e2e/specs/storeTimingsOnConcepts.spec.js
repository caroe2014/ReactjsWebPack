// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../pageActions/homePage.actions')();
const prepareBy = require('../pageActions/loginPage.actions')();
const conceptPage= require('../pageActions/conceptPage.actions')();
const categoryPage= require('../pageActions/categoriesPage.actions')();
const itemsPage= require('../pageActions/itemsPage.actions')();
const backofficeApi = require('../backOfficeApiCalls/backOfficeApi')();
const nameCapturePage= require('../pageActions/nameCapturePage.actions')();
const paymentPage = require('../pageActions/paymentPage.actions')();
const checkoutPage = require('../pageActions/checkoutPage.actions');

describe('BUY-31744 verify store timings are only on concept page when we turn on store timing', function () {

    beforeAll('Enable name capture', async function () {
        await backofficeApi.setStoreShowTimingTo(true);
    });

    it('verify if you could select a location, concept, category and item and see store timings are only on concept page and location not on other pages', function () {
        prepareBy.OpenBrowser();
        expect(homePage.storeTimeOnLocationPage()).toBe(true);
        let locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        expect(conceptPage.isStoreTimingVisibleConceptPage()).toBe(true);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        expect(conceptPage.isStoreTimingVisibleConceptPage()).toBe(false);
        let categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
        expect(conceptPage.isStoreTimingVisibleConceptPage()).toBe(false);

    });

    it('verify if you could select pay now on checkout page and see there is no store timing displayed here', function () {
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(checkoutPage.checkoutPageVisible()).toBe(true);
        expect(conceptPage.isStoreTimingVisibleConceptPage()).toBe(false);
        checkoutPage.clickCheckoutPagePayButton();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        expect(conceptPage.isStoreTimingVisibleConceptPage()).toBe(false);
    });

    afterAll('disable name capture', async function () {
        await backofficeApi.setStoreShowTimingTo(false);
    });

});