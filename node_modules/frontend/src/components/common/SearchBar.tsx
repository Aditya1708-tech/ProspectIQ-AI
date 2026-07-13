import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search by name, email, or phone...' }) => {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onChange(localVal);
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [localVal, onChange]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4.5 w-4.5 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/60 transition-colors text-sm"
        placeholder={placeholder}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
      />
      {localVal && (
        <button
          onClick={() => setLocalVal('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
};
