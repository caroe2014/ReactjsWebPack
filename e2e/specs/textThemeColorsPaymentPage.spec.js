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
let paymentPage= require('../pageActions/paymentPage.actions')();

describe('BUY-34762 Verify text theme colors on payment page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
	});

	it('verify text and theme colors in payment page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory();
		itemsPage.selectAItem();
		itemsPage.openCart();
		itemsPage.clickPayNow();
		expect(paymentPage.paymentPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(paymentPage.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(paymentPage.getPaymentTitleColor()).toBe(constants.titleHeaderColor);
		paymentPage.clickCreditCardOption();
		paymentPage.switchControlToiFrame();
		expect(paymentPage.getPayButtonBgColor()).toBe(constants.buttonControlColor);
		expect(paymentPage.getPayButtonTextColor()).toBe(constants.buttonTextColor);
	});

	it('update the colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColorNew, constants.bannerTextColorNew,
			constants.titleHeaderColorNew, constants.buttonControlColorNew, constants.buttonTextColorNew);
	});

	it('verify updated text and theme colors in payment  page', function () {
		browser.refresh();
		expect(paymentPage.paymentPageVisible()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColorNew);
		expect(paymentPage.getHeaderTextColor()).toBe(constants.bannerTextColorNew);
		expect(paymentPage.getPaymentTitleColor()).toBe(constants.titleHeaderColorNew);
        paymentPage.clickCreditCardOption();
		paymentPage.switchControlToiFrame();
		expect(paymentPage.getPayButtonBgColor()).toBe(constants.buttonControlColorNew);
		expect(paymentPage.getPayButtonTextColor()).toBe(constants.buttonTextColorNew);
	});
});