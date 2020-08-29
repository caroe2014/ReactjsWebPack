// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

const Page = require('./page');

class Checkout extends Page {

    get checkoutPage() {
        return $('.context-title');
    }

    get payButton() {
        return $('.pay-button');
    }
};

module.exports = new Checkout();