// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export const hydrateCartsSelectedModifiersWithLineItemsIdsFromOrder = (cartItem, order) => {
  let result;

  order.lineItems.forEach(lineItem => {
    if (isCartItemAndOrderItemTheSame(cartItem, lineItem)) {
      result = hydrateCartsSelectedModifier(cartItem, lineItem);
    }
  });
  return result;
};

export const isCartItemAndOrderItemTheSame = (cartItem, orderItem) => {
  let a = getNestedIdsFromCartItem(cartItem);
  let b = getNestedIdsFromOrderItem(orderItem);
  return a.every(id => b.includes(id));
};

export const getNestedIdsFromOrderItem = (item) => {
  let results = [];

  if (item.itemId) {
    results.push(item.itemId);
  }

  if (item.groupId) {
    results.push(item.groupId);
  }

  if (item.lineItemGroups && item.lineItemGroups.length > 0) {
    item.lineItemGroups.forEach(item => {
      results = results.concat(getNestedIdsFromOrderItem(item));
    });
  }

  if (item.lineItems && item.lineItems.length > 0) {
    item.lineItems.forEach(item => {
      results = results.concat(getNestedIdsFromOrderItem(item));
    });
  }

  return results;
};

export const getNestedIdsFromCartItem = (item) => {
  let results = [item.id];

  if (item.selectedModifiers) {
    item.selectedModifiers.map(group => {
      let groupId = [group.parentGroupId, group.id];
      let optionIds = [];

      if (group.options) {
        optionIds = [];
        group.options.filter(option => option.selected).forEach(option => {
          if (option.selected) {
            optionIds = optionIds.concat(option.parentGroupId, option.id);
          }
        });
      }
      results = [...results, ...groupId, ...optionIds];
    });
  }
  return results;
};

export const getItemMapFromOrderLineItem = (items) => {
  let results = {};

  items.forEach(item => {

    let id = item.itemId ? item.itemId : item.groupId;
    results[id] = item;

    if (item.lineItemGroups && item.lineItemGroups.length > 0) {
      results = {
        ...results,
        ...getItemMapFromOrderLineItem(item.lineItemGroups)
      };
    }

    if (item.lineItems && item.lineItems.length > 0) {
      results = {
        ...results,
        ...getItemMapFromOrderLineItem(item.lineItems)
      };
    }

  });
  return results;
};

const hydrateCartsSelectedModifier = (cartItem, orderItem) => {

  let itemMap = getItemMapFromOrderLineItem([orderItem]);

  let hydratedCartItem = JSON.parse(JSON.stringify(cartItem));

  if (hydratedCartItem.selectedModifiers) {
    hydratedCartItem.selectedModifiers.forEach(group => {

      if (itemMap[group.id]) {
        group.lineItemId = itemMap[group.id].lineItemId;
      }

      if (group.options) {
        group.options.forEach(option => {
          if (itemMap[option.id]) {
            option.lineItemId = itemMap[option.id].lineItemId;
          }
        });
      }
    });
  };

  hydratedCartItem.lineItemId = itemMap[cartItem.id].lineItemId;

  return hydratedCartItem;
};
