// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import mockCartItem from './mocks/cartItem'
import mockOrderLineItem from './mocks/orderLineItem'

import * as toCartUtils from './toCart'

describe('Agilysys Utils', () => {

  it('should getNestedIdsFromOrderItem', () => {
    let ids = toCartUtils.getNestedIdsFromOrderItem(mockOrderLineItem);
    expect(ids).toEqual(['LID-cheeseburger-1', 'GID-make-it-a-combo', 'LID-add-a-fit-side', 'GID-fit-combo', 'LID-fit-grain-salad', 'GID-add-vegetable', 'LID-red-onions']);
  })

  it('should getNestedIdsFromCartItem', () => {
    let ids = toCartUtils.getNestedIdsFromCartItem(mockCartItem)
    expect(ids).toEqual(['LID-cheeseburger-1', 'GID-make-it-a-combo', 'LID-add-a-fit-side', 'GID-fit-combo', 'LID-fit-grain-salad', 'GID-add-vegetable', 'LID-red-onions']);
  })

  it('hydrate cartItems with lineItemIds from order', () => {
    const mockOrder = { lineItems:[mockOrderLineItem] }
    let hydrated = toCartUtils.hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder(mockCartItem, mockOrder)

    expect(hydrated.lineItemId).toEqual('5c3cea2e-344b-4a48-8a8f-50ed5e2ce857')
    expect(hydrated.selectedModifiers.length).toBe(2);
    expect(hydrated.selectedModifiers[0].lineItemId).toEqual('7688a1d3-4795-4f4a-a27a-2f110351b631')
    expect(hydrated.selectedModifiers[0].options[0].lineItemId).toEqual('c9150f59-9847-4653-81c8-423b244e158c')
    expect(hydrated.selectedModifiers[1].lineItemId).toEqual('8b970e86-9edd-4791-8d42-1c018871ce41')
  })

  it('should create item map from orer', () => {
    let map = toCartUtils.getItemMapFromOrderLineItem([mockOrderLineItem])

    expect(map['LID-cheeseburger-1']).toEqual(mockOrderLineItem);
    expect(map['GID-make-it-a-combo']).toEqual(mockOrderLineItem.lineItemGroups[0]);
    expect(map['LID-add-a-fit-side']).toEqual(mockOrderLineItem.lineItemGroups[0].lineItems[0]);
    expect(map['GID-fit-combo']).toEqual(mockOrderLineItem.lineItemGroups[0].lineItems[0].lineItemGroups[0]);
    expect(map['LID-fit-grain-salad']).toEqual(mockOrderLineItem.lineItemGroups[0].lineItems[0].lineItemGroups[0].lineItems[0]);
    expect(map['GID-add-vegetable']).toEqual(mockOrderLineItem.lineItemGroups[1]);
    expect(map['LID-red-onions']).toEqual(mockOrderLineItem.lineItemGroups[1].lineItems[0]);

    expect(Object.keys(map).length).toBe(7)

  });

})
