import { renderHook, act } from '@testing-library/react';
import { useBuy } from './useBuy';

describe('useBuy', () => {
  const mockWs = {
    send: jest.fn(),
    isConnected: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not buy if ws is null', async () => {
    const { result } = renderHook(() => useBuy(null, false));
    
    await act(async () => {
      await result.current.buyContract({
        id: 'test-id',
        askPrice: 10,
        payout: 20,
        longcode: 'test',
        minStake: 1,
        maxPayout: 100,
      });
    });

    expect(mockWs.send).not.toHaveBeenCalled();
  });

  it('should send buy request on buyContract call', async () => {
    mockWs.send.mockResolvedValue({ buy: { contract_id: 123, buy_price: 10, payout: 20, longcode: 'test', balance_after: 990 } });
    
    const { result } = renderHook(() => useBuy(mockWs as any, true));

    await act(async () => {
      await result.current.buyContract({
        id: 'test-proposal-id',
        askPrice: 10,
        payout: 20,
        longcode: 'Win test',
        minStake: 1,
        maxPayout: 100,
      });
    });

    expect(mockWs.send).toHaveBeenCalledWith({
      buy: 'test-proposal-id',
      price: '10',
    });
  });

  it('should set buyResult on successful buy', async () => {
    mockWs.send.mockResolvedValue({
      buy: { contract_id: 12345, buy_price: 0.5, payout: 1.95, longcode: 'Win if up', balance_after: 999.5 }
    });

    const { result } = renderHook(() => useBuy(mockWs as any, true));

    await act(async () => {
      await result.current.buyContract({
        id: 'test-id',
        askPrice: 0.5,
        payout: 1.95,
        longcode: 'Win if up',
        minStake: 1,
        maxPayout: 100,
      });
    });

    expect(result.current.buyResult).toEqual({
      contractId: 12345,
      buyPrice: 0.5,
      payout: 1.95,
      longcode: 'Win if up',
      balanceAfter: 999.5,
    });
  });

  it('should set buyError on failed buy', async () => {
    mockWs.send.mockRejectedValue(new Error('Insufficient balance'));

    const { result } = renderHook(() => useBuy(mockWs as any, true));

    await act(async () => {
      await result.current.buyContract({
        id: 'test-id',
        askPrice: 100,
        payout: 200,
        longcode: 'test',
        minStake: 1,
        maxPayout: 100,
      });
    });

    expect(result.current.buyError).toBe('Insufficient balance');
    expect(result.current.buyResult).toBeNull();
  });

  it('should clear results with clearBuyResult', async () => {
    mockWs.send.mockResolvedValue({
      buy: { contract_id: 123, buy_price: 10, payout: 20, longcode: 'test', balance_after: 990 }
    });

    const { result } = renderHook(() => useBuy(mockWs as any, true));

    await act(async () => {
      await result.current.buyContract({
        id: 'test-id',
        askPrice: 10,
        payout: 20,
        longcode: 'test',
        minStake: 1,
        maxPayout: 100,
      });
    });

    expect(result.current.buyResult).not.toBeNull();

    act(() => {
      result.current.clearBuyResult();
    });

    expect(result.current.buyResult).toBeNull();
    expect(result.current.buyError).toBeNull();
  });
});
