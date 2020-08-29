// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import i18n from 'web/client/i18n';

export const getVatEntriesFromOrderedItems = (order, taxRuleData) => {
  const vatEntries = [];
  vatEntries.push({
    label: i18n.t('TAX_NET_LABEL'),
    amount: parseFloat(order.taxExcludedTotalAmount.amount)
  });

  order.taxBreakdown.vatTaxes.forEach(vatData => {
    vatEntries.push({
      label: vatData.taxClassName,
      amount: vatData.taxAmount
    });
  });

  vatEntries.push({
    label: i18n.t('TAX_GROSS_LABEL'),
    amount: parseFloat(order.taxIncludedTotalAmount.amount)
  });

  return vatEntries;
};
