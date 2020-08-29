// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import appConfig from 'app.config';
import path from 'path';
import Agilysys, { scheduleUtils, paymentUtils } from 'agilysys.lib';
import Boom from 'boom';
import moment from 'moment-timezone';
import parser from 'cron-parser';
import get from 'lodash.get';

const logger = appConfig.logger.child({ component: path.basename(__filename) });

const getCurrentConceptMenus = (schedule, menus, conceptId, timezone, scheduleTime, daysToAdd) => {
  const lastRunCron = scheduleUtils.getLastScheduledTask(schedule, timezone, scheduleTime, daysToAdd);
  if (lastRunCron && lastRunCron['@c'] !== '.TransitionTask') {
    const currentConceptState = lastRunCron.displayProfileState.conceptStates.find(state => state.conceptId === conceptId);
    const currentMenus = menus.filter(menu => menu.id === (currentConceptState ? currentConceptState.menuId : -1));
    return currentMenus;
  } else {
    return [];
  }
};

const mapItems = (items, tenantId, businessContext, conceptId, storePriceLevel) => {
  return items.map(item => ({
    ...item,
    description: item.longDescription,
    amount: (item.priceLevels && item.priceLevels[storePriceLevel]) ? item.priceLevels[storePriceLevel].price.amount : item.price.amount,
    image: item.itemImages[0] ? appConfig.getPOSImageURL(businessContext,
      item.itemImages[0].fileNames.find(n => n.indexOf('xl') >= 0) || item.itemImages[0].fileNames[item.itemImages[0].fileNames.length > 0 ? item.itemImages[0].fileNames.length - 1 : 0],
      tenantId) : undefined,
    thumbnail: item.itemImages[0] ? appConfig.getPOSImageURL(businessContext,
      item.itemImages[0].fileNames.find(n => n.indexOf('md') >= 0) || item.itemImages[0].fileNames[0],
      tenantId) : undefined,
    options: [],
    attributes: [],
    modifiers: getModifiers(Object.assign({}, item)),
    conceptId
  }));
};

const itemDetailsMapper = (item, tenantId, businessContext, storePriceLevel) => {
  return {
    ...item,
    description: item.longDescription,
    amount: (item.priceLevels && item.priceLevels[storePriceLevel]) ? item.priceLevels[storePriceLevel].price.amount : item.price.amount,
    image: item.itemImages[0] ? appConfig.getPOSImageURL(businessContext,
      item.itemImages[0].fileNames.find(n => n.indexOf('xl') >= 0) || item.itemImages[0].fileNames[item.itemImages.fileNames.length > 0 ? item.itemImages.fileNames.length - 1 : 0],
      tenantId) : undefined,
    thumbnail: item.itemImages[0] ? appConfig.getPOSImageURL(businessContext,
      item.itemImages[0].fileNames.find(n => n.indexOf('md') >= 0) || item.itemImages[0].fileNames[0],
      tenantId) : undefined,
    options: [],
    attributes: [],
    modifiers: getModifiers(Object.assign({}, item), storePriceLevel)
  };
};

