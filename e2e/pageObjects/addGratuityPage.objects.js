const Page = require('./page');

class Category extends Page {


    get tipContainer() {
        return $('.tip-capture-container');
    }

    tipOption(option) {
        let identifier = '.tip-button-'+option;
        return $(identifier);
    }

    get customTipButton() {
        return $('.custom-tip-button');
    }

    get customTipField() {
        return $('.custom-flex input[type="number"]');
    }

    get addButtonOnCustomTip() {
        return $('.add-custom-tip-button');
    }

    get closeButtonOnCustomTip() {
        return $('.custom-tip-button .close-button');
    }

    get tipAmount() {
        return $('div.add-tip-label:nth-child(2)');
    }

    get totalValue() {
        return $('.pay-field div.bill-amount-value');
    }

    get payButton() {
        return $('.pay-button');
    }

    get noTipButton() {
        return $('.no-tip-button');
    }

    get homeButton() {
        return $('.home-button-link');
    }

    get tipTitle() {
	    return $('.context-title');
    }
};

module.exports = new Category();