// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let headersAndFooters = require('../pageActions/homePage.actions')();
let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi')();
let displayProfile = require('../backOfficeApiCalls/displayProfileApiBasedOnID')();
let conceptPage = require('../pageActions/conceptPage.actions')();
let categoryPage = require('../pageActions/categoriesPage.actions')();
let itemsPage = require('../pageActions/itemsPage.actions')();
const constants = require('../scripts/constants');
let gratuityPage= require('../pageActions/addGratuityPage.actions')();

describe('BUY-39230 Verify text theme colors on tip capture page', function() {

	beforeAll('Set the text and theme colors, enable tip capture', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
		await displayProfile.acceptTip(true);
	});

	it('verify text and theme colors in tip capture page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory();
		itemsPage.selectAItem();
		itemsPage.openCart();
		itemsPage.clickPayNow();
		expect(gratuityPage.isGratuityPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(gratuityPage.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(gratuityPage.getTipCatureTitleColor()).toBe(constants.titleHeaderColor);
		expect(gratuityPage.getContinuePayButtonBgColor()).toBe(constants.buttonControlColor);
		expect(gratuityPage.getContinuePayButtonTextColor()).toBe(constants.buttonTextColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in tip capture  page', function () {
		browser.refresh();
		expect(gratuityPage.isGratuityPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(gratuityPage.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(gratuityPage.getTipCatureTitleColor()).toBe(constants.titleHeaderColorNew);
		expect(gratuityPage.getContinuePayButtonBgColor()).toBe(constants.buttonControlColorNew);
		expect(gratuityPage.getContinuePayButtonTextColor()).toBe(constants.buttonTextColorNew);
	});

	afterAll('disable tip capture', async function () {
		await displayProfile.acceptTip(false);
	});
});