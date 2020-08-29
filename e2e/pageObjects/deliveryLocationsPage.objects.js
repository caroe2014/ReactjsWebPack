// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

const Page = require('./page');

class Category extends Page {
    get deliveryLocationHeader() {
        return $('.delivery-header');
    }

	get deliveryInstruction() {
        return $('.instruction-text');
    }

    get getAllFields() {
        return $$('.delivery-child-box .input-text');
    }

    get getAllFieldLabels() {
        return $$('.delivery-child-box label.input-field-label');
    }

    get child() {
        return $('.input-text');
    }

    get payButton() {
        return $('.pay-button');
    }

    get clearButton() {
        return $('.clear-button');
    }

    get getAllErrors() {
        return $$('.delivery-child-box .input-field-error');
    }

    get homeButton() {
        return $('.home-button-link');
    }
}

module.exports = new Category();