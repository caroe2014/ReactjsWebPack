// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let headersAndFooters = require('../pageActions/homePage.actions')();
let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi')();
const constants = require('../scripts/constants');

describe('BUY-34553 Verify text theme colors on locations page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
	});

	it('verify text and theme colors in locations page', function () {
		prepareBy.OpenBrowser();
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(headersAndFooters.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(homePage.getLocationHeaderColor()).toBe(constants.titleHeaderColor);
		expect(homePage.getLocationNameColorOnHover()).toBe(constants.buttonControlColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in locations page', function () {
		browser.refresh();
        homePage.waitForSelectLocationPage();
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(headersAndFooters.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(homePage.getLocationHeaderColor()).toBe(constants.titleHeaderColorNew);
		expect(homePage.getLocationNameColorOnHover()).toBe(constants.buttonControlColorNew);
	});
});