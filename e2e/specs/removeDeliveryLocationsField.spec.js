// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

describe('BUY-34195 verify if location delivery field can be removed', function() {

    beforeAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(true);
        await displayProfile.setDeliveryEntriesCountTo(3);
        await displayProfile.setPickUpTo(false);
    });

    it('verify if you could get to deliver location page and check number of fields', function () {
        prepareBy.OpenBrowser();
	    var locationName = homePage.selectLocation();
	    expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
	    conceptPage.selectAConcept();
	    expect(categoryPage.categoryPageVisible()).toBe(true);
	    categoryPage.selectACategory();
	    expect(itemsPage.itemsPageVisible()).toBe(true);
	    itemsPage.selectAItem();
	    itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        expect(deliveryLocationPage.getLocationFieldsCount()).toBe(3);
    });

    it('verify if location delivery field can be added', async function () {
        await displayProfile.setDeliveryEntriesCountTo(2);
    });

    it('verify if you could get to deliver location page and check number of fields', function () {
        browser.refresh();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        expect(deliveryLocationPage.getLocationFieldsCount()).toBe(2);
    });

    afterAll('disable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
        await displayProfile.setPickUpTo(true);
    });
});