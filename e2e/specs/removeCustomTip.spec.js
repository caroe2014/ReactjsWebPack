// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
let itemsPage= require('../pageActions/itemsPage.actions')();
let displayProfileCall = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let gratuityPage= require('../pageActions/addGratuityPage.actions')();
let utils = require('../wdioHelpers/utils.js');
const commonStrings = require('../wdioHelpers/commonStrings');

let total;
let newTotal;
let newTotalWithTip;
let amount = "1.00";

describe('BUY-35517 verify user can remove custom tip', function() {

    beforeAll('Enable tip', async function () {
        await displayProfileCall.acceptTip(true);
        await displayProfileCall.acceptCustomTip(true);
    });

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
        expect(prepareBy.buyOnDemandLogoVisible()).toBe(true);
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        var categoryName = categoryPage.selectACategory();
        expect(itemsPage.fetchCategoryNameFromItemPage()).toBe(categoryName);
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.selectAItem();
    });

    it('verify if you could click pay now from cart and land in gratuity page', function () {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        gratuityPage.isGratuityPageVisible();
    });

    it('verify if you could set custom tip and add it', function () {
        gratuityPage.clickCustomTipButton();
        total = gratuityPage.getTotalValue();
        gratuityPage.setCustomTipValue(amount);
        gratuityPage.clickAddButtonCustomTip();
        gratuityPage.verifyTipAmount('$1.00');
        newTotal = utils.get$RemovedNumber(total);
        newTotalWithTip = utils.formatNumberWithXDecimals((newTotal + 1.00));
        expect(gratuityPage.getTotalValue()).toBe('$'+newTotalWithTip);
    });

    it('verify if you could remove custom tip and add it again', function () {
        gratuityPage.clickCloseButtonCustomTip();
        gratuityPage.verifyCustomTipValue('');
        gratuityPage.verifyTipAmount('$0.00');
        newTotalWithTip = utils.formatNumberWithXDecimals((newTotal + 0.00));
        gratuityPage.verifyTotal('$'+newTotalWithTip);
        gratuityPage.setCustomTipValue(amount);
        gratuityPage.clickAddButtonCustomTip();
        gratuityPage.verifyTipAmount('$1.00');
        newTotalWithTip = utils.formatNumberWithXDecimals((newTotal + 1.00));
        gratuityPage.verifyTotal('$'+newTotalWithTip);
    });

    it('verify if you can set no gratuity', function () {
        gratuityPage.clickNoTipButton();
        gratuityPage.verifyTipAmount('$0.00');
        newTotalWithTip = utils.formatNumberWithXDecimals((newTotal + 0.00));
        gratuityPage.verifyTotal('$'+newTotalWithTip);
    });

    afterAll('disable tip capture', async function () {
        await displayProfileCall.acceptTip(false);
        await displayProfileCall.acceptCustomTip(false);
    });
});