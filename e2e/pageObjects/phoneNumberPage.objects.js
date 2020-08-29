// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

const Page = require('./page');

class Category extends Page {
    get phoneCapture() {
        return $('.phone-number-container');
    }

    get phoneNumberInstructionText() {
        return $('.instruction-text');
    }

    get phoneTextField() {
        return $('.input-text');
    }

    get continueToPayButton() {
        return $('button.pay-button');
    }

    get skipButton() {
        return $('.skip-btn');
    }

    get inputfieldError() {
        return $('.input-field-error');
    }

    get clearPhoneField() {
        return $('i.fa:nth-child(4)');  //need stable identifier
    }

    get backButton() {
        return $('.back-link-container');
    }

    get homeButton() {
	    return $('.home-button-link');
    }

	get pageTitle() {
		return $('.context-title');
	}
};

module.exports = new Category();