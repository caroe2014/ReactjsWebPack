// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

const checkoutObjects = require('../pageObjects/checkoutPage.objects');

class CheckoutPage {

    checkoutPageVisible() {
        checkoutObjects.checkoutPage.waitForVisible();
        return true;
    }

    clickOnPayButton() {
        checkoutObjects.payButton.click();
    }
}

module.exports = new CheckoutPage();