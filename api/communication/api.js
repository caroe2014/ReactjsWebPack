// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Agilysys from 'agilysys.lib';
import get from 'lodash.get';
import moment from 'moment-timezone';
import { AsYouTypeFormatter } from 'google-libphonenumber';

/* istanbul ignore file */
const logger = config.logger.child({ component: path.basename(__filename) });
const api = {
  getReceipt: async (credentials, receiptInfo) => {
    try {
      const agilysys = new Agilysys(credentials);
      const receipt = await agilysys.getReceipt(receiptInfo);
      return receipt.data;
    } catch (err) {
      logger.fatal(err);
    }
  },

  getSMSReceipt: async (credentials, receiptInfo) => {
    try {
      const agilysys = new Agilysys(credentials);
      const receipt = await agilysys.getSMSReceipt(receiptInfo);
      return receipt.data;
    } catch (err) {
      logger.fatal(err);
    }
  },

  sendEmailReceipt: async (credentials, receiptData) => {
    try {
      const agilysys = new Agilysys(credentials);

      var jsonData = {
        'emailDeliveryRequest': {
          'metadata': {
            'fromAddress': `${receiptData.emailInfo ? receiptData.emailInfo.receiptFromAddress : 'noreply@rguest.com'}`, // eslint-disable-line max-len
            'fromName': receiptData.emailInfo ? receiptData.emailInfo.receiptFromName : 'rGuestBuyOnDemand',
            'toAddresses': receiptData.customerAddress || [ receiptData.sendOrderTo ],
            'subject': receiptData.emailInfo && receiptData.emailInfo.receiptSubject ? receiptData.emailInfo.receiptSubject : 'Receipt from rGuestBuyOnDemand' // eslint-disable-line max-len
          },
          'content': {
            'objectType': 'formattedContent',
            'type': 'HTML',
            'messageBody': receiptData.receiptHtml
              ? receiptData.receiptHtml.replace(/(?:\r\n|\r|\n)/g, '')
              : ''
          }
        }
      };

      const response = await agilysys.sendEmailReceipt(jsonData, receiptData.contextId);
      return response;
    } catch (err) {
      logger.error('Send Receipt failed. An error occured.', err);
    }
  },

  sendSMSReceipt: async (credentials, receiptData) => {
    try {
      const agilysys = new Agilysys(credentials);
      var jsonData = {
        smsDeliveryRequest: {
          metadata: {
            fromName: '',
            toNumbers: [
              receiptData.sendOrderTo
            ]
          },
          content: {
            objectType: 'formattedContent',
            type: 'TEXT',
            messageBody: receiptData.receiptText
          }
        }
      };

      const response = await agilysys.sendSMSReceipt(jsonData, receiptData.contextId);
      return response;
    } catch (err) {
      logger.error('Send Receipt failed. An error occured.', err);
    }
  },

  formatPhoneNumber: (phoneNumber, countryInfo) => {
    const formatNumber = phoneNumber.replace(/\D/g, '').substr(countryInfo.phoneCode.length);
    const formatter = new AsYouTypeFormatter(countryInfo.value);
    let finalOutput = '';
    for (var i = 0; i < formatNumber.length; i++) {
      finalOutput = formatter.inputDigit(formatNumber.charAt(i));
    }
    return `+${countryInfo.phoneCode} ${finalOutput}`;
  },

  createReceiptData: async (credentials, orderData) => {

    let lineItems = [];
    try {
      let closedOrderData = orderData.closedOrderData;
      let currencyDetails = orderData.currencyDetails;
      let tipEnabled = orderData.tipEnabled;

      const storeInfo = orderData.storeInfo;
      // const storeLogo = orderData.closedOrderData.logoDetails;
      const printedReceiptLogo = orderData.closedOrderData.logoDetails;

      const receipientName = orderData.nameCapture && closedOrderData.order.deliveryProperties.nameString;
      const mobileNumber = get(closedOrderData.order, 'properties.mobileNumber', false);
      const countryInfo = get(closedOrderData.order, 'selectedSMSCountry');
      const storePriceLevel = closedOrderData.storePriceLevel;
      const gratuity = get(closedOrderData, 'order.gratuityAmount.amount', 0);
      const serviceAmount = get(closedOrderData, 'order.serviceAmount.amount', 0);

      lineItems = closedOrderData.items.map((items) => {
        return {
          quantity: items.count,
          price: (items.priceLevels && items.priceLevels[storePriceLevel]) ? items.priceLevels[storePriceLevel].price.amount : items.price.amount,
          displayText: items.displayText,
          splInstruction: items.splInstruction ? items.splInstruction.toUpperCase() : undefined,
          lineItemGroups: items.selectedModifiers ? items.selectedModifiers.map(groups => {
            groups.lineItems = [{
              displayText: groups.description,
              price: groups.baseAmount,
              lineItemGroups: groups.suboption ? [{
                lineItems: groups.suboption.map(sOption => ({
                  displayText: sOption.description,
                  price: sOption.amount
                }))
              }] : []
            }
            ];
            return groups;
          }) : []
        };
      });

      let currencyInfo = {};
      let paymentInfo = [];
      const defaultLocale = 'en-US';
      paymentInfo = api.buildPaymentInfoMap(orderData);
      currencyInfo.currencyCultureName = get(currencyDetails, 'currencyCultureName', 'en-US');
      currencyInfo.currencyCode = get(currencyDetails, 'currencyCode', 'USD');
      currencyInfo.currencyDecimalDigits = get(currencyDetails, 'currencyDecimalDigits', 2);
      currencyInfo.currencySymbol = get(currencyDetails, 'currencySymbol', '$');
      const orderTime = moment(new Date(orderData.orderPlacedTime)).tz(storeInfo.timezone);
      const timezoneOffsetMinutes = moment.parseZone(orderTime.format()).utcOffset() * -1;
      const dateTime = orderTime.format();
      const receiptDate = moment(orderTime).locale(orderData.dateTime || defaultLocale).format('ll');
      const receiptTime = moment(orderTime).locale(defaultLocale).format('LT');
      const printDateTime = `${receiptDate} ${receiptTime}`;
      let orderMessage = api.getOrderMessage(orderData.readyTime,
        closedOrderData.order.scheduledTime, closedOrderData.order.scheduledDay, closedOrderData.order.deliveryProperties,
        storeInfo.storeName, orderTime, defaultLocale);

      let tip;
      if (tipEnabled) {
        if (closedOrderData.order.tipAmount) {
          tip = parseFloat(closedOrderData.order.tipAmount)
            .toFixed(2);
        } else if (closedOrderData.stripeSaleData) {
          tip = parseFloat(closedOrderData.stripeSaleData.closedOrder.tipAmount)
            .toFixed(2);
        }
      }

      const response = {
        orderData: {
          terminalNumber: closedOrderData.order.properties.closedTerminalId,
          storeInfo,
          // storeLogo,
          printedReceiptLogo,
          lineItems,
          tip: Number(tip) > 0 && tip,
          totalAmount: (parseFloat(get(closedOrderData, 'order.totalPaymentAmount.amount', 0)) + parseFloat(get(closedOrderData, 'order.tipAmount', 0))).toFixed(2),
          gratuity: Number(gratuity) > 0 && gratuity,
          serviceAmount: Number(serviceAmount) > 0 && serviceAmount,
          checkNumber: closedOrderData.order.orderNumber,
          receipientName: receipientName && receipientName.trim(),
          mobileNumber: mobileNumber && api.formatPhoneNumber(mobileNumber, countryInfo),
          orderMessage,
          paymentInfo,
          currencyInfo,
          dateTime,
          timezoneOffsetMinutes,
          printDateTime,
          receiptDate,
          receiptTime,
          deliveryConfirmationText: orderData.deliveryConfirmationText
        },
        templateName: 'OnDemandReceiptTemplate'
      };

      if (orderData.vatEntries) {
        response.orderData.vatEntries = orderData.vatEntries;
        response.orderData.taxIdentificationNumber = orderData.taxIdentificationNumber;
      } else {
        response.orderData.subtotalAmount = closedOrderData.order.subTotalAmount.amount;
        response.orderData.taxAmount = closedOrderData.order.subTotalTaxAmount.amount;
      }

      return response;
    } catch (err) {
      logger.error('Send Receipt failed. An error occured.', err);
    }
  },

  getPaymentAmountForReceiptInfo: (orderInfo) => {
    const { orderData } = orderInfo;
    let amount;

    let creditCardAuthAmount = get(orderInfo, 'saleTransactionData.authorizedAmount');// eslint-disable-line max-len

    if (creditCardAuthAmount) {
      amount = creditCardAuthAmount;
    } else if (orderData.payments[0]) {
      amount = parseFloat(orderData.payments[0].amount.amount) +
        parseFloat(orderData.payments[0].tipAmount.amount);
    } else {
      amount = parseFloat(get(orderData, 'totalPaymentAmount.amount', 0)) + parseFloat(orderInfo.tipAmount); // eslint-disable-line max-len
    }
    return parseFloat(amount).toFixed(2);
  },

  buildPaymentInfoMapForReceiptInfo: (orderInfo) => {
    const { orderData } = orderInfo;
    let paymentModel = orderData.paymentModel;
    let paymentInfoMap = [];

    if (paymentModel === 1) {
      let cardInfo = {};
      paymentInfoMap = orderData.payments[0];
      paymentInfoMap.amount = api.getPaymentAmountForReceiptInfo(orderInfo, paymentModel);
      if (orderInfo.saleTransactionData) {
        cardInfo.cardIssuer = orderInfo.saleTransactionData.cardInfo.cardIssuer;
        cardInfo.cardType = orderInfo.saleTransactionData.cardInfo.cardType;
        cardInfo.entryMode = 'External';
      } else if (orderInfo.stripeChargeData) {
        cardInfo.cardIssuer = orderInfo.stripeChargeData.brand;
      } else {
        cardInfo.entryMode = 'External';
      }
      paymentInfoMap.cardInfo = cardInfo;
    }

    orderData.paymentInfoList.map(data => {
      let gaTenderName;
      let tenderName;
      let transactionData;
      let account;
      let accountNumberLabelText;
      if (data.buyPaymentForm === 'GENERIC_AUTHORIZATION') {
        const gaAccount = orderInfo.gaAccountInfoList.find(account => account.accountNumber === data.accountNumber &&
          account.paymentTypeVerificationCode === data.verificationCode &&
        account.tenderId === data.tenderId);
        gaTenderName = gaAccount.gaTenderName;
        accountNumberLabelText = orderInfo.accountNumberLabelText;
      } else if (data.buyPaymentForm === 'WALLETS') {
        tenderName = data.tenderName;
        account = data.account;
      } else if (data.buyPaymentForm === 'ROOM_CHARGE' || data.buyPaymentForm === 'MEMBER_CHARGE') {
        tenderName = data.tenderName;
      } else if (data.buyPaymentForm === 'LOYALTY') {
        tenderName = data.tenderName;
      } else {
        tenderName = get(data, 'cardInfo.cardIssuer', undefined);
        account = get(data, 'cardInfo.accountNumberMasked', undefined);
        transactionData = get(data, 'transactionResponseData', undefined);
      }

      paymentInfoMap.push({
        ...data,
        gaTenderName,
        accountNumberLabelText,
        authCode: data.authCode,
        tenderName,
        account,
        transactionData
      });
    });
    return paymentInfoMap;

  },

  createSMSReceiptData: async (credentials, orderData) => {

    try {
      let lineItems = [];
      let closedOrderData = orderData.closedOrderData;
      let currencyDetails = orderData.currencyDetails;
      let tipEnabled = orderData.tipEnabled;
      const introText = get(orderData, 'smsConfig.introText', false);
      const storeInfo = orderData.storeInfo;
      const orderTime = moment(new Date(orderData.orderPlacedTime)).tz(storeInfo.timezone);
      const timezoneOffsetMinutes = moment.parseZone(orderTime.format()).utcOffset() * -1;
      const storePriceLevel = closedOrderData.storePriceLevel;
      const gratuity = get(closedOrderData, 'order.gratuityAmount.amount', 0);
      const serviceAmount = get(closedOrderData, 'order.serviceAmount.amount', 0);
      let currencyInfo = {};
      currencyInfo.currencyCultureName = get(currencyDetails, 'currencyCultureName', 'en-US');
      currencyInfo.currencyCode = get(currencyDetails, 'currencyCode', 'USD');
      currencyInfo.currencyDecimalDigits = get(currencyDetails, 'currencyDecimalDigits', 2);
      currencyInfo.currencySymbol = get(currencyDetails, 'currencySymbol', '$');
      let paymentInfo = [];
      paymentInfo = api.buildPaymentInfoMap(orderData);
      let tip;
      if (tipEnabled) {
        if (closedOrderData.order.tipAmount) {
          tip = parseFloat(closedOrderData.order.tipAmount)
            .toFixed(2);
        } else if (closedOrderData.stripeSaleData) {
          tip = parseFloat(closedOrderData.stripeSaleData.closedOrder.tipAmount)
            .toFixed(2);
        }
      }
      let smsReceiptOption = {
        'smsHeader': get(orderData, 'smsConfig.isIntroEnabled', true),
        'smsBody': get(orderData, 'smsConfig.isItemizedListEnabled', true),
        'smsFooter': get(orderData, 'smsConfig.isTotalsEnabled', true)
      };

      lineItems = closedOrderData.items.map((items) => {
        return {
          quantity: items.count,
          price: (items.priceLevels && items.priceLevels[storePriceLevel]) ? items.priceLevels[storePriceLevel].price.amount : items.price.amount,
          displayText: items.displayText,
          lineItemGroups: items.selectedModifiers ? items.selectedModifiers.map(groups => {
            groups.lineItems = [{
              displayText: groups.description,
              price: groups.baseAmount,
              lineItemGroups: groups.suboption ? [{
                lineItems: groups.suboption.map(sOption => ({
                  displayText: sOption.description,
                  price: sOption.amount
                }))
              }] : []
            }
            ];
            return groups;
          }) : []
        };
      });

      const response = {
        orderData: {
          terminalNumber: closedOrderData.order.properties.closedTerminalId,
          checkNumber: closedOrderData.order.orderNumber,
          introText: introText && introText.replace('{{N}}', storeInfo.storeName),
          timezoneOffsetMinutes,
          currencyInfo,
          orderDiscountInfo: [],
          subtotalAmount: closedOrderData.order.subTotalAmount.amount,
          taxAmount: orderData.vatEnabled ? undefined : closedOrderData.order.subTotalTaxAmount.amount,
          tip: Number(tip) > 0 && tip,
          totalAmount: (parseFloat(get(closedOrderData, 'order.totalPaymentAmount.amount', 0)) + parseFloat(get(closedOrderData, 'order.tipAmount', 0))).toFixed(2),
          onDemandGrautuity: Number(gratuity) > 0 && gratuity,
          onDemandServiceAmount: Number(serviceAmount) > 0 && serviceAmount,
          discountPostTax: false,
          storeInfo,
          smsReceiptOption,
          paymentInfo,
          isCheckDiscountEnabled: false,
          lineItems
        },
        templateName: 'SMSReceiptTemplate'
      };

      return response;
    } catch (err) {
      logger.error('Send Receipt failed. An error occured.', err);
    }
  },

  buildPaymentInfoMap: (orderData) => {
    const { closedOrderData } = orderData;
    let paymentModel = closedOrderData.order.paymentModel;
    let paymentInfoMap = [];

    if (paymentModel === 1) {
      let cardInfo = {};
      paymentInfoMap = closedOrderData.order.payments[0];
      paymentInfoMap.amount = api.getPaymentAmount(closedOrderData, paymentModel);
      if (closedOrderData.order.saleTransactionData) {
        cardInfo.cardIssuer = closedOrderData.order.saleTransactionData.cardInfo.cardIssuer;
        cardInfo.cardType = closedOrderData.order.saleTransactionData.cardInfo.cardType;
        cardInfo.entryMode = 'External';
      } else if (closedOrderData.order.stripeChargeData) {
        cardInfo.cardIssuer = closedOrderData.order.stripeChargeData.brand;
      } else {
        cardInfo.entryMode = 'External';
      }
      paymentInfoMap.cardInfo = cardInfo;
    }

    closedOrderData.order.paymentInfoList.map(data => {
      let gaTenderName;
      let tenderName;
      let transactionData;
      let account;
      let accountNumberLabelText;
      if (data.buyPaymentForm === 'GENERIC_AUTHORIZATION') {
        const gaAccount = closedOrderData.order.gaAccountInfoList.find(account => account.accountNumber === data.accountNumber &&
          account.paymentTypeVerificationCode === data.verificationCode &&
        account.tenderId === data.tenderId);
        gaTenderName = gaAccount.gaTenderName;
        accountNumberLabelText = orderData.accountNumberLabelText;
      } else if (data.buyPaymentForm === 'WALLETS') {
        tenderName = data.tenderName;
        account = data.account;
      } else if (data.buyPaymentForm === 'ROOM_CHARGE' || data.buyPaymentForm === 'MEMBER_CHARGE') {
        tenderName = data.tenderName;
      } else if (data.buyPaymentForm === 'LOYALTY') {
        tenderName = data.tenderName;
      } else {
        tenderName = get(data, 'cardInfo.cardIssuer', undefined);
        account = get(data, 'cardInfo.accountNumberMasked', undefined);
        transactionData = get(data, 'transactionResponseData', undefined);
      }

      paymentInfoMap.push({
        ...data,
        gaTenderName,
        accountNumberLabelText,
        authCode: data.authCode,
        tenderName,
        account,
        transactionData
      });
    });
    return paymentInfoMap;

  },

  getPaymentAmount: (closedOrderData) => {
    let amount;

    let creditCardAuthAmount = get(closedOrderData, 'order.saleTransactionData.authorizedAmount');// eslint-disable-line max-len

    if (creditCardAuthAmount) {
      amount = creditCardAuthAmount;
    } else if (closedOrderData.order.payments[0]) {
      amount = parseFloat(closedOrderData.order.payments[0].amount.amount) +
        parseFloat(closedOrderData.order.payments[0].tipAmount.amount);
    } else {
      amount = parseFloat(get(closedOrderData, 'order.totalPaymentAmount.amount', 0)) + parseFloat(closedOrderData.order.tipAmount); // eslint-disable-line max-len
    }
    return parseFloat(amount).toFixed(2);
  },

  getAbsoluteReadyTime: (etf, orderTime, defaultLocale) => {
    const timeWithEtf = moment(orderTime).add(etf, 'minutes').locale(defaultLocale);
    timeWithEtf.set({
      minute: Math.ceil(timeWithEtf.get('minute') / 5) * 5
    });
    return moment(timeWithEtf).locale(defaultLocale).format('LT');
  },

  getOrderMessage: (readyTime, scheduledTime, scheduledDay, deliveryProperties, storeName, orderTime, defaultLocale) => {
    const etf = get(readyTime, 'etf') ? get(readyTime, 'etf.minutes') : get(readyTime, 'minutes');
    const minTime = get(readyTime, 'minTime.minutes');
    const maxTime = get(readyTime, 'maxTime.minutes');
    const scheduleFromTime = scheduledTime;
    if (!scheduledTime) {
      const readyText = `Your order will be ${(deliveryProperties.deliveryOption.id === 'delivery')
        ? `delivered to ${deliveryProperties.deliveryLocation}`
        : `ready for ${deliveryProperties.deliveryOption.id === 'dinein' ? 'dine-in' : 'pickup'} at ${storeName}`}`;
      let minuteText = '';
      if (etf >= 0) {
        if (etf === 0) {
          minuteText = ' in less than a minute';
        } else if (etf === 1) {
          minuteText = ' in a minute';
        } else {
          minuteText = etf > 60
            ? ` at about <b>${api.getAbsoluteReadyTime(etf, orderTime, defaultLocale)}</b>`
            : ` in about <b>${etf}</b> minutes`;
        }
      } else if (minTime >= 0 && maxTime >= 0) {
        if (minTime === 0 && maxTime === 0) {
          minuteText = ' in less than a minute';
        } else if (minTime === maxTime && minTime !== 0) {
          minuteText = minTime > 60
            ? ` at about <b>${api.getAbsoluteReadyTime(minTime, orderTime, defaultLocale)}</b>`
            : minTime === 1 ? ` in a minute` : ` in about <b>${minTime}</b> minutes`;
        } else if (minTime === 0 && maxTime === 1) {
          minuteText = ' in a minute';
        } else if (minTime === 0 && maxTime > 1) {
          minuteText = maxTime > 60
            ? ` at about <b>${api.getAbsoluteReadyTime(maxTime, orderTime, defaultLocale)}</b>`
            : ` in less than <b>${maxTime}</b> minutes`;
        } else {
          minuteText = maxTime > 60
            ? `between <b>${api.getAbsoluteReadyTime(minTime, orderTime, defaultLocale)} -
             ${api.getAbsoluteReadyTime(maxTime, orderTime, defaultLocale)}</b>`
            : ` in <b>${minTime} to ${maxTime}</b> minutes`;
        }
      }
      return `${readyText}${minuteText}.`;
    } else {
      const readyText = (deliveryProperties.deliveryOption.id === 'delivery')
        ? `Your order at ${storeName} will be delivered to ${deliveryProperties.deliveryLocation} 
      <b>${scheduledDay ? 'on ' + scheduledDay : 'today'} between ${scheduleFromTime.startTime} - ${scheduleFromTime.endTime}</b>`
        : `Your order at ${storeName} will be ready for ${deliveryProperties.deliveryOption.id === 'dinein' ? 'dine-in' : 'pickup'} <b>${scheduledDay ? 'on ' + scheduledDay : 'today'} between ${scheduleFromTime.startTime} - ${scheduleFromTime.endTime}</b>`;// eslint-disable-line max-len
      return `${readyText}.`;
    }
  }
};

