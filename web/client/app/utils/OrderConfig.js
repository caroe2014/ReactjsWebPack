// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

export const getOrderConfigurationDetails = (items, storesList, displayProfileId, contextId = undefined) => {
  if (!items || items.length === 0 || !storesList || storesList.length === 0) return;
  return getOrderConfigurationDetailsWithContextId(items[0].contextId || contextId, displayProfileId, storesList);
};

export const getOrderConfigurationDetailsWithContextId = (contextId, displayProfileId, storesList) => {
  const selectedSite = storesList.find(list => list.id === contextId && list.displayProfileId === displayProfileId);
  return {
    siteId: selectedSite.id,
    displayProfileId,
    deliveryDestination: selectedSite.deliveryDestination,
    tip: selectedSite.tip,
    pay: selectedSite.pay,
    sms: selectedSite.sms,
    nameCapture: selectedSite.nameCapture,
    aliasNameCaptureEnabled: selectedSite.aliasNameCaptureEnabled,
    useIgOrderApi: selectedSite.useIgOrderApi,
    conceptLevelIgPosConfig: selectedSite.conceptLevelIgPosConfig,
    storeName: selectedSite.name,
    etf: selectedSite.etf,
    dateTime: selectedSite.dateTime,
    orderThrottling: selectedSite.orderThrottling,
    emailReceipt: selectedSite.emailReceipt,
    textReceipt: selectedSite.textReceipt,
    textReceiptFormat: selectedSite.textReceiptFormat,
    navigation: selectedSite.navigation,
    printReceipt: selectedSite.printReceipt,
    multiPaymentEnabled: selectedSite.multiPaymentEnabled,
    digitalMenuEnabled: selectedSite.multiPaymentEnabled,
    dineInConfig: selectedSite.dineInConfig,
    pickUpConfig: selectedSite.pickUpConfig,
    promptPaymentEnabled: selectedSite.promptPaymentEnabled,
    profitCenter: selectedSite.profitCenter,
    platformGuestProfileConfig: selectedSite.platformGuestProfileConfig,
    roomChargeConfiguration: selectedSite.roomChargeConfiguration,
    roomChargeTenderConfig: selectedSite.roomChargeTenderConfig,
    memberChargeTenderConfig: selectedSite.memberChargeTenderConfig,
    memberChargeConfiguration: selectedSite.memberChargeConfiguration,
    timeZone: selectedSite.timeZone,
    displayOptions: selectedSite.displayOptions,
    taxIdentificationNumber: selectedSite.taxIdentificationNumber,
    taxRuleData: selectedSite.taxRuleData,
    loyaltyDetails: selectedSite.loyaltyDetails,
    paymentLoyaltyEnabled: selectedSite.paymentLoyaltyEnabled,
    storePriceLevel: selectedSite.storePriceLevel,
    loyaltyAccrueEnabled: selectedSite.loyaltyAccrueEnabled,
    gaAccountConfig: selectedSite.gaAccountConfig,
    atriumConfig: selectedSite.atriumConfig,
    cartScreen: selectedSite.cartScreen,
    invalidScreen: selectedSite.invalidScreen,
    footer: selectedSite.footer,
    storeInfo: selectedSite.storeInfo
  };
};
