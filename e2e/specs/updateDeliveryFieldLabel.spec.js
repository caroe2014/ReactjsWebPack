// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

describe('BUY-34083 verify if update delivery details field label', function() {

    beforeAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(true);
        await displayProfile.setPickUpTo(false);
        await displayProfile.setDeliveryEntriesCountTo(2);
    });

    it('verify if you could get to deliver location page', function () {
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
        expect(deliveryLocationPage.getFirstDeliveryFieldLabel()).toBe('Building - enter building letter (A, B, C, etc.) for Corporate Campus only. We do not deliver to West Campus');
    });

    it('verify if you could update delivery details field label', async function () {
        await displayProfile.setFirstDeliveryFieldLabelTo(0,'Enter A, B, C D or something');
    });

    it('verify if you could see updated field label in application', function () {
        browser.refresh();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        expect(deliveryLocationPage.getFirstDeliveryFieldLabel()).toBe('Enter A, B, C D or something');
    });

    afterAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
        await displayProfile.setPickUpTo(true);
    });
});