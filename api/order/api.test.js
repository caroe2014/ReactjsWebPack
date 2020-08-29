// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import Api from './api';
import MockAgilysys from '../../test/agilysys.mock';
import Agilysys from '../../agilysys.lib/agilysys.lib';
import Boom from 'boom';

/* global describe, it, expect, jest, beforeAll */

jest.mock('../../agilysys.lib/agilysys.lib');
const mockAgilysys = new MockAgilysys();
Agilysys.mockImplementation(() => mockAgilysys);

Boom.resourceGone = () => { return {}; };

describe('order api', () => {

  describe('create order', () => {

    beforeAll(() => {
      mockAgilysys.order = { orderDetails: { orderId: '1234' } };
    });

    it('order creation success', async () => {
      let data = await Api.createOrder();
      expect(data).toEqual(mockAgilysys.order);
    });

    it('order failure if order details not found', async () => {
      mockAgilysys.order = { orderDetails: {} };
      let data = await Api.createOrder();
      expect(data).toEqual(Boom.resourceGone(`Unable to create an order at this time`));
    });

    it('catch error if the order contains empty object', async () => {
      mockAgilysys.order = {};
      let data = await Api.createOrder();
      expect(data).toEqual(Boom.resourceGone(`Cannot read property 'orderId' of undefined`));
    });

    it('catch error if response contains error message', async () => {
      mockAgilysys.order = new Error('server error 400');
      mockAgilysys.order.response = {status: 400};
      let data = await Api.createOrder();
      expect(data).toEqual({'name': 'server error 400'});
    });
  });

  describe('Add Item to order', () => {
    const orderId = '1234';
    const currencyDetails = '';
    const orderDetails = {
      orderId: orderId,
      currencyDetails: currencyDetails
    };

    it('add order success', async () => {
      mockAgilysys.order = { orderDetails: orderDetails };
      let data = await Api.addItemToOrder({}, '1', orderDetails.orderId, orderDetails);
      expect(data).toEqual(mockAgilysys.order);
    });

    it('order failure if order details not found', async () => {
      mockAgilysys.order = { orderDetails: {} };
      let data = await Api.addItemToOrder({}, '1', orderDetails.orderId, orderDetails);
      expect(data).toEqual(Boom.resourceGone(`Unable to add item to your order at this time`));
    });

    it('catch error if the order contains empty object', async () => {
      mockAgilysys.order = {};
      let data = await Api.addItemToOrder({}, '1', orderDetails.orderId, orderDetails);
      expect(data).toEqual(Boom.resourceGone(`Cannot read property 'orderId' of undefined`));
    });

    it('catch error if response contains error message', async () => {
      mockAgilysys.order = new Error('server error 400');
      mockAgilysys.order.response = {status: 400};
      let data = await Api.addItemToOrder({}, '1', orderDetails.orderId, orderDetails);
      expect(data).toEqual({'name': 'server error 400'});
    });

  });

  describe('Delete Item from order', () => {

    beforeAll(() => {
      mockAgilysys.order = { orderDetails: { orderId: '1234' } };
    });

    it('Delete Item success', async () => {
      let data = await Api.deleteItemFromOrder();
      expect(data).toEqual(mockAgilysys.order);
    });

    it('order failure if order details not found', async () => {
      mockAgilysys.order = {};
      let data = await Api.deleteItemFromOrder();
      expect(data).toEqual(Boom.resourceGone(`Unable to delete item from your order at this time`));
    });

    it('catch error if the order data is undefined', async () => {
      mockAgilysys.order = undefined;
      let data = await Api.deleteItemFromOrder();
      expect(data).toEqual(Boom.resourceGone(`Somthing went wrong in delete order`));
    });

    it('catch error if response contains error message', async () => {
      mockAgilysys.order = new Error('server error 400');
      mockAgilysys.order.response = {status: 400};
      let data = await Api.deleteItemFromOrder({}, 'test', 123, 456);
      expect(data).toEqual({'name': 'server error 400'});
    });

  });

  describe('Close order', () => {
    const credential = { test: 'test' };
    const orderData = { order: 'order data' };
    beforeAll(() => {
      mockAgilysys.closeOrderData = { data: 'sample close order data' };
    });

    it('create close order success', async () => {
      const closeOrder = {};
      let data = await Api.createClosedOrder(credential, orderData);
      expect(data).toEqual(closeOrder);
    });

    it('catch error if the close order is empty object', async () => {
      mockAgilysys.closeOrderData = {};
      let data = await Api.createClosedOrder(credential, orderData);
      expect(data).toEqual(Boom.badRequest('close order data missing'));
    });

    it('catch error if response contains error message', async () => {
      mockAgilysys.closeOrderData = new Error('server error 400');
      mockAgilysys.closeOrderData.response = {status: 400};
      let data = await Api.createClosedOrder(credential, orderData);
      expect(data).toEqual({});
    });

  });

  describe('Close order for Stripe', () => {
    const credential = { test: 'test' };
    const orderData = { order: 'order data' };
    beforeAll(() => {
      mockAgilysys.closeOrderData = { data: '' };
    });

    it('create close order success', async () => {
      const closeOrder = {};
      let data = await Api.createClosedOrderWallets(credential, orderData);
      expect(data).toEqual(closeOrder);
    });

    it('catch error if the close order is empty object', async () => {
      mockAgilysys.closeOrderData = {};
      let data = await Api.createClosedOrderWallets(credential, orderData);
      expect(data).toEqual(Boom.badRequest('close order data missing'));
    });

    it('catch error if response contains error message', async () => {
      mockAgilysys.closeOrderData = new Error('server error 400');
      mockAgilysys.closeOrderData.response = {status: 400};
      let data = await Api.createClosedOrderWallets(credential, orderData);
      expect(data).toEqual({});
    });

  });

  describe('get WaitTime For Items', () => {

    mockAgilysys.waitTimes = { minutes: 10 };

    it('getWaitTimeForItems success', async () => {
      let data = await Api.getWaitTimeForItems();
      expect(data).toEqual(mockAgilysys.waitTimes);
    });

    it('wait times failure if waitime api return undefined', async () => {
      jest.spyOn(Boom, 'resourceGone');
      delete mockAgilysys.waitTimes.minutes;
      await Api.getWaitTimeForItems();
      expect(Boom.resourceGone).toBeCalled();
    });

    it('catch error if the waittime contains undefined', async () => {
      jest.spyOn(Boom, 'resourceGone');
      mockAgilysys.waitTimes = undefined;
      await Api.getWaitTimeForItems();
      expect(Boom.resourceGone).toBeCalled();
    });

    it('catch error if response contains error message', async () => {
      mockAgilysys.waitTimes = new Error('server error 400');
      mockAgilysys.waitTimes.response = {status: 400};
      let data = await Api.getWaitTimeForItems();
      expect(data).toEqual({'name': 'server error 400'});
    });

  });
});
