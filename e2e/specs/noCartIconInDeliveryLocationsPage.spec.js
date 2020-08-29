// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

describe('BUY-36418 verify cart icon is not visible in delivery details page', function() {

    beforeAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(true);
        await displayProfile.setDeliveryEntriesCountTo(2);
	    await displayProfile.setPickUpTo(false);
    });

    it('verify if you could get to deliver location page & verify cart icon not visible', function () {
        prepareBy.OpenBrowser();
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        categoryPage.selectACategory();
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        expect(deliveryLocationPage.isCartIconVisibleInDeliveryPage()).toBe(false);
    });

    afterAll('disable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
	    await displayProfile.setPickUpTo(true);
    });
});