export const createReceiptInfoData = (orderInfo) => {

  let lineItems = [];
  try {
    let orderData = orderInfo.orderData;
    let currencyDetails = orderInfo.currencyDetails;
    let tipEnabled = orderInfo.tipEnabled;

    const receipientName = orderInfo.nameCapture && orderInfo.nameString;
    const mobileNumber = get(orderInfo, 'mobileNumber', false);
    const countryInfo = get(orderInfo, 'selectedSMSCountry');
    const storePriceLevel = orderInfo.storePriceLevel;
    const gratuity = get(orderData, 'gratuityAmount.amount', 0);
    const serviceAmount = get(orderData, 'serviceAmount.amount', 0);

    lineItems = orderInfo.items.map((items) => {
      return {
        quantity: items.count,
        price: (items.priceLevels && items.priceLevels[storePriceLevel]) ? items.priceLevels[storePriceLevel].price.amount : items.price.amount,
        displayText: items.displayText,
        splInstruction: items.splInstruction ? items.splInstruction.toUpperCase() : undefined,
        lineItemGroups: items.selectedModifiers ? items.selectedModifiers.map(groups => {
          groups.lineItems = [{
            displayText: groups.description,
            price: groups.baseAmount,
            lineItemGroups: groups.suboption ? [{
              lineItems: groups.suboption.map(sOption => ({
                displayText: sOption.description,
                price: sOption.amount
              }))
            }] : []
          }
          ];
          return groups;
        }) : []
      };
    });

    let currencyInfo = {};
    let paymentInfo = [];
    const defaultLocale = 'en-US';

    paymentInfo = api.buildPaymentInfoMapForReceiptInfo(orderInfo);

    currencyInfo.currencyCultureName = get(currencyDetails, 'currencyCultureName', 'en-US');
    currencyInfo.currencyCode = get(currencyDetails, 'currencyCode', 'USD');
    currencyInfo.currencyDecimalDigits = get(currencyDetails, 'currencyDecimalDigits', 2);
    currencyInfo.currencySymbol = get(currencyDetails, 'currencySymbol', '$');
    const orderTime = moment(new Date(orderInfo.orderPlacedTime)).tz(orderInfo.timeZone);
    const timezoneOffsetMinutes = moment.parseZone(orderTime.format()).utcOffset() * -1;
    const dateTime = orderTime.format();
    const receiptDate = moment(orderTime).locale(orderData.dateTime || defaultLocale).format('ll');
    const receiptTime = moment(orderTime).locale(defaultLocale).format('LT');
    const printDateTime = `${receiptDate} ${receiptTime}`;
    if (orderInfo.scheduledDay > 0) {
      orderInfo.scheduledDay = moment().add(orderInfo.scheduledDay, 'days').format('dddd, MMMM D');
    }
    let orderMessage = api.getOrderMessage(orderData.readyTime,
      orderInfo.scheduledTime, orderInfo.scheduledDay, orderInfo.deliveryProperties,
      orderInfo.storeName, orderTime, defaultLocale);

    let tip;
    if (tipEnabled) {
      if (orderInfo.tipAmount) {
        tip = parseFloat(orderInfo.tipAmount)
          .toFixed(2);
      }
    }

    const response = {
      orderData: {
        terminalNumber: orderInfo.terminalId,
        storeInfo: {
          businessContextId: orderData.contextId
        },
        lineItems,
        tip: Number(tip) > 0 && tip,
        totalAmount: (parseFloat(get(orderData, 'totalPaymentAmount.amount', 0)) + parseFloat(get(orderData, 'tipAmount', 0))).toFixed(2),
        gratuity: Number(gratuity) > 0 && gratuity,
        serviceAmount: Number(serviceAmount) > 0 && serviceAmount,
        checkNumber: orderInfo.checkNumber,
        receipientName: receipientName && receipientName.trim(),
        mobileNumber: mobileNumber && api.formatPhoneNumber(mobileNumber, countryInfo),
        orderMessage,
        paymentInfo,
        currencyInfo,
        dateTime,
        timezoneOffsetMinutes,
        printDateTime,
        receiptDate,
        receiptTime,
        deliveryConfirmationText: orderData.deliveryConfirmationText
      },
      templateName: 'OnDemandReceiptTemplate'
    };

    if (orderData.vatEntries) {
      response.orderData.vatEntries = orderData.vatEntries;
      response.orderData.taxIdentificationNumber = orderData.taxIdentificationNumber;
    } else {
      response.orderData.subtotalAmount = orderData.subTotalAmount.amount;
      response.orderData.taxAmount = orderData.subTotalTaxAmount.amount;
    }

    return response;
  } catch (err) {
    logger.error('Send Receipt failed. An error occured.', err);
  }
};

export default api;
