// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();

const roomNum = '123';
const lastName = 'gaffney';

describe('BUY-46625 and BUY-46747: Verify exit (X) and Cancel functionality on room charge modal', function() {

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

    it('verify if you could click on room charge option, verify X functionality without entering any values and verify empty values after reopening modal', async function () {
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
        paymentPage.verifyRoomNumberFieldValue('');
        paymentPage.verifyLastNameFieldValue('');
        paymentPage.clickXButtonOnRoomChargeModal();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
        paymentPage.verifyRoomNumberFieldValue('');
        paymentPage.verifyLastNameFieldValue('');
    });

    it('verify Cancel button functionality without entering any values and reopen to see empty values  ', async function () {
        paymentPage.clickCancelButtonOnRoomChargeModal();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
        paymentPage.verifyRoomNumberFieldValue('');
        paymentPage.verifyLastNameFieldValue('');
    });

    it('verify if you could fill in the details and dismiss room charge modal by X and verify the empty values after reopening', async function() {
        paymentPage.setValueInRoomNumberField(roomNum);
        paymentPage.setValueInLastNameField(lastName);
        paymentPage.clickXButtonOnRoomChargeModal();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
        paymentPage.verifyRoomNumberFieldValue('');
        paymentPage.verifyLastNameFieldValue('');
    });

    it('verify if you could fill in the details and dismiss room charge modal by Cancel and verify the empty values after reopening' , async function () {
        paymentPage.setValueInRoomNumberField(roomNum);
        paymentPage.setValueInLastNameField(lastName);
        paymentPage.clickCancelButtonOnRoomChargeModal();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
        paymentPage.verifyRoomNumberFieldValue('');
        paymentPage.verifyLastNameFieldValue('');
    });
});