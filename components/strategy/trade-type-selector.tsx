'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STRATEGY_NAMES, STRATEGY_IDS, type StrategyId } from '@/lib/strategies/types';

interface TradeTypeSelectorProps {
  value: 'manual' | 'bot';
  onChange: (value: 'manual' | 'bot') => void;
}

export function TradeTypeSelector({ value, onChange }: TradeTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Trade type</label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as 'manual' | 'bot')}
        className="grid grid-cols-2 gap-2"
      >
        <ToggleGroupItem value="manual">Manual</ToggleGroupItem>
        <ToggleGroupItem value="bot">Bot</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

interface StrategySelectorProps {
  value: StrategyId;
  onChange: (value: StrategyId) => void;
}

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Strategy</label>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as StrategyId)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select strategy" />
        </SelectTrigger>
        <SelectContent>
          {STRATEGY_IDS.map((strategyId) => (
            <SelectItem key={strategyId} value={strategyId}>
              {STRATEGY_NAMES[strategyId]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}