const getModifiers = (item, storePriceLevel) => {
  if (item.childGroups && item.childGroups.length > 0) {
    try {
      let modifiers = [];
      item.childGroups.map(group => {
        if (group.isAvailableToGuests && group.childItems && group.childItems.length > 0) {
          let groupData = {};
          groupData.id = group.id;
          groupData.description = group.displayName;
          groupData.type = group.maximum === 1 ? 'radio' : 'checkbox';
          groupData.maximum = group.maximum;
          groupData.minimum = group.minimum;
          groupData.options = group.childItems.filter(childItem => childItem.isAvailableToGuests).map(childItem => {
            let childOptions = {};
            if (childItem.childGroups) {
              childOptions = childItem.childGroups.map(childGroup => {
                let childSubOption = {};
                childSubOption.minimum = childGroup.minimum;
                childSubOption.maximum = childGroup.maximum;
                childSubOption.type = childGroup.maximum === 1 ? 'radio' : 'checkbox';
                childSubOption.options = childGroup.childItems.filter(child => child.isAvailableToGuests).map(child => {
                  // eslint-disable-next-line max-len
                  return { id: child.id, description: child.displayText, selected: false, amount: child.price.amount, parentGroupId: childGroup.id };
                });
                return childSubOption;
              })[0];
            }
            return {
              id: childItem.id,
              description: childItem.displayText,
              selected: false,
              baseAmount: (childItem.priceLevels && childItem.priceLevels[storePriceLevel]) ? childItem.priceLevels[storePriceLevel].price.amount : childItem.price.amount,
              amount: (childItem.priceLevels && childItem.priceLevels[storePriceLevel]) ? childItem.priceLevels[storePriceLevel].price.amount : childItem.price.amount,
              childPriceLevelId: (childItem.priceLevels && childItem.priceLevels[storePriceLevel]) ? childItem.priceLevels[storePriceLevel].priceLevelId : childItem.defaultPriceLevelId,
              parentGroupId: group.id,
              ...childOptions
            };
          });
          modifiers.push(groupData);
        }
      });
      return modifiers.length > 0 ? { modifiers: modifiers, addOnAmount: 0 } : undefined;
    } catch (error) {
      logger.fatal(error);
      return undefined;
    }
  } else {
    return undefined;
  }
};

const getConceptsWithStatus = (schedule, concepts, timezone, scheduleTime, scheduledDay) => {
  const lastRunCron = scheduleUtils.getCurrentAndFutureTask(schedule, timezone, scheduleTime, scheduledDay);
  const isOpenNow = lastRunCron.open && lastRunCron.open['@c'] !== '.TransitionTask';
  if (isOpenNow || lastRunCron.nextSession) {
    const currentDate = scheduleTime ? scheduleUtils.getCustomTime(timezone, scheduleTime.startTime) : scheduleUtils.getCurrentTime(timezone);
    let openTime;
    let closeTime;
    if (isOpenNow) {
      const openInterval = parser.parseExpression(lastRunCron.open.scheduledExpression, { currentDate }).next();
      const closeInterval = parser.parseExpression(lastRunCron.close.scheduledExpression, { currentDate }).next();
      openTime = moment(openInterval._date).year(currentDate.year()).month(currentDate.month()).date(currentDate.date());
      closeTime = moment(closeInterval._date).year(currentDate.year()).month(currentDate.month()).date(currentDate.date());
    }
    return concepts.filter(concept => {
      if (isOpenNow && lastRunCron.open.displayProfileState.conceptStates.find(c => c.conceptId === concept.id) !== undefined) {
        concept.availableNow = true;
        concept.availableAt = {
          open: openTime.format('h:mm a'),
          close: closeTime.format('h:mm a'),
          time: closeTime.diff(currentDate, 'minutes') + 1
        };
        return true;
      }
      return false;
    });
  } else {
    return [];
  }
};

const getMemberChargeFeatureConfig = (memberChargeInfo) => {
  if (!memberChargeInfo) {
    return;
  };
  let tenderList = [];
  for (const property in memberChargeInfo) {
    tenderList.push({
      tenderId: property,
      isEnabled: memberChargeInfo[property].isEnabled
    });
  }
  return tenderList.length > 0 && tenderList.filter(tender => tender.isEnabled === true)[0];
};

