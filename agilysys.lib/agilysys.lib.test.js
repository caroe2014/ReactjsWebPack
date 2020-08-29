// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Agilysys from './agilysys.lib';
import envConfig from 'env.config';
import axios from 'axios';
import config, { _mockConfigHooks } from 'app.config';
import Boom from 'boom';
import _mockData_ from '../__mocks__/agilysys.lib.mock_data';
import { scheduleUtils } from 'agilysys.lib';
import { loyaltyAccountPaymentResponseByCapture } from '../__mocks__/loyalty';
import { delay } from '../api/util';

const toOrderUtils = require.requireActual('./utils/toOrder');
const toCartUtils = require.requireActual('./utils/toCart');
const paymentUtils = require.requireActual('./utils/payment');

let agilysys, mockData, opts, businessContext, profileId, tenantId;
let logger = _mockConfigHooks.logger;

describe('Agilysys Lib:', () => {

  beforeEach(() => {
    mockData = Object.assign({}, _mockData_);
    envConfig.tenants = Object.assign({}, mockData.tenantConfig.tenants);

    opts = mockData.opts;
    // opts.tenantConfig = {};

    businessContext = mockData.businessContext;
    profileId = mockData.profileId;
    tenantId = mockData.tenantId;

    jest.clearAllMocks();
  });

  describe('instantiate', () => {
    it('should have the correct properites', () => {
      agilysys = new Agilysys(opts);
      expect(agilysys.tenantId).toBe(tenantId);
      expect(agilysys.opts).toEqual(opts);
      expect(axios.interceptors.request.use).toBeCalled();
      expect(axios.interceptors.response.use).toBeCalled();
    });
    it('should throw error when ivalid opts is passed', () => {
      const invalidOpts = {};
      try {
        agilysys = new Agilysys(invalidOpts);
      } catch (error) {
        expect(error.message).toEqual('child "tenantId" fails because ["tenantId" is required]');
      }
    });
  });

  describe('request interceptors', () => {

    it('should return request with addtional headers if there is a session token', () => {
      agilysys = new Agilysys(opts);
      let requestInterceptor = agilysys.axiosInstance.interceptors.request.use.mock.calls[0][0];
      let mockRequest = { headers: {} };

      expect(requestInterceptor(mockRequest)).toEqual({
        headers: {
          TENANT_ID: 1,
          authorization: 'fake-session-toke'
        }
      });
    });

    it('should return request with no addtional headers if there is no session token', () => {
      opts.sessionToken = undefined;
      agilysys = new Agilysys(opts);
      let requestInterceptor = agilysys.axiosInstance.interceptors.request.use.mock.calls[0][0];
      let mockRequest = { headers: {} };
      expect(requestInterceptor(mockRequest)).toEqual(mockRequest);
      expect(logger.error).toBeCalledWith('MISSING CREDENTIALS');
    });
  });

  describe('response interceptors', () => {

    it('should log api data', () => {
      agilysys = new Agilysys(opts);
      let requestInterceptor = agilysys.axiosInstance.interceptors.response.use.mock.calls[0][0];

      let request = requestInterceptor(mockData.request);

      expect(request).toBe(mockData.request);
      expect(logger.info).toBeCalledWith('GET http:test.com/abc => 200');
    });

    it('should log api error', () => {
      agilysys = new Agilysys(opts);

      let requestInterceptor = agilysys.axiosInstance.interceptors.response.use.mock.calls[0][1];

      expect(requestInterceptor(mockData.request)).rejects.toBe(mockData.request);
      expect(logger.error).toBeCalledWith('GET http:test.com/abc => 200');
    });
  });

  describe('basic config information', () => {
    it('should return tenant', () => {
      agilysys = new Agilysys(opts);
      expect(agilysys.getTenant).toEqual(opts.tenant);
    });

    it('should return configured tenant', () => {
      agilysys = new Agilysys(opts);
      expect(agilysys.getTenantConfig()).toEqual(mockData.opts.tenantConfig);
    });

    it('should return configured stores', () => {
      agilysys = new Agilysys(opts);
      expect(agilysys.getConfiguredStores()).toEqual(mockData.opts.tenantConfig.storeList);
    });

    it('should return configured store', () => {
      agilysys = new Agilysys(opts);
      expect(agilysys.getConfiguredStore('123')).toEqual(mockData.opts.tenantConfig.tenants[1].stores['123']);
    });
  });

  describe('everything else', () => {

    it('should log in', async () => {
      agilysys = new Agilysys(opts);
      let mockPostResponse = {
        headers: {
          'access-token': 123,
          'refresh-token': 456
        }
      };
      axios.post.mockReturnValue(Promise.resolve(mockPostResponse));
      let result = await agilysys.login();

      expect(logger.debug).toBeCalledWith('LOGGING INTO POS API');

      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/grant/client`,
        null,
        {
          headers: {
            authorization: `Bearer ${opts.apiKey}`
          }
        }
      );

      expect(result).toEqual({
        accessToken: 123,
        refreshToken: 456
      });
    });

    it('should get stores sucsessfully', async () => {
      agilysys = new Agilysys(opts);
      let mockResponse = { data: mockData.getStoresResponse };
      axios.get
        .mockReturnValueOnce({data: mockData.getStoresResponse[0]})
        .mockReturnValueOnce({data: mockData.getStoresResponse[1]});
      axios.get.mockReturnValue(Promise.resolve(mockResponse));

      let result = await agilysys.getStores();

      expect(axios.get).toBeCalledWith(`${config.webPaths.posApi}/api/buy/kiosk/businessContexts/${mockData.opts.tenantConfig.storeList[0].businessContextId}`);
      expect(axios.get).toBeCalledWith(`${config.webPaths.posApi}/api/buy/kiosk/businessContexts/${mockData.opts.tenantConfig.storeList[1].businessContextId}`);
      expect(result).toEqual([mockResponse.data[0], mockResponse.data[1]]);
    });

    it('should handle error when get stores', async () => {
      jest.spyOn(Boom, 'badData');
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(() => Promise.reject({message: 'error'}));

      await agilysys.getStores();
      expect(logger.error).toBeCalled();
      expect(Boom.badData).toBeCalledWith(`Cannot read property 'depth' of undefined`);
    });
  });

  describe('get payment types', () => {
    it('should rget payment types for a given business context', async () => {
      axios.get.mockReturnValue(Promise.resolve({data: ['creditcard', 'GA']}));
      let paymentTypes = await agilysys.paymentTypes(businessContext);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/core/tenants/${opts.tenantId}/context/${businessContext}/v2/payment-types`
      );
      expect(paymentTypes).toEqual(['creditcard', 'GA']);
    });
  });

  describe('email and sms reciepts', () => {
    it('should send email receipt', async () => {
      agilysys = new Agilysys(opts);
      axios.mockReturnValue(Promise.resolve({data: 123}));
      let mockFormData = {myFormData: `abc`};

      await agilysys.sendEmailReceipt(mockFormData, businessContext);

      expect(axios).toBeCalledWith({
        'data': mockFormData,
        'headers': {'Content-Type': 'application/json'},
        'method': 'post',
        'url': `${config.webPaths.posApi}/communication-service/deliver/tenants/${tenantId}/context/${businessContext}`
      });
    });

    it('should error when sending email receipt', async () => {
      jest.spyOn(Boom, 'badData');
      agilysys = new Agilysys(opts);
      let mockFormData = {myFormData: `abc`};
      axios.mockReturnValue(Promise.reject({data: 123}));

      await agilysys.sendEmailReceipt(mockFormData, businessContext);
      expect(logger.error).toBeCalled();
      expect(Boom.badData).toBeCalled();
    });

    it('should send sms receipt', async () => {
      agilysys = new Agilysys(opts);
      axios.mockReturnValue(Promise.resolve({data: 123}));
      let mockJsonData = JSON.stringify({myData: 'abca'});

      await agilysys.sendSMSReceipt(mockJsonData, businessContext);
      expect(axios).toBeCalledWith({
        'data': mockJsonData,
        'headers': {'Content-Type': 'application/json'},
        'method': 'post',
        'url': `${config.webPaths.posApi}/communication-service/deliver/tenants/${tenantId}/context/${businessContext}`
      });
    });

    it('should error when sending sms receipt', async () => {
      jest.spyOn(Boom, 'badData');
      agilysys = new Agilysys(opts);
      axios.mockReturnValue(Promise.reject({data: 123}));

      await agilysys.sendSMSReceipt({myFormData: `abc`}, businessContext);
      expect(logger.error).toBeCalled();
      expect(Boom.badData).toBeCalled();
    });
  });

  describe('stores, info and details', () => {

    it('should get store info', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve({data: 123}));
      let storeInfo = await agilysys.getStoreInfo(businessContext);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/businessContexts/${businessContext}/storeInfo`
      );
      expect(storeInfo).toEqual(123);
    });

    it('should get details', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve({data: [123, 234]}));
      let storeDetails = await agilysys.getDetails(businessContext, profileId);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${tenantId}/businessContexts/${businessContext}/kioskConfigurations/byDisplayProfileId/${profileId}`
      );
      expect(storeDetails).toEqual(123);
    });
    
    it('should get store with details', async () => {
      agilysys = new Agilysys(opts);
      agilysys.storeAvailabilityCheck = jest.fn().mockReturnValue(true);

      agilysys.getDetails = jest.fn().mockReturnValueOnce(mockData.getStoreDetails[0])
        .mockReturnValueOnce(mockData.getStoreDetails[1]);

      let storesWithDetails = await agilysys.getStoresWithDetails(mockData.opts.tenantConfig.storeList);
      expect(storesWithDetails).toEqual(mockData.getStoresWithDetailsResponse);
    });

    it('should get item list', async () => {
      agilysys = new Agilysys(opts);
      axios.post.mockReturnValue({data: mockData.getItemListResponse});
      let itemList = await agilysys.getItems(businessContext, [mockData.getItemListResponse.content.itemId]);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/core/tenants/${tenantId}/context/${businessContext}/kiosk-items/get-items`, [mockData.getItemListResponse.content.itemId]
      );
      expect(itemList).toEqual(mockData.getItemListResponse.content);
    });

    it('should get item details', async () => {
      agilysys = new Agilysys(opts);
      let itemId = mockData.getItemDetailsResonses.itemId;

      axios.get.mockReturnValue({data: mockData.getItemDetailsResonses});
      let itemDetails = await agilysys.getItemDetails(businessContext, itemId);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/core/tenants/${tenantId}/context/${businessContext}/kiosk-items/${itemId}`);

      expect(itemDetails).toEqual(mockData.getItemDetailsResonses);
    });

    it('should get Profile', async () => {
      agilysys = new Agilysys(opts);

      axios.get.mockReturnValue({data: mockData.profileResponse});
      let profileResponse = await agilysys.getProfile(businessContext, mockData.profileResponse.profileId);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/businessContexts/${businessContext}/displayProfiles/${profileId}`);

      expect(profileResponse).toEqual(mockData.profileResponse);
    });
  });

  describe('Concept, menus, schedule, employee and Meal Period Id', () => {

    it('should get Concept', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve({data: 'mockConcept'}));
      let concept = await agilysys.getConcept(businessContext, '1');
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/businessContexts/${businessContext}/concepts/1`
      );
      expect(concept).toEqual('mockConcept');
    });

    it('should get Menus', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve({data: mockData.menuResponse}));
      let menus = await agilysys.getMenus(businessContext, '1');
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/businessContexts/${businessContext}/concepts`
      );
      expect(menus).toEqual(mockData.menuResponse.find(concept => concept.id === '1').menus);
    });

    it('should get Menus empty if concept not match', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve({data: mockData.menuResponse}));
      let menus = await agilysys.getMenus(businessContext, '2');
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/businessContexts/${businessContext}/concepts`
      );
      expect(menus).toEqual([]);
    });

    it('should get Schedule', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getDetails = jest.fn().mockReturnValue(mockData.scheduleResponse);
      let schedule = await agilysys.getSchedule(businessContext, tenantId);
      expect(schedule).toEqual(mockData.scheduleResponse.schedule);
    });

    it('should get Meal Period Id', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getConfiguredStore = jest.fn().mockReturnValue({storeInfo: {timezone: 'GMT-4'}});
      scheduleUtils.getLastScheduledTask = jest.fn().mockReturnValue({scheduledExpression: '0 0 5 * * SUN', properties: {'meal-period-id': 1}});
      axios.get.mockReturnValue(Promise.resolve({data: [{mealPeriodId: 0}, {mealPeriodId: 1}]}));
      let res = await agilysys.getMealPeriodId(businessContext, tenantId, '1', '1');
      expect(res).toEqual(1);
    });

    it('should get Meal Period Id throw error if no mealPeriodIndex matches', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getConfiguredStore = jest.fn().mockReturnValue({storeInfo: {timezone: 'GMT-4'}});
      scheduleUtils.getLastScheduledTask = jest.fn().mockReturnValue({scheduledExpression: '0 0 5 * * SUN', properties: {'meal-period-id': 1}});
      axios.get.mockReturnValue(Promise.resolve({data: [{mealPeriodId: 0}, {mealPeriodId: 0}]}));
      try {
        await agilysys.getMealPeriodId(businessContext, tenantId, '1', '1');
      } catch (error) {
        expect(logger.error).toBeCalled();
      }
    });
  });

  describe('Order Process', () => {

    it('should Create order', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getMealPeriodId = jest.fn().mockReturnValue(1);
      toOrderUtils.transformCartItemToOrderItem = jest.fn().mockReturnValue(mockData.transformCartItems);
      toOrderUtils.buildNewOrder = jest.fn().mockReturnValue(mockData.transformCartItems);
      toCartUtils.hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder = jest.fn().mockReturnValue(mockData.transformCartItems);
      axios.post.mockReturnValue(Promise.resolve({data: mockData.transformCartItems}));
      let createOrderResponse = await agilysys.createOrder(businessContext, mockData.orderData);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${businessContext}/orders`, mockData.transformCartItems
      );
      expect(createOrderResponse).toEqual({
        orderDetails: mockData.transformCartItems,
        addedItem: mockData.transformCartItems,
        mealPeriodId: 1
      });
    });

    it('should Create order throw error', async () => {
      agilysys = new Agilysys(opts);
      jest.spyOn(Boom, 'badData');
      agilysys.getMealPeriodId = jest.fn().mockReturnValue(1);
      axios.post.mockReturnValueOnce(Promise.reject(new Error({message: 'error'})));
      try {
        await agilysys.createOrder(businessContext, mockData.transformCartItems);
      } catch (error) {
        expect(logger.error).toBeCalled();
      }
    });

    it('should add item to order', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getMealPeriodId = jest.fn().mockReturnValue(1);
      toOrderUtils.transformCartItemToOrderItem = jest.fn().mockReturnValue(mockData.transformCartItems);
      toCartUtils.hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder = jest.fn().mockReturnValue(mockData.transformCartItems);
      axios.post.mockReturnValue(Promise.resolve({data: mockData.transformCartItems}));
      let createOrderResponse = await agilysys.addItemToOrder(businessContext, 123, mockData.transformCartItems[0]);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${businessContext}/orders/123/line-items`, mockData.transformCartItems
      );
      expect(createOrderResponse).toEqual({
        orderDetails: mockData.transformCartItems,
        addedItem: mockData.transformCartItems
      });
    });

    it('should add item to order with getMealPeriodId', async () => {
      agilysys = new Agilysys(opts);
      delete mockData.transformCartItems[0].mealPeriodId;
      agilysys.getMealPeriodId = jest.fn().mockReturnValue(1);
      toOrderUtils.transformCartItemToOrderItem = jest.fn().mockReturnValue(mockData.transformCartItems);
      toCartUtils.hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder = jest.fn().mockReturnValue(mockData.transformCartItems);
      axios.post.mockReturnValue(Promise.resolve({data: mockData.transformCartItems}));
      let createOrderResponse = await agilysys.addItemToOrder(businessContext, 123, mockData.transformCartItems[0]);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${businessContext}/orders/123/line-items`, mockData.transformCartItems
      );
      expect(createOrderResponse).toEqual({
        orderDetails: mockData.transformCartItems,
        addedItem: mockData.transformCartItems
      });
    });

    it('should delete item from order', async () => {
      agilysys = new Agilysys(opts);
      const orderId = 123;
      const itemId = 456;
      axios.delete.mockReturnValue(Promise.resolve({data: mockData.transformCartItems}));
      let createOrderResponse = await agilysys.deleteItemFromOrder(businessContext, orderId, itemId);
      expect(axios.delete).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${businessContext}/orders/${orderId}/line-items/${itemId}`
      );
      expect(createOrderResponse).toEqual({
        orderDetails: mockData.transformCartItems,
        deletedItem: itemId
      });
    });
    it('should throw error when delete item fails', async () => {
      agilysys = new Agilysys(opts);
      const orderId = 123;
      const itemId = 456;
      axios.delete.mockReturnValue(Promise.reject(new Error('error')));
      try {
        await agilysys.deleteItemFromOrder(businessContext, orderId, itemId);
      } catch (error) {
        expect(error.message).toEqual(`Cannot read property 'data' of undefined`);
      }
    });
  });

  describe('payments', () => {

    it('should makeStripeTransaction', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getDetails = jest.fn().mockReturnValueOnce(mockData.displayProfile);
      jest.mock('stripe', () => {
        return jest.fn().mockImplementation(() => {
          return {
            setTimeout: jest.fn(),
            charges: {
              create: () => Promise.resolve('stripe transaction sucessful response')
            },
            refunds: {
              create: () => Promise.resolve('stripe refund sucessful response')
            }
          };
        });
      });

      let result = await agilysys.makeStripeTransaction(mockData.makeStripeTransactionValues);
      expect(result).toEqual('stripe transaction sucessful response');
    });

    it('should makeStripeTransaction throw error if strip create fails', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getDetails = jest.fn().mockReturnValueOnce(mockData.displayProfile);
      jest.mock('stripe', () => {
        return jest.fn().mockImplementation(() => {
          return {
            setTimeout: jest.fn(),
            charges: {
              create: () => Promise.rejects(new Error('stripe error'))
            }
          };
        });
      });

      try {
        await agilysys.makeStripeTransaction(mockData.makeStripeTransactionValues);
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('stripe transaction failed. An error occured.');
      }
    });

    it('should makeStripeRefund', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getDetails = jest.fn().mockReturnValueOnce(mockData.displayProfile);
      jest.mock('stripe', () => {
        return jest.fn().mockImplementation(() => {
          return {
            setTimeout: jest.fn(),
            refunds: {
              create: () => Promise.resolve('stripe refund sucessful response')
            }
          };
        });
      });

      let result = await agilysys.makeStripeRefund(mockData.makeStripeRefundValues);
      expect(result).toEqual('stripe refund sucessful response');
    });

    it('should makeStripeRefund throw error if strip refund fails', async () => {
      agilysys = new Agilysys(opts);
      agilysys.getDetails = jest.fn().mockReturnValueOnce(mockData.displayProfile);
      jest.mock('stripe', () => {
        return jest.fn().mockImplementation(() => {
          return {
            setTimeout: jest.fn(),
            refunds: {
              create: () => Promise.rejects(new Error('stripe error'))
            }
          };
        });
      });

      try {
        await agilysys.makeStripeRefund(mockData.makeStripeRefundValues);
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('stripe refund failed. An error occured.');
      }
    });

    it('should post payment as external payment type based on config', async () => {
      agilysys = new Agilysys(opts);

      agilysys.postBuyPayment = jest.fn();
      agilysys.postExternalPayment = jest.fn();

      let mockPaymentInfo = {
        processPaymentAsExternalPayment: true
      };

      agilysys.postPayment(mockPaymentInfo);

      expect(agilysys.postBuyPayment).not.toBeCalled();
      expect(agilysys.postExternalPayment).toBeCalledWith(mockPaymentInfo);

    });

    it('should post payment as buy credit card payment type based on config', async () => {
      agilysys = new Agilysys(opts);

      agilysys.postBuyPayment = jest.fn();
      agilysys.postExternalPayment = jest.fn();

      let mockPaymentInfo = {
        processPaymentAsExternalPayment: false
      };

      agilysys.postPayment(mockPaymentInfo);

      expect(agilysys.postBuyPayment).toBeCalledWith(mockPaymentInfo);
      expect(agilysys.postExternalPayment).not.toBeCalled();

    });

    it('should post external payment', async () => {
      agilysys = new Agilysys(opts);

      const mockPayment = {
        order: {
          orderId: 200,
          contextId: 'mock-context-id-1234'
        }
      };

      agilysys.paymentUtils.buildExternalPaymentType = jest.fn(() => mockPayment);
      axios.put.mockReturnValue(Promise.resolve({data: mockPayment}));

      let results = await agilysys.postExternalPayment(mockPayment);

      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${tenantId}/context/${mockPayment.order.contextId}/orders/${mockPayment.order.orderId}/payments`,
        mockPayment,
        {'headers': {'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'}}
      );

      expect(results).toEqual(mockPayment);

    });

    it('should post buy credit card payment', async () => {
      agilysys = new Agilysys(opts);

      const mockPayment = {
        order: {
          orderId: 200,
          contextId: 'mock-context-id-1234'
        }
      };

      agilysys.paymentUtils.buildBuyCreditCardPayment = jest.fn(() => mockPayment);
      axios.put.mockReturnValue(Promise.resolve({data: mockPayment}));

      let results = await agilysys.postBuyPayment(mockPayment);

      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${tenantId}/context/${mockPayment.order.contextId}/orders/${mockPayment.order.orderId}/payments`,
        mockPayment,
        {'headers': {'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'}}
      );

      expect(results).toEqual(mockPayment);
    });

    it('should postSplitBuyPayment', async () => {
      agilysys = new Agilysys(opts);
      agilysys.addPaymentToOrder = jest.fn().mockReturnValue('addPaymentToOrder');
      let res = await agilysys.postSplitBuyPayment('1', '2', '3');
      expect(res).toEqual('addPaymentToOrder');
    });

    it('should addPaymentToOrder', async () => {
      let mockRes = {data: 'mock return value'};
      agilysys = new Agilysys(opts);
      axios.put.mockReturnValue(Promise.resolve(mockRes));
      let res = await agilysys.addPaymentToOrder('1', '2', 'paymentInfo');

      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/1/orders/2/payments`,
        'paymentInfo',
        {'headers': {'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'}}
      );
      expect(res).toEqual(mockRes.data);
    });

    it('should deletePaymentsFromOrder', async () => {
      agilysys = new Agilysys(opts);
      let payload = '123'
      axios.delete.mockReturnValue(Promise.resolve('mock deletePaymentsFromOrder'));
      let res = await agilysys.deletePaymentsFromOrder('1', '2', payload);
      expect(axios.delete).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/1/orders/2/payments`,
        { data: '123' },
      );
      expect(res).toEqual('mock deletePaymentsFromOrder');
    });


    it('should make transaction', async () => {
      agilysys = new Agilysys(opts);
      agilysys.postPaymentToPaymentGateWay = jest.fn().mockReturnValue({data: {name: 'test data'}, payAgentRequest: mockData.postPaymentPayload});
      let results = await agilysys.makeTransaction(mockData.postPaymentData);
      expect(results).toEqual(mockData.makeTransaction);
    });

    it('should postPaymentToPaymentGateWay', async () => {
      agilysys = new Agilysys(opts);
      let mockResponse = {data: {name: 'test data'}, payAgentRequest: mockData.postPaymentPayload};

      axios.mockReturnValue(Promise.resolve(mockResponse));
      let results = await agilysys.postPaymentToPaymentGateWay(mockData.postPaymentData);

      expect(axios).toBeCalledWith({
        url: `${config.webPaths.posApi}/v1.5/transaction/sale/token/${mockData.postPaymentData.tokenizedData.token}`,
        method: 'post',
        data: mockData.postPaymentPayload
      });
      expect(results).toEqual(mockResponse);
    });

  });

  describe('Loyalty', () => {
    it('should getLoyaltyAccountInquiryCallbackId', async () => {
      let inquiryInfo = {contextId: '1'};
      axios.post.mockReturnValue(Promise.resolve('mock getLoyaltyAccountInquiryCallbackId'));
      let res = await agilysys.getLoyaltyAccountInquiryCallbackId(inquiryInfo);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/${inquiryInfo.contextId}/accounts/inquiry/loyalty/tier/get-callback-id`,
        inquiryInfo
      );
      expect(res).toEqual('mock getLoyaltyAccountInquiryCallbackId');
    });

    it('should getLoyaltyAccountInquiryByCallbackId', async () => {
      let inquiryInfo = {contextId: '1', id: '2'};
      axios.get.mockReturnValue(Promise.resolve('mock getLoyaltyAccountInquiryByCallbackId'));
      let res = await agilysys.getLoyaltyAccountInquiryByCallbackId(inquiryInfo.contextId, inquiryInfo.id);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/1/accounts/inquiry/loyalty/tier/2`
      );
      expect(res).toEqual('mock getLoyaltyAccountInquiryByCallbackId');
    });

    it('should postLoyaltyPaymentAnddGetCallbackId', async () => {
      let inquiryInfo = {contextId: '1'};
      axios.post.mockReturnValue(Promise.resolve('mock postLoyaltyPaymentAnddGetCallbackId'));
      let res = await agilysys.postLoyaltyPaymentAnddGetCallbackId(inquiryInfo.contextId, mockData.postPaymentPayload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/1/payments/asyncronized/capture/get-callback-id`,
        mockData.postPaymentPayload
      );
      expect(res).toEqual('mock postLoyaltyPaymentAnddGetCallbackId');
    });

    it('should getLoyaltyPaymentResponseByCallbackId', async () => {
      let inquiryInfo = {contextId: '1', callbackId: '2'};
      axios.get.mockReturnValue(Promise.resolve('mock getLoyaltyPaymentResponseByCallbackId'));
      let res = await agilysys.getLoyaltyPaymentResponseByCallbackId(inquiryInfo.contextId, inquiryInfo.callbackId);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/1/payments/asyncronized/capture/2`
      );
      expect(res).toEqual('mock getLoyaltyPaymentResponseByCallbackId');
    });

    it('should pointsAccrual', async () => {
      let inquiryInfo = {contextId: '1', orderId: '2'};
      let accrualObject = {data: 'mock'};
      axios.post.mockReturnValue(Promise.resolve('mock pointsAccrual'));
      let res = await agilysys.pointsAccrual(inquiryInfo.contextId, inquiryInfo.orderId, accrualObject);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/1/order/2/loyalty/accrue`,
        accrualObject
      );
      expect(res).toEqual('mock pointsAccrual');
    });

    it('should createLoyaltyCaptureToken', async () => {
      let payload = {contextId: '1', orderId: '2'};
      axios.post.mockReturnValue(Promise.resolve('mock createLoyaltyCaptureToken'));
      let res = await agilysys.createLoyaltyCaptureToken(payload);
      expect(logger.info).toBeCalledWith('createLoyaltyCaptureToken: {"contextId":"1","orderId":"2"}');
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/${payload.contextId}/loyalty/payment/capture`,
        payload
      );
      expect(res).toEqual('mock createLoyaltyCaptureToken');
    });

    it('should getLoyaltyCaptureResponseByToken', async () => {
      let payload = {contextId: '1', token: '2'};
      axios.get.mockReturnValue(Promise.resolve('mock getLoyaltyCaptureResponseByToken'));
      let res = await agilysys.getLoyaltyCaptureResponseByToken(payload);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/1/loyalty/payment/capture/2`
      );
      expect(res).toEqual('mock getLoyaltyCaptureResponseByToken');
    });

    // it('should captureLoyaltyPayment', async () => {
    //   let payload = {retryMax: '3', retryTime: 2, contextId: '1'};
    //   agilysys.createLoyaltyCaptureToken = jest.fn().mockReturnValue({data: '123'});
    //   delay = jest.fn().mockReturnValue(Promise.resolve());
    //   agilysys.getLoyaltyCaptureResponseByToken = jest.fn().mockReturnValue({data: 'response'});
    //   let res = await agilysys.captureLoyaltyPayment(payload);
    //   expect(agilysys.createLoyaltyCaptureToken).toBeCalledWith(payload);
    //   expect(agilysys.delayCall).toBeCalledWith(2);
    //   expect(agilysys.getLoyaltyCaptureResponseByToken).toBeCalledWith({contextId: '1', token: '123'});
    //   expect(res).toEqual('response');
    // });

    // it('should getLoyaltyCaptureResponseByTokenMOCK', async () => {
    //   let payload = {data: '1'};
    //   let res = await agilysys.getLoyaltyCaptureResponseByTokenMOCK(payload);
    //   expect(res).toEqual(loyaltyAccountPaymentResponseByCapture);
    //   expect(agilysys.getLoyaltyCaptureResponseByTokenMOCK(payload)).resolves.toBe(loyaltyAccountPaymentResponseByCapture);
    //   expect(agilysys.getLoyaltyCaptureResponseByTokenMOCK(payload)).rejects.toBe(null);
    // });

    // it('should getLoyaltyCaptureResponseByTokenWithRetry', async () => {
    //   let payload = {retryMax: '3', retryTime: 2, businessContextId: '1', token: '123'};
    //   let res = {status: 200};
    //   agilysys.delayCall = jest.fn().mockReturnValue(Promise.resolve());
    //   agilysys.getLoyaltyCaptureResponseByTokenMOCK = jest.fn().mockReturnValue({status: 200});
    //   let mockRes = await agilysys.getLoyaltyCaptureResponseByTokenWithRetry(payload);
    //   expect(logger.info).toBeCalledWith('retryTime: 2');
    //   expect(logger.info).toBeCalledWith('retryMax: 3');
    //   expect(agilysys.getLoyaltyCaptureResponseByTokenMOCK).toBeCalledWith({businessContextId: '1', token: '123'});
    //   expect(logger.info).toBeCalledWith(`loyaltyCaptureResponse: ${JSON.stringify({status: 200})}`);
    //   expect(res).toEqual(mockRes);
    // });

    // it('should getLoyaltyCaptureResponseByTokenWithRetry throw error', async () => {
    //   let payload = {retryMax: '3', retryTime: 2, businessContextId: '1', token: '123'};
    //   agilysys.delayCall = jest.fn().mockReturnValue(Promise.resolve());
    //   agilysys.getLoyaltyCaptureResponseByTokenMOCK = jest.fn().mockReturnValue({status: 400});
    //   try {
    //     await agilysys.getLoyaltyCaptureResponseByTokenWithRetry(payload);
    //   } catch (error) {
    //     expect(logger.info).toBeCalledWith('retryTime: 2');
    //     expect(logger.info).toBeCalledWith('retryMax: 3');
    //     expect(agilysys.getLoyaltyCaptureResponseByTokenMOCK).toBeCalledWith({businessContextId: '1', token: '123'});
    //     expect(logger.info).toBeCalledWith(`loyaltyCaptureResponse: ${JSON.stringify({status: 400})}`);
    //     expect(error).toEqual('Loyalty capture payment error');
    //   }
    // });

    it('should addLoyaltyPaymentToOrder', async () => {
      let captureLoyaltyPaymentResponse = {data: 'mock captureLoyaltyPaymentResponse'};
      axios.put.mockReturnValue(Promise.resolve('mock addLoyaltyPaymentToOrder'));
      let res = await agilysys.addLoyaltyPaymentToOrder(businessContext, '2', captureLoyaltyPaymentResponse);
      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${businessContext}/orders/2/payments`,
        captureLoyaltyPaymentResponse,
        {'headers': {'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'}}
      );
      expect(res).toEqual('mock addLoyaltyPaymentToOrder');
    });

    it('should getVoidLoyaltyPaymentResponseByToken', async () => {
      axios.get.mockReturnValue(Promise.resolve('mock getVoidLoyaltyPaymentResponseByToken'));
      let res = await agilysys.getVoidLoyaltyPaymentResponseByToken('1', '2');
      expect(axios.get).toBeCalledWith(`${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/1/loyalty/payment/void/2`);
      expect(res).toEqual('mock getVoidLoyaltyPaymentResponseByToken');
    });

    // it('should voidLoyaltyPaymentTokenAndRetrieve', async () => {
    //   let payload = {retryTime: 2, contextId: '1'};
    //   agilysys.voidLoyaltyPayment = jest.fn().mockReturnValue('123');
    //   agilysys.delayCall = jest.fn().mockReturnValue(Promise.resolve());
    //   agilysys.getVoidLoyaltyPaymentResponseByToken = jest.fn().mockReturnValue('response');

    //   let res = await agilysys.voidLoyaltyPaymentTokenAndRetrieve(payload);

    //   expect(agilysys.voidLoyaltyPayment).toBeCalledWith(payload);
    //   expect(agilysys.delayCall).toBeCalledWith(2);
    //   expect(agilysys.getVoidLoyaltyPaymentResponseByToken).toBeCalledWith('1', '123');
    //   expect(res).toEqual('response');
    // });

    it('should voidLoyaltyPayment', async () => {
      agilysys = new Agilysys(opts);
      axios.post.mockReturnValue(Promise.resolve({data: 'mock voidLoyaltyPayment'}));
      let res = await agilysys.voidLoyaltyPayment(mockData.voidLoyaltyPaymentPayload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/1/loyalty/payment/void`,
        mockData.voidPaymentPayload
      );
      expect(res).toEqual('mock voidLoyaltyPayment');
    });

    it('should voidAndDeleteLoyaltyPaymentFromOrder', async () => {
      let payload = {orderId: '2', contextId: '1', paymentResponse: {paymentData: {id: '3'}}};
      agilysys.voidLoyaltyPaymentTokenAndRetrieve = jest.fn();
      agilysys.deletePaymentsFromOrder = jest.fn().mockReturnValue(Promise.resolve('order'));
      let res = await agilysys.voidAndDeleteLoyaltyPaymentFromOrder(payload);
      expect(agilysys.voidLoyaltyPaymentTokenAndRetrieve).toBeCalledWith(payload);
      expect(agilysys.deletePaymentsFromOrder).toBeCalledWith('1', '2', ['3']);
      expect(res).toEqual('order');
    });

    it('should voidAndDeleteLoyaltyPaymentFromOrder throw error then succeed', async () => {
      let payload = {orderId: '2', contextId: '1', paymentResponse: {paymentData: {id: '3'}}};
      agilysys.voidLoyaltyPaymentTokenAndRetrieve = jest.fn();
      agilysys.deletePaymentsFromOrder = jest.fn().mockReturnValueOnce(Promise.reject(new Error({message: 'Unable to get void payment.'})))
        .mockReturnValueOnce(Promise.resolve('order'));
      let res = null;
      try {
        res = await agilysys.voidAndDeleteLoyaltyPaymentFromOrder(payload);
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('Unable to get void payment.');
        expect(agilysys.deletePaymentsFromOrder).toBeCalledWith('1', '2', ['3']);
        expect(res).toEqual('order');
      }
    });

    it('should voidAndDeleteLoyaltyPaymentFromOrder throw error then throw error', async () => {
      let payload = {orderId: '2', contextId: '1', paymentResponse: {paymentData: {id: '3'}}};
      agilysys.voidLoyaltyPaymentTokenAndRetrieve = jest.fn();
      agilysys.deletePaymentsFromOrder = jest.fn().mockReturnValue(Promise.reject(new Error({message: 'Unable to get void payment.'})));
      try {
        await agilysys.voidAndDeleteLoyaltyPaymentFromOrder(payload);
      } catch (error) {
        expect(logger.error).toHaveBeenCalledTimes(1);
        try {
        } catch (error) {
          expect(logger.error).toHaveBeenCalledTimes(2);
          expect(error.message).toEqual('Unable to get void payment.');
        }
      }
    });
  });

  describe('Tax', () => {
    it('should getTaxRuleData', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve({data: 'mock getTaxRuleData'}));
      let res = await agilysys.getTaxRuleData('1');
      expect(axios.get).toBeCalledWith(`${config.webPaths.posApi}/tax-service/taxRuleData/tenants/${opts.tenantId}/properties/1`);
      expect(res).toEqual('mock getTaxRuleData');
    });
  });


  describe('GA', () => {
    it('should return employee ID for a given business context', async () => {
      // getEmployeeId
      axios.get.mockReturnValue(Promise.resolve({data: [{ employeeId: 1234 }]}));
      await agilysys.getEmployeeId(businessContext);
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/core/tenants/${opts.tenantId}/context/${businessContext}/employees`
      );
    });

    it('should getGAAccountInfo', async () => {
      let payload = {contextId: '1'};
      axios.post.mockReturnValue(Promise.resolve('mock getGAAccountInfo'));
      let res = await agilysys.getGAAccountInfo(payload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/ig/tenants/${opts.tenantId}/context/1/accounts/ga-with-tenders`,
        payload
      );
      expect(res).toEqual('mock getGAAccountInfo');
    });

    it('should gaAccountInquiry', async () => {
      let payload = {contextId: '1'};
      axios.post.mockReturnValue(Promise.resolve('mock gaAccountInquiry'));
      let res = await agilysys.gaAccountInquiry(payload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/1/accounts/inquiry/ga`,
        payload
      );
      expect(res).toEqual('mock gaAccountInquiry');
    });

    it('should authorizeGAPayment', async () => {
      let payload = mockData.authorizeGAPaymentPayload;
      axios.post.mockReturnValue(Promise.resolve('mock authorizeGAPayment'));
      let res = await agilysys.authorizeGAPayment(payload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/222/payments/authorize`,
        mockData.authorizeGAPaymentformattedPayload
      );
      expect(res).toEqual('mock authorizeGAPayment');
    });

    it('should addGAPaymentToOrder', async () => {
      let authorizeGAPaymentResponse = {data: 'mock authorizeGAPaymentResponse'};
      agilysys = new Agilysys(opts);
      axios.put.mockReturnValue(Promise.resolve('mock addGAPaymentToOrder'));
      let res = await agilysys.addGAPaymentToOrder('1', '2', '3', authorizeGAPaymentResponse);
      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/1/context/2/orders/3/payments`,
        authorizeGAPaymentResponse,
        {'headers': {'Content-Type': 'application/vnd.v2.payment.buy.rguest.agilysys.com+json'}}
      );
      expect(res).toEqual('mock addGAPaymentToOrder');
    });
  });

  describe('room charge', () => {
    it('should roomChargeAccountInquiry', async () => {
      let payload = {data: 'mock payload'};
      axios.post.mockReturnValue(Promise.resolve('mock roomChargeAccountInquiry'));
      let res = await agilysys.roomChargeAccountInquiry(payload, '2');
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/2/accounts/inquiry/room-charge-by-name-and-room-number`,
        {data: 'mock payload'}
      );
      expect(res).toEqual('mock roomChargeAccountInquiry');
    });

    it('should memberChargeAccountInquiry', async () => {
      let payload = {data: 'mock payload'};
      axios.post.mockReturnValue(Promise.resolve('mock memberChargeAccountInquiry'));
      let res = await agilysys.memberChargeAccountInquiry(payload, '2');
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/2/accounts/inquiry/room-charge-by-name-and-account-number`,
        {data: 'mock payload'}
      );
      expect(res).toEqual('mock memberChargeAccountInquiry');
    });

    it('should captureRoomChargePayment', async () => {
      let payload = {order: {contextId: '2'}};
      paymentUtils.buildRoomChargeCapturePayload = jest.fn(() => payload);
      axios.post.mockReturnValue(Promise.resolve({data: 'mock captureRoomChargePayment'}));
      let res = await agilysys.captureRoomChargePayment(payload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/2/payments/capture`,
        payload
      );
      expect(res).toEqual('mock captureRoomChargePayment');
    });

    it('should captureMemberChargePayment', async () => {
      let payload = {order: {contextId: '2'}};
      paymentUtils.buildMemberChargeCapturePayload = jest.fn(() => payload);
      axios.post.mockReturnValue(Promise.resolve({data: 'mock captureMemberChargePayment'}));
      let res = await agilysys.captureMemberChargePayment(payload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/payment/tenants/${opts.tenantId}/context/2/payments/capture`,
        payload
      );
      expect(res).toEqual('mock captureMemberChargePayment');
    });


  });
  describe('Wait time Process', () => {

    it('should getReceipt', async () => {
      agilysys = new Agilysys(opts);
      const receiptInfo = {id: 123, name: 'test receipt'};

      axios.post.mockReturnValue(Promise.resolve(receiptInfo));
      let receiptResponse = await agilysys.getReceipt(receiptInfo);

      expect(axios.post).toBeCalledWith(
        `${config.webPaths.receiptApi}/api/buy/receipt/receiptTemplate`, receiptInfo);
      expect(receiptResponse).toEqual(receiptInfo);
    });

    it('should getReceipt throw error', async () => {
      agilysys = new Agilysys(opts);
      axios.post.mockReturnValue(Promise.reject(new Error('error')));
      try {
        await agilysys.getReceipt();
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('error');
      }
    });

    it('should getWaitTimeForItems', async () => {
      agilysys = new Agilysys(opts);
      axios.post.mockReturnValue(Promise.resolve({data: mockData.waitTimeCartItems}));
      let waitTimeResponse = await agilysys.getWaitTimeForItems(businessContext, mockData.waitTimeCartItems);

      const waitTimeRequest = {
        tenantId: opts.tenantId,
        contextId: businessContext,
        lineItems: [{'item': {'displayName': undefined, 'prepTime': 123},
          'itemId': 2,
          'kitchenVideoId': 123,
          'quantity': undefined},
        {'item': {'displayName': undefined, 'prepTime': 0}, 'itemId': 3, 'kitchenVideoId': 123, 'quantity': undefined}],
        orderOrigin: 'CLOUD',
        notificationData: {
          varianceEnabled: mockData.waitTimeCartItems.varianceEnabled,
          variancePercentage: mockData.waitTimeCartItems.variancePercentage
        }
      };

      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/display/metrics/tenants/${opts.tenantId}/context/${businessContext}/ordersWaitTimeWithVariance`, waitTimeRequest
      );
      expect(waitTimeResponse).toEqual(mockData.waitTimeCartItems);
    });

    it('should getWaitTimeForItems throw error when cart item undefined', async () => {
      agilysys = new Agilysys(opts);
      axios.post.mockReturnValue(Promise.resolve({data: mockData.waitTimeCartItems}));

      try {
        await agilysys.getWaitTimeForItems(businessContext, {});
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual("Cannot read property 'map' of undefined");
      }
    });

    it('should getProfitCenter', async () => {
      agilysys = new Agilysys(opts);
      const responseData = {id: 123, name: 'mock profit center'};
      const profitCenterId = 123;

      axios.get.mockReturnValue(Promise.resolve({data: responseData}));
      let profitCenterResponse = await agilysys.getProfitCenter(businessContext, profitCenterId);

      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/core/tenants/${opts.tenantId}/context/${businessContext}/profit-centers/profitCenterId/${profitCenterId}`);
      expect(profitCenterResponse).toEqual(responseData);
    });

    it('should getProfitCenter throw error', async () => {
      agilysys = new Agilysys(opts);
      jest.spyOn(Boom, 'badData');
      const profitCenterId = 123;

      axios.get.mockReturnValue(Promise.resolve(undefined));
      try {
        await agilysys.getProfitCenter(businessContext, profitCenterId);
        expect(axios.get).toBeCalledWith(
          `${config.webPaths.posApi}/api/buy/core/tenants/${opts.tenantId}/context/${businessContext}/profit-centers/profitCenterId/${profitCenterId}`);
      } catch (error) {
        expect(logger.error).toBeCalled();
      }
    });

    it('should getProfitCenterId', async () => {
      agilysys = new Agilysys(opts);
      const responseData = {id: 123, name: 'mock profit center'};
      axios.get.mockReturnValue(Promise.resolve({data: responseData}));
      let profitCenterResponse = await agilysys.getProfitCenterId(businessContext);

      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/context-mapping/context/${businessContext}`);
      expect(profitCenterResponse).toEqual(responseData);
    });

    it('should getThrottlingConfiguration', async () => {
      agilysys = new Agilysys(opts);
      const responseData = {id: 123, name: 'mock getThrottlingConfiguration'};
      axios.get.mockReturnValue(Promise.resolve({data: responseData}));
      let res = await agilysys.getThrottlingConfiguration(businessContext);

      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/core/tenants/${opts.tenantId}/context/${businessContext}/order/throttling/configuration`);
      expect(res).toEqual(responseData);
    });

    it('should orderThrottlingCapacityCheck', async () => {
      agilysys = new Agilysys(opts);
      const payload = {data: 'mock payload'};
      const responseData = {id: 123, name: 'mock orderThrottlingCapacityCheck'};
      axios.post.mockReturnValue(Promise.resolve({data: responseData}));
      let res = await agilysys.orderThrottlingCapacityCheck(businessContext, payload);

      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${businessContext}/orders/capacity-check`, payload);
      expect(res).toEqual(responseData);
    });

    it('should storeAvailabilityCheck', async () => {
      agilysys = new Agilysys(opts);
      const responseData = {id: 123, name: 'mock storeAvailabilityCheck'};
      axios.get.mockReturnValue(Promise.resolve({data: responseData}));
      let res = await agilysys.storeAvailabilityCheck(businessContext);

      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/display/storeAvailable/tenants/${opts.tenantId}/context/${businessContext}`);
      expect(res).toEqual(responseData);
    });
  });

  describe('FB, Google login', () => {
    it('should generateFBLongLiveToken', async () => {
      agilysys = new Agilysys(opts);
      const payload = {app_id: '123', token: '456'};
      const mockParamsObj = {
        grant_type: 'fb_exchange_token',
        client_id: payload.app_id,
        client_secret: '789',
        fb_exchange_token: payload.token
      };
      const responseData = {data: 'mock generateFBLongLiveToken'};
      axios.get.mockReturnValue(Promise.resolve({data: responseData}));
      let res = await agilysys.generateFBLongLiveToken(payload, '789');
      expect(axios.get).toBeCalledWith(
        'https://graph.facebook.com/v5.0/oauth/access_token', { params: mockParamsObj });
      expect(res).toEqual(responseData);
    });

    it('should validateFBToken', async () => {
      agilysys = new Agilysys(opts);
      const mockParamsObj = { access_token: 'token' };
      const responseData = {data: 'mock validateFBToken'};
      axios.get.mockReturnValue(Promise.resolve({data: responseData}));
      let res = await agilysys.validateFBToken('token');
      expect(axios.get).toBeCalledWith(
        'https://graph.facebook.com/me', { params: mockParamsObj });
      expect(res).toEqual(responseData);
    });

    it('should validateFBToken throw error', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.reject(new Error('error')));
      try {
        await agilysys.validateFBToken('token');
      } catch (error) {
        expect(logger.error).toBeCalled();
      }
    });
  });

  describe('Guest profile', () => {
    it('should fetchGuestProfile', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve({data: 'mock fetchGuestProfile'}));
      let res = await agilysys.fetchGuestProfile('1');
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/guestUserProfiles/1`);
      expect(res).toEqual('mock fetchGuestProfile');
    });

    it('should createGuestProfile', async () => {
      agilysys = new Agilysys(opts);
      const payload = {data: 'mock payload'};
      axios.post.mockReturnValue(Promise.resolve({data: 'mock createGuestProfile'}));
      let res = await agilysys.createGuestProfile(payload);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/guestUserProfiles`, payload);
      expect(res).toEqual('mock createGuestProfile');
    });

    it('should updateGuestProfile', async () => {
      agilysys = new Agilysys(opts);
      const payload = {data: 'mock payload'};
      axios.put.mockReturnValue(Promise.resolve({data: 'mock updateGuestProfile'}));
      let res = await agilysys.updateGuestProfile(payload);
      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/guestUserProfiles`, payload);
      expect(res).toEqual('mock updateGuestProfile');
    });

    it('should deleteUserSavedCard', async () => {
      agilysys = new Agilysys(opts);
      axios.delete.mockReturnValue(Promise.resolve('mock deleteUserSavedCard'));
      let res = await agilysys.deleteUserSavedCard('1', '2');
      expect(axios.delete).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/guestUserProfiles/1/cardInfo/2`);
      expect(res).toEqual('mock deleteUserSavedCard');
    });

    it('should getCardInfoByUniqueId', async () => {
      agilysys = new Agilysys(opts);
      axios.get.mockReturnValue(Promise.resolve('mock getCardInfoByUniqueId'));
      let res = await agilysys.getCardInfoByUniqueId('1', '2');
      expect(axios.get).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/kiosk/tenants/${opts.tenantId}/guestUserProfiles/1/cardInfoUniqueId/2`);
      expect(res).toEqual('mock getCardInfoByUniqueId');
    });


  });

  describe('Get Receipt', () => {

    it('should getReceipt', async () => {
      agilysys = new Agilysys(opts);
      const receiptInfo = {id: 123, name: 'test receipt'};

      axios.post.mockReturnValue(Promise.resolve(receiptInfo));
      let receiptResponse = await agilysys.getReceipt(receiptInfo);

      expect(axios.post).toBeCalledWith(
        `${config.webPaths.receiptApi}/api/buy/receipt/receiptTemplate`, receiptInfo);
      expect(receiptResponse).toEqual(receiptInfo);
    });

    it('should getReceipt catch error', async () => {
      agilysys = new Agilysys(opts);
      axios.post.mockReturnValue(Promise.reject(new Error('error')));
      try {
        await agilysys.getReceipt();
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('error');
      }
    });

    it('should getSMSReceipt', async () => {
      agilysys = new Agilysys(opts);
      const receiptInfo = {id: 123, name: 'SMS receipt'};
      axios.post.mockReturnValue(Promise.resolve(receiptInfo));
      let receiptResponse = await agilysys.getSMSReceipt(receiptInfo);
      expect(axios.post).toBeCalledWith(
        `${config.webPaths.receiptApi}/api/buy/receipt/smsTemplate`, receiptInfo);
      expect(receiptResponse).toEqual(receiptInfo);
    });

    it('should getSMSReceipt catch error', async () => {
      agilysys = new Agilysys(opts);
      axios.post.mockReturnValue(Promise.reject(new Error('error')));
      try {
        await agilysys.getSMSReceipt();
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('error');
      }
    });
  });

  describe('Clsoe, cancel an order', () => {
    const mockInput = {
      order: {
        contextId: 1234,
        orderId: 1001,
        scheduledOrderCompletionTimeStamp: '12-Jan-2019'
      }
    };
    it('should close the order', async () => {
      const mockPutResponse = {};
      const mockproperties = {
        'properties': {},
        'scheduledOrderCompletionTimeStamp': '12-Jan-2019'
      };
      toOrderUtils.getOrderProperties = jest.fn().mockReturnValue({});
      axios.put.mockReturnValue(Promise.resolve(mockPutResponse));
      await agilysys.closeOrder(mockInput);
      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${mockInput.order.contextId}/orders/${mockInput.order.orderId}/close`, mockproperties
      );
    });

    it('should closeOrder catch error', async () => {
      agilysys = new Agilysys(opts);
      axios.put.mockReturnValue(Promise.reject(new Error('error')));
      try {
        await agilysys.closeOrder(mockInput);
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('error');
      }
    });

    it('should cancel the order', async () => {
      const mockPutResponse = {}
      axios.put.mockReturnValue(Promise.resolve(mockPutResponse));
      let res = await agilysys.cancelOrder(mockInput.order.contextId, mockInput.order.orderId);
      expect(axios.put).toBeCalledWith(
        `${config.webPaths.posApi}/api/buy/order/tenants/${opts.tenantId}/context/${mockInput.order.contextId}/orders/${mockInput.order.orderId}/cancel`, { orderState: 'CANCEL' }
      );
      expect(res).toEqual(res);
    });

    it('should throw error if cancel the order fails', async () => {
      axios.put.mockReturnValue(Promise.reject(new Error('error')));
      try {
        await agilysys.closeOrder(mockInput);
      } catch (error) {
        expect(logger.error).toBeCalled();
        expect(error.message).toEqual('error');
      }
    });
  });
});
