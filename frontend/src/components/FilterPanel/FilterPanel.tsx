import React from 'react';

export interface FilterOption {
  key: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
}

interface FilterPanelProps {
  filters: FilterOption[];
  onChange: (key: string, value: string) => void;
  onApply?: () => void;
  onReset?: () => void;
  title?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onApply,
  onReset,
  title = "Quick Filters"
}) => {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-[0px_4px_20px_rgba(15,23,42,0.05)] mb-lg">
      <div className="flex items-center justify-between mb-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">filter_list</span>
          {title}
        </h3>
        {onReset && (
          <button
            onClick={onReset}
            className="text-caption font-caption text-secondary hover:underline"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-sm">
        {filters.map((f) => (
          <div key={f.key} className="flex flex-col">
            <label className="font-caption text-caption text-on-surface-variant font-semibold mb-1">
              {f.label}
            </label>
            <select
              value={f.value}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary"
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {onApply && (
        <div className="mt-md flex justify-end">
          <button
            onClick={onApply}
            className="h-[44px] px-md bg-secondary text-white font-label-md text-label-md rounded-lg hover:bg-secondaryContainer transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};
