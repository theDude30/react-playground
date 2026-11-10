import { createContext, useContext, useState } from 'react';
import type { Severity } from './types';

type FilterState = {
  text: string;
  setText: (v: string) => void;
  minSeverity: Severity;
  setMinSeverity: (v: Severity) => void;
};

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState('');
  const [minSeverity, setMinSeverity] = useState<Severity>('low');

  return (
    <FilterContext.Provider value={{ text, setText, minSeverity, setMinSeverity }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter outside provider');
  return ctx;
}
