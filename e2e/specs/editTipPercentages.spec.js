// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let gratuityPage= require('../pageActions/addGratuityPage.actions')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();

describe('BUY-35132 verify if tip percentages can be edited', function() {

    beforeAll('Enable tip capture', async function () {
        await displayProfile.acceptTip(true);
        await displayProfile.setTipPercentagesTo("[10,12,15]");
    });

    it('verify if you could get to tip capture page and verify percentages', function () {
        prepareBy.OpenBrowser();
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        categoryPage.selectACategory();
        itemsPage.selectAItem();
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
        expect(gratuityPage.getTipPercentageAt(0)).toContain('10%');
        expect(gratuityPage.getTipPercentageAt(1)).toContain('12%');
        expect(gratuityPage.getTipPercentageAt(2)).toContain('15%');
    });

    it('update tip capture percentages', async function () {
        await displayProfile.setTipPercentagesTo("[15,18,20]");
    });

    it('verify updated tip capture percentages are visible', function () {
        browser.refresh();
        expect(gratuityPage.isGratuityPageVisible()).toBe(true);
        expect(gratuityPage.getTipPercentageAt(0)).toContain('15%');
        expect(gratuityPage.getTipPercentageAt(1)).toContain('18%');
        expect(gratuityPage.getTipPercentageAt(2)).toContain('20%');
    });

    afterAll('disable tip capture', async function () {
        await displayProfile.acceptTip(false);
    });
});