const getOrderConfiguration = (displayProfile) => {
  const roomChargeInfo = get(displayProfile, 'displayProfileOptions.roomCharge/paymentIds', '');
  const roomChargeIds = roomChargeInfo && roomChargeInfo.split(',');
  const memberChargeFeatureConfig = getMemberChargeFeatureConfig(get(displayProfile, 'featureConfigurations.paymentConfigurations.INTERACTIVE_ACCOUNT_CHARGING.tenders', ''));
  const memberChargeTenderId = memberChargeFeatureConfig && memberChargeFeatureConfig.tenderId;
  const iframeConfig = paymentUtils.getIframeConfiguration(displayProfile);
  const payOptions = paymentUtils.getPaymentOptions(displayProfile, roomChargeIds);
  const stripeConfig = get(displayProfile, 'featureConfigurations.sitePayments.paymentConfigs', []).find(option => option.type === 'stripe');
  if (stripeConfig && stripeConfig.config) {
    delete stripeConfig.config.secretKey;
  }
  const roomChargeConfig = get(displayProfile, 'featureConfigurations.sitePayments.paymentConfigs', []).find(option => option.type === 'roomCharge');
  const memberChargeConfig = get(displayProfile, 'featureConfigurations.sitePayments.paymentConfigs', []).find(option => option.type === 'memberCharge');
  const loyaltyPaymentConfig = get(displayProfile, 'featureConfigurations.sitePayments.paymentConfigs', []).find(option => option.type === 'loyalty');
  const loyaltyAccrueEnabled = get(displayProfile, 'featureConfigurations.loyaltyConfiguration.featureEnabled', false);
  const paymentLoyaltyEnabled = (loyaltyPaymentConfig && loyaltyPaymentConfig.paymentEnabled);
  const isLoyaltyEnabled = loyaltyAccrueEnabled || paymentLoyaltyEnabled;
  const pay = {
    iFrameApi: get(iframeConfig, 'config.iframeAuth.iFrameApi'),
    paymentsEnabled: get(iframeConfig, 'paymentEnabled'),
    iFrameTenantID: get(iframeConfig, 'config.iframeAuth.iFrameTenantID'),
    clientId: get(iframeConfig, 'config.iframeAuth.clientId'),
    headerText: get(displayProfile, 'featureConfigurations.sitePayments.headerText'),
    instructionText: get(displayProfile, 'featureConfigurations.sitePayments.instructionText'),
    subInstructionText: get(displayProfile, 'featureConfigurations.sitePayments.subInstructionText'),
    payOptions,
    stripeConfig
  };
  const todaySchedulingEnabled = get(displayProfile, 'featureConfigurations.scheduleOrdering.featureEnabled', false);
  const isAsapOrderDisabled = get(displayProfile, 'featureConfigurations.scheduleOrdering.disableAsapOrders', false);
  const isFutureSchedulingEnabled = get(displayProfile, 'featureConfigurations.scheduleOrdering.isFutureSchedulingEnabled', false);
  const aliasNameCaptureEnabled = get(displayProfile, 'featureConfigurations.aliasNameCapture.featureEnabled', false);
  const countryCode = get(displayProfile, 'featureConfigurations.smsOptions.countryCode', '1');
  return {
    pay,
    multiPaymentEnabled: displayProfile.workflowTypeList && displayProfile.workflowTypeList.includes('multi_payment'),
    digitalMenuEnabled: displayProfile.workflowTypeList && displayProfile.workflowTypeList.includes('digital_menu'),
    multiPassEnabled: displayProfile.workflowTypeList && displayProfile.workflowTypeList.includes('on_demand_dine_in'),
    etf: get(displayProfile, 'featureConfigurations.etf'),
    tip: get(displayProfile, 'featureConfigurations.tipConfiguration'),
    deliveryDestination: get(displayProfile, 'featureConfigurations.deliveryDestination'),
    nameCapture: get(displayProfile, aliasNameCaptureEnabled ? 'featureConfigurations.aliasNameCapture' : 'featureConfigurations.nameCapture'),
    aliasNameCaptureEnabled,
    useIgOrderApi: get(displayProfile, 'displayProfileOptions.useIgOrderApi') === 'true',
    conceptLevelIgPosConfig: get(displayProfile, 'displayProfileOptions.isConceptLevelIgposConfigEnabled') === 'true',
    sms: {
      isSmsEnabled: get(displayProfile, 'displayProfileOptions.isSmsEnabled') === 'true',
      isMobileNumberRequired: get(displayProfile, 'displayProfileOptions.isMobileNumberRequired') === 'true',
      smsInstructionText: get(displayProfile, 'displayProfileOptions.smsInstructionText'),
      smsComplianceText: get(displayProfile, 'displayProfileOptions.smsComplianceText'),
      smsHeaderText: get(displayProfile, 'displayProfileOptions.smsHeaderText'),
      countryCode,
      regionCode: get(displayProfile, 'featureConfigurations.smsOptions.regionCode', countryCode === '1' && 'US'),
      countryCodeList: get(displayProfile, 'featureConfigurations.smsOptions.countryCodeList')
    },
    todaySchedulingEnabled,
    isAsapOrderDisabled,
    isFutureSchedulingEnabled,
    futureScheduledDays: isFutureSchedulingEnabled ? get(displayProfile, 'featureConfigurations.scheduleOrdering.futureScheduledDays', 0) : 0,
    isScheduleOrderEnabled: todaySchedulingEnabled || isFutureSchedulingEnabled,
    isLoyaltyEnabled,
    paymentLoyaltyEnabled,
    loyaltyAccrueEnabled,
    loyaltyDetails: get(displayProfile, 'featureConfigurations.loyaltyConfiguration'),
    dateTime: get(displayProfile, 'featureConfigurations.dateTime.dateTimeCulture'),
    orderThrottling: get(displayProfile, 'featureConfigurations.orderThrottling'),
    emailReceipt: get(displayProfile, 'featureConfigurations.emailReceipt'),
    textReceipt: get(displayProfile, 'featureConfigurations.textReceipt'),
    textReceiptFormat: get(displayProfile, 'featureConfigurations.textReceiptFormat'),
    navigation: get(displayProfile, 'featureConfigurations.navigation'),
    printReceipt: get(displayProfile, 'featureConfigurations.printReceipt'),
    dineInConfig: get(displayProfile, 'featureConfigurations.dineInConfig'),
    pickUpConfig: get(displayProfile, 'featureConfigurations.pickUpConfig'),
    profitCenter: get(displayProfile, 'featureConfigurations.profitCenter'),
    checkTypeId: get(displayProfile, 'displayProfileOptions.check-type'),
    roomChargeConfiguration: roomChargeConfig && { resetTime: roomChargeConfig.resetTime, maxAttempts: roomChargeConfig.maxAttempts },
    memberChargeConfiguration: memberChargeConfig && { resetTime: memberChargeConfig.resetTime, maxAttempts: memberChargeConfig.maxAttempts },
    roomChargeIds,
    memberChargeTenderId,
    roomChargeTenderConfig: get(displayProfile, 'featureConfigurations.roomChargeConfig'),
    memberChargeTenderConfig: get(displayProfile, 'featureConfigurations.memberChargeConfig'),
    storePriceLevel: get(displayProfile, 'featureConfigurations.item.priceLevelId'),
    specialInstructions: get(displayProfile, 'featureConfigurations.item.specialInstructions'),
    gaAccountConfig: get(displayProfile, 'featureConfigurations.gaAccountConfig'),
    atriumConfig: get(displayProfile, 'featureConfigurations.paymentConfigurations.CAMPUS_CARD'),
    homeScreen: get(displayProfile, 'featureConfigurations.homeScreen'),
    invalidScreen: get(displayProfile, 'featureConfigurations.invalidScreen'),
    footer: get(displayProfile, 'featureConfigurations.footer'),
    cartScreen: get(displayProfile, 'featureConfigurations.cartScreen'),
    closedScreen: get(displayProfile, 'featureConfigurations.closedScreen'),
    limitItems: get(displayProfile, 'featureConfigurations.cartScreen.limitItems'),
    itemDisplayList: get(displayProfile, 'featureConfigurations.item.displayList')
  };
};

