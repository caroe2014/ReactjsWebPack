// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const prepareBy = require('../../../pageActions/loginPage.actions')();
const itemsPage= require('../../../pageActions/itemsPage.actions')();
const cartPage = require('../../../pageActions/cart.actions')();
const scheduledOrderingPage = require('../../../pageActions/scheduledOrderingPage.actions');
const commonFunctions = require('../../../wdioHelpers/commonFunctions');

let timeSlot;

describe('BUY-39383 , BUY-40409 verify time slot in cart and hydration of the time slot after refresh', function () {
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

    it('verify time shown for pick up on cart is the same as the previous time slot selected', function () {
        //BUY-40409 cart time check
        cartPage.verifyCartTimeSlot(timeSlot);
        //BUY-39383 cart time after refresh
        browser.refresh();
        expect(itemsPage.itemsPageVisible()).toBe(true);
        itemsPage.openCart();
        expect(itemsPage.isCartOpen()).toBe(true);
        cartPage.verifyCartTimeSlot(timeSlot);
    });
});