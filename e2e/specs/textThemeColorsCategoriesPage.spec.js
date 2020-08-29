// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let headersPageActions = require('../pageActions/homePage.actions')();
let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi')();
let conceptPage= require('../pageActions/conceptPage.actions')();
let categoryPage= require('../pageActions/categoriesPage.actions')();
const constants = require('../scripts/constants');

describe('BUY-34584 Verify text theme colors on categories page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
	});

	it('verify text and theme colors in categories page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		expect(categoryPage.categoryPageVisible()).toBe(true);
		expect(headersPageActions.getHeaderColor()).toBe(constants.bannerColor);
		expect(headersPageActions.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(categoryPage.getCategoryHeaderColor()).toBe(constants.titleHeaderColor);
		expect(categoryPage.getCategoryNameColorOnHover()).toBe(constants.buttonControlColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in categories page', function () {
		browser.refresh();
		expect(categoryPage.categoryPageVisible()).toBe(true);
		expect(headersPageActions.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(headersPageActions.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(categoryPage.getCategoryHeaderColor()).toBe(constants.titleHeaderColorNew);
		expect(categoryPage.getCategoryNameColorOnHover()).toBe(constants.buttonControlColorNew);
	});
});