const getStoreInfo = (store, tenantId) => {
  const featureConfigStoredata = get(store, 'displayProfile.featureConfigurations.customizeLocation', {});
  let imageName = store.storeInfo.logoDetails && store.storeInfo.logoDetails.RECEIPT_HEADER.fileName;
  const storeInfo = {
    ...store.storeInfo,
    storeName: store.storeInfo.storeName,
    timezone: store.storeInfo.timezone,
    location: get(store, 'storeInfo.storeInfoOptions.coordinates'),
    taxIdentificationNumber: get(store, 'storeInfo.properties.taxIdentificationNumber')
  };
  if (featureConfigStoredata.featureEnabled) {
    storeInfo.storeName = featureConfigStoredata.locationName;
    storeInfo.address1 = featureConfigStoredata.address1;
    storeInfo.address2 = featureConfigStoredata.address2;
    storeInfo.city = featureConfigStoredata.city;
    storeInfo.state = featureConfigStoredata.state;
    storeInfo.zipCode = featureConfigStoredata.zipCode;
    storeInfo.phoneNumber = featureConfigStoredata.phoneNumber;
    imageName = get(featureConfigStoredata, 'logoDetails.RECEIPT_HEADER.fileName');
  }
  storeInfo.address = [`${storeInfo.address1 || ''} ${storeInfo.address2 || ''}`, `${storeInfo.city || ''} ${storeInfo.state || ''} ${storeInfo.zipCode || ''}`];
  storeInfo.image = appConfig.getPOSImageURL(store.businessContextId, imageName, tenantId);
  return storeInfo;
};

