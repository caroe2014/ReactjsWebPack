// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();

const longRoomNum = '22222222222222222222222222222';
const singleDigitRoomNum = '5';
const singleAlphabet = 'a';
const alphaNum = 'ALG17';
const aplhaNumSpecialChar = 'A@1$22';

describe('BUY-46645: Verify room charge last name and room number field functionality on room charge modal', function() {

    it('verify if you could select a location, concept, category and item', function () {
        prepareBy.OpenBrowser();
        var locationName = homePage.selectLocation();
        expect(conceptPage.fetchLocationFromConceptPage()).toBe(locationName);
        conceptPage.selectAConcept();
        expect(categoryPage.categoryPageVisible()).toBe(true);
        categoryPage.selectACategory();
        itemsPage.selectAItem();
    });

    it('verify if you could click pay now from cart and land on payment page', function () {
        itemsPage.openCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('click on room charge option', async function () {
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
    });

    it('verify room number field', async function () {
        paymentPage.setValueInRoomNumberField(longRoomNum);
        paymentPage.verifyRoomNumberFieldValue(longRoomNum);
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.setValueInRoomNumberField(singleDigitRoomNum);
        paymentPage.verifyRoomNumberFieldValue(singleDigitRoomNum);
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.setValueInRoomNumberField(alphaNum);
        paymentPage.verifyRoomNumberFieldValue(alphaNum);
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.setValueInRoomNumberField(aplhaNumSpecialChar);
        paymentPage.verifyRoomNumberFieldValue(aplhaNumSpecialChar);
    });

    it('verify last name field' , async function () {
        paymentPage.setValueInLastNameField(longRoomNum);
        paymentPage.verifyLastNameFieldValue(longRoomNum);
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.setValueInLastNameField(singleAlphabet);
        paymentPage.verifyLastNameFieldValue(singleAlphabet);
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.setValueInLastNameField(alphaNum);
        paymentPage.verifyLastNameFieldValue(alphaNum);
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.setValueInLastNameField(aplhaNumSpecialChar);
        paymentPage.verifyLastNameFieldValue(aplhaNumSpecialChar);
    });
});