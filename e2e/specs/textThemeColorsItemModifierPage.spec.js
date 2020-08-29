// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let headersAndFooters = require('../pageActions/homePage.actions')();
let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi')();
let conceptPage = require('../pageActions/conceptPage.actions')();
let categoryPage = require('../pageActions/categoriesPage.actions')();
let itemsPage = require('../pageActions/itemsPage.actions')();
const constants = require('../scripts/constants');

describe('BUY-34722 Verify text theme colors on items modifier page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
	});

	it('verify text and theme colors in items modifier page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory(1);
		expect(itemsPage.itemsPageVisible()).toBe(true);
		itemsPage.selectAItem();
		itemsPage.customizeItem();
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(headersAndFooters.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(itemsPage.getAddToCartButtonBackgroundColor()).toBe(constants.buttonControlColor);
		expect(itemsPage.getAddToCartButtonTextColor()).toBe(constants.buttonTextColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in items modifier page', function () {
		browser.refresh();
		expect(itemsPage.itemsModifierPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(headersAndFooters.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(itemsPage.getAddToCartButtonBackgroundColor()).toBe(constants.buttonControlColorNew);
		expect(itemsPage.getAddToCartButtonTextColor()).toBe(constants.buttonTextColorNew);
	});
});