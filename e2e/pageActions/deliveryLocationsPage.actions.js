// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let deliveryLocationObjects = require('../pageObjects/deliveryLocationsPage.objects');
let cartObjects = require('../pageObjects/cart.objects');

function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

	isDeliveryLocationPageVisible: {
		value() {
			return deliveryLocationObjects.deliveryLocationHeader.waitForVisible();
		}
	},

	getDeliveryInstructionText:{
		value() {
			deliveryLocationObjects.deliveryLocationHeader.waitForVisible();
			return deliveryLocationObjects.deliveryInstruction.getText();
		}
	},

	getLocationFieldsCount: {
		value() {
            let allTextFields = deliveryLocationObjects.getAllFields;
			return allTextFields.length;
		}
	},

	getFirstDeliveryFieldLabel: {
		value() {
			let allFieldsLabels = deliveryLocationObjects.getAllFieldLabels;
			return allFieldsLabels[0].getText();
		}
	},

    enterDeliveryDetails: {
	    value(field, value) {
            let allTextFields = deliveryLocationObjects.getAllFields;
            allTextFields[field].setValue(value);
        }
    },

    clickContinuePay: {
	    value() {
            deliveryLocationObjects.payButton.waitForVisible();
            deliveryLocationObjects.payButton.click();
        }
    },

    getDeliveryFieldValue: {
        value(field=0) {                                               //if field value is not passed, the default is 0
            let allTextFields = deliveryLocationObjects.getAllFields;
            return allTextFields[field].getValue();
        }
    },

    clearFields: {
        value() {
            deliveryLocationObjects.clearButton.waitForVisible();
            deliveryLocationObjects.clearButton.click();
        }
    },

    isErrorMessageVisibleForField: {
	    value(field=0) {
            let allErrorFields = deliveryLocationObjects.getAllErrors;
            return allErrorFields[field].waitForVisible();
        }
    },

    isCartIconVisibleInDeliveryPage: {
	    value() {
            return cartObjects.myCart.isExisting();
        }
    },

	getHeaderTextColor: {
		value() {
			return getColor(deliveryLocationObjects.homeButton, 'color');
		}
	},

	getDeliveryLocationTitleColor: {
		value() {
			return getColor(deliveryLocationObjects.deliveryLocationHeader, 'color');
		}
	},

	getNextButtonBgColor: {
		value() {
			return getColor(deliveryLocationObjects.payButton, 'background');
		}
	},

	getNextButtonTextColor: {
		value() {
			return getColor(deliveryLocationObjects.payButton, 'color');
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