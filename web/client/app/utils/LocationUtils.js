// Copyright © 2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.
import _ from 'lodash';
import get from 'lodash.get';
import i18n from 'web/client/i18n';

export const getLocation = (successHandler, errorHandler = undefined) => {
  if (navigator.geolocation) {
    successHandler && navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }
};

export const sortSitesList = (sites = [], currentLatitude = 0, currentLongitude = 0) => {
  const cloneSiteList = _.cloneDeep(sites);
  return cloneSiteList.sort((site1, site2) => {
    if (site1.location && site2.location) {
      const distance1 = site1.location.latitude && site1.location.longitude ? distance(site1.location.latitude, site1.location.longitude, currentLatitude, currentLongitude) : -1; // eslint-disable-line max-len
      const distance2 = site2.location.latitude && site2.location.longitude ? distance(site2.location.latitude, site2.location.longitude, currentLatitude, currentLongitude) : -1; // eslint-disable-line max-len

      if (distance1 < distance2) {
        return -1;
      } else if (distance1 > distance2) {
        return 1;
      }
      return 0;
    } else if (!site1.location && site2.location) {
      return 1;
    }
    return 0;
  });
};

const distance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km (change this constant to get miles - 3956)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const latitudeRad1 = toRad(lat1);
  const latitudeRad2 = toRad(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latitudeRad1) * Math.cos(latitudeRad2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const toRad = (Value) => {
  return Value * Math.PI / 180;
};

export const getDeliveryOptions = (orderConfig) => {
  const deliveryConfig = get(orderConfig, 'deliveryDestination', {});
  const dineInConfig = get(orderConfig, 'dineInConfig', {});
  const pickUpConfig = get(orderConfig, 'pickUpConfig', {});
  const deliveryOptions = [];
  if (dineInConfig.featureEnabled) {
    deliveryOptions.push(getDeliveryOption('dinein', dineInConfig.kitchenText, dineInConfig.buttonText));
  }
  if (pickUpConfig.featureEnabled) {
    deliveryOptions.push(getDeliveryOption('pickup', pickUpConfig.kitchenText, pickUpConfig.buttonText));
  }
  if (deliveryConfig.deliverToDestinationEnabled) {
    deliveryOptions.push(getDeliveryOption('delivery', deliveryConfig.kitchenText || i18n.t('DELIVERY_KITCHEN_TEXT'), deliveryConfig.buttonText || i18n.t('DELIVERY_BUTTON_TEXT'))); // eslint-disable-line max-len
  }
  if (deliveryOptions.length === 0) {
    deliveryOptions.push(getDeliveryOption('dinein', i18n.t('DELIVERY_DINEIN_KITCHEN_TEXT'), i18n.t('DELIVERY_DINEIN_DISPLAY_TEXT'))); // eslint-disable-line max-len
  }
  return deliveryOptions;
};

const getDeliveryOption = (id, kitchenText, displayText) => ({
  id, kitchenText, displayText
});

export const getDeliveryEnabled = (orderConfig) => {
  const deliveryOptions = getDeliveryOptions(orderConfig);
  return (deliveryOptions.length > 1 || (deliveryOptions.length === 1 && deliveryOptions[0].id === 'delivery'));
};

export const getLoyaltyList = (loyaltyData) => {
  let loyaltyPayment = [];
  const hostCompVoucherList = loyaltyData.hostCompVoucherPayments && loyaltyData.hostCompVoucherPayments.length > 0 ? loyaltyData.hostCompVoucherPayments : []; // eslint-disable-line max-len
  if (hostCompVoucherList.length > 0) {
    hostCompVoucherList.map(hostCompVoucher => {
      hostCompVoucher.isHostComp = true;
      loyaltyPayment.push(hostCompVoucher);
    });
  }
  const loyaltyAccounts = loyaltyData.loyaltyProcess.loyaltyLinkedAccounts;
  if (loyaltyAccounts && loyaltyAccounts.length > 0) {
    loyaltyAccounts.forEach(loyaltyAccount => {
      loyaltyAccount.loyaltyAccountTiers.forEach(loyaltyAccountTier => {
        loyaltyAccountTier.voucherSummaries && loyaltyAccountTier.voucherSummaries.map(voucherSummarie => {
          voucherSummarie.paymentResponse && loyaltyPayment.push(voucherSummarie);
        });
        loyaltyAccountTier.pointsSummaries && loyaltyAccountTier.pointsSummaries.find(pointsSummarie => {
          pointsSummarie.paymentResponse && loyaltyPayment.push(pointsSummarie);
        });
      });
    });
  }
  return loyaltyPayment;
};
