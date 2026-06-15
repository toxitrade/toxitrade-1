import { getDurationOptions, computeEndTimeEpoch, parseTradingDays, getEarlyCloseDates, parseCloseTime } from './duration-utils';
import type { ContractInfo } from '@deriv/core';

describe('duration-utils', () => {
  describe('getDurationOptions', () => {
    it('should return tick option for tick contracts', () => {
      const contracts: ContractInfo[] = [
        {
          contract_type: 'CALL',
          min_contract_duration: '1',
          max_contract_duration: '10',
          expiry_type: 'tick',
          barriers: 0,
          contract_category: 'rise_fall',
          default_stake: 10,
          last_digit_range: [],
          market: 'synthetic_index',
          sentiment: 'neutral',
          submarket: 'random_indices',
          underlying_symbol: 'R_100',
        },
      ];
      const options = getDurationOptions(contracts);
      expect(options).toHaveLength(1);
      expect(options[0]).toEqual({
        unit: 't',
        label: 'Ticks',
        min: 1,
        max: 10,
      });
    });

    it('should return intraday options for intraday contracts', () => {
      const contracts: ContractInfo[] = [
        {
          contract_type: 'CALL',
          min_contract_duration: '60',
          max_contract_duration: '3600',
          expiry_type: 'intraday',
          barriers: 0,
          contract_category: 'rise_fall',
          default_stake: 10,
          last_digit_range: [],
          market: 'synthetic_index',
          sentiment: 'neutral',
          submarket: 'random_indices',
          underlying_symbol: 'R_100',
        },
      ];
      const options = getDurationOptions(contracts);
      expect(options).toHaveLength(2);
      expect(options.find(o => o.unit === 'm')).toBeDefined();
      expect(options.find(o => o.unit === 'h')).toBeDefined();
    });

    it('should return daily and end-time options for daily contracts', () => {
      const contracts: ContractInfo[] = [
        {
          contract_type: 'CALL',
          min_contract_duration: '1',
          max_contract_duration: '365',
          expiry_type: 'daily',
          barriers: 0,
          contract_category: 'rise_fall',
          default_stake: 10,
          last_digit_range: [],
          market: 'synthetic_index',
          sentiment: 'neutral',
          submarket: 'random_indices',
          underlying_symbol: 'R_100',
        },
      ];
      const options = getDurationOptions(contracts);
      expect(options.find(o => o.unit === 'd')).toBeDefined();
      expect(options.find(o => o.unit === 'end-time')).toBeDefined();
    });

    it('should maintain correct order of options', () => {
      const contracts: ContractInfo[] = [
        { 
          contract_type: 'CALL', 
          min_contract_duration: '1', 
          max_contract_duration: '10', 
          expiry_type: 'tick',
          barriers: 0,
          contract_category: 'rise_fall',
          default_stake: 10,
          last_digit_range: [],
          market: 'synthetic_index',
          sentiment: 'neutral',
          submarket: 'random_indices',
          underlying_symbol: 'R_100',
        },
        { 
          contract_type: 'CALL', 
          min_contract_duration: '60', 
          max_contract_duration: '3600', 
          expiry_type: 'intraday',
          barriers: 0,
          contract_category: 'rise_fall',
          default_stake: 10,
          last_digit_range: [],
          market: 'synthetic_index',
          sentiment: 'neutral',
          submarket: 'random_indices',
          underlying_symbol: 'R_100',
        },
        { 
          contract_type: 'CALL', 
          min_contract_duration: '1', 
          max_contract_duration: '365', 
          expiry_type: 'daily',
          barriers: 0,
          contract_category: 'rise_fall',
          default_stake: 10,
          last_digit_range: [],
          market: 'synthetic_index',
          sentiment: 'neutral',
          submarket: 'random_indices',
          underlying_symbol: 'R_100',
        },
      ];
      const options = getDurationOptions(contracts);
      const units = options.map(o => o.unit);
      expect(units.indexOf('t')).toBeLessThan(units.indexOf('m'));
      expect(units.indexOf('m')).toBeLessThan(units.indexOf('d'));
      expect(units.indexOf('d')).toBeLessThan(units.indexOf('end-time'));
    });
  });

  describe('computeEndTimeEpoch', () => {
    it('should return null for invalid inputs', () => {
      expect(computeEndTimeEpoch(undefined, '')).toBeNull();
      expect(computeEndTimeEpoch(new Date(), '')).toBeNull();
      expect(computeEndTimeEpoch(undefined, '10:00')).toBeNull();
      expect(computeEndTimeEpoch(new Date(), 'invalid')).toBeNull();
    });

    it('should compute correct epoch for valid future inputs', () => {
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      const epoch = computeEndTimeEpoch(tomorrow, '10:30');
      expect(epoch).not.toBeNull();
      const expectedEpoch = Math.floor(Date.UTC(
        tomorrow.getUTCFullYear(),
        tomorrow.getUTCMonth(),
        tomorrow.getUTCDate(),
        10, 30, 0, 0
      ) / 1000);
      expect(epoch).toBe(expectedEpoch);
    });

    it('should return null for past time', () => {
      const pastDate = new Date(Date.now() - 86400000 * 2);
      expect(computeEndTimeEpoch(pastDate, '10:00')).toBeNull();
    });
  });

  describe('parseTradingDays', () => {
    it('should return non-trading days', () => {
      const tradingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const nonTrading = parseTradingDays(tradingDays);
      expect(nonTrading).toContain(0);
      expect(nonTrading).toContain(6);
      expect(nonTrading).not.toContain(1);
    });
  });

  describe('getEarlyCloseDates', () => {
    it('should filter early close events for correct month', () => {
      const events = [
        { dates: '2026-1-15', descrip: 'Market closes early (at 12:00)' },
        { dates: '2026-2-20', descrip: 'Market closes early (at 13:00)' },
      ];
      const month = new Date(2026, 0, 10);
      const dates = getEarlyCloseDates(events, month);
      expect(dates).toHaveLength(1);
      expect(dates[0].getMonth()).toBe(0);
    });
  });

  describe('parseCloseTime', () => {
    it('should parse close time correctly', () => {
      expect(parseCloseTime(['16:30:00'])).toBe('16:30:00');
      expect(parseCloseTime(['9:30'])).toBe('09:30:00');
      expect(parseCloseTime([])).toBe('');
    });
  });
});
