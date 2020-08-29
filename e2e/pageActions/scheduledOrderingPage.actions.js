// (C) 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

let scheduledOrderingPageObjects = require('../pageObjects/scheduledOrderingPage.objects');

class ScheduledOrderingPage {

    backgroundVisible() {
        scheduledOrderingPageObjects.backgroundImage.waitForVisible();
    }

    getTitleText() {
        scheduledOrderingPageObjects.headerText.waitForVisible();
        return scheduledOrderingPageObjects.headerText.getText();
    }

    verifyTitleText(text) {
        expect(this.getTitleText()).toBe(text);
    }

    selectASAP() {
        this.chooseItem(0, scheduledOrderingPageObjects.timeFrameSelectBox);
    }

    waitForFindFoodButton(){
        scheduledOrderingPageObjects.findFoodButton.waitForVisible();
    }

    isFindFoodButtonVisible() {
        return scheduledOrderingPageObjects.findFoodButton.isVisible();
    }

    isTimeSelectBoxVisible() {
        return scheduledOrderingPageObjects.timeSelectBox.isVisible();
    }

    getChosenTime() {
        return scheduledOrderingPageObjects.chosenTime.getText();
    }

    selectLaterToday() {
        this.chooseItem(1, scheduledOrderingPageObjects.timeFrameSelectBox);
    }

    selectTime(timeIndex = 0) {
        return this.chooseItem(timeIndex, scheduledOrderingPageObjects.timeSelectBox);
    }

    chooseItem(index = 0, selectBox) {
        let allOptions = this.getAllDropDownOptions(selectBox);
        let optionName = allOptions[index].getText();
        allOptions[index].click();
        console.log("Chosen option:" + optionName);
        return optionName;
    }

    getTimeFrameDropDownList() {
        return this.getAllDropDownOptions(scheduledOrderingPageObjects.timeFrameSelectBox);
    }

    clickOutsideOfTimeFrameSelectBox() {
        scheduledOrderingPageObjects.outerDiv.click();
    }

    getTimeDropDownList() {
        return this.getAllDropDownOptions(scheduledOrderingPageObjects.timeSelectBox);
    }

    getAllDropDownOptions(selectBox) {
        selectBox.waitForVisible();
        selectBox.click();
        return scheduledOrderingPageObjects.getOptions;
    }

    clickFindFood() {
        scheduledOrderingPageObjects.findFoodButton.click();
    }

    waitForTimeChangeWarning() {
        scheduledOrderingPageObjects.timeChangeWarningModal.waitForVisible();
    }

    getWarningTextForAreYouSure() {
       scheduledOrderingPageObjects.warningTextForAreYouSure.waitForVisible();
       return scheduledOrderingPageObjects.warningTextForAreYouSure.getText();
    }

    getWarningTextAboutAbandoning() {
        scheduledOrderingPageObjects.warningTextAboutAbandoning.waitForVisible();
        return scheduledOrderingPageObjects.warningTextAboutAbandoning.getText();
    }

    getWarningTextButtonYes() {
        scheduledOrderingPageObjects.warningTextButtonYes.waitForVisible();
        return scheduledOrderingPageObjects.warningTextButtonYes.getText();
    }

    getWarningTextButtonCancel() {
        scheduledOrderingPageObjects.warningTextButtonCancel.waitForVisible();
        return scheduledOrderingPageObjects.warningTextButtonCancel.getText();
    }

    getWarningTextButtonClose() {
        scheduledOrderingPageObjects.warningTextButtonClose.waitForVisible();
        return scheduledOrderingPageObjects.warningTextButtonClose.getText();
    }

    clickCancelButtonOnWarningText() {
        scheduledOrderingPageObjects.warningTextButtonCancel.waitForVisible();
        scheduledOrderingPageObjects.warningTextButtonCancel.click();
    }

    clickYesButtonOnWarningText() {
        scheduledOrderingPageObjects.warningTextButtonYes.waitForVisible();
        scheduledOrderingPageObjects.warningTextButtonYes.click();
    }

    calculateIntervalTime(timeSlot) {
        let pickUpWindow = timeSlot.split(" ");

        let startTime = pickUpWindow[0];
        let endTime = pickUpWindow[3];
        let startTimeSplit = startTime.split(":");
        let endTimeSplit = endTime.split(":");

        let date1 = new Date(0, 0, 0, startTimeSplit[0], startTimeSplit[1], 0, 0);
        let date2 = new Date(0, 0, 0, endTimeSplit[0], endTimeSplit[1],0, 0);
        let diff = new Date(date2 - date1);
        let intervalTimeInMins = diff.getMinutes();

        return intervalTimeInMins;
    }
}

module.exports = new ScheduledOrderingPage();