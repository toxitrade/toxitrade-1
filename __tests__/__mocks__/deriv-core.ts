import type { ContractInfo } from '../../packages/core/src/types';

export const mockContractInfo: ContractInfo = {
  barriers: 0,
  contract_category: 'rise_fall',
  contract_type: 'CALL',
  default_stake: 10,
  expiry_type: 'tick',
  last_digit_range: [],
  market: 'synthetic_index',
  max_contract_duration: '10',
  min_contract_duration: '1',
  sentiment: 'neutral',
  submarket: 'random_indices',
  underlying_symbol: 'R_100',
};
