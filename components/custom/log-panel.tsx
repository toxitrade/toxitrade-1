'use client';

import { useLog } from './log-context';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const levelColors = {
  error: 'text-red-500',
  warn: 'text-amber-500',
  info: 'text-blue-500',
  log: 'text-foreground',
};

export function LogPanel() {
  const { logs, clear, verbosity, setVerbosity } = useLog();

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Verbosity:</span>
          <Select value={verbosity} onValueChange={(v) => setVerbosity(v as 'log' | 'info' | 'warn' | 'error')}>
            <SelectTrigger className="w-28 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="log">Log (all)</SelectItem>
              <SelectItem value="info">Info+</SelectItem>
              <SelectItem value="warn">Warn+</SelectItem>
              <SelectItem value="error">Error only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="sm" onClick={clear} disabled={logs.length === 0}>
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto font-mono text-xs p-2 bg-muted/30 min-h-[200px]">{logs.length === 0 ? (
          <p className="text-muted-foreground">No logs to display</p>
        ) : (
          <div className="space-y-0.5">
            {logs.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2">
                <span className="text-muted-foreground">[{entry.timestamp}]</span>
                <span className={cn('font-semibold', levelColors[entry.level])}>
                  {entry.level.toUpperCase()}
                </span>
                <span className="break-all">{entry.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}