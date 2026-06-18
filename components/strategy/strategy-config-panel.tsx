'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_STRATEGIES, type StrategyId } from '@/store/strategies';
import type { IndicatorKey } from '@/lib/strategies/types';

function formatParamValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  return String(value);
}

function getIndicatorLabel(key: IndicatorKey): string {
  return key.toUpperCase();
}

export function StrategyConfigPanel({ strategyId }: { strategyId: StrategyId }) {
  const config = DEFAULT_STRATEGIES[strategyId];

  if (!config) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Strategy values</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <section>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Enabled indicators
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(config.enabled) as IndicatorKey[]).map((indicator) => (
              <Badge key={indicator} variant={config.enabled[indicator] ? 'default' : 'outline'}>
                {getIndicatorLabel(indicator)}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Parameters
          </div>
          <div className="grid gap-2 rounded-md border bg-muted/30 p-3">
            {Object.entries(config.params).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="font-medium capitalize text-foreground">{key}</span>
                <span className="font-mono text-muted-foreground">{formatParamValue(value)}</span>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
