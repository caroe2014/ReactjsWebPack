// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import config from 'app.config';
import path from 'path';
import Agilysys, { throttlingUtils, paymentUtils } from 'agilysys.lib';
import { createReceiptInfoData } from './../communication/api';
import Boom from 'boom';
import get from 'lodash.get';
import userProfileApi from '../userProfile/api';
import { LESS_AMOUNT } from 'web/client/app/utils/constants';
const logger = config.logger.child({ component: path.basename(__filename) });

const throttlingStrategy = {
  ALLOW: 'ALLOW',
  SUGGEST_AND_ALLOW: 'SUGGEST_AND_ALLOW',
  SUGGEST_AND_REJECT: 'SUGGEST_AND_REJECT',
  REJECT: 'REJECT'
};

const maxIteration = 3;

/* istanbul ignore file */
export default {
  createOrder: async (credentials, businessContext, items = []) => {
    try {
      const agilysys = new Agilysys(credentials);
      const order = await agilysys.createOrder(businessContext, items);
      if (order && order.orderDetails.orderId) {
        return order;
      } else {
        return Boom.resourceGone(`Unable to create an order at this time`);
      }
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  addItemToOrder: async (credentials, businessContext, orderId, orderDetails) => {
    try {
      const agilysys = new Agilysys(credentials);
      const order = await agilysys.addItemToOrder(businessContext, orderId, orderDetails.item, orderDetails.currencyDetails,
        orderDetails.schedule, orderDetails.scheduleTime, orderDetails.storePriceLevel, orderDetails.scheduledDay);
      if (order && order.orderDetails.orderId) {
        return order;
      } else {
        return Boom.resourceGone(`Unable to add item to your order at this time`);
      }
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  deleteItemFromOrder: async (credentials, businessContext, orderId, itemId) => {
    try {
      const agilysys = new Agilysys(credentials);
      const order = await agilysys.deleteItemFromOrder(businessContext, orderId, itemId);
      if (order) {
        return order;
      } else {
        return Boom.resourceGone(`Unable to delete item from your order at this time`);
      }
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  getWaitTimeForItems: async (credentials, businessContext, itemOrderInfo) => {
    try {
      const agilysys = new Agilysys(credentials);
      const waitTime = await agilysys.getWaitTimeForItems(businessContext, itemOrderInfo);
      if (waitTime) {
        return waitTime;
      } else {
        return Boom.resourceGone(`Unable to get wait time at this time`);
      }
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  createClosedOrder: async (credentials, values) => {
    const agilysys = new Agilysys(credentials);
    try {
      let saleData;
      let closedOrderInfo;
      let paymentInfoList;
      try {
        if (values.tokenizedData.uniqueId) {
          const profileData = await getUserProfileData(credentials, values);
          decoratePaymentInfoInTransactionPayload(values, profileData);
        }
        values.profitCenterDetails = await agilysys.getProfitCenter(values.order.contextId, values.profitCenterId);
        saleData = await agilysys.makeTransaction(values);
      } catch (ex) {
        logger.error('Sale transaction failed. An error occured.', ex);
        if (ex.statusCode === 'OND_TOKEN_FAILED' || ex.statusCode === 'OND_FETCH_CARD_FAILED') {
          return Boom.badRequest(ex.statusCode);
        } else {
          if (ex.response && ex.response.status) {
            return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
          } else {
            return Boom.badRequest(ex.message);
          }
        }
      }
      const paymentObj = {
        authorizedAmount: saleData.paymentData.transactionResponseData.authorizedAmount,
        subtotal: saleData.paymentData.transactionResponseData.subTotalAmount,
        transactionId: saleData.paymentData.transactionReferenceData.transactionId,
        tipAmount: saleData.paymentData.transactionResponseData.tipAmount
      };
      try {
        const orderPayment = await agilysys.postPayment({ ...paymentObj, ...values, saleData });
        if (orderPayment.paymentModel && orderPayment.paymentModel === 2) {
          paymentInfoList = getPaymentInfoList(orderPayment.payments2);
          orderPayment.paymentInfoList = paymentInfoList;
        }
        const receiptPayload = {
          ...values.receiptInfo,
          orderData: orderPayment
        };
        const receiptInfo = createReceiptInfoData(receiptPayload);
        values.receiptJson = {
          receiptJson: receiptInfo
        };
        if (!values.scheduledOrderTime) {
          await getStoreAvailability(agilysys, values.order.contextId, 'CLOSED_ASAP');
        }
        const closedOrder = await agilysys.closeOrder(values, orderPayment);
        if (closedOrder && closedOrder.data) {
          closedOrderInfo = closedOrder.data;
          if (closedOrderInfo.paymentModel && closedOrderInfo.paymentModel === 2) {
            paymentInfoList = getPaymentInfoList(closedOrderInfo.payments2);
            delete closedOrderInfo.payments2[0].paymentData;
          }
        }
        return {
          closedOrder: {
            ...closedOrderInfo,
            deliveryProperties: values.deliveryProperties,
            paymentInfoList
          }
        };
      } catch (error) {
        logger.error('create closed order failed. An error occured.', error);
        throw new Error(error === 'CLOSED_ASAP' ? 'CLOSED_ASAP' : 'CREATE_CLOSE_ORDER_FAIL'); // eslint-disable-line max-len
      }
    } catch (ex) {
      logger.error('create closed order failed. An error occured.', ex);
      if (ex.message === 'CLOSED_ASAP' || ex.message === 'CREATE_CLOSE_ORDER_FAIL') {
        try {
          const { contextId, orderId } = values.order;
          await agilysys.cancelOrder(contextId, orderId);
          if (ex.message === 'CLOSED_ASAP') {
            logger.error('High demand - Try ordering for later!, Refund has been initiated.', orderId);
            return Boom.badRequest('REFUND_SUCCESS_AND_CLOSED_ASAP');
          }
          logger.error('refund success for order id', orderId);
          return Boom.badRequest('REFUND_SUCCESS');
        } catch (error) {
          if (ex.message === 'CLOSED_ASAP') {
            logger.error('High demand - Try ordering later! and refund failed. An error occured.', ex);
            return Boom.badRequest('REFUND_FAILED_AND_CLOSED_ASAP');
          }
          logger.error('refund failed. An error occured.', ex);
          return Boom.badRequest('REFUND_FAILED');
        }
      }
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  createClosedOrderWallets: async (credentials, values) => {
    const agilysys = new Agilysys(credentials);
    let result;
    try {
      try {
        values.profitCenterDetails = await agilysys.getProfitCenter(values.order.contextId, values.profitCenterId);
        result = await agilysys.makeStripeTransaction(values);
      } catch (ex) {
        logger.error('stripe transaction failed. An error occured.', ex);
        return Boom.badRequest('STRIPE_TRANSACTION_FAILED');
      }
      if (result.status === 'succeeded') {
        try {
          let paymentInfoList;
          const orderPayment = await agilysys.postPayment({ ...values, result });
          if (!values.scheduledOrderTime) {
            await getStoreAvailability(agilysys, values.order.contextId, 'CLOSED_ASAP');
          }
          if (orderPayment.paymentModel && orderPayment.paymentModel === 2) {
            paymentInfoList = getPaymentInfoList(orderPayment.payments2, result, values.chargeData);
            orderPayment.paymentInfoList = paymentInfoList;
          }
          const receiptPayload = {
            ...values.receiptInfo,
            orderData: orderPayment
          };
          const receiptInfo = createReceiptInfoData(receiptPayload);
          values.receiptJson = {
            receiptJson: receiptInfo
          };
          const closedOrder = await agilysys.closeOrder(values, orderPayment);
          paymentInfoList = getPaymentInfoList(closedOrder.data.payments2, result, values.chargeData);
          return {
            closedOrder: {
              ...closedOrder.data,
              deliveryProperties: values.deliveryProperties,
              paymentInfoList
            }
          };
        } catch (ex) {
          logger.error('create closed order failed. An error occured.', ex);
          // eslint-disable-next-line no-throw-literal
          throw (ex === 'CLOSED_ASAP' ? 'CLOSED_ASAP' : 'CREATE_CLOSE_ORDER_FAIL');
        }
      }
    } catch (ex) {
      if (ex === 'CLOSED_ASAP' || ex === 'CREATE_CLOSE_ORDER_FAIL') {
        const refundData = {
          businessContextId: values.siteId,
          transactionId: result.id,
          profileId: values.profileId
        };
        const refundResponse = await agilysys.makeStripeRefund(refundData)
          .then(response => {
            return response;
          })
          .catch(err => {
            logger.error('stripe refund failed. An error occured.', err);
            const refundError = {
              status: 'failed'
            };
            return refundError;
          });
        if (refundResponse.status === 'succeeded') {
          if (ex === 'CLOSED_ASAP') {
            logger.info('High demand - Try ordering later! and stripe refund success.');
            return Boom.badRequest('REFUND_SUCCESS_AND_CLOSED_ASAP');
          }
          logger.info('stripe refund success.');
          return Boom.badRequest('STRIPE_REFUND_SUCCESS');
        } else {
          if (ex === 'CLOSED_ASAP') {
            logger.error('High demand - Try ordering later! and stripe refund failed. An error occured.', ex);
            return Boom.badRequest('REFUND_FAILED_AND_CLOSED_ASAP');
          }
          logger.error('stripe refund failed. An error occured.', ex);
          return Boom.badRequest('STRIPE_REFUND_FAILED');
        }
      } else {
        logger.error('stripe transaction failed. An error occured.', ex);
        return Boom.badRequest('STRIPE_TRANSACTION_FAILED');
      }
    }
  },
  capacityCheck: async (credentials, reply, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const throttlingConfig = await agilysys.getThrottlingConfiguration(payload.contextId);
      const storeStrategy = get(throttlingConfig, 'scheduledOrderCapacity.experience.strategy');
      const throttlingEnabled = get(throttlingConfig, 'scheduledOrderCapacity.enabled', false);
      if (!throttlingEnabled || storeStrategy === throttlingStrategy.ALLOW) {
        return { isToSuggest: false, strategy: storeStrategy };
      } else {
        const timeSlotList = throttlingUtils.getThrottlingTimeSlots(payload.storeConfig, payload.scheduleTime, payload.daysToAdd);
        if (timeSlotList.length === 0) {
          return { isToSuggest: true, strategy: storeStrategy };
        } else {
          let index = 0;
          let capacityCheck;
          const storeTimeZone = payload.storeConfig.storeTimeZone;
          const capacityPayload = {
            orderId: payload.orderId,
            scheduledOrderCompletionTimeStamp: throttlingUtils.getUtcDateTimeFromTimeString(payload.scheduleTime.split('-')[1], storeTimeZone, payload.daysToAdd)
          };
          while (index < maxIteration && index < timeSlotList.length) {
            const {startTime, endTime} = timeSlotList[index];
            const beginning = throttlingUtils.getUtcDateTimeFromTimeString(startTime, storeTimeZone, payload.daysToAdd);
            const end = throttlingUtils.getUtcDateTimeFromTimeString(endTime, storeTimeZone, payload.daysToAdd);
            capacityPayload.forecastPeriod = { beginning, end };

            capacityCheck = await agilysys.orderThrottlingCapacityCheck(payload.contextId, capacityPayload);
            if (storeStrategy === throttlingStrategy.REJECT && capacityCheck.atCapacity) {
              return { isToSuggest: true, strategy: storeStrategy };
            } else if (!capacityCheck.atCapacity) {
              return { isToSuggest: false, strategy: storeStrategy };
            } else if (capacityCheck.atCapacity && capacityCheck.forecast && capacityCheck.forecast.capacityWindows.length > 0) {
              const capacityWindows = capacityCheck.forecast.capacityWindows;
              if (index === 0) {
                const scheduledOrderCompletionTime = throttlingUtils.getScheduleTimeFromCapacityWindow(payload.scheduleTime, capacityWindows, storeTimeZone, payload.daysToAdd);
                if (scheduledOrderCompletionTime) {
                  return { isToSuggest: false, strategy: storeStrategy, scheduledOrderCompletionTime };
                }
              }
              return {
                isToSuggest: true,
                strategy: storeStrategy,
                scheduleSlotList: throttlingUtils.getSlotListFromCapacityRange(capacityWindows, storeTimeZone, payload.storeConfig.intervalTime)
              };
            }
            index++;
          }
          return { isToSuggest: true, strategy: storeStrategy };
        }
      }
    } catch (ex) {
      logger.error('capacity check failed. An error occured.', ex);
      if (ex.response && ex.response.status) {
        if (ex.response.status === 404) {
          return reply.response({}).code(200);
        }
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  createMultiPaymentClosedOrder: async (credentials, payload) => {
    const agilysys = new Agilysys(credentials);
    let ccSaleData;
    let walletSaleData;
    try {
      let postPaymentResponse;
      let remainingTipAmount = parseFloat(payload.tipAmount);
      if (payload.roomChargeData) {
        try {
          postPaymentResponse = await agilysys.captureRoomChargePayment(payload);
        } catch (ex) {
          logger.error('Capture room charge payment and close order failed. An error occured.', ex);
          return Boom.badRequest('ROOM_CHARGE_TRANSACTION_FAILED');
        }
      } else if (payload.memberChargeData) {
        try {
          postPaymentResponse = await agilysys.captureMemberChargePayment(payload);
        } catch (ex) {
          logger.error('Capture member charge payment and close order failed. An error occured.', ex);
          return Boom.badRequest('MEMBER_CHARGE_TRANSACTION_FAILED');
        }
      } else if (payload.tokenizedData) {
        try {
          if (payload.tokenizedData.uniqueId) {
            const profileData = await getUserProfileData(credentials, payload);
            decoratePaymentInfoInTransactionPayload(payload, profileData);
          }
          payload.profitCenterDetails = await agilysys.getProfitCenter(payload.order.contextId, payload.profitCenterId);
          const splitPayload = getSplitTransactionPayload(payload, remainingTipAmount);
          payload.splitTrasanctionData = splitPayload.splitTrasanctionData;
          remainingTipAmount = splitPayload.remainingTipAmount;
        } catch (ex) {
          logger.error('Sale transaction failed. An error occured.', ex);
          if (ex.statusCode === 'OND_TOKEN_FAILED' || ex.statusCode === 'OND_FETCH_CARD_FAILED') {
            return Boom.badRequest(ex.statusCode);
          } else {
            return Boom.badRequest('SPLIT_TRANSACTION_FAILED');
          }
        }
        try {
          ccSaleData = await agilysys.makeTransaction(payload);
          const paymentObj = {
            authorizedAmount: ccSaleData.paymentData.transactionResponseData.authorizedAmount,
            subtotal: ccSaleData.paymentData.transactionResponseData.subTotalAmount,
            transactionId: ccSaleData.paymentData.transactionReferenceData.transactionId,
            tipAmount: ccSaleData.paymentData.transactionResponseData.tipAmount
          };
          if (payload.processPaymentAsExternalPayment) {
            postPaymentResponse = paymentUtils.buildExternalPaymentType({...paymentObj, ...payload, saleData: ccSaleData});
          } else {
            postPaymentResponse = paymentUtils.buildBuyCreditCardPayment({...paymentObj, ...payload, saleData: ccSaleData});
          }
        } catch (error) {
          logger.info(`cc sale transaction failed ${error.message}`);
          return Boom.badRequest(`CC_SALE_TRANSACTION_FAILED`);
        }
      }
      if (payload.chargeData) {
        try {
          if (!payload.profitCenterDetails) {
            payload.profitCenterDetails = await agilysys.getProfitCenter(payload.order.contextId, payload.profitCenterId);
          }
          walletSaleData = await agilysys.makeStripeTransaction(payload);
          if (walletSaleData.status === 'succeeded') {
            const { amount, tipAmount } = calculatePayableAmountWithTip(payload.chargeData.amount, remainingTipAmount);
            postPaymentResponse = paymentUtils.buildExternalPaymentType({...payload, subtotal: amount, tipAmount, walletSaleData});
          }
        } catch (ex) {
          logger.error('stripe transaction failed. An error occured.', ex);
          return Boom.badRequest(`STRIPE_TRANSACTION_FAILED${ex.code === LESS_AMOUNT ? '#' + ex.message : ''}`);
        }
      }
      try {
        let orderPayment;
        let paymentInfoList;
        if (payload.atriumPaymentAccounts && payload.atriumPaymentAccounts.length > 0) {
          const paymentData = await getUpdatedAtriumPayments(agilysys, payload.order.contextId, payload.atriumPaymentAccounts, postPaymentResponse || payload.isGaPaymentAvailable);
          postPaymentResponse && paymentData.push(postPaymentResponse);
          orderPayment = await agilysys.postSplitBuyPayment(payload.order.contextId, payload.order.orderId, paymentData);
        } else if (postPaymentResponse) {
          orderPayment = await agilysys.postSplitBuyPayment(payload.order.contextId, payload.order.orderId, postPaymentResponse);
        } else {
          orderPayment = await agilysys.getOrderDetails(payload.order.contextId, payload.order.orderId);
        }
        if (!payload.scheduledOrderTime) {
          await getStoreAvailability(agilysys, payload.order.contextId, 'CLOSED_ASAP');
        }
        if (orderPayment.paymentModel && orderPayment.paymentModel === 2) {
          paymentInfoList = getPaymentInfoList(orderPayment.payments2, walletSaleData, payload.chargeData, payload.roomChargeData, payload.memberChargeData, payload.atriumPaymentAccounts);
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

        const closedOrder = await agilysys.closeOrder(payload);
        let closedOrderInfo;
        if (closedOrder && closedOrder.data) {
          closedOrderInfo = closedOrder.data;
          paymentInfoList = getPaymentInfoList(closedOrderInfo.payments2, walletSaleData, payload.chargeData, payload.roomChargeData, payload.memberChargeData, payload.atriumPaymentAccounts);
          delete closedOrderInfo.payments2;
        }
        return {
          closedOrder: {
            ...closedOrderInfo,
            paymentInfoList,
            deliveryProperties: payload.deliveryProperties
          }
        };
      } catch (error) {
        // eslint-disable-next-line no-throw-literal
        console.log(error);
        throw (payload.tokenizedData || payload.roomChargeData || payload.memberChargeData || payload.loyaltyPayment ||
          (payload.atriumPaymentAccounts && payload.atriumPaymentAccounts.length > 0) ? (error === 'CLOSED_ASAP' ? 'CLOSED_ASAP' : 'CREATE_CLOSE_ORDER_FAIL') : payload.chargeData ? (error === 'CLOSED_ASAP' ? 'STRIPE_ASAP' : 'CREATE_STRIPE_CLOSE_ORDER_FAIL') : error); // eslint-disable-line max-len
      }

    } catch (ex) {
      if (ex === 'CREATE_CLOSE_ORDER_FAIL' || ex === 'CLOSED_ASAP') {
        const { contextId, orderId, orderNumber } = payload.order;
        try {
          await agilysys.cancelOrder(contextId, orderId);
          if (ex === 'CLOSED_ASAP') {
            logger.error('High demand - Try ordering for later!, Refund has been initiated.', orderId, contextId, orderNumber);
            return Boom.badRequest('REFUND_SUCCESS_AND_CLOSED_ASAP');
          }
          logger.error('refund success for order id', ex, orderId, contextId, orderNumber);
          return Boom.badRequest('REFUND_SUCCESS');
        } catch (error) {
          if (ex === 'CLOSED_ASAP') {
            logger.error('High demand - Try ordering later! and refund failed. An error occured.', ex, orderId, contextId, orderNumber);
            return Boom.badRequest('REFUND_FAILED_AND_CLOSED_ASAP');
          }
          logger.error('refund failed. An error occured.', ex, orderId, contextId, orderNumber);
          return Boom.badRequest('REFUND_FAILED');
        }
      } else if (ex === 'CREATE_STRIPE_CLOSE_ORDER_FAIL' || ex === 'STRIPE_ASAP') {
        const refundData = {
          businessContextId: payload.contextId,
          transactionId: walletSaleData.id,
          profileId: payload.profileId,
          orderId: payload.orderId,
          orderNumber: payload.orderNumber
        };
        await agilysys.cancelOrder(payload.contextId, payload.orderId);
        const refundResponse = await agilysys.makeStripeRefund(refundData)
          .then(response => {
            return response;
          })
          .catch(err => {
            logger.error('refund failed. An error occured.', ex, err, refundData.orderId, refundData.orderNumber);
            const refundError = {
              status: 'failed'
            };
            return refundError;
          });
        if (refundResponse.status === 'succeeded') {
          if (ex === 'STRIPE_ASAP') {
            logger.info('High demand - Try ordering later! and refund success.', ex, refundData.orderId, refundData.orderNumber);
            return Boom.badRequest('REFUND_SUCCESS_AND_CLOSED_ASAP');
          }
          logger.info('refund success.', ex, refundData.orderId, refundData.orderNumber);
          return Boom.badRequest('REFUND_SUCCESS');
        } else {
          if (ex === 'STRIPE_ASAP') {
            logger.error('High demand - Try ordering later! and refund failed. An error occured.', ex, refundData.orderId, refundData.orderNumber);
            return Boom.badRequest('REFUND_FAILED_AND_CLOSED_ASAP');
          }
          logger.error('refund failed. An error occured.', ex, refundData.orderId, refundData.orderNumber);
          return Boom.badRequest('STRIPE_REFUND_FAILED');
        }
      } else if (ex === 'CLOSED_ASAP') {
        logger.error('High demand - Try ordering later!', ex);
        return Boom.badRequest('CLOSED_ASAP');
      } else {
        logger.error('split transaction failed. An error occured.', ex);
        return Boom.badRequest('SPLIT_TRANSACTION_FAILED');
      }
    }
  },
  deletePaymentsFromOrder: async (credentials, businessContext, orderId, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const order = await agilysys.deletePaymentsFromOrder(businessContext, orderId, payload);
      if (order) {
        return {order: order.data};
      } else {
        return Boom.resourceGone(`Unable to delete item from your order at this time`);
      }
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  getPaymentTenderInfo: async (credentials, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const paymentTypesList = await agilysys.paymentTypes(payload.contextId);
      const paymentTendersObj = {};
      paymentTypesList.forEach((paymentType) => {
        const tenderId = payload.tenderList.find((tenderId) => tenderId === paymentType.tenderId);
        if (tenderId) {
          paymentTendersObj[paymentType.tenderId] = {
            verificationCodeId: paymentType.verificationCodeId
          };
        }
      });
      return paymentTendersObj;
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  }
};

export const decoratePaymentInfoInTransactionPayload = (payload, profileData) => {
  payload.tokenizedData.token = profileData.token;
  payload.tokenizedData.paymentDetails.cardHolderName = profileData.cardHolderName || '';
  payload.tokenizedData.paymentDetails.expirationYearMonth = profileData.expiry || '';
  payload.tokenizedData.paymentDetails.cardIssuer = profileData.cardIssuer || '';
};

export const getStoreAvailability = async (agilysys, contextId, error) => {
  try {
    const storeAvailableNow = await agilysys.storeAvailabilityCheck(contextId);
    if (!storeAvailableNow) {
      throw error;
    }
  } catch (ex) {
    logger.error('Error occured while checking store availability.', ex);
    throw ex;
  }
  return error;
};

export const getPaymentInfoList = (paymentList, walletSaleData, chargeData, roomChargeData, memberChargeData, atriumAccounts) => {
  let paymentTransactionMap = [];
  paymentList.map(data => {
    const paymentProviderId = get(data, 'paymentData.paymentRequest.paymentProviderId', '');
    if (paymentProviderId === 'IG_GENERIC_AUTHORIZATION') {
      const accountNumber = get(data, 'paymentData.paymentRequest.transactionData.accountNumber', '');
      const transactionData = get(data, 'paymentData.paymentResponse.transactionData', {});
      const gaTenderBalance = transactionData.accountLimited ? transactionData.remainingBalanceAfterCharge : transactionData.chargesToDateAfterCharge;
      paymentTransactionMap.push({
        accountNumberLast4: accountNumber.slice(-4),
        gaTenderBalance,
        buyPaymentForm: 'GENERIC_AUTHORIZATION',
        accountNumber: get(data, 'paymentData.paymentRequest.transactionData.accountNumber', ''), // eslint-disable-line max-len
        verificationCode: get(data, 'paymentData.paymentRequest.transactionData.verificationCode', ''),
        tenderId: get(data, 'paymentData.paymentResponse.properties.tenderId', ''),
        showAuthorizationInfoOnReceipt: false,
        amount: transactionData.amount
      });
    } else if (paymentProviderId === 'RGUESTPAY_CREDIT_CARD') {
      const transactionResponseData = get(data, 'paymentData.paymentRequest.transactionData.rguestPayAgentTransactionServiceResponse.transactionResponseData', {});
      paymentTransactionMap.push(getCCPaymentTransactionData(transactionResponseData, data));
    } else if (paymentProviderId === 'EXTERNAL') {
      const cardInfo = get(data, 'paymentData.paymentRequest.transactionData.rguestPayAgentTransactionServiceResponse.cardInfo');
      const transactionAmount = get(data, 'paymentData.paymentRequest.transactionData.amount.amount', '0');
      const tipAmount = get(data, 'paymentData.paymentRequest.transactionData.tipAmount.amount', '0');
      if (chargeData && parseFloat(chargeData.amount) === (parseFloat(transactionAmount) + parseFloat(tipAmount)) && !cardInfo) {
        paymentTransactionMap.push({
          buyPaymentForm: 'WALLETS',
          tenderName: walletSaleData.source.brand,
          account: walletSaleData.source.last4,
          showAuthorizationInfoOnReceipt: true,
          amount: chargeData.amount
        });
      } else {
        const transactionResponseData = get(data, 'paymentData.paymentRequest.transactionData.rguestPayAgentTransactionServiceResponse.transactionResponseData', {});
        paymentTransactionMap.push(getCCPaymentTransactionData(transactionResponseData, data));
      }
    } else if (paymentProviderId === 'ROOM_CHARGE') {
      if (memberChargeData) {
        paymentTransactionMap.push({
          buyPaymentForm: 'MEMBER_CHARGE',
          memberInfo: memberChargeData.tenderName,
          showAuthorizationInfoOnReceipt: false,
          amount: (parseFloat(memberChargeData.paymentAmount.amount) + parseFloat(memberChargeData.paymentAmount.tipAmount)).toFixed(2)
        });
      } else if (roomChargeData) {
        paymentTransactionMap.push({
          buyPaymentForm: 'ROOM_CHARGE',
          tenderName: roomChargeData.tenderName,
          roomInfo: `${roomChargeData.roomNumber}`,
          showAuthorizationInfoOnReceipt: false,
          amount: (parseFloat(roomChargeData.paymentAmount.amount) + parseFloat(roomChargeData.paymentAmount.tipAmount)).toFixed(2)
        });
      }
    } else if (paymentProviderId === 'ATRIUM') {
      const tenderId = get(data, 'paymentData.paymentRequest.transactionData.atriumPaymentRequest.tenderId', '');
      const atriumAccount = atriumAccounts.find(account => account.atriumTenderId === tenderId);
      if (atriumAccount) {
        const atriumTransactionData = {
          buyPaymentForm: 'ATRIUM',
          showAuthorizationInfoOnReceipt: false,
          atriumLabel: atriumAccount.displayName,
          accountNumber: atriumAccount.accountNumberDisplay
        };
        if (atriumAccount.limitOnAccount) {
          atriumTransactionData.valueCharged = atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.applied;
          atriumTransactionData.valueCurrentBalance = atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.remaining;
        } else {
          atriumTransactionData.amountCharged = atriumAccount.authResponse.paymentData.paymentResponse.paymentSupport.amount.amount;
          atriumTransactionData.currentBalance = atriumAccount.authResponse.paymentData.paymentResponse.transactionData.atriumPaymentResponse.amount.remaining;
        }
        paymentTransactionMap.push(atriumTransactionData);
      }
    }
  });
  let loyaltyList = paymentList.filter(list => list.paymentData.paymentRequest && list.paymentData.paymentRequest.paymentProviderId === 'LOYALTY');
  let loyaltyAccounts = [];
  loyaltyList.map(data => {
    const account = get(data, 'paymentData.paymentRequest.transactionData.loyaltyPaymentRequest.accountIdentifierValue', '');
    !loyaltyAccounts.includes(account) && loyaltyAccounts.push(account);
  });

  loyaltyAccounts.forEach(accountNumber => {
    let loyaltyVoucherList = [];
    loyaltyList.map(data => {
      const account = get(data, 'paymentData.paymentRequest.transactionData.loyaltyPaymentRequest.accountIdentifierValue', '');
      if (accountNumber === account) {
        const redeemType = get(data, 'paymentData.paymentRequest.transactionData.loyaltyPaymentRequest.redeemType', '');
        const amount = parseFloat(get(data, 'paymentData.paymentRequest.transactionData.loyaltyPaymentRequest.amount.amount', 0));
        const tipAmount = parseFloat(get(data, 'paymentData.paymentRequest.transactionData.loyaltyPaymentRequest.tipAmount.amount', 0));
        const totalAmount = (amount + tipAmount).toFixed(2);
        if (redeemType === 'VOUCHER') {
          const isHostComp = get(data, 'paymentData.paymentRequest.properties.isHostComp', false);
          if (isHostComp) {
            paymentTransactionMap.push({
              buyPaymentForm: 'LOYALTY',
              tenderName: get(data, 'paymentData.paymentRequest.properties.displayLabel', 'Host Comp'),
              amount: totalAmount,
              accountNumber: get(data, 'paymentData.paymentRequest.transactionData.loyaltyPaymentRequest.loyaltyVoucherAccountIdentifierData.voucherId', '')
            });
          } else {
            loyaltyVoucherList.push({
              label: get(data, 'paymentData.paymentRequest.properties.tenderName', false),
              amount: totalAmount
            });
          }
        } else if (redeemType === 'POINTS') {
          const pointsType = get(data, 'paymentData.paymentResponse.transactionData.loyaltyPaymentResponse.pointSummary.pointsType', 'POINTS');
          const pointSummaries = get(data, 'paymentData.paymentResponse.transactionData.loyaltyPaymentResponse.availablePointsSummaries', []);
          const pointsObject = pointSummaries.find(points => points.instrumentType === pointsType);
          paymentTransactionMap.push({
            buyPaymentForm: 'LOYALTY',
            accountNumber: `XXXX${accountNumber.slice(-4)}`,
            tenderName: get(data, 'paymentData.paymentRequest.properties.displayLabel', 'Points'),
            pointsUsed: totalAmount,
            currentBalance: (pointsObject && pointsObject.currencyAmount) || undefined
          });
        }
      }
    });
    loyaltyVoucherList.length > 0 && paymentTransactionMap.push({
      buyPaymentForm: 'LOYALTY',
      tenderName: 'Player Card',
      accountNumber: `XXXX${accountNumber.slice(-4)}`,
      loyaltyVoucherList: loyaltyVoucherList
    });
  });

  return paymentTransactionMap;
};

const getCCPaymentTransactionData = (transactionResponseData, data) => {
  return {
    buyPaymentForm: 'CREDIT_CARD',
    authorizedAmount: transactionResponseData.authorizedAmount,
    subtotal: transactionResponseData.subTotalAmount,
    tipAmount: transactionResponseData.tipAmount,
    transactionResponseData,
    transactionId: get(data, 'paymentData.paymentRequest.transactionData.rguestPayAgentTransactionServiceResponse.transactionReferenceData.transactionId', ''),
    cardInfo: get(data, 'paymentData.paymentRequest.transactionData.rguestPayAgentTransactionServiceResponse.cardInfo', {}),
    authCode: get(data, 'paymentData.paymentRequest.transactionData.rguestPayAgentTransactionServiceResponse.gatewayResponseData.authCode', ''),
    showAuthorizationInfoOnReceipt: true
  };
};

const getSplitTransactionPayload = (values, actualTipAmount) => {
  const { amount, tipAmount, remainingTip } = calculatePayableAmountWithTip(values.tokenizedData.paymentDetails.multiPaymentAmount, actualTipAmount);
  const splitTrasanctionData = {
    transactionDate: values.tokenizedData.paymentDetails.billDate,
    transactionAmount: amount,
    taxAmount: '0',
    tipAmount,
    allowPartialTransactionAmount: false
  };
  return {splitTrasanctionData, remainingTipAmount: remainingTip};
};

const calculatePayableAmountWithTip = (amountAgainstPayment, payableRemainingTip) => {
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

const getUserProfileData = async (credentials, values) => {
  const cardRequestpayload = {
    ond_token: values.tokenizedData.ond_token,
    uniqueId: values.tokenizedData.uniqueId
  };
  const cardInfoResponse = await userProfileApi.getCardInfoByUniqueId(credentials, cardRequestpayload);
  return cardInfoResponse.cardInfo[0];
};

const getUpdatedAtriumPayments = async (agilysys, contextId, atriumAccounts, isTaxable) => {
  const atriumPayment = [];
  const isNonTaxableTenders = atriumAccounts.every(account => account.isAllTaxExempt);
  await Promise.all(atriumAccounts.map(async account => {
    if ((isTaxable || !isNonTaxableTenders) && account.isAllTaxExempt) {
      const authRequestPayload = account.authResponse.paymentData.paymentRequest;
      authRequestPayload.properties.tenderId = account.taxableTenderId;
      authRequestPayload.properties.igVerificationCodeId = account.taxableVerficationCode;
      const authResponse = await agilysys.authAtriumPayment(authRequestPayload, contextId);
      atriumPayment.push(authResponse.data);
    } else {
      atriumPayment.push(account.authResponse);
    }
  }));
  return atriumPayment;
};
