// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Agilysys from 'agilysys.lib';
import Boom from 'boom';
import { getPaymentInfoList, getStoreAvailability } from './../order/api';
import { createReceiptInfoData } from './../communication/api';

const logger = config.logger.child({ component: path.basename(__filename) });

export default {
  accountInfo: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const accountInfoResponse = await agilysys.getGAAccountInfo(payload);
      return accountInfoResponse.data;
    } catch (ex) {
      logger.error('GA getAccountInfo failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  accountInquiry: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const gaAccountInquiryResponse = await agilysys.gaAccountInquiry(payload);
      return gaAccountInquiryResponse.data;
    } catch (ex) {
      logger.error('GA account inquiry failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  authorizeGAPaymentAndCloseOrder: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      let paymentInfoList;
      const { contextId, tenantId, order: { orderId } } = payload;
      const authorizeGAPaymentResponse = await agilysys.authorizeGAPayment(payload);
      const { remainingBalanceAfterCharge, accountLimited, chargesToDateAfterCharge } = authorizeGAPaymentResponse.data.paymentData.paymentResponse.transactionData;
      const gaAuthResponse = await agilysys.addGAPaymentToOrder(tenantId, contextId, orderId, authorizeGAPaymentResponse.data);
      if (!payload.scheduledOrderTime) {
        await getStoreAvailability(agilysys, payload.order.contextId, 'CLOSED_ASAP');
      }

      const gaPaymentResponse = gaAuthResponse.data;
      if (gaPaymentResponse.paymentModel && gaPaymentResponse.paymentModel === 2) {
        paymentInfoList = getPaymentInfoList(gaPaymentResponse.payments2);
        gaPaymentResponse.paymentInfoList = paymentInfoList;
      }
      const receiptPayload = {
        ...payload.receiptInfo,
        orderData: gaPaymentResponse
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
          remainingGAAccountBalance: accountLimited ? remainingBalanceAfterCharge : chargesToDateAfterCharge,
          paymentInfoList
        }
      };
      return closedOrder;
    } catch (ex) {
      logger.error('Authorize GA Payment and close order failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message || ex);
      }
    }
  },

  authorizeAndAddGAPaymentToOrder: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const { contextId, tenantId, orderId } = payload;
      const authorizeGAPaymentResponse = await agilysys.authorizeGAPayment(payload);
      const order = await agilysys.addGAPaymentToOrder(tenantId, contextId, orderId, authorizeGAPaymentResponse.data);
      return {
        authResponse: authorizeGAPaymentResponse.data,
        order: order.data
      };
    } catch (ex) {
      logger.error('Authorize GA Payment failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  }

};
