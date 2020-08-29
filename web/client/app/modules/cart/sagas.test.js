// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import { put, call } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import {
  removeItemFromOrder, modifingOrder,
  modifingOrderSucceeded, modifingOrderFailed, _removeItemFromOrder,
  addItemToOrder, _addItemToExistingOrder, _addItemToNewOrder,
  fetchCartReadyTime, getCartReadyTimeSucceeded, getCartReadyTimeFailed,
  fetchCartReadyTimeSaga, updateCartOnRemoveItemFailure, updateCartOnAddItemFailure, fetchCartReadyTimesForOpenCart,
  setAppError, closeOrder, modifingOrderResolved, modifingClearUndo, modifingAddUndo, completeOrder,
  fetchCartReadyTimesForClosedOrder, fetchCartReadyTimesForClosingOrder, modifyCartItem
} from './sagas';
import { resetDelivery } from 'web/client/app/modules/deliverylocation/sagas';
import { resetTipData } from 'web/client/app/modules/tip/sagas';
import { resetSmsDetails } from 'web/client/app/modules/smsnotification/sagas';
import { resetScheduleOrderData } from 'web/client/app/modules/scheduleorder/sagas';
import { resetNameDetails } from 'web/client/app/modules/namecapture/sagas';
import { resetLoyaltyMap } from 'web/client/app/modules/loyalty/sagas';
import { clearGAState } from 'web/client/app/modules/gaPayment/sagas';
import axios from 'axios';
import config from 'app.config';

const getTenantId = require('./sagas').__get__('getTenantId');
const getSelectedSiteId = require('./sagas').__get__('getSelectedSiteId');
const getReadyTime = require('./sagas').__get__('getReadyTime');
const getTipAmount = require('./sagas').__get__('getTipAmount');
const getOrder = require('./sagas').__get__('getOrder');
const getCartItems = require('./sagas').__get__('getCartItems');
const getClosedOrderItems = require('./sagas').__get__('getClosedOrderItems');
const getCartOpen = require('./sagas').__get__('getCartOpen');
const getUndoItem = require('./sagas').__get__('getUndoItem');
const getCurrencyDetails = require('./sagas').__get__('getCurrencyDetails');
const getCurrentSchedule = require('./sagas').__get__('getCurrentSchedule');

/* global describe, it, expect */
/* eslint-disable max-len */
const order = { orderId: '7896' };
const selectedItem = { lineItemId: '12', uniqueId: '12', contextId: '1234' };
const currentCartItems = [{ contextId: '1234', uniqueId: '12', addedItem: {uniqueId: '45', lineItemId: '34'} }];
const siteId = '1234';
const orderTimeZone = 'America/Los_Angeles';
const sitesList = [{
  id: '1234',
  timeZone: 'America/Los_Angeles'
}];
const currencyDetails = {};
const schedule = {task: ['test']};
const scheduleTime = '09:15 PM';

global.Date = jest.fn(() => {
  return {
    getTime: () => 'test'
  };
});
const tenantId = '1234';
const displayProfileId = '123';
const sites = [
  {
    id: '1234',
    displayProfileId: '123',
    etf: {
      etfEnabled: true,
      varianceEnabled: true,
      variancePercentage: 20
    }
  }
];

