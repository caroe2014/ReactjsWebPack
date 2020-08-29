'use strict';

let gratuityObjects = require('../pageObjects/addGratuityPage.objects');
let cartObjects = require('../pageObjects/cart.objects');

function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    isGratuityPageVisible: {
        value() {
            return gratuityObjects.tipContainer.waitForVisible();
        }
    },

    clickTipButton: {
        value(option) {
            gratuityObjects.tipOption(option).waitForVisible();
            gratuityObjects.tipOption(option).click();
        }
    },

    clickCustomTipButton:{
        value() {
            gratuityObjects.customTipButton.waitForVisible();
            gratuityObjects.customTipButton.click();
        }
    },

    setCustomTipValue: {
        value(amount) {
            gratuityObjects.customTipField.setValue(amount);
        }
    },

    verifyCustomTipValue: {
        value(amount) {
            expect(gratuityObjects.customTipField.getText()).toBe(amount);
        }
    },

    clickAddButtonCustomTip: {
        value() {
            gratuityObjects.addButtonOnCustomTip.click();
        }
    },

    clickCloseButtonCustomTip: {
        value() {
            gratuityObjects.closeButtonOnCustomTip.click();
        }
    },

    getTipAmount: {
        value() {
            return gratuityObjects.tipAmount.getText();
        }
    },

    verifyTipAmount: {
        value(tip) {
            expect(this.getTipAmount()).toBe(tip);
        }
    },

    getTotalValue: {
        value() {
            return gratuityObjects.totalValue.getText();
        }

    },

    clickPayButton: {
        value() {
            gratuityObjects.payButton.waitForVisible();
            gratuityObjects.payButton.click();
        }
    },

    clickNoTipButton: {
        value() {
            gratuityObjects.noTipButton.waitForVisible();
            gratuityObjects.noTipButton.click();
        }
    },

    fetchAmountFromPayButton: {
        value() {
            return gratuityObjects.payButton.getText();
        }
    },

    verifyTotal: {
        value(text) {
            expect(this.getTotalValue()).toBe(text);
        }
    },

    getTipPercentageAt: {
        value(position) {
            return gratuityObjects.tipOption(position).getText();
        }
    },

	getHeaderTextColor: {
        value() {
	        return getColor(gratuityObjects.homeButton, 'color');
        }
    },

	getTipCatureTitleColor: {
		value() {
			return getColor(gratuityObjects.tipTitle, 'color');
		}
	},

	getContinuePayButtonBgColor: {
		value() {
			return getColor(gratuityObjects.payButton, 'background');
		}
	},

	getContinuePayButtonTextColor: {
		value() {
			return getColor(gratuityObjects.payButton, 'color');
		}
	},

    isCartIconVisibleInDeliveryPage: {
        value() {
            return cartObjects.myCart.isExisting();
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
