// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

const Page = require('./page');

class ScheduledOrdering extends Page {

    get myCart() {
        return $('.CartLink');
    }

    get headerText() {
        return $('div.header-text');
    }

    get findFoodButton() {
        return $('.pay-button');
    }

    get timeFrameSelectBox() {
        return $('div.type-select');
    }

    get getOptions() {
        return $$('.react-select__menu-list .react-select__option');
    }

    get chosenTime() {
        return $('.time-select .react-select__value-container .react-select__single-value');
    }

    get timeSelectBox() {
        return $('div.time-select');
    }

    get backgroundImage() {
        return $('.image');
    }

    get outerDiv() {
        return $('div.schedule-order');
    }

    get timeChangeWarningModal() {
        return $('div.modal-container');
    }

    get warningTextForAreYouSure() {
        return this.timeChangeWarningModal.$('h2.modal-title');
    }

    get warningTextAboutAbandoning() {
        return this.timeChangeWarningModal.$('div.modal-content div.modal-text');
    }

    get warningTextButtonYes() {
        return this.timeChangeWarningModal.$('div.modal-footer button.modal-continue-button');
    }

    get warningTextButtonCancel() {
        return this.timeChangeWarningModal.$('div.modal-footer button.modal-cancel-button');
    }

    get warningTextButtonClose() {
        return this.timeChangeWarningModal.$('button.close-button');
    }
};

module.exports = new ScheduledOrdering();