'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { optimizeStrategy } from '@/lib/strategies/optimizer';
import { fixtureCandles } from '@/lib/strategies/candles';
import { STRATEGY_NAMES } from '@/lib/strategies/types';
import type { StrategyId } from '@/store/strategies';

const CANDIDATES = [
  { smaPeriod: 2, emaPeriod: 2 },
  { smaPeriod: 3, emaPeriod: 3 },
  { smaPeriod: 5, emaPeriod: 5 },
];

export function ImproveStrategyPanel() {
  const optimized = optimizeStrategy({
    strategyId: 'fast-ema-sma-cross',
    baseParams: CANDIDATES[0],
    candidates: CANDIDATES,
    candles: fixtureCandles(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Improve Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Best candidate: {STRATEGY_NAMES['fast-ema-sma-cross']}
        </div>
        {optimized.map((item, index) => (
          <div key={index} className="rounded-md border p-3 text-sm">
            <div className="font-semibold">
              SMA {'smaPeriod' in item.params ? item.params.smaPeriod : '--'} / EMA {'emaPeriod' in item.params ? item.params.emaPeriod : '--'}
            </div>
            <div>Win rate: {Math.round(item.result.winRate * 100)}%</div>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          Save improved strategy
        </Button>
      </CardContent>
    </Card>
  );
}