describe('Cart Saga', () => {

  describe('remove item from order', () => {
    const generator = cloneableGenerator(removeItemFromOrder)(selectedItem);
    let clone;
    it('remove item success action', () => {
      clone = generator.clone();
      clone.next(selectedItem);
      clone.next(order);
      expect(clone.next(tenantId).value).toEqual(put(modifingOrder()));
      expect(clone.next().value).toEqual(call(_removeItemFromOrder, tenantId, siteId, selectedItem.lineItemId, order.orderId));
      expect(clone.next().value).toEqual(put(modifingOrderSucceeded()));
      expect(clone.next().value).toEqual(put(modifingOrderResolved('REMOVE')));
      expect(clone.next().done).toEqual(true);
    });

    it('remove item catch error', () => {
      clone = generator.clone();
      clone.next(selectedItem);
      clone.next(order);
      expect(clone.next(tenantId).value).toEqual(put(modifingOrder()));
      clone.next();
      expect(clone.throw('modify order failed').value).toEqual(put(updateCartOnRemoveItemFailure(selectedItem)));
      expect(clone.next().value).toEqual(put(setAppError(new Error('Failed to delete item from the cart , please try again'), 'ERROR_CART_DELETE')));
      expect(clone.next().value).toEqual(put(modifingOrderFailed('modify order failed')));
      expect(clone.next().value).toEqual(put(modifingOrderResolved('REMOVE')));
      expect(clone.next().done).toEqual(true);
    });

    it('missing tenant id', () => {
      clone = generator.clone();
      clone.next(selectedItem);
      clone.next(order);
      expect(clone.next().value).toEqual(put(modifingOrderFailed('REMOVE :: Missing Tenant ID')));
      expect(clone.next().done).toEqual(true);
    });

    it('no order to delete', () => {
      clone = generator.clone();
      clone.next(selectedItem);
      clone.next({});
      expect(clone.next(tenantId).value).toEqual(put(modifingOrderFailed('REMOVE :: No order to delete items from')));
      expect(clone.next().done).toEqual(true);
    });

    it('shoud check item not in order', () => {
      const generator = cloneableGenerator(removeItemFromOrder)();
      clone = generator.clone();
      clone.next();
      clone.next(order);
      expect(clone.next(tenantId).value).toEqual(put(modifingOrderFailed('REMOVE :: Item Not In Order')));
      expect(clone.next().done).toEqual(true);
    });

    it('shoud check item line item id not found', () => {
      delete selectedItem.lineItemId;
      clone = generator.clone();
      clone.next(selectedItem);
      clone.next(order);
      clone.next(tenantId);
      expect(clone.next({uniqueId: '12'}).value).toEqual(put(modifingClearUndo()));
      expect(clone.next().value).toEqual(put(modifingOrderFailed('REMOVE :: Item Not In Order')));
      expect(clone.next().done).toEqual(true);
    });
  });

  // describe('add item to order', () => {
  //   const generator = cloneableGenerator(addItemToOrder)(selectedItem);
  //   let clone;

    // it('add item to existing order', () => {
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(order);
    //   clone.next(tenantId);
    //   clone.next(siteId);
    //   clone.next(sitesList);
    //   expect(clone.next(currentCartItems).value).toEqual(put(modifingOrder()));
    //   clone.next();
    //   clone.next(schedule);
    //   clone.next(scheduleTime);
    //   expect(clone.next(currencyDetails).value).toEqual(call(_addItemToExistingOrder, tenantId, siteId, selectedItem, order.orderId, currencyDetails, schedule, scheduleTime));
    //   clone.next(currentCartItems);
    //   expect(clone.next(currentCartItems).value).toEqual(put(modifingOrderSucceeded(currentCartItems)));
    //   expect(clone.next().value).toEqual(put(modifingOrderResolved('ADD')));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('add item to new order', () => {
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next({ item: 'burger' });
    //   clone.next(tenantId);
    //   clone.next(siteId);
    //   clone.next(sitesList);
    //   expect(clone.next(currentCartItems).value).toEqual(put(modifingOrder()));
    //   clone.next();
    //   clone.next(schedule);
    //   clone.next(scheduleTime);
    //   expect(clone.next(currencyDetails).value).toEqual(call(_addItemToNewOrder, tenantId, siteId, selectedItem, currencyDetails, schedule, orderTimeZone, scheduleTime));
    //   clone.next(currentCartItems);
    //   expect(clone.next(currentCartItems).value).toEqual(put(modifingOrderSucceeded(currentCartItems)));
    //   expect(clone.next().value).toEqual(put(modifingOrderResolved('ADD')));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('add item no longer in cart', () => {
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next({ item: 'burger' });
    //   clone.next(tenantId);
    //   clone.next(siteId);
    //   clone.next(sitesList);
    //   expect(clone.next(currentCartItems).value).toEqual(put(modifingOrder()));
    //   clone.next();
    //   clone.next(schedule);
    //   clone.next(scheduleTime);
    //   expect(clone.next(currencyDetails).value).toEqual(call(_addItemToNewOrder, tenantId, siteId, selectedItem, currencyDetails, schedule, orderTimeZone, scheduleTime));
    //   clone.next(currentCartItems[0]);
    //   expect(clone.next([{uniqueId: '45'}]).value).toEqual(put(modifingAddUndo(currentCartItems[0].addedItem.uniqueId, currentCartItems[0].addedItem.lineItemId)));
    //   expect(clone.next().value).toEqual(put(modifingOrderFailed('ADD :: Item No Longer In Cart')));
    //   expect(clone.next().value).toEqual(put(modifingOrderResolved('ADD')));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('add item catch error', () => {
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(order);
    //   clone.next(tenantId);
    //   clone.next(siteId);
    //   clone.next(sitesList);
    //   expect(clone.next(currentCartItems).value).toEqual(put(modifingOrder()));
    //   clone.next();
    //   expect(clone.throw('modify order failed').value).toEqual(put(updateCartOnAddItemFailure(selectedItem)));
    //   expect(clone.next().value).toEqual(put(setAppError(new Error('Failed to add item to the cart , please try again'), 'ERROR_CART_ADD')));
    //   expect(clone.next().value).toEqual(put(modifingOrderFailed('modify order failed')));
    //   expect(clone.next().value).toEqual(put(modifingOrderResolved('ADD')));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('missing tenant id', () => {
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(order);
    //   clone.next();
    //   clone.next(siteId);
    //   clone.next(sitesList);
    //   expect(clone.next().value).toEqual(put(modifingOrderFailed('ADD :: Missing Tenant ID')));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('missing site id', () => {
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(order);
    //   clone.next(tenantId);
    //   clone.next(-1);
    //   clone.next(sitesList);
    //   expect(clone.next().value).toEqual(put(modifingOrderFailed('ADD :: Missing Site ID')));
    //   expect(clone.next().done).toEqual(true);
    // });
  // });

  describe('fetch cart ready saga', () => {
    const generator = cloneableGenerator(fetchCartReadyTimeSaga)(currentCartItems);
    let clone;
    it('ready time success action', () => {
      clone = generator.clone();
      clone.next();
      clone.next(tenantId);
      clone.next(sites);
      clone.next(displayProfileId);
      expect(clone.next().value).toEqual(put(getCartReadyTimeSucceeded()));
      expect(clone.next().done).toEqual(true);
    });

    it('ready time catch error', () => {
      clone = generator.clone();
      clone.next();
      clone.next(tenantId);
      clone.next(sites);
      clone.next(displayProfileId);
      expect(clone.throw('ready time failed').value).toEqual(put(getCartReadyTimeFailed('ready time failed')));
      expect(clone.next().done).toEqual(true);
    });

    it('missing tenant id', () => {
      clone = generator.clone();
      clone.next();
      clone.next();
      clone.next(sites);
      expect(clone.next(displayProfileId).value).toEqual(put(getCartReadyTimeFailed('Missing Tenant ID')));
      expect(clone.next().done).toEqual(true);
    });

    it('cart items not found', () => {
      const generator = cloneableGenerator(fetchCartReadyTimeSaga)([]);
      clone = generator.clone();
      clone.next();
      clone.next(tenantId);
      clone.next(sites);
      expect(clone.next().done).toEqual(true);
    });

    it('should call fetchCartReadyTimesForClosedOrder', () => {
      const generator = cloneableGenerator(fetchCartReadyTimesForClosedOrder)([]);
      clone = generator.clone();
      clone.next();
      expect(clone.next([]).value).toEqual(call(fetchCartReadyTimeSaga, []));
      expect(clone.next().done).toEqual(true);
    });

  });

  describe('complete order saga', () => {
    const saleData = {saleData: {closedOrder: {tipAmount: 10, scheduledTime: '10:14 PM'}}};
    const readyTime = '12';
    const tipAmount = 10;
    const scheduledTime = '10:14 PM';
    const gaPaymentInfo = {
      gaAccountInfo: {},
      indexOfSelectedGAPaymentType: 0
    };
    let clone;
    // it('success action with sale data', () => {
    //   const generator = cloneableGenerator(completeOrder)(saleData);
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(readyTime);
    //   clone.next(tipAmount);
    //   clone.next(scheduledTime);
    //   expect(clone.next(gaPaymentInfo).value).toEqual(put(closeOrder(saleData.saleData, readyTime)));
    //   expect(clone.next().value).toEqual(put(resetDelivery()));
    //   expect(clone.next().value).toEqual(put(resetSmsDetails()));
    //   expect(clone.next().value).toEqual(put(resetTipData()));
    //   expect(clone.next().value).toEqual(put(resetScheduleOrderData()));
    //   expect(clone.next().value).toEqual(put(resetNameDetails()));
    //   expect(clone.next().value).toEqual(put(resetLoyaltyMap()));
    //   expect(clone.next().value).toEqual(put(clearGAState()));
    //   expect(clone.next().done).toEqual(true);
    // });

    // it('success action without sale data', () => {
    //   const generator = cloneableGenerator(completeOrder)({});
    //   clone = generator.clone();
    //   clone.next();
    //   clone.next(readyTime);
    //   clone.next(tipAmount);
    //   clone.next(scheduledTime);
    //   expect(clone.next(gaPaymentInfo).value).toEqual(put(closeOrder(undefined, readyTime)));
    //   expect(clone.next().value).toEqual(put(resetDelivery()));
    //   expect(clone.next().value).toEqual(put(resetSmsDetails()));
    //   expect(clone.next().value).toEqual(put(resetTipData()));
    //   expect(clone.next().value).toEqual(put(resetScheduleOrderData()));
    //   expect(clone.next().value).toEqual(put(resetNameDetails()));
    //   expect(clone.next().value).toEqual(put(resetLoyaltyMap()));
    //   expect(clone.next().value).toEqual(put(clearGAState()));
    //   expect(clone.next().done).toEqual(true);
    // });
  });

  describe('fetch cart ready times for closing order saga', () => {
    const cartItems = [{id: 123, name: 'Test'}];
    const scheduledTime = '10:14 PM';
    let clone;
    it('should not call ready when schedule time enabled', () => {
      const generator = cloneableGenerator(fetchCartReadyTimesForClosingOrder)();
      clone = generator.clone();
      clone.next();
      clone.next(cartItems);
      expect(clone.next(scheduledTime).done).toEqual(true);
    });

    it('should call ready time when schedule time disabled', () => {
      const generator = cloneableGenerator(fetchCartReadyTimesForClosingOrder)({});
      clone = generator.clone();
      clone.next();
      clone.next(cartItems);
      expect(clone.next().value).toEqual(call(fetchCartReadyTimeSaga, cartItems));
      expect(clone.next().done).toEqual(true);
    });
  });

  describe('fetch cart ready times for open cart saga', () => {
    const cartItems = [{id: 123, name: 'Test'}];
    let isCartOpen = true;
    const scheduledTime = '10:14 PM';
    let clone;
    it('should call ready time when schedule time disabled', () => {
      const generator = cloneableGenerator(fetchCartReadyTimesForOpenCart)();
      clone = generator.clone();
      clone.next();
      clone.next(isCartOpen);
      clone.next(cartItems);
      expect(clone.next().value).toEqual(call(fetchCartReadyTimeSaga, cartItems));
      expect(clone.next().done).toEqual(true);
    });

    it('should not call ready when schedule time enabled', () => {
      const generator = cloneableGenerator(fetchCartReadyTimesForOpenCart)();
      clone = generator.clone();
      clone.next();
      clone.next(isCartOpen);
      clone.next(cartItems);
      expect(clone.next(scheduledTime).done).toEqual(true);
    });
  });

  describe('modify cart item saga', () => {
    const cartItem = {id: 123, name: 'Test', count: 1};
    it('should call ADD item', () => {
      const result = {item: {...cartItem, count: cartItem.count, modifierTotal: 0, mealPeriodId: null, uniqueId: 'undefined-test'},
        type: 'MODIFY_CART_ITEM',
        action: 'ADD',
        displayProfileId};
      expect(modifyCartItem(cartItem, 'ADD', displayProfileId)).toEqual(result);
    });
  });

  describe('fetch cart ready time axios', () => {
    const payload = {data: {items: {id: '123', name: 'test'}}};
    it('should fetch Cart ReadyTime', async () => {
      axios.post.mockReturnValue(Promise.resolve(payload));
      const response = await fetchCartReadyTime(tenantId, siteId, payload.data);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/getWaitTimeForItems`, payload.data);
      expect(response).toEqual(payload.data);
    });

    it('should fetchCartReadyTime catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('Ready time not found')));
      try {
        await fetchCartReadyTime(tenantId, siteId, payload.data);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/getWaitTimeForItems`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('Ready time not found'));
      }
    });
  });

  describe('Add Item To NewOrder axios', () => {
    const item = {id: '345', name: 'Test'};
    const orderTimeZone = 'America/Los_Angeles';
    const payload = {item, currencyDetails, schedule, orderTimeZone};
    const mockResponse = {data: {orderNo: '342', item}};
    it('should fetch new order', async () => {
      axios.post.mockReturnValue(Promise.resolve(mockResponse));
      const response = await _addItemToNewOrder(tenantId, siteId, item, currencyDetails, schedule, orderTimeZone);
      expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/orders`, payload);
      expect(response).toEqual(mockResponse.data);
    });

    it('should addItemToNewOrder catch error', async () => {
      axios.post.mockReturnValue(Promise.reject(new Error('Failed to create new order')));
      try {
        await _addItemToNewOrder(tenantId, siteId, item, currencyDetails, schedule, orderTimeZone);
        expect(axios.post).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/orders`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to create new order'));
      }
    });
  });

  describe('Add Item To Existing Order axios', () => {
    const item = {id: '345', name: 'Test'};
    const payload = {item, currencyDetails, schedule};
    const mockResponse = {data: {orderNo: '456', item}};
    // it('should add item to existing order', async () => {
    //   axios.put.mockReturnValue(Promise.resolve(mockResponse));
    //   const response = await _addItemToExistingOrder(tenantId, siteId, item, mockResponse.data.orderNo, currencyDetails, schedule);
    //   expect(axios.put).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/orders/456`, payload);
    //   expect(response).toEqual(mockResponse.data);
    // });

    it('should add item catch error', async () => {
      axios.put.mockReturnValue(Promise.reject(new Error('Failed to add item')));
      try {
        await _addItemToExistingOrder(tenantId, siteId, item, '456', currencyDetails, schedule);
        expect(axios.put).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/orders/456`, payload);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to add item'));
      }
    });
  });

  describe('Remove Item From Order axios', () => {
    const item = {lineItemId: '2345', id: '345', name: 'Test'};
    const mockResponse = {data: {orderNo: '342'}};
    it('should remove item from order', async () => {
      axios.delete.mockReturnValue(Promise.resolve(mockResponse));
      const response = await _removeItemFromOrder(tenantId, siteId, item.lineItemId, mockResponse.data.orderNo);
      expect(axios.delete).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/orders/${mockResponse.data.orderNo}/${item.lineItemId}`);
      expect(response).toEqual(mockResponse.data);
    });

    it('should remove item catch error', async () => {
      axios.delete.mockReturnValue(Promise.reject(new Error('Failed to remove item')));
      try {
        await _removeItemFromOrder(tenantId, siteId, item.lineItemId, mockResponse.data.orderNo);
        expect(axios.delete).toBeCalledWith(`${config.webPaths.api}order/${tenantId}/${siteId}/orders/${mockResponse.data.orderNo}/${item.lineItemId}`);
      } catch (error) {
        expect(error).toEqual(new Error('Failed to remove item'));
      }
    });
  });

  describe('unit test for non export functions', () => {
    const payload = {app: {config: {tenantId: 24}},
      sites: {selectedId: 4, currencyForPay: {}, scheduledTime: 34},
      cart: {readyTime: 45, order: 23, items: [], closedOrder: {items: []}, cartOpen: 12, undoItem: false},
      tip: {tipAmount: 10},
      concept: {list: [{id: 2, schedule: 24}], conceptId: 2}};
    it('should get tenant id', () => {
      expect(getTenantId(payload)).toEqual(payload.app.config.tenantId);
    });
    it('should get selected siteId', () => {
      expect(getSelectedSiteId(payload)).toEqual(payload.sites.selectedId);
    });
    it('should get ready time', () => {
      expect(getReadyTime(payload)).toEqual(payload.cart.readyTime);
    });
    it('should get tip amount', () => {
      expect(getTipAmount(payload)).toEqual(payload.tip.tipAmount);
    });
    it('should get order', () => {
      expect(getOrder(payload)).toEqual(payload.cart.order);
    });
    it('should get cart items', () => {
      expect(getCartItems(payload)).toEqual(payload.cart.items);
    });
    it('should get close order items', () => {
      expect(getClosedOrderItems(payload)).toEqual(payload.cart.closedOrder.items);
    });
    it('should get cart open', () => {
      expect(getCartOpen(payload)).toEqual(payload.cart.cartOpen);
    });
    it('should get undo item', () => {
      expect(getUndoItem(payload)).toEqual(payload.cart.undoItem);
    });
    it('should get currency details', () => {
      expect(getCurrencyDetails(payload)).toEqual(payload.sites.currencyForPay);
    });
    it('should get current schedule', () => {
      expect(getCurrentSchedule(payload)).toEqual(payload.concept.list[0].schedule);
    });
  });

});
