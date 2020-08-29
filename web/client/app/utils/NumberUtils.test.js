'use strict';

import { currencyLocaleFormat, formatGAAccountNumber } from './NumberUtils';

describe('NumberUtils', function () {

  let amount = 10;
  let currencyDetails = {
    currencyCultureName: 'en-US',
    currencyCode: 'USD',
    currencyDecimalDigits: 2,
    currencySymbol: '$'
  };
  it('should return if format is available', function () {
    expect(currencyLocaleFormat(amount, currencyDetails)).toEqual('$10.00');
  });
  describe('getOrderConfigurationDetails', function () {
    beforeEach(() => {
      global.Intl = {
        NumberFormat: () => {
          return {
            format: () => '$10.00',
            formatToParts: () => {
              let obj = [{
                type: 'currency',
                value: '10.00'
              }];
              return obj;
            }
          };
        }
      };
    });
    it('should return if formatToParts is available', function () {
      expect(currencyLocaleFormat(amount, currencyDetails)).toEqual('$');
    });
  });
  describe('getOrderConfigurationDetails', function () {
    beforeEach(() => {
      global.Intl = {
        NumberFormat: () => {
          return {
            format: () => '$10.00',
            formatToParts: () => {
              let obj = [{
                type: 'number',
                value: '10.00'
              }];
              return obj;
            }
          };
        }
      };
    });
    it('should return if formatToParts is available', function () {
      expect(currencyLocaleFormat(amount, currencyDetails)).toEqual('10.00');
    });
  });

  describe('formatGAAccountNumber', () => {
    const getGAAccountConfig = (trimPrecedingCharacters, modifyGaAccountNumber, trimStart, trimLast, trimCharacter, appendStart, appendLast) => {
      return {
        trimPrecedingCharacters,
        modifyGaAccountNumber,
        trimStart,
        trimLast,
        trimCharacter,
        appendStart,
        appendLast
      };
    };
    const gaAccountNumber = '7701013879509080';
    
    it('not change GAAccountNumber when trimPreceding and modifyGAAccount are false', () => {
      const gaAccountConfig = getGAAccountConfig(false, false, 2, 1, '0', '123', '234');

      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(gaAccountNumber);
    });

    it('should trimPrecedingCharacters if there is a trimPrecedingCharacters pattern that matches', () => {
      const gaAccountConfig = getGAAccountConfig(true, false, 2, 1, '7', '123', '234');

      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(gaAccountNumber.slice(2, gaAccountNumber.length));
    });

    it('should trimStart and trimLast if modifyGAAccountNumber if it is set to true', () => {
      const gaAccountConfig = getGAAccountConfig(false, true, 2, 1, '', '', '');

      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(gaAccountNumber.slice(2, gaAccountNumber.length - 1));
    });

    it('should appendStart and appendLast after trimStart and trimLast', () => {
      const gaAccountConfig = getGAAccountConfig(false, true, 2, 1, '', 'A', 'B');

      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`A${gaAccountNumber.slice(2, gaAccountNumber.length - 1)}B`);
    });

    it('should trimPreceding after trimStart and trimLast', () => {
      const gaAccountConfig = getGAAccountConfig(true, true, 4, 0, '0', '', '');

      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`${gaAccountNumber.slice(5, gaAccountNumber.length)}`);
    });

    it('should trimStart/last, then trimPreceding, then append', () => {
      const gaAccountConfig = getGAAccountConfig(true, true, 4, 0, '0', 'A', 'B');

      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`A${gaAccountNumber.slice(5, gaAccountNumber.length)}B`);
    });

    it('should use onDemandOverride logic if featureEabled is true', () => {
      let gaAccountConfig = getGAAccountConfig(true, true, 3, 0, '0', 'a', 'b');
      gaAccountConfig.onDemandOverride = {
        featureEnabled: true,
        trimPrecedingCharacters: true,
        modifyGaAccountNumber: true,
        trimStart: 4,
        trimLast: 0,
        trimCharacter: '0',
        appendStart: 'A',
        appendLast: 'B'
      };
      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).not.toEqual(`a${gaAccountNumber.slice(3, gaAccountNumber.length)}b`);
      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`A${gaAccountNumber.slice(5, gaAccountNumber.length)}B`);
    });

    it('should not use onDemandOverride logic if featureEabled is false', () => {
      let gaAccountConfig = getGAAccountConfig(true, true, 3, 0, '0', 'a', 'b');
      gaAccountConfig.onDemandOverride = {
        featureEnabled: false,
        trimPrecedingCharacters: true,
        modifyGaAccountNumber: true,
        trimStart: 4,
        trimLast: 0,
        trimCharacter: '0',
        appendStart: 'A',
        appendLast: 'B'
      };
      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`a${gaAccountNumber.slice(3, gaAccountNumber.length)}b`);
      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).not.toEqual(`A${gaAccountNumber.slice(5, gaAccountNumber.length)}B`);
    });

    it('should not use onDemandOverride logic if onDemandOverride does not exist (undefined)', () => {
      let gaAccountConfig = getGAAccountConfig(true, true, 2, 0, '0', 'a', 'b');
      gaAccountConfig.onDemandOverride = undefined;
      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`a${gaAccountNumber.slice(3, gaAccountNumber.length)}b`);
    });

    it('should not use onDemandOverride logic if onDemandOverride does not exist (null) ', () => {
      let gaAccountConfig = getGAAccountConfig(true, true, 2, 0, '0', 'a', 'b');
      gaAccountConfig.onDemandOverride = null;
      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`a${gaAccountNumber.slice(3, gaAccountNumber.length)}b`);
    });

    it('should not use onDemandOverride logic if onDemandOverride does not exist ({}) ', () => {
      let gaAccountConfig = getGAAccountConfig(true, true, 2, 0, '0', 'a', 'b');
      gaAccountConfig.onDemandOverride = {};
      expect(formatGAAccountNumber(gaAccountConfig, gaAccountNumber)).toEqual(`a${gaAccountNumber.slice(3, gaAccountNumber.length)}b`);
    });
  });

});
