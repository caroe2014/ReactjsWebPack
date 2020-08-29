// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */

import path from 'path';
import axios from 'axios';
import Joi from 'joi';
import config from 'app.config';
import Boom from 'boom';
import * as toCartUtils from './utils/toCart';
import * as toOrderUtils from './utils/toOrder';
import * as paymentUtils from './utils/payment';
import { scheduleUtils } from 'agilysys.lib';
import { loyaltyAccountPaymentResponseByCapture } from '../__mocks__/loyalty';
import get from 'lodash.get';
import { delay } from '../api/util';
const util = require('util');

const { OAuth2Client } = require('google-auth-library');

const CALL_DELAY = 5000;

// import { markRequest, markResponse } from './../utils/performance-utils';

const logger = config.logger.child({ component: path.basename(__filename) });

const optsValidator = Joi.object().keys({
  tenantId: Joi.number().required(),
  tenantConfig: Joi.object().required(),
  sessionToken: Joi.string()
});

const paymentGateway = {
  freedompay: 'freedompay',
  elavon: 'elavon',
  threec: '3C'
};

const gaProviderId = 'IG_GENERIC_AUTHORIZATION';

/*
  This is a node lib. Useful for our APIs, but not so much for the web client.
  If we split off the login method, it might be possible to use the rest of this lib on the client,
  but that'll be an exercise for later.

  Additionally, making this a true 3rd party library would mean decoupling from the app.config.
*/