export default {
  getSites: async (credentials) => {
    try {
      const agilysys = new Agilysys(credentials);
      const tenantConfig = agilysys.getTenantConfig();
      const sites = await agilysys.getStoresWithDetails(tenantConfig.storeList);
      return sites.map(site => {
        const storeInfo = getStoreInfo(site, tenantConfig.tenantID);
        const orderConfiguration = getOrderConfiguration(site.displayProfile);
        const todaySchedule = scheduleUtils.getTodaysSchedule(site.schedule, storeInfo.timezone);
        const allConfiguredSchedules = scheduleUtils.getConfiguredSchedule(site.schedule, storeInfo.timezone,
          orderConfiguration.isFutureSchedulingEnabled && orderConfiguration.futureScheduledDays, orderConfiguration.todaySchedulingEnabled);
        let availableAt = scheduleUtils.getTodaysAvailability(todaySchedule, storeInfo.timezone, scheduleUtils.getCurrentConcepts(todaySchedule, site.displayProfile.concepts, storeInfo.timezone).length > 0);
        let allAvailableList = scheduleUtils.getAllDaysAvailability(allConfiguredSchedules, storeInfo.timezone, site.displayProfile.concepts);
        return {
          id: site.businessContextId,
          image: storeInfo.image,
          displayProfileId: site.displayProfile.id,
          displayOptions: site.displayProfile.displayProfileOptions,
          address: storeInfo.address,
          timeZone: storeInfo.timezone,
          availableAt,
          allAvailableList,
          name: storeInfo.storeName,
          profitCenterId: site.profitCenterId,
          platformGuestProfileConfig: site.displayProfile.featureConfigurations.guestProfile,
          postCreditCardsAsExternalPayments: site.displayProfile.featureConfigurations.postCreditCardsAsExternalPayments && site.displayProfile.featureConfigurations.postCreditCardsAsExternalPayments.enabled,
          ...orderConfiguration,
          location: storeInfo.location,
          storeAvailabeNow: site.storeAvailabeNow,
          taxIdentificationNumber: storeInfo.taxIdentificationNumber,
          storeInfo
        };
      });
    } catch (ex) {
      logger.fatal(ex.message);
      return new Boom(ex.message, { statusCode: ex.response.status });
    }
  },
  getConcepts: async (credentials, businessContext, profileId, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const kioskConfiguration = await agilysys.getDetails(businessContext, profileId);
      kioskConfiguration.schedule.tenantId = agilysys.tenant.toString();
      const scheduleTime = payload.scheduleTime;
      const scheduledDay = payload.scheduledDay;
      const timezone = agilysys.getConfiguredStore(businessContext).storeInfo.timezone;
      const todaySchedule = scheduleUtils.getCustomDaySchedule(kioskConfiguration.schedule, timezone, scheduledDay);
      const concepts = kioskConfiguration.displayProfile.concepts.map(concept => {
        return {
          id: concept.id,
          image: appConfig.getPOSImageURL(businessContext, concept.conceptOptions.onDemandConceptLogo, credentials.tenantId),
          name: concept.conceptOptions && concept.conceptOptions.onDemandDisplayText ? concept.conceptOptions.onDemandDisplayText : concept.name,
          description: concept.description,
          conceptOptions: concept.conceptOptions,
          menus: concept.menus,
          schedule: todaySchedule,
          igposApiConfiguration: get(concept, 'featureConfigurations.igposApiConfiguration')
        };
      });
      const currentConcepts = getConceptsWithStatus(todaySchedule, concepts, timezone, scheduleTime, scheduledDay);
      if (currentConcepts.length > 0) {
        return currentConcepts;
      } else {
        return Boom.resourceGone(`Concepts is unavailable. Check Back Later.`);
      }
    } catch (ex) {
      logger.fatal(ex.message);
      return new Boom(ex.message, { statusCode: ex.response && ex.response.status });
    }
  },
  getMenus: async (credentials, businessContext, conceptId, conceptData) => {
    try {
      const agilysys = new Agilysys(credentials);
      const timezone = agilysys.getConfiguredStore(businessContext).storeInfo.timezone;
      const currentMenus = getCurrentConceptMenus(conceptData.schedule, conceptData.menus, conceptId, timezone, conceptData.scheduleTime, conceptData.scheduledDay);
      if (currentMenus.length > 0) {
        return await Promise.all(currentMenus.map(async (menu) => {
          if (menu.items || menu.categories.length === 1) {
            const items = await agilysys.getItems(businessContext, menu.items ? menu.items : menu.categories[0].items);
            const itemsListEmpty = !((!items || items.length === 0));
            return { ...menu, categories: [{ id: '0', name: '', itemsLoaded: true, itemsListEmpty, items: mapItems(items, credentials.tenantId, businessContext, conceptId, conceptData.storePriceLevel) }] };
          } else {
            const categories = await Promise.all(menu.categories.map(async (category, index) => {
              return {
                ...category,
                id: index.toString(),
                itemsLoaded: false,
                image: category.kioskImages[0] ? appConfig.getPOSImageURL(businessContext,
                  category.kioskImages[0].fileNames.find(n => n.indexOf('xl') >= 0) || category.kioskImages[0].fileNames[category.kioskImages[0].fileNames.length - 1],
                  credentials.tenantId) : undefined
              };
            }));
            return { ...menu, categories };
          }
        }));
      } else {
        return Boom.resourceGone(`Menu is unavailable. Check Back Later.`);
      }
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response && ex.response.status });
    }
  },
  getCategoryItems: async (credentials, businessContext, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const items = await agilysys.getItems(businessContext, payload.itemIds);
      return mapItems(items, credentials.tenantId, businessContext, payload.conceptId, payload.storePriceLevel);
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response && ex.response.status });
    }
  },
  getItemDetails: async (credentials, businessContext, itemId, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const item = await agilysys.getItemDetails(businessContext, itemId);
      return itemDetailsMapper(item, credentials.tenantId, businessContext, payload.storePriceLevel);
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response && ex.response.status });
    }
  },
  getProfitCenterDetails: async (credentials, businessContext, profitCenterId) => {
    try {
      const agilysys = new Agilysys(credentials);
      const profitCenterDetails = await agilysys.getProfitCenter(businessContext, profitCenterId);
      return profitCenterDetails.name;
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response.status });
    }
  },
  getProfitCenterId: async (credentials, businessContext) => {
    try {
      const agilysys = new Agilysys(credentials);
      const profitCenter = await agilysys.getProfitCenterId(businessContext);
      return profitCenter.profitCenterId;
    } catch (ex) {
      logger.error('Unable to get Profit Center Id. Please try again.', ex);
      throw ex;
    }
  },
  getRoomChargeDetails: async (credentials, businessContext, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const paymentTypesList = await agilysys.paymentTypes(businessContext);
      const roomChargeDetails = paymentUtils.getRoomChargeDetails(paymentTypesList, payload.roomChargeIds);
      return roomChargeDetails;
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response.status });
    }
  },
  getMemberChargeDetails: async (credentials, businessContext, payload) => {
    try {
      const agilysys = new Agilysys(credentials);
      const paymentTypesList = await agilysys.paymentTypes(businessContext);
      const memberChargeDetails = paymentUtils.getMemberChargeDetails(paymentTypesList, payload.memberChargeId);
      return memberChargeDetails;
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response.status });
    }
  },
  getTaxRuleData: async (credentials, businessContext) => {
    try {
      const agilysys = new Agilysys(credentials);
      const taxRuleData = await agilysys.getTaxRuleData(businessContext);
      return taxRuleData;
    } catch (ex) {
      logger.fatal(ex);
      return new Boom(ex.message, { statusCode: ex.response.status });
    }
  }
};
