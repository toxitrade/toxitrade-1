'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { runBacktest } from '@/lib/strategies/backtest';
import { fixtureCandles } from '@/lib/strategies/candles';
import type { StrategyId } from '@/store/strategies';
import { STRATEGY_NAMES } from '@/lib/strategies/types';

const STRATEGIES: { id: StrategyId; params: unknown }[] = [
  { id: 'fast-ema-sma-cross', params: { smaPeriod: 2, emaPeriod: 2 } },
  { id: 'multi-momentum', params: { minConfirmations: 3, rsiPeriod: 5, rsiHigh: 70, rsiLow: 30, smaFast: 3, smaSlow: 5, bbPeriod: 5, bbStdDev: 2, enabled: { rsi: true, stoch: false, macd: false, sma: true, bb: false } } },
];

export function BacktestRunner() {
  const [selected, setSelected] = useState<StrategyId>('fast-ema-sma-cross');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof runBacktest> | null>(null);

  const run = () => {
    setRunning(true);
    const strategy = STRATEGIES.find(s => s.id === selected);
    if (!strategy) {
      setRunning(false);
      return;
    }
    const output = runBacktest({
      candles: fixtureCandles(),
      strategyId: strategy.id,
      params: strategy.params,
    });
    setResult(output);
    setRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtest</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {STRATEGIES.map(strategy => (
            <Button
              key={strategy.id}
              variant={selected === strategy.id ? 'default' : 'outline'}
              onClick={() => setSelected(strategy.id)}
            >
              {STRATEGY_NAMES[strategy.id]}
            </Button>
          ))}
        </div>
        <Button onClick={run} disabled={running}>
          {running ? 'Running...' : 'Run Backtest'}
        </Button>
        {result && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-md bg-green-500/10 p-3 text-center">
              <div className="text-2xl font-bold text-green-500">{result.win}</div>
              <div>WIN</div>
            </div>
            <div className="rounded-md bg-red-500/10 p-3 text-center">
              <div className="text-2xl font-bold text-red-500">{result.loss}</div>
              <div>LOSE</div>
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-center">
              <div className="text-2xl font-bold">{Math.round(result.winRate * 100)}%</div>
              <div>RATE</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}