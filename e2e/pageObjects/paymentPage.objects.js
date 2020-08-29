const Page = require('./page');

class Payment extends Page {


    get paymentPageHeader() {
        return $('.payments-container-parent');
    }

    get payiFrame() {
        return $('.payment-iframe-modal-parent .iFrame');
    }

    get roomChargePaymentOption() {
        return $('.pay-options-parent .roomCharge-1');
    }

    get roomChargeModal() {
        return $('.roomcharge-modal .modal-container .modal-body');
    }

    get roomChargeTotal() {
        return $('.roomcharge-modal .modal-container .total-due');
    }

    get exitButtonOnRoomChargeModal() {
        return $('.roomcharge-modal .modal-container button.exit-dialog-button');
    }

    get cancelButtonOnRoomChargeModal() {
        return $('.roomcharge-modal .modal-container button.cancel-button');
    }

    get roomNumberField() {
        return $('input.room-number');
    }

    get roomChargeLastNameField() {
        return $('input.last-name');
    }

    get roomChargeFieldsClearButton() {
        return $('button.clear-value');
    }

    get roomChargeSubmitButton() {
        return $('button.main-btn');
    }

    get hotelWingDropDown() {
        return $('.input-field-parent .wing .react-select__control');
    }

    get hotelDropDown() {
        return $('.input-field-parent .hotel .react-select__control');
    }

    get gaPaymentOption() {
        return $('.pay-options-parent .genericAuthorization-1');
    }

    get gaPaymentMethodName(){
        return $('.genericAuthorization-1 .account-container .detail-container .text-container');
    }

    get gaPaymentModal() {
        return $('.modal-container .modal-body');
    }

    get gaXButton() {
        return $('.close-btn');
    }

    get gaCancelButton() {
        return $('button.cancel-btn1');
    }
    
    get gaPaymentModalHeader() {
        return $('.modal-body .modal-title');
    }

    get gaPaymentInstructionText() {
        return $('.modal-body .instruction-text');
    }

    get gaAccountNumberField() {
        return $('input.input-text');
    }

    get gaSecondaryVerf() {
        return $('input.secondaryVerification');
    }

    get showGaAccountsButton() {
        return $('button.main-btn');
    }

    get gaAccountsErrorText() {
        return $('.modal-body .error-text');
    }

    get creditCardOption() {
        return $('.rGuestIframe-0');
    }

    get cardNumberFeild() {
        return $('#cardNumber');
    }

    get expiryMonth() {
        return $('#expirationMonth');
    }

    get expiryYear() {
        return $('#expirationYear');
    }

    get cvvFeild() {
        return $('#cvv');
    }

    get zipCodeFeild() {
        return $('#postalCode');
    }

    get cardHolderNameField() {
        return $('#cardholderName');
    }

    get payButton() {
        return $('#btnSubmit');
    }

    get cancelButton() {
        return $('#cancelSubmit');
    }

    get appContainer() {
        return $('#appContainer');
    }

    get paySuccessful() {
        return $('.pay-success-container');
    }

    get backToMain() {
        return $('.No-button');
    }

    get emailBox() {
        return $('.email-text');
    }

    get sendEmail() {
        return $('.send-button');
    }

    get emailSentSuccessfulSign() {
        return $('.agilysys-icon-email-sent');
    }

    get orderNumber() {
        return $('div.order-number');
    }

    get ETFtext() {
        return $('.ready-time-container');

    }

    get orderNumberFromConfirmationPage() {
        return $('div.order-number:nth-child(1)');
    }

    get emailFromConformationPage() {
        return $('.email-id-sent');
    }

    get homeLogo() {
        return $('.home-button-link');
    }

    get backButton() {
        return $('.back-link-container');
    }

    get backButtonToAddName() {
        return $('.back-link-container a.back-arrow-link');
    }

    get paymentMethodTile() {
        return $('.pay-options-parent .tile');
    }

    get totalBillPaid() {
        return $('.TotalBill');
    }

    get cvvFieldError() {
        return $('#cvv-error');
    }

    get zipFieldError() {
        return $('#postalCode-error');
    }

    get expiryFieldError() {
        return $('#DateofExpiry-error');
    }

    get orderName() {
        return $('.seat-number');
    }

    get homeButton() {
        return $('.home-button-link');
    }

    get pageTitle() {
        return $('.context-title');
    }

    get pickUpTime() {
        return $('.ready-time-container .ready-time');
    }

    get instructionText() {
        return $('.pay-label-container .sc-PLyBE'); // need to change the identifier to instruction-text post 3.8.0
    }
};

module.exports = new Payment();