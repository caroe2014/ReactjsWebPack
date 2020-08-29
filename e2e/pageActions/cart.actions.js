'use strict';

let itemsObjects = require('../pageObjects/itemsPage.objects');
let cartObjects = require('../pageObjects/cart.objects');


function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {
    
    getItemDetailsFromCart: {
        value(itm = 0) {
            let cartItems = cartObjects.allCartItems;
            return cartItems[itm].getValue();
        }
    },

    getItemDisplayNameFromCart: {
        value(itm = 0) {
            let cartItems = cartObjects.allCartItems;
            return cartObjects.getItemDisplayNameInCart(cartItems[itm]).getText();
        }
    },

    getPickUpTime: {
        value() {
            return cartObjects.pickUpTime.getText();
        }
    },

    verifyCartTimeSlot: {
        value(timeSlot) {
            expect(this.getPickUpTime()).toBe(timeSlot);
        }
    },

    getTotalPriceFromCart: {
        value() {
            cartObjects.payNowButton.waitForVisible();
            cartObjects.payNowButton.waitForEnabled();
            return cartObjects.totalPrice.getText();
        }
    }
});

module.exports = function () {
    return new HelperPageObject();
};