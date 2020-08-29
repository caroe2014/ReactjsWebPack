// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Agilysys, { paymentUtils } from 'agilysys.lib';
import Boom from 'boom';

const logger = config.logger.child({ component: path.basename(__filename) });

export default {
  accountInquiry: async (credentials, payload) => {
    const agilysys = new Agilysys(credentials);
    let inquiryResponses = await Promise.allSettled(payload.map(async (inquiryPayload) => {
      const inquiryResponse = await agilysys.atriumAccountInquiry(inquiryPayload.data, inquiryPayload.data.contextId);
      if (inquiryResponse.data) {
        return {
          tenderId: inquiryPayload.tenderId,
          ...inquiryResponse.data
        };
      } else {
        return {};
      }
    }));
    const successfulPromises = inquiryResponses.filter(p => p.status === 'fulfilled');
    if (successfulPromises.length === 0) {
      logger.error('error while fetching account enuiry');
      return Boom.badRequest('error while fetching account enuiry');
    }
    return successfulPromises.map(p => p.value);
  },
  authAtriumAutoDetectPayment: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const accountInquiry = await agilysys.authAtriumAutoDetectPayment(payload, payload.contextId);
      return accountInquiry.data;
    } catch (ex) {
      logger.error('Auth auto detect failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  captureAtriumAutoDetectPayment: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const accountInquiry = await agilysys.captureAtriumAutoDetectPayment(payload, payload.contextId);
      return accountInquiry.data;
    } catch (ex) {
      logger.error('Capture auto detect failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  authAtriumPayment: async (credentials, payload) => {
    try {
      const { amountToCharge, remainingToPaid, totalTaxAmount, isAllTaxExempt, atriumAccount } = payload;
      const agilysys = new Agilysys(credentials);
      payload.totalTaxAmount = !payload.isAllTaxExempt ? 0.0 : payload.totalTaxAmount;
      const authPayload = paymentUtils.buildAtriumAuthPayload(payload);
      let authResponse = atriumAccount.isAuthUsingTaxableTenderId && await agilysys.authAtriumPayment(authPayload, payload.contextId);
      if ((!atriumAccount.isAuthUsingTaxableTenderId) || (isAllTaxExempt && authResponse && authResponse.data.paymentData.paymentResponse.transactionData.atriumPaymentResponse.taxRemoved)) {
        const remainingAmountAfterPayment = (parseFloat(remainingToPaid) - parseFloat(amountToCharge)).toFixed(2);
        authPayload.properties.tenderId = atriumAccount.taxExemptTenderId;
        authPayload.properties.igVerificationCodeId = payload.paymentTenderInfo[atriumAccount.taxExemptTenderId].verificationCodeId;
        let completePayment = false;
        authPayload.transactionData.atriumPaymentRequest.atriumCurrency.tax = 0;
        if ((parseFloat(remainingAmountAfterPayment) <= parseFloat(totalTaxAmount))) {
          completePayment = true;
          authPayload.transactionData.atriumPaymentRequest.atriumCurrency.tax = 0;
          authPayload.transactionData.atriumPaymentRequest.atriumCurrency.total = (parseFloat(remainingToPaid) - parseFloat(totalTaxAmount)).toFixed(2);
        }
        authResponse = await agilysys.authAtriumPayment(authPayload, payload.contextId);
        return {
          isAllTaxExempt: true,
          completePayment,
          data: authResponse.data
        };
      } else {
        if (parseFloat(totalTaxAmount) > parseFloat(amountToCharge)) {
          authPayload.transactionData.atriumPaymentRequest.atriumCurrency.tax = amountToCharge;
          authPayload.transactionData.atriumPaymentRequest.atriumCurrency.total = amountToCharge;
          authResponse = await agilysys.authAtriumPayment(authPayload, payload.contextId);
        }
        return {
          isAllTaxExempt: false,
          data: authResponse.data
        };
      }
    } catch (ex) {
      logger.error('Auth atrium payment failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  captureAtriumPayment: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const accountInquiry = await agilysys.captureAtriumPayment(payload, payload.contextId);
      return accountInquiry.data;
    } catch (ex) {
      logger.error('Capture atrium payment failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  }
};
