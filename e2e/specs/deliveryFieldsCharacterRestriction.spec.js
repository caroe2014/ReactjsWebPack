// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

describe('BUY-34132 verify if delivery details field character restriction', function() {

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

    it('verify field character restriction(Alpha)', function () {
        deliveryLocationPage.enterDeliveryDetails(0, 'A1');  //{field-position, value-to-enter}
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('A');
        deliveryLocationPage.clearFields();
        deliveryLocationPage.enterDeliveryDetails(0, '12');
        expect(deliveryLocationPage.getDeliveryFieldValue()).toBe('');
    });

    it('make delivery location field character restriction to AlphaNumeric', async function () {
        await displayProfile.setDeliveryFieldCharacterRestrictionTo(0,'ALPHA_NUMERIC','^[a-zA-Z0-9]{0,2}$');  //{field-position, restriction-to-enter, validation regex}
    });

    it('verify field character restriction(Alpha-numeric)', function () {
        browser.refresh();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        deliveryLocationPage.enterDeliveryDetails(0, 'A1');
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('A1');
        deliveryLocationPage.clearFields();
        deliveryLocationPage.enterDeliveryDetails(0, '1B');
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('1B');
    });

    it('make delivery location field character restriction to Numeric', async function () {
        await displayProfile.setDeliveryFieldCharacterRestrictionTo(0,'NUMERIC','^[0-9]{0,2}$');
    });

    it('verify field character restriction(Numeric)', function () {
        browser.refresh();
        expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
        deliveryLocationPage.enterDeliveryDetails(0, 'A1');
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('1');
        deliveryLocationPage.clearFields();
        deliveryLocationPage.enterDeliveryDetails(0, 'AB');
        expect(deliveryLocationPage.getDeliveryFieldValue(0)).toBe('');
    });

    afterAll('Enable location delivery', async function () {
        await displayProfile.setDeliveryLocationsTo(false);
	    await displayProfile.setPickUpTo(true);
    });
});