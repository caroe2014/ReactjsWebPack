// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
'use strict';

let phoneNumberPageObjects = require('../pageObjects/phoneNumberPage.objects');

function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    isPhoneNumberPageVisible: {
        value() {
            return phoneNumberPageObjects.phoneCapture.waitForVisible();
        }
    },

    getPhonePageInstruction: {
        value() {
            phoneNumberPageObjects.phoneNumberInstructionText.waitForVisible();
            return phoneNumberPageObjects.phoneNumberInstructionText.getText();
        }
    },

    isPhoneNumberInstructionVisible: {
        value() {
            return phoneNumberPageObjects.phoneNumberInstructionText.isVisible();
        }
    },

    enterPhoneNumber: {
        value(phone) {
            phoneNumberPageObjects.phoneTextField.waitForVisible();
            phoneNumberPageObjects.phoneTextField.setValue(phone);
        }
    },

    getPhoneNumber: {
        value() {
            phoneNumberPageObjects.phoneTextField.waitForVisible();
            return phoneNumberPageObjects.phoneTextField.getValue();
        }
    },

    clearField: {
        value() {
            phoneNumberPageObjects.clearPhoneField.waitForVisible();
            phoneNumberPageObjects.clearPhoneField.click();
        }
    },

    isValidationErrorVisible: {
        value() {
            return phoneNumberPageObjects.inputfieldError.waitForVisible();
        }
    },

    clickContinueToPay: {
        value() {
            phoneNumberPageObjects.continueToPayButton.waitForVisible();
            phoneNumberPageObjects.continueToPayButton.click();
        }
    },

    isSkipButtonVisible: {
        value() {
            return phoneNumberPageObjects.skipButton.waitForVisible();
        }
    },

    clickSkipButton: {
        value() {
            phoneNumberPageObjects.skipButton.click();
        }
    },

    clickBackToItemsPage: {
        value() {
            phoneNumberPageObjects.backButton.click();
        }
    },

	getHeaderTextColor: {
		value() {
			return getColor(phoneNumberPageObjects.homeButton, 'color');
		}
	},

	getPhonePageTitleColor: {
		value() {
			return getColor(phoneNumberPageObjects.pageTitle, 'color');
		}
	},

	getContinueToPayButtonBgColor: {
		value() {
			return getColor(phoneNumberPageObjects.continueToPayButton, 'background-color');
		}
	},

	getContinueToPayButtonTextColor: {
		value() {
			return getColor(phoneNumberPageObjects.continueToPayButton, 'color');
		}
	},

	getSkipButtonColor: {
		value() {
			return getColor(phoneNumberPageObjects.skipButton, 'color');
		}
	}
});

function getColor(element, property)  {
	let colorObj = (element).getCssProperty(property);
	return colorObj.parsed.hex;
}

module.exports = function () {
    return new HelperPageObject();
};