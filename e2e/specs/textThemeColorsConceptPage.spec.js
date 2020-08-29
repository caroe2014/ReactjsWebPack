// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let headersAndFooters = require('../pageActions/homePage.actions')();
let homePage = require('../pageActions/homePage.actions')();
let prepareBy = require('../pageActions/loginPage.actions')();
let backOfficeCalls = require('../backOfficeApiCalls/backOfficeApi')();
let conceptPage= require('../pageActions/conceptPage.actions')();
const constants = require('../scripts/constants');

describe('BUY-34583 Verify text theme colors on concept page', function() {

	beforeAll('Set the text and theme colors', async function () {
		 await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
		     constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
	});

	it('verify text and theme colors in concepts page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		expect(conceptPage.isConceptPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(headersAndFooters.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(conceptPage.getConceptHeaderColor()).toBe(constants.titleHeaderColor);
		expect(conceptPage.getConceptNameColorOnHover()).toBe(constants.buttonControlColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in concepts page', function () {
		browser.refresh();
		expect(conceptPage.isConceptPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(headersAndFooters.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(conceptPage.getConceptHeaderColor()).toBe(constants.titleHeaderColorNew);
		expect(conceptPage.getConceptNameColorOnHover()).toBe(constants.buttonControlColorNew);
	});
});