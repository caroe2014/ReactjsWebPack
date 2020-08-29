// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const conceptPage= require('../../../pageActions/conceptPage.actions')();
const categoryPage= require('../../../pageActions/categoriesPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const paymentPage= require('../../../pageActions/paymentPage.actions')();
const cartPage = require('../../../pageActions/cart.actions')();

const alphaNum = 'ALG17';

let total;

describe('BUY-46675, BUY-46777 and BUY-44933 : Verify room charge process button functionality ,wing and total section on room charge modal', function() {

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
        total = cartPage.getTotalPriceFromCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
    });

    it('click on room charge option', async function () {
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
        // when all fields are empty - process button is disabled
        expect(paymentPage.isRoomChargeSubmitButtonEnabled()).toBe(false);
    });

    it('verify process button is disabled for a combintaion of fields being empty', async function () {
        //all fields including hotel are filled
        paymentPage.clickHotelDropDown();
        browser.keys("\uE004");
        expect(paymentPage.isRoomChargeSubmitButtonEnabled()).toBe(false);
        paymentPage.clickHotelWingDropDown();
        browser.keys("\uE004");
        expect(paymentPage.getWingDropDownText()).toBe('WING1');
        expect(paymentPage.isRoomChargeSubmitButtonEnabled()).toBe(false);
        paymentPage.setValueInRoomNumberField(alphaNum);
        expect(paymentPage.isRoomChargeSubmitButtonEnabled()).toBe(false);
        paymentPage.setValueInLastNameField(alphaNum);
        expect(paymentPage.isRoomChargeSubmitButtonEnabled()).toBe(true);

        //only room number is filled
        paymentPage.clickRoomNumberField();
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.clickHotelWingDropDown();
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.clickHotelDropDown();
        paymentPage.clickRoomChargeFieldsClearButton();
        expect(paymentPage.isRoomChargeSubmitButtonEnabled()).toBe(false);

        //only last name is filled
        paymentPage.setValueInRoomNumberField(alphaNum);
        paymentPage.clickLastNameField();
        paymentPage.clickRoomChargeFieldsClearButton();
        expect(paymentPage.isRoomChargeSubmitButtonEnabled()).toBe(false);
    });

    // BUY-46777

    it('verify total amount matches checkout total amount', async function () {
        expect(paymentPage.getTotalOnRoomChargeModal()).toContain(total);
        paymentPage.clickCancelButtonOnRoomChargeModal();
        browser.pause();
    });

    it('go back to items page', async function () {
        paymentPage.clickBackToGratuityPage();
        expect(itemsPage.itemsPageVisible()).toBe(true);
    });

    it('verify total amount matches checkout total amount after adding a new item', async function () {
        itemsPage.selectAItem();
        itemsPage.openCart();
        total = cartPage.getTotalPriceFromCart();
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickRoomChargeOption();
        paymentPage.waitForRoomChargeModal();
        expect(paymentPage.getTotalOnRoomChargeModal()).toContain(total);
    });

    // wing verification BUY-44933

    it('verify wing section', async function () {
        // verifying choosing hotel with no wing option doesn't display wing field
        paymentPage.clickHotelDropDown();
        browser.keys('\ue015');
        browser.keys("\uE004");
        expect(paymentPage.isWingOptionDisplayed()).toBe(false);

        //2nd wing configured text verification
        paymentPage.clickHotelDropDown();
        paymentPage.clickRoomChargeFieldsClearButton();
        paymentPage.clickHotelDropDown();
        browser.keys("\uE004");
        paymentPage.clickHotelWingDropDown();
        browser.keys('\ue015');
        browser.keys("\uE004");
        expect(paymentPage.getWingDropDownText()).toBe('WING2');
    });

});