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
let deliveryLocationPage = require('../pageActions/deliveryLocationsPage.actions')();

describe('BUY-34724 Verify text theme colors on delivery locations page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
		await displayProfile.setDeliveryLocationsTo(true);
        await displayProfile.setPickUpTo(false);
		await displayProfile.setDeliveryEntriesCountTo(2);
	});

	it('verify text and theme colors in delivery locations page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory();
		itemsPage.selectAItem();
		itemsPage.openCart();
		itemsPage.clickPayNow();
		expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(deliveryLocationPage.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(deliveryLocationPage.getDeliveryLocationTitleColor()).toBe(constants.titleHeaderColor);
		expect(deliveryLocationPage.getNextButtonBgColor()).toBe(constants.buttonControlColor);
		expect(deliveryLocationPage.getNextButtonTextColor()).toBe(constants.buttonTextColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in delivery locations  page', function () {
		browser.refresh();
		expect(deliveryLocationPage.isDeliveryLocationPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(deliveryLocationPage.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(deliveryLocationPage.getDeliveryLocationTitleColor()).toBe(constants.titleHeaderColorNew);
		expect(deliveryLocationPage.getNextButtonBgColor()).toBe(constants.buttonControlColorNew);
		expect(deliveryLocationPage.getNextButtonTextColor()).toBe(constants.buttonTextColorNew);
	});

	afterAll('disable delivery locations', async function () {
		await displayProfile.setDeliveryLocationsTo(false);
        await displayProfile.setPickUpTo(true);
	});
});