export default class Agilysys {
  constructor (opts) {
    const checkValid = Joi.validate(opts, optsValidator);
    this.tenantId = undefined;
    this.opts = undefined;
    this.tenantConfig = undefined;

    this.paymentUtils = paymentUtils;

    this.axiosInstance = axios.create();

    if (checkValid.error === null) {
      // valid
      this.opts = opts;
      this.tenantId = this.opts.tenantId;
      this.tenantConfig = this.opts.tenantConfig;
      this.login = this.login.bind(this);

      // decorate the request to the posApi
      this.requestInterceptor = this.axios.interceptors.request.use((request) => {
        // markRequest(`API - ${request.url}`);
        if (this.opts.sessionToken) {
          if (process.env.isAzure) {
            request.headers['X-Gateway-Key'] = `${this.opts.sessionToken}`;
          } else {
            request.headers['authorization'] = `${this.opts.sessionToken}`;
          }
          request.headers['TENANT_ID'] = this.tenant;
        } else {
          logger.error('MISSING CREDENTIALS');
        }
        return request;
      });
      // Log api response errors.
      this.responseInterceptor = this.axios.interceptors.response.use((request) => {
        // markResponse(`API - ${request.config.url}`);
        logger.info(`${request.config.method.toUpperCase()} ${request.config.url} => ${request.status}`);
        return request;
      }, async (request) => {
        // markResponse(`API - ${request.config.url}`);
        logger.error(`${request.config.method.toUpperCase()} ${request.config.url} => ${request.response && request.response.status}`);
        return Promise.reject(request);
      });
    } else {
      // invalid
      throw new Error(checkValid.error.message);
    }
  }
  get tenant () {
    return this.tenantId;
  }
  get axios () {
    return this.axiosInstance;
  }
  getTenantConfig () {
    return this.tenantConfig;
  }
  getConfiguredStores () {
    return this.tenantConfig.storeList;
  }
  getConfiguredStore (businessContext) {
    return this.tenantConfig.storeList.find(store => store.businessContextId === businessContext);
  }
  async login () {
    if (process.env.isAzure) {
      return {
        gatewayToken: this.tenantConfig.grantClientJWT
      };
    } else {
      logger.debug('LOGGING INTO POS API');
      const loginResponse = await this.axios.post(`${config.webPaths.posApi}/grant/client`, null, {
        headers: {
          authorization: `Bearer ${this.tenantConfig.grantClientJWT}`
        }
      });
      return {
        accessToken: loginResponse.headers['access-token'],
        refreshToken: loginResponse.headers['refresh-token']
      };
    }
  }
  async getStores () {
    try {
      const storeList = await Promise.all(this.getConfiguredStores().map(async (store) => {
        const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/businessContexts/${store.businessContextId}`);
        return response.data;
      }));
      return storeList.filter(store => store.depth >= 2);
    } catch (ex) {
      logger.error(ex);
      return Boom.badData(ex.message);
    }
  }
  async sendEmailReceipt (formData, businessContext) {
    try {
      const response = await this.axios({
        method: 'post',
        url: `${config.webPaths.posApi}/communication-service/deliver/tenants/${this.opts.tenantId}/context/${businessContext}`,
        data: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        return response.data;
      })
        .catch(err => {
          logger.error('Send Receipt failed. An error occured.', err);
          throw err;
        });
      return response;
    } catch (ex) {
      return Boom.badData(ex.message);
    }
  }
  async sendSMSReceipt (jsonData, businessContext) {
    try {
      const response = await this.axios({
        method: 'post',
        url: `${config.webPaths.posApi}/communication-service/deliver/tenants/${this.opts.tenantId}/context/${businessContext}`,
        data: jsonData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        return response.data;
      })
        .catch(err => {
          logger.error('Send Receipt failed. An error occured.', err);
          throw err;
        });
      return response;
    } catch (ex) {
      return Boom.badData(ex.message);
    }
  }

  async paymentTypes (businessContext) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/core/tenants/${this.opts.tenantId}/context/${businessContext}/v2/payment-types`);
    return response.data;
  }

  async getStoreInfo (businessContext) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/businessContexts/${businessContext}/storeInfo`);
    return response.data;
  }
  async getDetails (businessContext, profileId) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/businessContexts/${businessContext}/kioskConfigurations/byDisplayProfileId/${profileId}`);
    return response.data[0];
  }

  async getOrderDetails (businessContextId, orderId) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders/${orderId}`);
    return response.data;
  }

  async getStoresWithDetails (storeList) {
    const stores = [];
    await Promise.all(storeList.map(async (store) => {
      const storeAvailabeNow = await this.storeAvailabilityCheck(store.businessContextId);
      let displayProfileId = this.getConfiguredStore(store.businessContextId).displayProfileId;
      let displayProfileDetails = await Promise.all(displayProfileId.map(async (profileId) => {
        const details = await this.getDetails(store.businessContextId, profileId);
        return details;
      }));
      displayProfileDetails.map(data => {
        delete data.name;
        delete data.id;
        data.schedule.tenantId = this.opts.tenantId.toString();
        const profitCenterId = data.displayProfile.displayProfileOptions['profit-center-id'];
        stores.push({ ...store, ...data, profitCenterId, storeAvailabeNow });
      });
    }));
    return stores;
  }

  async getItems (businessContext, itemIds) {
    let items = await this.axios.post(`${config.webPaths.posApi}/api/buy/core/tenants/${this.tenantId}/context/${businessContext}/kiosk-items/get-items`, itemIds);
    return items.data.content.filter(i => i !== undefined).filter(i => i.isAvailableToGuests);
  }

  async getItemDetails (businessContext, itemId) {
    let item = await this.axios.get(`${config.webPaths.posApi}/api/buy/core/tenants/${this.tenantId}/context/${businessContext}/kiosk-items/${itemId}`);
    return item.data;
  }

  async getProfile (businessContext, profileId) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/businessContexts/${businessContext}/displayProfiles/${profileId}`);
    return response.data;
  }

  async getConcept (businessContext, conceptId) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/businessContexts/${businessContext}/concepts/${conceptId}`);
    return response.data;
  }

  async getMenus (businessContext, conceptId) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/businessContexts/${businessContext}/concepts`);
    const concept = response.data.find(concept => concept.id === conceptId);
    const menus = concept ? concept.menus : [];
    return menus;
  }
  async getSchedule (businessContext, profileId) {
    const details = await this.getDetails(businessContext, profileId);
    details.schedule.tenantId = this.opts.tenantId.toString();
    delete details.schedule.name;
    delete details.schedule.id;
    return details.schedule;
  }

  async getEmployeeId (businessContext) {
    const response = await this.axios.get(`${config.webPaths.posApi}/api/buy/core/tenants/${this.opts.tenantId}/context/${businessContext}/employees`);
    return response.data[0].employeeId;
  }

  async getMealPeriodId (businessContext, schedule, scheduleTime, scheduledDay) {
    try {
      const timezone = this.getConfiguredStore(businessContext).storeInfo.timezone;
      const lastSchdeuledTask = scheduleUtils.getLastScheduledTask(schedule, timezone, scheduleTime, scheduledDay);
      const mealPeriodIndex = get(lastSchdeuledTask, ['properties', 'meal-period-id']);
      const allMealPeriodsResponse = await this.axios.get(`${config.webPaths.posApi}/api/buy/core/tenants/${this.opts.tenantId}/context/${businessContext}/meal-periods`);
      const currentMealPeriod = allMealPeriodsResponse.data.find(mealPeriod => mealPeriod.mealPeriodId === mealPeriodIndex);
      return currentMealPeriod.mealPeriodId;
    } catch (ex) {
      logger.error('Unable to get meal periods. Please try again.', ex);
      throw ex;
    }
  }

  async makeTransaction (values) {
    try {
      const paymentData = await this.postPaymentToPaymentGateWay(values);
      return {
        paymentData: paymentData.data,
        payAgentRequest: paymentData.payAgentRequest,
        tokenizedData: values.tokenizedData
      };
    } catch (ex) {
      logger.error('Sale transaction failed. An error occured.', ex);
      throw ex;
    }
  }

  /* istanbul ignore next */
  async makeStripeTransaction (values) {
    try {
      const displayProfile = await this.getDetails(values.chargeData.businessContextId, values.chargeData.profileId);
      let secretKey;
      const paymentConfigs = get(displayProfile, 'displayProfile.featureConfigurations.sitePayments.paymentConfigs');
      if (paymentConfigs) {
        secretKey = paymentConfigs.filter(option => option.type === 'stripe')[0].config.secretKey;
      }
      var stripe = require('stripe')(secretKey);
      stripe.setTimeout(10000);
      const promiseMessage = (resolve, reject) => {
        stripe.charges.create({
          amount: Math.round(Number(values.chargeData.amount) * 100),
          currency: values.chargeData.currency,
          description: values.chargeData.label,
          source: values.chargeData.token,
          statement_descriptor: `Order${values.order.orderNumber}`
        }).then((charge) => {
          return resolve(charge);
          // New charge created on a new customer
        }).catch((err) => {
          logger.error('Stripe charge failed. An error occured.', err);
          return reject(err);
        });
      };
      const message = new Promise(promiseMessage);
      return message;
    } catch (ex) {
      logger.error('stripe transaction failed. An error occured.', ex);
      throw ex;
    }
  }

  /* istanbul ignore next */
  async makeStripeRefund (values) {
    try {
      const displayProfile = await this.getDetails(values.businessContextId, values.profileId);
      let secretKey;
      const paymentConfigs = get(displayProfile, 'displayProfile.featureConfigurations.sitePayments.paymentConfigs');
      if (paymentConfigs) {
        secretKey = paymentConfigs.filter(option => option.type === 'stripe')[0].config.secretKey;
      }
      var stripe = require('stripe')(secretKey);
      stripe.setTimeout(10000);
      const promiseMessage = (resolve, reject) => {
        stripe.refunds.create({
          charge: values.transactionId
        }).then((charge) => {
          return resolve(charge);
          // New charge created on a new customer
        }).catch((err) => {
          logger.error('Stripe refund failed. An error occured.', err);
          return reject(err);
        });
      };
      const message = new Promise(promiseMessage);
      return message;
    } catch (ex) {
      logger.error('stripe refund failed. An error occured.', ex);
      throw ex;
    }
  }

  async createOrder (businessContextId, order) {
    try {
      const mealPeriodId = await this.getMealPeriodId(businessContextId, order.schedule, order.scheduleTime, order.scheduledDay);
      const transformedItems = toOrderUtils.transformCartItemToOrderItem(order.item, mealPeriodId, order.currencyDetails, order.storePriceLevel);
      const newOrder = toOrderUtils.buildNewOrder(transformedItems, order.currencyDetails, order.orderTimeZone, order.useIgOrderApi,
        order.onDemandTerminalId, order.properties, mealPeriodId);
      const response = await this.axios.post(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders`, newOrder);
      const hydratedItem = toCartUtils.hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder(order.item, response.data);

      return {
        orderDetails: response.data,
        addedItem: hydratedItem,
        mealPeriodId
      };
    } catch (ex) {
      logger.error('Unable to create Order. Please try again.', ex);
      throw ex;
    }
  }

  async addItemToOrder (businessContextId, orderId, item, currencyDetails, schedule, scheduleTime, storePriceLevel, scheduledDay) {
    try {
      const mealPeriodId = item.mealPeriodId ? item.mealPeriodId : await this.getMealPeriodId(businessContextId, schedule, scheduleTime, scheduledDay);
      const transformedItem = toOrderUtils.transformCartItemToOrderItem(item, mealPeriodId, currencyDetails, storePriceLevel);
      const response = await this.axios.post(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders/${orderId}/line-items`, transformedItem);
      const hydratedItem = toCartUtils.hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder(item, response.data);

      return {
        orderDetails: response.data,
        addedItem: hydratedItem
      };
    } catch (ex) {
      logger.error('Unable to add item to order. Please try again.', ex);
      throw ex;
    }
  }

  async deleteItemFromOrder (businessContextId, orderId, itemId) {
    try {
      const response = await this.axios.delete(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders/${orderId}/line-items/${itemId}`);

      return {
        orderDetails: response.data,
        deletedItem: itemId
      };
    } catch (ex) {
      logger.error('Unable to delete item from order. Please try again.', ex.response.data);
      throw ex;
    }
  }
  async postExternalPayment (paymentData) {
    try {
      const newPayment = this.paymentUtils.buildExternalPaymentType(paymentData);
      return await this.addPaymentToOrder(paymentData.order.contextId, paymentData.order.orderId, newPayment);
    } catch (err) {
      logger.error('Your payment failed to process. Please try again.', err);
    }
  }
  async postPayment (paymentInfo) {
    if (paymentInfo.processPaymentAsExternalPayment) { // To be removed OND-294
      return this.postExternalPayment(paymentInfo);
    } else {
      return this.postBuyPayment(paymentInfo);
    }
  }
  async postBuyPayment (paymentInfo) {
    try {
      const newPayment = this.paymentUtils.buildBuyCreditCardPayment(paymentInfo);
      const { contextId, orderId } = paymentInfo.order;
      return await this.addPaymentToOrder(contextId, orderId, newPayment);
    } catch (err) {
      logger.error('Your payment failed to process. Please try again.', err);
    }
  }
  async postSplitBuyPayment (contextId, orderId, paymentInfo) {
    try {
      return await this.addPaymentToOrder(contextId, orderId, paymentInfo);
    } catch (err) {
      logger.error('Your payment failed to process. Please try again.', err);
    }
  }
  async addPaymentToOrder (contextId, orderId, paymentInfo) {
    const headers = {
      'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'
    };
    logger.info(`paymentInfo: ${JSON.stringify(paymentInfo)}`);
    let { data } = await this.axios.put(
      `${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${contextId}/orders/${orderId}/payments`,
      paymentInfo,
      { headers }
    );
    return data;
  }

  async deletePaymentsFromOrder (businessContextId, orderId, payload) {
    try {
      return await this.axios.delete(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders/${orderId}/payments`, { data: payload });
    } catch (err) {
      logger.error('get user saved card failed.', err);
      throw err;
    }
  }

  async closeOrder (values) {
    try {
      const properties = toOrderUtils.getOrderProperties(values);
      const payload = {
        scheduledOrderCompletionTimeStamp: values.order.scheduledOrderCompletionTimeStamp,
        capacitySuggestionPerformed: values.capacitySuggestionPerformed,
        properties,
        receiptData: values.receiptJson
      };

      logger.info(`closeOrder payload: ${JSON.stringify(payload)}`);

      return await this.axios.put(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${values.order.contextId}/orders/${values.order.orderId}/close`,
        payload);
    } catch (err) {
      logger.error('Your order failed to close. Please try again.', err);
      throw err;
    }
  }

  async cancelOrder (businessContextId, orderId) {
    try {
      return await this.axios.put(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders/${orderId}/cancel`, { orderState: 'CANCEL' });
    } catch (err) {
      logger.error('cancel order request failed.', err);
      throw err;
    }
  }

  async getLoyaltyAccountInquiryCallbackId (inquiryInfo) {
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${inquiryInfo.contextId}/accounts/inquiry/loyalty/tier/get-callback-id`, inquiryInfo);
    } catch (err) {
      logger.error('Account inquiry call back request failed.', err);
      throw err;
    }
  }

  async getLoyaltyAccountInquiryByCallbackId (contextId, inquiryId) {
    try {
      return await this.axios.get(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/accounts/inquiry/loyalty/tier/${inquiryId}`);
    } catch (err) {
      logger.error('Account information fetch request failed.', err);
      throw err;
    }
  }

  async postLoyaltyPaymentAnddGetCallbackId (contextId, loyaltyPaymentPayload) {
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/payments/asyncronized/capture/get-callback-id`, loyaltyPaymentPayload);
    } catch (err) {
      logger.error('postLoyaltyPaymentAnddGetCallbackId failed', err);
    }
  }

  async getLoyaltyPaymentResponseByCallbackId (contextId, callbackId) {
    try {
      return await this.axios.get(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/payments/asyncronized/capture/${callbackId}`);
    } catch (err) {
      logger.error('getLoyaltyPaymentResponseByCallbackId', err);
    }
  }

  async pointsAccrual (contextId, orderId, accrualObject) {
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${contextId}/order/${orderId}/loyalty/accrue`, accrualObject);
    } catch (err) {
      logger.error('Point accrual fetch request failed.', err);
      throw err;
    }
  }

  async getGAAccountInfo (payload) {
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/ig/tenants/${this.opts.tenantId}/context/${payload.contextId}/accounts/ga-with-tenders`, payload);
    } catch (err) {
      logger.error('Get GA Account Info request failed.', err);
      throw err;
    }
  }

  async gaAccountInquiry (payload) {
    try {
      payload.accountInquiryProviderId = gaProviderId;
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${payload.contextId}/accounts/inquiry/ga`, payload);
    } catch (err) {
      logger.error('GA Account Inquiry request failed.', err);
      throw err;
    }
  }

  async authorizeGAPayment (payload) {
    const { tenantId, contextId, subtotal, tipAmount, verificationCode, accountNumber, profitCenterId, currencyUnit, tenderId, gaPostingAccountNumber, gaAccountName } = payload;

    const formattedPayload = {
      tenantId,
      contextId,
      paymentAction: {
        type: 'AUTHORIZE'
      },
      paymentProviderId: gaProviderId,
      transactionData: {
        amount: {
          currencyUnit,
          amount: subtotal
        },
        tipAmount: {
          currencyUnit,
          amount: tipAmount
        },
        profitCenterId,
        verificationCode,
        accountNumber
      },
      properties: {
        tenderId,
        gaAccountName,
        gaPostingAccountNumber
      }
    };
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${payload.contextId}/payments/authorize`, formattedPayload);
    } catch (err) {
      logger.error('GA Account Authorization request failed.', err);
      throw err;
    }
  }

  async addGAPaymentToOrder (tenantId, contextId, orderId, authorizeGAPaymentResponse) {
    let headers = {
      'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'
    };

    try {
      return await this.axios.put(`${config.webPaths.posApi}/api/buy/order/tenants/${tenantId}/context/${contextId}/orders/${orderId}/payments`, authorizeGAPaymentResponse, { headers });
    } catch (err) {
      logger.error('Adding GA Payment to order failed.', err);
      throw err;
    }
  }

  async roomChargeAccountInquiry (payload, contextId) {
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/accounts/inquiry/room-charge-by-name-and-room-number`, payload);
    } catch (err) {
      logger.error('Room charge account inquiry request failed.', err);
      throw err;
    }
  }

  async memberChargeAccountInquiry (payload, contextId) {
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/accounts/inquiry/room-charge-by-name-and-account-number`, payload);
    } catch (err) {
      logger.error('Room charge account inquiry request failed.', err);
      throw err;
    }
  }

  async captureRoomChargePayment (payload) {
    const formattedPayload = paymentUtils.buildRoomChargeCapturePayload(payload);

    try {
      const roomChargePaymentResponse = await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${payload.order.contextId}/payments/capture`, formattedPayload);
      return roomChargePaymentResponse.data;
    } catch (err) {
      logger.error('Room charge capture request failed.', err);
      throw err;
    }
  }

  async captureMemberChargePayment (payload) {
    const formattedPayload = paymentUtils.buildMemberChargeCapturePayload(payload);

    try {
      const memberChargePaymentResponse = await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${payload.order.contextId}/payments/capture`, formattedPayload);
      return memberChargePaymentResponse.data;
    } catch (err) {
      logger.error('Member charge capture request failed.', err);
      throw err;
    }
  }

  async postPaymentToPaymentGateWay (values) {
    try {
      const { paymentProcessorProperties: payProperties } = values.profitCenterDetails;
      let formattedPayConfiguration = [];

      for (let key in payProperties.configuration) {
        if ((payProperties.gatewayId === paymentGateway.elavon || payProperties.gatewayId === paymentGateway.threec) &&
          (key === 'elavon.laneid' || key === 'registerID')) {
          formattedPayConfiguration.push({
            'key': key,
            'value': values.terminalId
          });
        } else {
          formattedPayConfiguration.push({
            'key': key,
            'value': payProperties.configuration[key]
          });
        }
      }

      let payAgentRequest = {
        gatewayId: payProperties.gatewayId || paymentGateway.freedompay,
        industryType: payProperties.industryType || 'retail',
        configuration: formattedPayConfiguration,
        invoiceData: {
          invoiceId: values.tokenizedData.paymentDetails.invoiceId,
          invoiceDate: values.tokenizedData.paymentDetails.billDate
        }
      };

      if (values.splitTrasanctionData) {
        payAgentRequest.transactionData = Object.assign({}, values.splitTrasanctionData);
      } else {
        payAgentRequest.transactionData = {
          transactionDate: values.tokenizedData.paymentDetails.billDate,
          transactionAmount: values.tokenizedData.paymentDetails.transactionAmount,
          taxAmount: values.tokenizedData.paymentDetails.taxAmount,
          tipAmount: values.tokenizedData.paymentDetails.tipAmount,
          allowPartialTransactionAmount: true
        };
      }

      if (payProperties.gatewayId === paymentGateway.threec) {
        payAgentRequest.transactionData.registerID = values.terminalId;
        if (values.splitTrasanctionData) {
          payAgentRequest.transactionData.transactionAmount = (parseFloat(values.splitTrasanctionData.transactionAmount) +
            parseFloat(values.splitTrasanctionData.tipAmount ? values.splitTrasanctionData.tipAmount : '0')).toFixed(2);
        } else {
          payAgentRequest.transactionData.transactionAmount = (parseFloat(values.tokenizedData.paymentDetails.transactionAmount) +
            parseFloat(values.tokenizedData.paymentDetails.tipAmount ? values.tokenizedData.paymentDetails.tipAmount : '0')).toFixed(2);
        }
        delete payAgentRequest.transactionData.tipAmount;
      }

      let response = await this.axios({
        method: 'post',
        url: `${config.webPaths.posApi}/v1.5/transaction/sale/token/${values.tokenizedData.token}`,
        data: payAgentRequest
      });

      logger.info(`PAY RESPONSE: ${util.inspect(response)}`);

      if (payProperties.gatewayId === paymentGateway.threec) {
        let threeCResponse = response.data;
        if (values.splitTrasanctionData) {
          threeCResponse.transactionResponseData.tipAmount = values.splitTrasanctionData.tipAmount ? (parseFloat(values.splitTrasanctionData.tipAmount)).toFixed(2) : '0.00';
          threeCResponse.transactionResponseData.subTotalAmount = (parseFloat(values.splitTrasanctionData.transactionAmount)).toFixed(2);
        } else {
          threeCResponse.transactionResponseData.tipAmount = values.tokenizedData.paymentDetails.tipAmount ? (parseFloat(values.tokenizedData.paymentDetails.tipAmount)).toFixed(2) : '0.00';
          threeCResponse.transactionResponseData.subTotalAmount = (parseFloat(values.tokenizedData.paymentDetails.transactionAmount)).toFixed(2);
        }
        return {
          data: threeCResponse,
          payAgentRequest
        };
      }

      return {
        data: response.data,
        payAgentRequest
      };

    } catch (err) {
      logger.error('Could not post payment to payment gateway. Please try again.', err);
      throw err;
    }
  }

  async getReceipt (receiptInfo) {
    try {
      return await this.axios.post(`${config.webPaths.receiptApi}/api/buy/receipt/receiptTemplate`, receiptInfo);
    } catch (err) {
      logger.error('Get Receipt image failed. An error occured.', err);
      throw err;
    }
  }

  async getSMSReceipt (receiptInfo) {
    try {
      return await this.axios.post(`${config.webPaths.receiptApi}/api/buy/receipt/smsTemplate`, receiptInfo);
    } catch (err) {
      logger.error('Get SMS Receipt failed. An error occured.', err);
      throw err;
    }
  }

  async getWaitTimeForItems (businessContextId, cartObj) {
    try {
      const lineItems = cartObj.cartItems.map(item => {
        if (item.kitchenVideoId) {
          return {
            itemId: item.id,
            quantity: item.count,
            kitchenVideoId: item.kitchenVideoId,
            item: {
              displayName: item.kitchenDisplayText,
              prepTime: item.kitchenCookTimeSeconds || 0
            }
          };
        }
      }).filter(item => item !== undefined);

      const notificationData = {
        varianceEnabled: cartObj.varianceEnabled,
        variancePercentage: cartObj.variancePercentage
      };

      const waitTimeRequest = {
        tenantId: this.opts.tenantId,
        contextId: businessContextId,
        lineItems: lineItems,
        notificationData,
        orderOrigin: 'CLOUD'
      };

      const waitTimePath = cartObj.varianceEnabled ? 'ordersWaitTimeWithVariance' : 'ordersWaitTime';
      const response = await this.axios.post(`${config.webPaths.posApi}/api/buy/display/metrics/tenants/${this.opts.tenantId}/context/${businessContextId}/${waitTimePath}`, waitTimeRequest);
      return response.data;

    } catch (err) {
      logger.error('Get wait times failed. An error occured.', err);
      throw err;
    }
  }

  async getProfitCenter (businessContextId, profitCenterId) {
    try {
      const profitCenter = await this.axios.get(`${config.webPaths.posApi}/api/buy/core/tenants/${this.opts.tenantId}/context/${businessContextId}/profit-centers/profitCenterId/${profitCenterId}`);
      return profitCenter.data;
    } catch (ex) {
      logger.error('Unable to get Profit Center. Please try again.', ex);
      throw ex;
    }
  }

  async getProfitCenterId (businessContextId) {
    try {
      const profitCenter = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/context-mapping/context/${businessContextId}`);
      return profitCenter.data;
    } catch (ex) {
      logger.error('Unable to get Profit Center Id. Please try again.', ex);
      throw ex;
    }
  }

  async getThrottlingConfiguration (businessContextId) {
    try {
      const throttlingConfig = await this.axios.get(`${config.webPaths.posApi}/api/buy/core/tenants/${this.opts.tenantId}/context/${businessContextId}/order/throttling/configuration`);
      return throttlingConfig.data;
    } catch (ex) {
      logger.error('Unable to get throttling configuration. Please try again.', ex);
      throw ex;
    }
  }

  async orderThrottlingCapacityCheck (businessContextId, payload) {
    try {
      const throttlingConfig = await this.axios.post(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders/capacity-check`, payload);
      return throttlingConfig.data;
    } catch (ex) {
      logger.error('Unable to check the throttling capacity. Please try again.', ex);
      throw ex;
    }
  }

  async storeAvailabilityCheck (businessContextId) {
    try {
      const throttlingAvailable = await this.axios.get(`${config.webPaths.posApi}/api/buy/display/storeAvailable/tenants/${this.opts.tenantId}/context/${businessContextId}`);
      return throttlingAvailable.data;
    } catch (ex) {
      logger.error('Unable to check the store availability. Please try again.', ex);
      throw ex;
    }
  }

  async generateFBLongLiveToken (payload, clientId) {
    try {
      const paramsObj = {
        grant_type: 'fb_exchange_token',
        client_id: payload.app_id,
        client_secret: clientId,
        fb_exchange_token: payload.token
      };
      const longLiveToken = await this.axios.get('https://graph.facebook.com/v5.0/oauth/access_token', { params: paramsObj });
      return longLiveToken.data;
    } catch (ex) {
      logger.error('Generate FB LongLive Token failed.', ex);
      throw ex;
    }
  }

  async validateFBToken (token) {
    try {
      const paramsObj = {
        access_token: token
      };
      const accessTokenConfig = await this.axios.get('https://graph.facebook.com/me', { params: paramsObj });
      return accessTokenConfig.data;
    } catch (ex) {
      logger.error('Validate FB token failed.', ex);
      throw ex.response.data.error;
    }
  }

  async validateGoogleToken (token, appId) {
    const client = new OAuth2Client(appId);
    async function verify () {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: appId
      });
      const payload = ticket.getPayload();
      return { name: payload.name, id: payload.sub };
    }
    const payloadObj = await verify().catch((error) => {
      return error;
    });
    return payloadObj;
  }

  async validateAtriumToken (token, appId) {
    return { name: 'Test', id: '1234' };
  }

  async fetchGuestProfile (guestProfileId) {
    try {
      const guestProfile = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/guestUserProfiles/${guestProfileId}`);
      return guestProfile.data;
    } catch (ex) {
      logger.error('Fetch user profile failed.', ex);
      throw ex.response.data.error;
    }
  }

  async fetchAtriumProfile (guestProfileId) {
    try {
      const guestProfile = await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/guestUserProfiles/${guestProfileId}`);
      return guestProfile.data;
    } catch (ex) {
      logger.error('Fetch user profile failed.', ex);
      throw ex.response.data.error;
    }
  }

  async createGuestProfile (payload) {
    try {
      const createProfile = await this.axios.post(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/guestUserProfiles`, payload);
      return createProfile.data;
    } catch (ex) {
      logger.error('Create user profile failed.', ex);
      throw ex.response.data.error;
    }
  }

  async updateGuestProfile (payload) {
    try {
      const updateProfile = await this.axios.put(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/guestUserProfiles`, payload);
      return updateProfile.data;
    } catch (err) {
      logger.error('Error updating the guest profile.', err);
      throw err;
    }
  }

  async deleteUserSavedCard (userId, uniqueId) {
    try {
      return await this.axios.delete(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/guestUserProfiles/${userId}/cardInfo/${uniqueId}`);
    } catch (err) {
      logger.error('Delete user saved card failed.', err);
      throw err;
    }
  }

  async getCardInfoByUniqueId (userId, uniqueId) {
    try {
      return await this.axios.get(`${config.webPaths.posApi}/api/buy/kiosk/tenants/${this.opts.tenantId}/guestUserProfiles/${userId}/cardInfoUniqueId/${uniqueId}`);
    } catch (err) {
      logger.error('get user saved card failed.', err);
      throw err;
    }
  }

  async createLoyaltyCaptureToken (payload) {
    const { contextId } = payload;
    logger.info(`createLoyaltyCaptureToken: ${JSON.stringify(payload)}`);
    const createLoyaltyCaptureTokenUrl = `${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/loyalty/payment/capture`;
    try {
      return await this.axios.post(createLoyaltyCaptureTokenUrl, payload);
    } catch (err) {
      logger.error('createLoyaltyCaptureToken failed', err);
      throw err;
    }
  }

  async createLoyaltyCaptureTokenMOCK (payload) {
    return '9e5f684d-5a6f-482c-8a2d-5c5529ce442f';
  }

  async getLoyaltyCaptureResponseByToken (payload) {
    // logger.info(`getLoyaltyCaptureResponseByToken: ${JSON.stringify(payload)}`);
    const { token, contextId } = payload;
    const getLoyaltyCaptureResponseByTokenUrl = `${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/loyalty/payment/capture/${token}`;

    try {
      return await this.axios.get(getLoyaltyCaptureResponseByTokenUrl);
    } catch (err) {
      logger.error('getLoyaltyCaptureResponseByToken failed', err);
      throw err;
    }
  }

  async captureLoyaltyPayment (payload) {
    const { retryMax, retryTime } = payload;
    const token = await this.createLoyaltyCaptureToken(payload);

    const getLoyaltyCaptureResponseByTokenPayload = {
      contextId: payload.contextId,
      token: token.data
    };

    await delay(retryTime || CALL_DELAY);

    try {
      for (let i = 0; i < retryMax; i++) {
        let response = await this.getLoyaltyCaptureResponseByToken(getLoyaltyCaptureResponseByTokenPayload);
        if (response.status === 200) {
          return response.data;
        }
        if ((i + 1) !== retryMax) {
          await delay(retryTime || CALL_DELAY);
        }
      }
    } catch (err) {
      logger.error('captureLoyaltyVoucherPaymentAndAddToOrder failed');
      throw err;
    }
  }

  async getLoyaltyCaptureResponseByTokenMOCK (payload) {
    return new Promise((resolve, reject) => resolve(loyaltyAccountPaymentResponseByCapture));
  }

  async getLoyaltyCaptureResponseByTokenWithRetry (payload) {
    const { businessContextId, retryTime, retryMax } = payload;
    logger.info(`retryTime: ${retryTime}`);
    logger.info(`retryMax: ${retryMax}`);
    const getLoyaltyCaptureResponseByTokenPayload = {
      businessContextId: payload.businessContextId,
      token: payload.token
    };

    // for (let i = 0; i < retryMax; i++) {
    await delay(retryTime || CALL_DELAY);
    const loyaltyCaptureResponse = await this.getLoyaltyCaptureResponseByTokenMOCK(getLoyaltyCaptureResponseByTokenPayload);
    logger.info(`loyaltyCaptureResponse: ${JSON.stringify(loyaltyCaptureResponse)}`);
    if (loyaltyCaptureResponse.status === 200) {
      return loyaltyCaptureResponse;
    }
    // }

    throw 'Loyalty capture payment error';
  }

  async addLoyaltyPaymentToOrder (businessContextId, orderId, captureLoyaltyPaymentResponse) {
    let headers = {
      'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'
    };

    try {
      return await this.axios.put(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${businessContextId}/orders/${orderId}/payments`, captureLoyaltyPaymentResponse, { headers });
    } catch (err) {
      logger.error('Adding loyalty payment to order failed.', err);
      throw err;
    }
  }

  async getVoidLoyaltyPaymentResponseByToken (contextId, token) {
    try {
      return await this.axios.get(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/loyalty/payment/void/${token}`);
    } catch (err) {
      logger.error('getVoidLoyaltyPaymentResponseByToken failed', err);
      throw err;
    }
  }

  async voidLoyaltyPaymentTokenAndRetrieve (payload) {
    const { retryTime } = payload;
    const token = await this.voidLoyaltyPayment(payload);

    await delay(retryTime || CALL_DELAY);

    try {
      return await this.getVoidLoyaltyPaymentResponseByToken(payload.contextId, token);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async voidLoyaltyPayment (payload) {
    const { transactionData } = payload.paymentResponse.paymentData.paymentResponse;
    const voidPaymentPayload = {
      ...transactionData.loyaltyPaymentRequest,
      transactionId: transactionData.loyaltyPaymentResponse.transactionId
    };

    try {
      const voidPaymentResponse = await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${payload.contextId}/loyalty/payment/void`, voidPaymentPayload);
      return voidPaymentResponse.data;
    } catch (err) {
      logger.error('void payment failed', err);
      throw err;
    }
  }

  async voidAndDeleteLoyaltyPaymentFromOrder (payload) {
    try {
      await this.voidLoyaltyPaymentTokenAndRetrieve(payload);
      const order = await this.deletePaymentsFromOrder(payload.contextId, payload.orderId, [payload.paymentResponse.paymentData.id]);
      return order;
    } catch (error) {
      logger.error('Unable to get void payment.', error);
      try {
        const order = await this.deletePaymentsFromOrder(payload.contextId, payload.orderId, [payload.paymentResponse.paymentData.id]);
        return order;
      } catch (error) {
        throw error;
      }
    }
  }

  async getTaxRuleData (businessContextId) {
    try {
      const taxRuleDataResponse = await this.axios.get(`${config.webPaths.posApi}/tax-service/taxRuleData/tenants/${this.opts.tenantId}/properties/${businessContextId}`);
      return taxRuleDataResponse.data;
    } catch (ex) {
      logger.error('Unable to get Tax rule Data. Please try again.', ex);
      throw ex;
    }
  }

  async atriumAccountInquiry (payload, contextId) {
    return this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/accounts/inquiry/atrium`, payload);
  }

  async authAtriumPayment (payload, contextId) {
    try {
      return await this.axios.post(`${config.webPaths.posApi}/api/buy/payment/tenants/${this.opts.tenantId}/context/${contextId}/payments/authorize`, payload);
    } catch (err) {
      logger.error('atrium auth request failed.', err);
      throw err;
    }
  }

  async calculateOrderTotal (payload, contextId) {
    try {
      const calculateTotalResponse = await this.axios.post(`${config.webPaths.posApi}/api/buy/order/tenants/${this.opts.tenantId}/context/${contextId}/orders/calculate`, payload);
      return calculateTotalResponse.data;
    } catch (ex) {
      logger.error('Unable to calculate order total. Please try again.', ex);
      throw ex;
    }
  }

  async addLineItemToOrderByGuid (payload, orderId, contextId, cartItem) {
    try {
      const addLineItemResponse = await this.axios.post(`${config.webPaths.posApi}/api/buy/ig/tenants/${this.opts.tenantId}/context/${contextId}/orders/${orderId}/cart/line-items`, payload);
      const hydratedItem = toCartUtils.hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder(cartItem, addLineItemResponse.data);
      return {
        orderDetails: addLineItemResponse.data,
        addedItem: hydratedItem
      };
    } catch (ex) {
      logger.error('Unable to add item to order. Please try again.', ex);
      throw ex;
    }
  }

  async removeLineItemFromOrderByGuid (orderId, lineItemId, contextId) {
    try {
      const removeLineItemResponse = await this.axios.delete(`${config.webPaths.posApi}/api/buy/ig/tenants/${this.opts.tenantId}/context/${contextId}/orders/${orderId}/cart/line-items/${lineItemId}`);
      return {
        orderDetails: removeLineItemResponse.data,
        deletedItem: lineItemId
      };
    } catch (ex) {
      logger.error('Unable to remove item from order. Please try again.', ex);
      throw ex;
    }
  }

  async getItemsByOrderGuid (contextId, currencyUnit, orderGuid) {
    try {
      const getItemsResponse = await this.axios.get(`${config.webPaths.posApi}/api/buy/ig/tenants/${this.opts.tenantId}/context/${contextId}/orders/${orderGuid}/cart?currencyUnit=${currencyUnit}`);
      return getItemsResponse.data;
    } catch (ex) {
      logger.error('Unable to get items by order guid. Please try again.', ex);
      throw ex;
    }
  }

  async addLineItemsToOrderByGuid (contextId, orderGuid, properties) {
    try {
      const payload = {
        properties
      };
      const addLineItemsResponse = await this.axios.post(`${config.webPaths.posApi}/api/buy/ig/tenants/${this.opts.tenantId}/context/${contextId}/orders/${orderGuid}/cart/commit`, payload);
      return addLineItemsResponse.data;
    } catch (ex) {
      logger.error('Unable to add items by order guid. Please try again.', ex);
      throw ex;
    }
  }
}
