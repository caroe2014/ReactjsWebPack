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

describe('BUY-34782 Verify text theme colors on payment confirmation page', function() {

	beforeAll('Set the text and theme colors', async function () {
		await backOfficeCalls.setTextThemeColors(constants.bannerColor, constants.bannerTextColor,
			constants.titleHeaderColor, constants.buttonControlColor, constants.buttonTextColor);
	});

	it('verify text and theme colors in payment confirmation page', function () {
		prepareBy.OpenBrowser();
		homePage.selectLocation();
		conceptPage.selectAConcept();
		categoryPage.selectACategory();
		itemsPage.selectAItem();
		itemsPage.openCart();
		itemsPage.clickPayNow();
		expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickCreditCardOption();
		paymentPage.switchControlToiFrame();
		paymentPage.enterCardDetails();
		paymentPage.clickPay();
		paymentPage.switchToAppContainer();
		expect(paymentPage.isPaymentSuccessful()).toBe(true);
		expect(headersAndFooters.getHeaderColor()).toBe(constants.bannerColor);
		expect(paymentPage.getHeaderTextColor()).toBe(constants.bannerTextColor);
		expect(paymentPage.getOrderNumberColor()).toBe(constants.titleHeaderColor);
		expect(paymentPage.getEmailSendButtonBgColor()).toBe(constants.buttonControlColor);
		expect(paymentPage.getEmailSendButtonTextColor()).toBe(constants.buttonTextColor);
	});
});