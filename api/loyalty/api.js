/* eslint-disable max-len */
// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
import config from 'app.config';
import path from 'path';
import Agilysys from 'agilysys.lib';
import Boom from 'boom';
import { getPaymentInfoList } from './../order/api';
import { createReceiptInfoData } from './../communication/api';

const logger = config.logger.child({ component: path.basename(__filename) });

export default {
  getAccountInquiryCallbackId: async (credentials, values) => {
    try {
      const agilysys = new Agilysys(credentials);
      const atob = require('atob');
      values.pin = atob(values.pin);
      const accountInquiry = await agilysys.getLoyaltyAccountInquiryCallbackId(values);
      return accountInquiry.data;
    } catch (ex) {
      logger.error('Loyalty account inquiry failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  getAccountInquiryByCallbackId: async (credentials, reply, contextId, callbackId) => {
    try {
      const agilysys = new Agilysys(credentials);
      const accountRequest = await agilysys.getLoyaltyAccountInquiryByCallbackId(contextId, callbackId);
      if (accountRequest.status === 202) {
        return reply.response(accountRequest.data).code(202);
      }
      return accountRequest.data;
    } catch (ex) {
      logger.error('Loyalty account info failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  capturePaymentAndAddToOrder: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const { contextId, orderId, redeemType } = payload;

      const atob = require('atob');
      payload.pin = atob(payload.pin);

      if (redeemType === 'POINTS' || !payload.voucherPaymentInfoArray) {
        payload.properties.isHostComp = payload.isHostComp;
        payload.properties.displayLabel = payload.displayLabel;
        const loyaltyCaptureResponse = await agilysys.captureLoyaltyPayment(payload);
        const addPaymentToOrderResponse = await agilysys.addLoyaltyPaymentToOrder(contextId, orderId, loyaltyCaptureResponse);
        return {
          loyaltyCaptureResponse,
          orderData: addPaymentToOrderResponse.data
        };
      } else if (redeemType === 'VOUCHER') {
        let loyaltyVoucherCapturePromises = [];
        const payloadProperties = Object.assign({}, payload.properties);
        payload.voucherPaymentInfoArray.forEach(voucherToProcess => {
          const voucherCapturePaymentPayload = {
            amount: {
              currencyUnit: voucherToProcess.currencyUnit,
              amount: voucherToProcess.amount
            },
            tipAmount: {
              currencyUnit: voucherToProcess.currencyUnit,
              amount: voucherToProcess.tipAmount
            },
            loyaltyVoucherAccountIdentifierData: { ...voucherToProcess },
            ...payload
          };
          voucherCapturePaymentPayload.properties = Object.assign({}, payloadProperties);
          voucherCapturePaymentPayload.properties.tenderId = voucherToProcess.tenderId;
          voucherCapturePaymentPayload.properties.tenderName = voucherToProcess.tenderName;
          voucherCapturePaymentPayload.properties.isHostComp = voucherToProcess.isHostComp;
          loyaltyVoucherCapturePromises.push(agilysys.captureLoyaltyPayment(voucherCapturePaymentPayload));
        });

        const loyaltyCaptureResponse = await Promise.all(loyaltyVoucherCapturePromises);
        const orderData = await agilysys.addPaymentToOrder(contextId, orderId, loyaltyCaptureResponse);
        return {
          loyaltyCaptureResponse,
          orderData
        };
      }
    } catch (ex) {
      logger.error('Capture loyalty payment failed', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  capturePaymentAndCloseOrder: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const { contextId, order } = payload;
      let paymentInfoList;
      let loyaltyPaymentResponse;
      const { redeemType, orderId, voucherPaymentInfoArray } = payload.loyaltyPaymentPayload;
      let loyaltyCaptureResponse;
      const atob = require('atob');
      payload.loyaltyPaymentPayload.pin = atob(payload.loyaltyPaymentPayload.pin);
      if (redeemType === 'VOUCHER' && voucherPaymentInfoArray) {
        let loyaltyVoucherCapturePromises = [];
        const payloadProperties = Object.assign({}, payload.loyaltyPaymentPayload.properties);
        voucherPaymentInfoArray.forEach(voucherToProcess => {
          const voucherCapturePaymentPayload = {
            amount: {
              currencyUnit: voucherToProcess.currencyUnit,
              amount: voucherToProcess.amount
            },
            tipAmount: {
              currencyUnit: voucherToProcess.currencyUnit,
              amount: voucherToProcess.tipAmount
            },
            loyaltyVoucherAccountIdentifierData: { ...voucherToProcess },
            ...payload.loyaltyPaymentPayload
          };
          voucherCapturePaymentPayload.properties = Object.assign({}, payloadProperties);
          voucherCapturePaymentPayload.properties.tenderId = voucherToProcess.tenderId;
          voucherCapturePaymentPayload.properties.tenderName = voucherToProcess.tenderName;
          voucherCapturePaymentPayload.properties.isHostComp = voucherToProcess.isHostComp;
          loyaltyVoucherCapturePromises.push(agilysys.captureLoyaltyPayment(voucherCapturePaymentPayload));
        });

        loyaltyCaptureResponse = await Promise.all(loyaltyVoucherCapturePromises);

        loyaltyPaymentResponse = await agilysys.addPaymentToOrder(contextId, orderId, loyaltyCaptureResponse);
      } else {
        loyaltyCaptureResponse = await agilysys.captureLoyaltyPayment(payload.loyaltyPaymentPayload);
        loyaltyPaymentResponse = await agilysys.addLoyaltyPaymentToOrder(contextId, order.orderId, loyaltyCaptureResponse);
      }
      delete payload.loyaltyPaymentPayload;
      const orderPayment = loyaltyPaymentResponse.data;
      if (orderPayment.paymentModel && orderPayment.paymentModel === 2) {
        paymentInfoList = getPaymentInfoList(orderPayment.payments2);
        orderPayment.paymentInfoList = paymentInfoList;
      }
      const receiptPayload = {
        ...payload.receiptInfo,
        orderData: orderPayment
      };
      const receiptInfo = createReceiptInfoData(receiptPayload);
      payload.receiptJson = {
        receiptJson: receiptInfo
      };
      const closeOrderResponse = await agilysys.closeOrder(payload);

      paymentInfoList = getPaymentInfoList(closeOrderResponse.data.payments2);

      const closedOrder = {
        closedOrder: {
          ...closeOrderResponse.data,
          deliveryProperties: payload.deliveryProperties,
          paymentInfoList
        }
      };
      return closedOrder;

    } catch (ex) {
      logger.error('Capture loyalty payment failed', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  pointsAccrual: async (credentials, reply, siteId, orderId, values) => {
    try {
      const agilysys = new Agilysys(credentials);
      const pointAccrualData = await agilysys.pointsAccrual(siteId, orderId, values);
      return reply.response(pointAccrualData.data).code(pointAccrualData.status);
    } catch (ex) {
      logger.error('Loyalty account inquiry failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  getLoyaltyTendersFromPaymentTypeList: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const paymentTypesList = await agilysys.paymentTypes(payload.businessContext);

      const loyaltyTendersObj = {};
      paymentTypesList.forEach((paymentType) => {
        if (paymentType.paymentForm.includes('LOYALTY')) {
          loyaltyTendersObj[paymentType.tenderId] = {
            verificationCodeId: paymentType.verificationCodeId,
            autoRemoveTax: paymentType.autoRemoveTax
          };
        }
      });
      return loyaltyTendersObj;
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response.status });
    }
  },
  voidLoyaltyPayment: async (credentials, paymentsToRemove) => {
    try {
      const agilysys = new Agilysys(credentials);
      let voidAndDeletePaymentPromises = [];

      paymentsToRemove.forEach(payment => {
        voidAndDeletePaymentPromises.push(agilysys.voidAndDeleteLoyaltyPaymentFromOrder(payment));
      });

      const voidAndDeletePaymentResponse = await Promise.all(voidAndDeletePaymentPromises);
      const order = voidAndDeletePaymentResponse[paymentsToRemove.length - 1];

      if (order) {
        return {
          order: order.data
        };
      } else {
        return Boom.resourceGone('Unable to void your payment');
      }
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  }
};
