// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Agilysys from 'agilysys.lib';
import Boom from 'boom';
import { getPaymentInfoList, getStoreAvailability } from './../order/api';
import { createReceiptInfoData } from './../communication/api';

const logger = config.logger.child({ component: path.basename(__filename) });

export default {
  accountInquiry: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const inquiryPayload = {
        guestName: payload.guestName,
        accountNumber: payload.memberNumber,
        properties: payload.properties
      };
      const accountInquiry = await agilysys.memberChargeAccountInquiry(inquiryPayload, payload.contextId);
      return accountInquiry.data;
    } catch (ex) {
      logger.error('Member charge account inquiry failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },

  capturePaymentAndCloseOrder: async (credentials, payload, reply) => {
    try {
      const agilysys = new Agilysys(credentials);
      const { order: { contextId, orderId } } = payload;
      const captureMemberChargePaymentResponse = await agilysys.captureMemberChargePayment(payload);
      try {
        const memberChargeResponse = await agilysys.addPaymentToOrder(contextId, orderId, captureMemberChargePaymentResponse);
        if (!payload.scheduledOrderTime) {
          await getStoreAvailability(agilysys, payload.order.contextId, 'CLOSED_ASAP');
        }
        const orderPayment = memberChargeResponse.data;
        if (orderPayment.paymentModel && orderPayment.paymentModel === 2) {
          const paymentInfoList = getPaymentInfoList(orderPayment.payments2, null, null, null, payload.memberChargeData);
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
        const paymentInfoList = getPaymentInfoList(closeOrderResponse.data.payments2, null, null, null, payload.memberChargeData);
        const closedOrder = {
          closedOrder: {
            ...closeOrderResponse.data,
            deliveryProperties: payload.deliveryProperties,
            paymentInfoList
          }
        };
        return closedOrder;
      } catch (ex) {
        try {
          logger.error('Error in member charge', ex);
          const { contextId, orderId } = payload.order;
          await agilysys.cancelOrder(contextId, orderId);
          if (ex === 'CLOSED_ASAP') {
            logger.error('High demand - Try ordering for later!, Refund has been initiated.', orderId);
            return Boom.badRequest('REFUND_SUCCESS_AND_CLOSED_ASAP');
          }
          logger.error('refund success for order id', orderId);
          return Boom.badRequest('REFUND_SUCCESS');
        } catch (error) {
          if (ex === 'CLOSED_ASAP') {
            logger.error('High demand - Try ordering later! and refund failed. An error occured.', ex);
            return Boom.badRequest('REFUND_FAILED_AND_CLOSED_ASAP');
          }
          logger.error('refund failed. An error occured.', ex);
          return Boom.badRequest('REFUND_FAILED');
        }
      }
    } catch (ex) {
      logger.error('Capture member charge payment and close order failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message || ex);
      }
    }
  }
};
