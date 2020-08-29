// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const homePage = require('../../../pageActions/homePage.actions')();
const prepareBy = require('../../../pageActions/loginPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const cartPage = require('../../../pageActions/cart.actions')();
const scheduledOrderingPage = require('../../../pageActions/scheduledOrderingPage.actions');
const commonStrings = require('../../../wdioHelpers/commonStrings');
const commonFunctions = require('../../../wdioHelpers/commonFunctions');

let timeSlot;
let itemDetails;
let timeSlotChange;


describe('BUY-40412 , BUY-40413 , BUY-40414 verify time change warning popup if cart already has items and cancel/yes functionality', function () {
    it('pick up a time slot and proceed ', function() {
        prepareBy.OpenBrowser(true);
        expect(scheduledOrderingPage.isFindFoodButtonVisible()).toBe(true);
        scheduledOrderingPage.selectLaterToday();
        expect(scheduledOrderingPage.isTimeSelectBoxVisible()).toBe(true);
        timeSlot = scheduledOrderingPage.selectTime();
        scheduledOrderingPage.clickFindFood();
    });

    it('verify if you could select a location, concept, category and item', function () {
        commonFunctions.addAnItem();
        itemsPage.openCart();
        itemDetails = cartPage.getItemDetailsFromCart();
    });

    it('verify warning time change modal after changing the time on scheduled ordering initial page', function () {
        cartPage.verifyCartTimeSlot(timeSlot);
        itemsPage.closeCart();
        homePage.clickOnHomeButton();
        timeSlotChange = scheduledOrderingPage.selectTime(1);
        scheduledOrderingPage.waitForTimeChangeWarning();
        expect(scheduledOrderingPage.getWarningTextAboutAbandoning()).toBe(commonStrings.scheduledOrderingWarningModalText.abandoningText);
        expect(scheduledOrderingPage.getWarningTextForAreYouSure()).toBe(commonStrings.scheduledOrderingWarningModalText.areYouSureText);
        expect(scheduledOrderingPage.getWarningTextButtonYes()).toBe(commonStrings.scheduledOrderingWarningModalText.yesButton);
        expect(scheduledOrderingPage.getWarningTextButtonCancel()).toBe(commonStrings.scheduledOrderingWarningModalText.cancelButton);
        expect(scheduledOrderingPage.getWarningTextButtonClose()).toBe(commonStrings.scheduledOrderingWarningModalText.closeButton);
    });

    //BUY-40413 cancel and verify
    it('verify after canceling on time change warning modal, the items still stay in cart', function () {
        scheduledOrderingPage.clickCancelButtonOnWarningText();
        itemsPage.openCart();
        expect(cartPage.getItemDetailsFromCart()).toBe(itemDetails);
        itemsPage.closeCart();
        scheduledOrderingPage.selectTime(1);
        scheduledOrderingPage.waitForTimeChangeWarning();
    });

    //BUY-40414 yes and verify
    it('verify after tapping on yes on time change warning modal, the items are removed from cart', function () {
        scheduledOrderingPage.clickYesButtonOnWarningText();
        itemsPage.openCart();
        expect(itemsPage.cartSummaryText()).toContain("There are no items in your cart");
        itemsPage.closeCart();
        expect(scheduledOrderingPage.getChosenTime()).toBe(timeSlotChange);
    });
});