// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

/* eslint-disable max-len */
import config from 'app.config';
import path from 'path';
import Agilysys, { toOrderUtils } from 'agilysys.lib';
import Boom from 'boom';
import get from 'lodash.get';
import _ from 'lodash';
const logger = config.logger.child({ component: path.basename(__filename) });

/* istanbul ignore file */
export default {
  calculateOrderTotal: async (credentials, contextId, payload) => {
    const { cartItems, currencyDetails, storePriceLevel, openTerminalId, closedTerminalId, profitCenterId, employeeId, checkTypeId, useIgOrderApi, mealPeriodId } = payload;
    try {
      const agilysys = new Agilysys(credentials);
      const cartItemsAddedToOrder = cartItems.filter(item => !item.pending);
      const transformedPendingItems = cartItems.filter(item => item.pending).map(item => {
        return toOrderUtils.transformCartItemToOrderItem(item, mealPeriodId, currencyDetails, storePriceLevel);
      });
      const calculateRequestPayload = {
        currencyUnit: get(currencyDetails, 'currencyCode', 'USD'),
        properties: {
          mealPeriodId,
          closedTerminalId: closedTerminalId,
          openTerminalId: openTerminalId,
          profitCenterId: profitCenterId,
          employeeId,
          checkTypeId,
          useIgOrderApi
        },
        addLineItemRequests: [
          ...transformedPendingItems,
          ...cartItemsAddedToOrder
        ]
      };
      const calculateTotalResponse = await agilysys.calculateOrderTotal(calculateRequestPayload, contextId);
      return calculateTotalResponse;
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  addLineItemToOrderByGuid: async (credentials, contextId, orderId, payload) => {
    const { cartItems, currencyDetails, storePriceLevel, openTerminalId, closedTerminalId, profitCenterId, employeeId, checkTypeId, useIgOrderApi, mealPeriodId } = payload;
    try {
      const agilysys = new Agilysys(credentials);
      const transformedPendingItems = cartItems.map(item => {
        const transformItem = toOrderUtils.transformCartItemToOrderItem(item, mealPeriodId, currencyDetails, storePriceLevel);
        transformItem.properties.closedTerminalId = closedTerminalId;
        transformItem.properties.openTerminalId = openTerminalId;
        transformItem.properties.profitCenterId = profitCenterId;
        transformItem.properties.employeeId = employeeId;
        transformItem.properties.checkTypeId = checkTypeId;
        transformItem.properties.useIgOrderApi = useIgOrderApi;
        transformItem.properties.uniqueId = item.uniqueId;
        return transformItem;
      });

      const addLineItemResponse = await agilysys.addLineItemToOrderByGuid(transformedPendingItems, orderId, contextId, cartItems[0]);
      addLineItemResponse.lineItems = _.filter(addLineItemResponse.lineItems, lineItem => !lineItem.properties.voidId || parseInt(lineItem.properties.voidId) === 0);
      return addLineItemResponse;
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  deleteLineItemFromOrderByGuid: async (credentials, contextId, orderId, itemId) => {
    try {
      const agilysys = new Agilysys(credentials);
      const removeLineItemResponse = await agilysys.removeLineItemFromOrderByGuid(orderId, itemId, contextId);
      removeLineItemResponse.lineItems = _.filter(removeLineItemResponse.lineItems, lineItem => !lineItem.properties.voidId || parseInt(lineItem.properties.voidId) === 0);
      return removeLineItemResponse;
    } catch (ex) {
      if (ex.response && ex.response.status) {
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  getItemsByOrderGuid: async (credentials, contextId, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const { currencyDetails, orderGuid } = payload;
      const currencyUnit = get(currencyDetails, 'currencyCode', 'USD');
      const getItemsResponse = await agilysys.getItemsByOrderGuid(contextId, currencyUnit, orderGuid);
      getItemsResponse.properties.orderNumber = getItemsResponse.orderNumber;
      getItemsResponse.lineItems = _.filter(getItemsResponse.lineItems, lineItem => !lineItem.properties.voidId || parseInt(lineItem.properties.voidId) === 0);
      return getItemsResponse;
    } catch (ex) {
      if (ex.response && ex.response.status) {
        const errorCode = ex.response.data && get(ex.response.data, 'errors[0].context.ORDER_NOT_FOUND', false);
        if (ex.response.status === 400 && errorCode) {
          return Boom.badRequest('INVALID_ORDER_GUID');
        }
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  },
  addLineItemsToOrderByGuid: async (credentials, contextId, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const { currencyDetails, orderGuid, openTerminalId, closedTerminalId, profitCenterId, employeeId, checkTypeId, useIgOrderApi, mealPeriodId } = payload;
      const properties = {
        currencyUnit: get(currencyDetails, 'currencyCode', 'USD'),
        openTerminalId,
        closedTerminalId,
        profitCenterId,
        employeeId,
        checkTypeId,
        useIgOrderApi,
        mealPeriodId
      };
      const addLineItemsResponse = await agilysys.addLineItemsToOrderByGuid(contextId, orderGuid, properties);
      addLineItemsResponse.lineItems = _.filter(addLineItemsResponse.lineItems, lineItem => !lineItem.properties.voidId || parseInt(lineItem.properties.voidId) === 0);
      return addLineItemsResponse;
    } catch (ex) {
      if (ex.response && ex.response.status) {
        const errorCode = ex.response.data && get(ex.response.data, 'errors[0].context.ORDER_NOT_FOUND', false);
        if (ex.response.status === 400 && errorCode) {
          return Boom.badRequest('INVALID_ORDER_GUID');
        }
        return new Boom(ex.errors ? JSON.stringify(ex.errors) : ex.message, { statusCode: ex.response.status });
      } else {
        return Boom.badRequest(ex.message);
      }
    }
  }
};
