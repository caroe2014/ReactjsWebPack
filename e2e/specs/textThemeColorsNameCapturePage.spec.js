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
let  nameCapturePage = require('../pageActions/nameCapturePage.actions')();
const constants = require('../scripts/constants');

describe('BUY-39238 Verify text theme colors on name capture page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
		await displayProfile.setNameCaptureTo(true);
		await displayProfile.setNameCaptureRequiredTo(false);
	});

	it('verify text and theme colors in name capture page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory();
		itemsPage.selectAItem();
		itemsPage.openCart();
		itemsPage.clickPayNow();
		expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(nameCapturePage.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(nameCapturePage.getNamePageTitleColor()).toBe(constants.titleHeaderColor);
		expect(nameCapturePage.getContinueToPayButtonBgColor()).toBe(constants.buttonControlColor);
		expect(nameCapturePage.getContinueToPayButtonTextColor()).toBe(constants.buttonTextColor);
		expect(nameCapturePage.getSkipButtonColor()).toBe(constants.buttonControlColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in name capture page', function () {
		browser.refresh();
		expect(nameCapturePage.isNameCapturePageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(nameCapturePage.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(nameCapturePage.getNamePageTitleColor()).toBe(constants.titleHeaderColorNew);
		expect(nameCapturePage.getContinueToPayButtonBgColor()).toBe(constants.buttonControlColorNew);
		expect(nameCapturePage.getContinueToPayButtonTextColor()).toBe(constants.buttonTextColorNew);
		expect(nameCapturePage.getSkipButtonColor()).toBe(constants.buttonControlColorNew);
	});

	afterAll('disable name capture capture', async function () {
		await displayProfile.setNameCaptureTo(false);
	});
});