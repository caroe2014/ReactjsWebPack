'use strict';

let paymentObjects = require('../pageObjects/paymentPage.objects');
let cartObjects = require('../pageObjects/cart.objects');

let email="weborderingauto@gmail.com";
function HelperPageObject() {
}

HelperPageObject.prototype = Object.create(Object.prototype, {

    paymentPageVisible: {
        value() {
            paymentObjects.paymentPageHeader.waitForVisible();
            return true;
        }
    },

    gaPaymentOptionVisible: {
        value() {
            paymentObjects.gaPaymentOption.waitForVisible();
            return true;
        }
    },

    gaPaymentMethodName: {
        value() {
            return paymentObjects.gaPaymentMethodName.getText();
        }
    },

    gaPaymentModalHeader: {
        value() {
            return paymentObjects.gaPaymentModalHeader.getText();
        }
    },

    gaPaymentInstructionText: {
        value() {
            return paymentObjects.gaPaymentInstructionText.getText();
        }
    },

    clickGaOption: {
        value() {
            paymentObjects.gaPaymentOption.waitForVisible();
            paymentObjects.gaPaymentOption.click();
        }
    },

    waitForGaModal: {
        value() {
            paymentObjects.gaPaymentModal.waitForVisible();
        }
    },

    isGaModalVisible: {
        value() {
            return paymentObjects.gaPaymentModal.isVisible();
        }
    },

    isGaShowAccountsButtonEnabled:{
        value() {
            return paymentObjects.showGaAccountsButton.isEnabled();
        }
    },

    clickGaShowAccountsButton: {
        value() {
            paymentObjects.showGaAccountsButton.waitForVisible();
            paymentObjects.showGaAccountsButton.click();
        }
    },

    clickGaXButton: {
        value() {
            paymentObjects.gaXButton.waitForVisible();
            paymentObjects.gaXButton.click();
        }
    },

    clickGaCancelButton: {
        value() {
            paymentObjects.gaCancelButton.waitForVisible();
            paymentObjects.gaCancelButton.click();
        }
    },

    getGaErrorText: {
        value() {
            paymentObjects.gaAccountsErrorText.waitForVisible();
            return paymentObjects.gaAccountsErrorText.getText();
        }
    },

    enterValuesInGaAccountField: {
        value(acctNum) {
            paymentObjects.gaAccountNumberField.click();
            paymentObjects.gaAccountNumberField.setValue(acctNum);
        }
    },

    enterValueInSecondaryVerfField: {
        value(textOrNum) {
            paymentObjects.gaSecondaryVerf.click();
            paymentObjects.gaSecondaryVerf.setValue(textOrNum);
        }
    },

    paymentMethodTileVisible: {
        value() {
            paymentObjects.paymentMethodTile.waitForVisible();
        }
    },

    enterCardDetails: {
        value() {

            paymentObjects.cardNumberFeild.waitForVisible();

            paymentObjects.cardHolderNameField.setValue('TestUser');
            paymentObjects.cardNumberFeild.setValue('4111111111111111');
            paymentObjects.expiryMonth.setValue('10');
            paymentObjects.expiryYear.setValue('2022');
            paymentObjects.cvvFeild.setValue('123');
            paymentObjects.zipCodeFeild.setValue('98009');

        }
    },

    clickPay: {
        value() {
            paymentObjects.payButton.waitForVisible();
            paymentObjects.payButton.click();
        }
    },

    clickRoomChargeOption: {
        value() {
            paymentObjects.roomChargePaymentOption.waitForVisible();
            paymentObjects.roomChargePaymentOption.click();
        }
    },

    waitForRoomChargeModal: {
        value() {
            paymentObjects.roomChargeModal.waitForVisible();
        }
    },

    clickXButtonOnRoomChargeModal: {
        value() {
            paymentObjects.exitButtonOnRoomChargeModal.waitForVisible();
            paymentObjects.exitButtonOnRoomChargeModal.click();
        }
    },

    clickCancelButtonOnRoomChargeModal: {
        value() {
            paymentObjects.cancelButtonOnRoomChargeModal.waitForVisible();
            paymentObjects.cancelButtonOnRoomChargeModal.click();
        }
    },

    getValueInRoomNumberField: {
        value() {
            paymentObjects.roomNumberField.click();
            return paymentObjects.roomNumberField.getValue();
        }
    },

    clickRoomNumberField: {
        value() {
            paymentObjects.roomNumberField.click();
        }
    },

    verifyRoomNumberFieldValue: {
        value(roomNum) {
            expect(this.getValueInRoomNumberField()).toBe(roomNum);
        }
    },

    setValueInRoomNumberField: {
        value(roomNum) {
            paymentObjects.roomNumberField.click();
            paymentObjects.roomNumberField.setValue(roomNum);
        }
    },

    getValueInLastNameField: {
        value() {
            paymentObjects.roomChargeLastNameField.click();
            return paymentObjects.roomChargeLastNameField.getText();
        }
    },

    clickLastNameField: {
        value() {
            paymentObjects.roomChargeLastNameField.click();
        }
    },

    verifyLastNameFieldValue: {
        value(lastName) {
            expect(this.getValueInLastNameField()).toBe(lastName);
        }
    },

    setValueInLastNameField: {
        value(lastName) {
            paymentObjects.roomChargeLastNameField.click();
            paymentObjects.roomChargeLastNameField.setValue(lastName);
        }
    },

    clickRoomChargeFieldsClearButton: {
        value() {
            paymentObjects.roomChargeFieldsClearButton.click();
        }
    },

    isRoomChargeSubmitButtonEnabled: {
        value() {
            return paymentObjects.roomChargeSubmitButton.isEnabled();
        }
    },

    getTotalOnRoomChargeModal: {
        value() {
            paymentObjects.roomChargeTotal.waitForVisible();
            return paymentObjects.roomChargeTotal.getText();
        }
    },

    clickHotelWingDropDown: {
        value() {
            paymentObjects.hotelWingDropDown.click();
        }
    },

    getWingDropDownText: {
        value() {
            return paymentObjects.hotelWingDropDown.getText();
        }
    },

    clickHotelDropDown: {
        value() {
            paymentObjects.hotelDropDown.click();
        }
    },

    isWingOptionDisplayed: {
        value() {
            return paymentObjects.hotelWingDropDown.isVisible();
        }

    },

    clickCreditCardOption: {
        value() {
            paymentObjects.creditCardOption.waitForVisible();
            paymentObjects.creditCardOption.click();
        }
    },

    switchControlToiFrame: {
        value() {

            // Using iframe class name `.iFrame` to find iframe and providing it to `frame` method
            paymentObjects.payiFrame.waitForVisible();
            var my_frame = paymentObjects.payiFrame.value;
            console.log("the frame value is "+my_frame);
            browser.frame(my_frame);
        }
    },

    switchToAppContainer: {
        value() {
            paymentObjects.appContainer.waitForVisible();
            console.log("switching back to app container ");
            browser.frameParent();
        }
    },

    isPaymentSuccessful: {
        value() {
            paymentObjects.paySuccessful.waitForVisible();
            return true;
        }
    },

    clickNoThanks: {
        value() {
            paymentObjects.backToMain.waitForVisible();
            paymentObjects.backToMain.scroll();
            paymentObjects.backToMain.click();
        }
    },

    enterEmailAndSend: {
        value() {
            paymentObjects.emailBox.waitForVisible();
            paymentObjects.emailBox.setValue(email);
            paymentObjects.sendEmail.waitForEnabled();
            paymentObjects.sendEmail.click();
        }
    },

    getEmailId: {
        value() {
            return email;
        }
    },

    getEmailIdFromEmailConfirmationPage: {
        value() {
            return paymentObjects.emailFromConformationPage.getText();
        }
    },

    getOrderFromEmailConfirmationPage: {
        value() {
            return paymentObjects.orderNumberFromConfirmationPage.getText();
        }
    },

    getPickUpTime: {
        value() {
            return paymentObjects.pickUpTime.getText();
        }
    },

    isEmailSent: {
        value() {
            paymentObjects.emailSentSuccessfulSign.waitForVisible();
            return true;
        }
    },

    clickClear: {
        value() {
            paymentObjects.cancelButton.waitForVisible();
            paymentObjects.cancelButton.click();
        }
    },

    getOrderNumber: {
        value() {
            paymentObjects.orderNumber.waitForVisible();
            return paymentObjects.orderNumber.getText();
        }
    },

    verifyPaymentFieldsAreCleared: {
        value() {
            paymentObjects.cardNumberFeild.waitForVisible();

            expect(paymentObjects.cardNumberFeild.getValue()).toBe('');
            expect(paymentObjects.expiryYear.getValue()).toBe('');
            expect(paymentObjects.expiryMonth.getValue()).toBe('')
            expect(paymentObjects.cvvFeild.getValue()).toBe('');
            expect(paymentObjects.zipCodeFeild.getValue()).toBe('');
            expect(paymentObjects.cardHolderNameField.getValue()).toBe('');
            return true;
        }
    },

    ETFtextVisible: {
        value() {
            paymentObjects.ETFtext.waitForVisible();
            return true;
        }
    },

    clickHome: {
        value() {
            paymentObjects.homeLogo.waitForVisible();
            paymentObjects.homeLogo.click();
        }
    },

    clickBackToPreviousPage: {
        value() {
            paymentObjects.backButton.waitForVisible();
            paymentObjects.backButton.click();
        }
    },

    clickBackToAddName: {
        value() {
            paymentObjects.backButtonToAddName.waitForVisible();
            paymentObjects.backButtonToAddName.click();
        }
    },

    getPayText: {
        value() {
            return paymentObjects.instructionText.getText();

        }
    },

    clickBackToGratuityPage: {
        value() {
            paymentObjects.backButton.waitForVisible();
            paymentObjects.backButton.click();
        }
    },

    totalBillPaid: {
        value() {
            paymentObjects.totalBillPaid.waitForVisible();
            return paymentObjects.totalBillPaid.getText();
        }
    },

    clickBackToPhoneNumberPage: {
        value() {
            paymentObjects.backButton.waitForVisible();
            paymentObjects.backButton.click();
        }
    },
    
    enterCVV: {
        value(cvv) {
            paymentObjects.cvvFeild.setValue(cvv);
        }
    },

    getCVVFromPaymentPage: {
        value() {
            return paymentObjects.cvvFeild.getValue();
        }
    },

    isCVVValidationErrorVisible: {
        value() {
            return paymentObjects.cvvFieldError.waitForVisible();
        }
    },

    enterZIP: {
        value(zip) {
            paymentObjects.zipCodeFeild.setValue(zip);
        }
    },

    getZIPFromPaymentPage: {
        value() {
            return paymentObjects.zipCodeFeild.getValue();
        }
    },

    isZIPValidationErrorVisible: {
        value() {
            return paymentObjects.zipFieldError.waitForVisible();
        }
    },

    enterExpiryYear: {
        value(expYear) {
            paymentObjects.expiryYear.setValue(expYear);
        }
    },

    getExpiryYear: {
        value() {
            return paymentObjects.expiryYear.getValue();
        }
    },

    isExpiryValidationErrorVisible: {
        value() {
            return paymentObjects.expiryFieldError.waitForVisible();
        }
    },

    enterExpiryMonth: {
        value(expMonth) {
            paymentObjects.expiryMonth.setValue(expMonth);
        }
    },

    getExpiryMonth: {
        value()
        {
            return paymentObjects.expiryMonth.getValue();
        }
    },

    getPayBtnText: {
        value() {
            return paymentObjects.payButton.getValue();
        }
    },

    getNameFromConfirmationPage: {
        value() {
            paymentObjects.orderName.waitForVisible();
            return paymentObjects.orderName.getText();
        }
    },

	getHeaderTextColor: {
        value() {
	        return getColor(paymentObjects.homeButton, 'color');
        }
    },

	getPaymentTitleColor: {
		value() {
			return getColor(paymentObjects.pageTitle, 'color');
		}
	},

	getPayButtonBgColor: {
		value() {
			return getColor(paymentObjects.payButton, 'background-color');
		}
	},

	getPayButtonTextColor: {
		value() {
			return getColor(paymentObjects.payButton, 'color');
		}
	},

	getOrderNumberColor: {
		value() {
			return getColor(paymentObjects.orderNumber, 'color');
		}
	},

	getEmailSendButtonBgColor: {
		value() {
			return getColor(paymentObjects.sendEmail, 'background-color');
		}
	},

	getEmailSendButtonTextColor: {
		value() {
			return getColor(paymentObjects.sendEmail, 'color');
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