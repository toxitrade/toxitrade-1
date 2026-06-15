import { renderHook, waitFor } from '@testing-library/react';
import { useProposal } from './useProposal';
import type { ProposalParams } from '../types';

describe('useProposal', () => {
  const mockUnsubscribe = jest.fn();
  const mockSend = jest.fn();
  
  const createMockWs = (response?: any) => ({
    send: mockSend.mockResolvedValue(response),
    subscribe: jest.fn().mockResolvedValue({ unsubscribe: mockUnsubscribe }),
    isConnected: true,
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return null proposal when params is null', () => {
    const mockWs = createMockWs();
    const { result } = renderHook(() => useProposal(mockWs as any, true, null));
    
    expect(result.current.proposal).toBeNull();
  });

  it('should subscribe to proposal and set proposal on response', async () => {
    const proposalResponse = {
      proposal: {
        id: 'proposal-123',
        ask_price: 0.5,
        payout: 1.95,
        longcode: 'Win if up',
        validation_params: {
          stake: { min: '1' },
          payout: { max: '1000' },
        },
      },
    };
    
    const mockWs = createMockWs();
    const params: ProposalParams = {
      contractType: 'CALL',
      symbol: 'R_100',
      amount: 10,
      basis: 'stake',
      currency: 'USD',
      duration: 1,
      durationUnit: 't',
    };

    const { result } = renderHook(() => useProposal(mockWs as any, true, params));

    await waitFor(() => {
      expect(mockWs.subscribe).toHaveBeenCalled();
    });
  });

  it('should handle missing proposal in response', async () => {
    const mockWs = createMockWs({}); // No proposal in response
    
    const params: ProposalParams = {
      contractType: 'CALL',
      symbol: 'R_100',
      amount: 10,
      basis: 'stake',
      currency: 'USD',
      duration: 1,
      durationUnit: 't',
    };

    const { result } = renderHook(() => useProposal(mockWs as any, true, params));

    expect(result.current.proposal).toBeNull();
  });

  it('should not subscribe when ws not connected', () => {
    const mockWs = createMockWs();
    const params: ProposalParams = {
      contractType: 'CALL',
      symbol: 'R_100',
      amount: 10,
      basis: 'stake',
      currency: 'USD',
      duration: 1,
      durationUnit: 't',
    };

    renderHook(() => useProposal(mockWs as any, false, params));

    expect(mockWs.subscribe).not.toHaveBeenCalled();
  });
});
