// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const prepareBy = require('../../../pageActions/loginPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const scheduledOrderingPage = require('../../../pageActions/scheduledOrderingPage.actions');
const commonFunctions = require('../../../wdioHelpers/commonFunctions');
const paymentPage= require('../../../pageActions/paymentPage.actions')();

let timeSlot;

describe('BUY-40410 verify time slot shows up on order confirmation page', function () {
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
    });

    it('go to payment page and click credit card option', function () {
        itemsPage.clickPayNow();
        expect(paymentPage.paymentPageVisible()).toBe(true);
        paymentPage.clickCreditCardOption();
    });

    it('verify if you could make a payment and land on confirmation page', function() {
        paymentPage.switchControlToiFrame();
        paymentPage.enterCardDetails();
        paymentPage.clickPay();

        paymentPage.switchToAppContainer();
        expect(paymentPage.isPaymentSuccessful()).toBe(true);
    });

    it('verify time shown on confirmation screen is the same as the timeslot selected', function () {
        expect(paymentPage.getPickUpTime()).toEqual(timeSlot);
    });
    
});