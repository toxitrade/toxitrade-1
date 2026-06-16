'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

interface LogEntry {
  id: number;
  timestamp: string; // HH:mm:ss
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
}

interface LogContextValue {
  logs: LogEntry[];
  log: (level: LogEntry['level'], message: string) => void;
  clear: () => void;
  setVerbosity: (level: LogEntry['level']) => void;
  verbosity: LogEntry['level'];
}

const LogContext = createContext<LogContextValue | null>(null);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [verbosity, setVerbosity] = useState<LogEntry['level']>('log'); // default show all? we'll define order: error > warn > info > log
  const nextId = useRef(0);

  const log = useCallback((level: LogEntry['level'], message: string) => {
    // verbosity levels: error (highest), warn, info, log (lowest)
    const levelPriority = { error: 4, warn: 3, info: 2, log: 1 };
    if (levelPriority[level] < levelPriority[verbosity]) {
      return;
    }
    const now = new Date();
    const timestamp = now.toTimeString().slice(0, 8); // HH:mm:ss
    const entry: LogEntry = {
      id: nextId.current++,
      timestamp,
      level,
      message,
    };
    setLogs(prev => [...prev, entry].slice(-1000)); // keep last 1000 entries
  }, [verbosity]);

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <LogContext.Provider value={{ logs, log, clear, setVerbosity, verbosity }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLog() {
  const context = useContext(LogContext);
  if (context === null) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
}