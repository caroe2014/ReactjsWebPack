// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* istanbul ignore file */
import moment from 'moment';

export const convertTimeStringToMomentFormat = (timeString) => {
  return moment(timeString, 'hh:mm A');
};

export const getUtcDateTimeFromTimeString = (timeString, daysToAdd = 0) => {
  const currentDate = moment(new Date()).add(daysToAdd, 'days').format('DD-MM-YYYY');
  const utcTimeStamp = moment.utc(moment(currentDate + ' ' + timeString, 'DD-MM-YYYY hh:mm a')).format();
  return utcTimeStamp;
};

export const checkScheduledTimeIsValid = (scheduledTime, timeZone) => {
  const currentTimeConvertedToStoreTimeZone = moment(new Date(), 'DD-MM-YYYY hh:mm A').tz(timeZone).format();
  const todayDate = moment(new Date()).format('DD-MM-YYYY');
  const selectedScheduleTime = moment(todayDate + ' ' + scheduledTime, 'DD-MM-YYYY hh:mm A').format();
  return selectedScheduleTime < currentTimeConvertedToStoreTimeZone;
};

export const calculatePayableAmountWithTip = (amountAgainstPayment, payableRemainingTip) => {
  let amountToBeCharged = parseFloat(amountAgainstPayment);
  let remainingTipAmount = parseFloat(payableRemainingTip);
  let amount = amountAgainstPayment;
  let tipAmount = '0.00';
  if (remainingTipAmount > 0) {
    if (amountToBeCharged >= remainingTipAmount) {
      amount = (amountToBeCharged - remainingTipAmount).toFixed(2);
      tipAmount = remainingTipAmount.toFixed(2);
      remainingTipAmount = 0;
    } else {
      amount = '0.00';
      remainingTipAmount = parseFloat((remainingTipAmount - amountToBeCharged).toFixed(2));
      tipAmount = amountToBeCharged.toFixed(2);
    }
  }
  return {amount, tipAmount, remainingTip: remainingTipAmount};
};

export const getCurrentCurrency = (selectedSite) => selectedSite ? {
  currencyDecimalDigits: selectedSite.displayOptions['currency/currencyDecimalDigits'],
  currencyCultureName: selectedSite.displayOptions['currency/currencyCultureName'],
  currencyCode: selectedSite.displayOptions['currency/currencyCode'],
  currencySymbol: selectedSite.displayOptions['currency/currencySymbol']
} : {};

export const getConceptIGSettings = (igSettings, conceptIgPosConfig, conceptLevelIgPosConfig) => {
  if (conceptLevelIgPosConfig && conceptIgPosConfig) {
    igSettings.onDemandTenderId = conceptIgPosConfig.tenderId;
    igSettings.onDemandTerminalId = conceptIgPosConfig.terminalId;
    igSettings.onDemandEmployeeId = conceptIgPosConfig.employeeId;
    igSettings.onDemandIgVerificationCodeId = conceptIgPosConfig.igVerificationCode;
  }
  return igSettings;
};
