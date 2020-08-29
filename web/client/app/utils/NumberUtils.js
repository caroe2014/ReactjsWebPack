// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import get from 'lodash.get';
import _ from 'lodash';

export const currencyLocaleFormat = (amount, currencyDetails) => {
  const currencyCultureName = get(currencyDetails, 'currencyCultureName', 'en-US');
  const currencyCode = get(currencyDetails, 'currencyCode', 'USD');
  const currencyDecimalDigits = get(currencyDetails, 'currencyDecimalDigits', 2);
  const currencySymbol = get(currencyDetails, 'currencySymbol', '$');
  const formatter = new Intl.NumberFormat(currencyCultureName, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyDecimalDigits,
    maximumFractionDigits: currencyDecimalDigits
  });

  // Added undefined check for formatToParts function to fix future unit test case failure in node
  return formatter.formatToParts ? formatter.formatToParts(amount).map(part => part.type === 'currency' ? currencySymbol : part.value).join('') // eslint-disable-line max-len
    : formatter.format(amount);
};

export const formatGAAccountNumber = (gaAccountConfig, accountNumber) => {
  let gaAccountNumber = _.cloneDeep(accountNumber);
  let { trimPrecedingCharacters, modifyGaAccountNumber, trimCharacter, trimStart, trimLast, appendStart, appendLast, onDemandOverride } = gaAccountConfig; // eslint-disable-line max-len

  if (onDemandOverride && onDemandOverride.featureEnabled) {
    trimPrecedingCharacters = onDemandOverride.trimPrecedingCharacters;
    modifyGaAccountNumber = onDemandOverride.modifyGaAccountNumber;
    trimCharacter = onDemandOverride.trimCharacter;
    trimStart = onDemandOverride.trimStart;
    trimLast = onDemandOverride.trimLast;
    appendStart = onDemandOverride.appendStart;
    appendLast = onDemandOverride.appendLast;
  }

  if (modifyGaAccountNumber) {
    gaAccountNumber = gaAccountNumber.slice(trimStart,
      gaAccountNumber.length - (trimLast || 0));
  }

  if (trimPrecedingCharacters) {
    let trimPrecedingCharactersPattern = new RegExp('^' + trimCharacter + '+');
    gaAccountNumber = gaAccountNumber.replace(trimPrecedingCharactersPattern, '');
  }

  if (modifyGaAccountNumber) {
    gaAccountNumber = (appendStart || '') + gaAccountNumber + (appendLast || '');
  }
  return gaAccountNumber;
};
