// (C) 2020 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

'use strict';

class Utils {

    getTimeObjectFromString(timeText) {
        var splitArray = timeText.split(" ");
        var meridian = splitArray[1];
        var time = splitArray[0];
        var splitTime = time.split(":");
        var hours = Number(splitTime[0]);
        var minutes = Number(splitTime[1]);

        if (meridian === "PM" && hours < 12) hours = hours + 12;
        if (meridian === "AM" && hours === 12) hours = hours - 12;

        var date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }

    getExpectedFirstTimeSlot(bufferTime, intervalTime) {
        var currentTime = new Date();
        var currentTimePlusBuffer = new Date(currentTime.getTime() + (bufferTime * 60 * 1000));
        var leftOverMins = (currentTimePlusBuffer.getMinutes() % intervalTime);
        var paddingMins = intervalTime - leftOverMins;
        var expectedTime = currentTimePlusBuffer;
        if (leftOverMins !== 0) {
            expectedTime = new Date(currentTimePlusBuffer.getTime() + (paddingMins * 60 * 1000));
        }
        return expectedTime;
    }

    get$RemovedNumber(price) {
        return parseFloat(price.slice(1));
    }

    formatNumberWithXDecimals (num, decimals = 2) {
            // setting decimal number with scale of desired number - if decimals is 2 and number is 0.5,returns 0.50;
            // if number is 1.11,returns the same number.
            num = num.toFixed(decimals);
            // Return updated or original number.
            return num;
    }
}

module.exports = new Utils();
