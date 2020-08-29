'use strict';

let nameCaptureObjects = require('../pageObjects/nameCapturePage.objects');

function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    isNameCapturePageVisible: {
        value() {
            return nameCaptureObjects.nameCapture.waitForVisible();
        }
    },

    enterName: {
        value(firstName, initial) {
            nameCaptureObjects.nameCapture.waitForVisible();
            nameCaptureObjects.firstNameField.click();
            nameCaptureObjects.firstNameField.setValue(firstName);
            nameCaptureObjects.lastInitialField.click();
            nameCaptureObjects.lastInitialField.setValue(initial);
        }
    },

    verifyFirstNameText: {
        value(text) {
            nameCaptureObjects.nameCapture.waitForVisible();
            expect(nameCaptureObjects.firstNameField.getValue()).toBe(text);
        }
    },

    verifyLastInitialText: {
        value(text) {
            nameCaptureObjects.nameCapture.waitForVisible();
            expect(nameCaptureObjects.lastInitialField.getValue()).toBe(text);
        }
    },


    clickContinueToPay: {
        value() {
            nameCaptureObjects.continueButton.waitForVisible();
            nameCaptureObjects.continueButton.click();
        }
    },

    clickSkip: {
        value() {
            nameCaptureObjects.spikButton.waitForVisible();
            nameCaptureObjects.spikButton.click();
        }
    },

    verifyIfNameRequired: {
        value() {
            return nameCaptureObjects.nameCapture.waitForVisible();
        }
    },

    instructionText: {
        value() {
            nameCaptureObjects.nameCaptureInstruction.waitForVisible();
            return nameCaptureObjects.nameCaptureInstruction.getText();
        }
    },

	getHeaderTextColor: {
	    value() {
		    return getColor(nameCaptureObjects.homeButton, 'color');
	    }
    },

	getNamePageTitleColor: {
		value() {
			return getColor(nameCaptureObjects.pageTitle, 'color');
		}
	},

	getContinueToPayButtonBgColor: {
		value() {
			return getColor(nameCaptureObjects.continueButton, 'background');
		}
	},

	getContinueToPayButtonTextColor: {
		value() {
			return getColor(nameCaptureObjects.continueButton, 'color');
		}
	},

	getSkipButtonColor: {
		value() {
			return getColor(nameCaptureObjects.spikButton, 'color');
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