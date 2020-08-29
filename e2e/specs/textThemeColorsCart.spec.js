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

describe('BUY-34723 Verify text theme colors on cart', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
	});

	it('verify text and theme colors in cart', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory();
		expect(itemsPage.itemsPageVisible()).toBe(true);
		itemsPage.selectAItem();
		itemsPage.openCart();
		expect(itemsPage.getStoreNameColorFromCart()).toBe(constants.buttonControlColor);
		expect(itemsPage.getPayButtonBackgroundColorFromCart()).toBe(constants.buttonControlColor);
		expect(itemsPage.getPayButtonTextColorFromCart()).toBe(constants.buttonTextColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in cart', function () {
		browser.refresh();
		expect(itemsPage.itemsPageVisible()).toBe(true);
		itemsPage.openCart();
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(headersAndFooters.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(itemsPage.getStoreNameColorFromCart()).toBe(constants.buttonControlColorNew);
		expect(itemsPage.getPayButtonBackgroundColorFromCart()).toBe(constants.buttonControlColorNew);
		expect(itemsPage.getPayButtonTextColorFromCart()).toBe(constants.buttonTextColorNew);
	});
});