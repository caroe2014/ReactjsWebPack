// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let gratuityPage= require('../pageActions/addGratuityPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();

describe('BUY-35395 verify can add tip', function() {

    beforeAll('Enable tip', async function () {
        await displayProfile.acceptTip(true);
    });

    it('verify if you could get to tip capture page', function () {
        prepareBy.OpenBrowser();
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        categoryPage.selectACategory();
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
    });

    it('verify cart icon is not visible in tip capture page', function () {
        expect(gratuityPage.isCartIconVisibleInDeliveryPage()).toBe(false);
    });

    afterAll('disable tip capture', async function () {
        await displayProfile.acceptTip(false);
    });
});