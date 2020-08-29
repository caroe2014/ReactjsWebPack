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
let phoneNumberPage = require('../pageActions/phoneNumberCapturePage.actions')();
const constants = require('../scripts/constants');


describe('BUY-39237 Verify text theme colors on phone number sms capture page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
		await displayProfile.setPhoneNumberCaptureTo(true);
		await displayProfile.setPhoneNumberCaptureRequiredTo(false);
	});

	it('verify text and theme colors in phone number page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory();
		itemsPage.selectAItem();
		itemsPage.openCart();
		itemsPage.clickPayNow();
		expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(phoneNumberPage.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(phoneNumberPage.getPhonePageTitleColor()).toBe(constants.titleHeaderColor);
		expect(phoneNumberPage.getContinueToPayButtonBgColor()).toBe(constants.buttonControlColor);
		expect(phoneNumberPage.getContinueToPayButtonTextColor()).toBe(constants.buttonTextColor);
		expect(phoneNumberPage.getSkipButtonColor()).toBe(constants.buttonControlColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in phone number page', function () {
		browser.refresh();
		browser.pause(800); //milliseconds
		expect(phoneNumberPage.isPhoneNumberPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(phoneNumberPage.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(phoneNumberPage.getPhonePageTitleColor()).toBe(constants.titleHeaderColorNew);
		expect(phoneNumberPage.getContinueToPayButtonBgColor()).toBe(constants.buttonControlColorNew);
		expect(phoneNumberPage.getContinueToPayButtonTextColor()).toBe(constants.buttonTextColorNew);
		expect(phoneNumberPage.getSkipButtonColor()).toBe(constants.buttonControlColorNew);
	});

	afterAll('disable phone number capture', async function () {
		await displayProfile.setPhoneNumberCaptureTo(false);
	});
});