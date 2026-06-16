'use client';

import { useLog } from '@/components/custom/log-context';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LogPanel() {
  const { logs, verbosity, setVerbosity, clear } = useLog();

  const handleClear = () => {
    clear();
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-[rgb(18,18,18)] text-[rgb(220,220,220)] font-mono text-sm overflow-auto">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold">Console Log</h2>
        <div className="flex items-center gap-2">
          <label className="text-[rgb(150,150,150)]">Verbosity: </label>
          <Select
            value={verbosity}
            onValueChange={setVerbosity}
            className="w-[100px]"
          >
            <SelectItem value="log">Log</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warn</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </Select>
          <Button onClick={handleClear} variant="outline" size="xs">
            Clear
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {logs.map((entry) => (
          <div key={entry.id} className="flex items-start gap-2 mb-1">
            <span className="w-12 text-[rgb(150,150,150)]">{entry.timestamp}</span>
            <span
              className={`text-[rgb(
                ${entry.level === 'error' ? '255,85,85' :
                entry.level === 'warn' ? '255,180,85' :
                entry.level === 'info' ? '85,180,255' :
                '220,220,220'
              )}]`}
            >
              [{entry.level.toUpperCase()}] {entry.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-[rgb(150,150,150)] italic">No logs yet.</div>
        )}
      </div>
    </div>
  );
}