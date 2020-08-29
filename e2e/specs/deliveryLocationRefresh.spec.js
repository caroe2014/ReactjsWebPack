// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../pageActions/homePage.actions')();
const prepareBy = require('../pageActions/loginPage.actions')();
const conceptPage= require('../pageActions/conceptPage.actions')();
const categoryPage= require('../pageActions/categoriesPage.actions')();
const itemsPage= require('../pageActions/itemsPage.actions')();
const displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
const paymentPage = require('../pageActions/paymentPage.actions')();
const deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

let buildingNumber = 'AB';
let floorNumber = '1';
let suite = '12';

describe('BUY-39382 verify hydration of the delivery location details page after refresh', function () {

    beforeAll('Enable delivery locations', async function () {
        await displayProfile.setDeliveryLocationsTo(true);
	    await displayProfile.setPickUpTo(false);
	    await displayProfile.setDeliveryEntriesCountTo(3);
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

    it('verify if you could get to delivery locations page ', function () {
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        deliveryLocationPage.enterDeliveryDetails(0,buildingNumber);
        deliveryLocationPage.enterDeliveryDetails(1,floorNumber);
        deliveryLocationPage.enterDeliveryDetails(2,suite);
        deliveryLocationPage.clickContinuePay();
    });

    it('should refresh and go back to delivery locations page', function () {
        expect(paymentPage.paymentPageVisible()).toBe(true);
        browser.refresh();
        paymentPage.paymentMethodTileVisible();
        paymentPage.clickBackToPreviousPage();
    });

    it('verify if you could get to delivery locations page and check if details are still present and matches entered text', function () {
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toEqual(buildingNumber);
        expect(deliveryLocationPage.getDeliveryFieldValue(1)).toEqual(floorNumber);
        expect(deliveryLocationPage.getDeliveryFieldValue(2)).toEqual(suite);
    });

    afterAll('disable delivery location details', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
	    await displayProfile.setPickUpTo(true);
    });

});
