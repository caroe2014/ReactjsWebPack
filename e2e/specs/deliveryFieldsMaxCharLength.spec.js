// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

describe('BUY-34141 verify if delivery details field character max length is respected', function() {

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
	    categoryPage.selectACategory();
	    itemsPage.selectAItem();
	    itemsPage.openCart();
	    itemsPage.clickPayNow();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
    });

    it('verify field character max length set to max 4', function () {
        deliveryLocationPage.enterDeliveryDetails(0, 'ABCD');  //{field-position, value-to-enter}
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('ABCD');
        deliveryLocationPage.clearFields();
        deliveryLocationPage.enterDeliveryDetails(0, 'DEFGHI');
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('DEFG');
    });

    it('make delivery location field character restriction to AlphaNumeric', async function () {
        await displayProfile.setDeliveryFieldMaxCharLengthTo(0,3);  //{field-position, restriction-to-enter, validation regex}
    });

    it('verify field character restriction(Alpha-numeric)', function () {
        browser.refresh();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        deliveryLocationPage.enterDeliveryDetails(0, 'ABC');
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('ABC');
        deliveryLocationPage.clearFields();
        deliveryLocationPage.enterDeliveryDetails(0, 'DEFG');
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('DEF');
    });

    afterAll('disable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
	    await displayProfile.setPickUpTo(true);
    });
});