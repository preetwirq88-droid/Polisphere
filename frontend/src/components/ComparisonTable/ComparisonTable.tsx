import React from 'react';
import { ComparisonTable as ComparisonTableType } from '../../api/notes';

interface ComparisonTableProps {
  data: ComparisonTableType;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  if (!data || !data.columns || data.columns.length === 0) return null;

  return (
    <div id="comparison" className="my-lg overflow-x-auto border border-outline-variant rounded-xl bg-surface-container-lowest p-md shadow-sm">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">analytics</span>
        {data.title || "Comparative Matrix"}
      </h3>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b-2 border-outline-variant bg-surface-container-low">
            <th className="p-3 font-label-md text-label-md text-primary">Concept / Aspect</th>
            {data.columns.map((col, idx) => (
              <th key={idx} className="p-3 font-label-md text-label-md text-primary font-bold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/60 font-body-md text-body-md text-on-surface">
          {data.rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-surface-container/40 transition-colors">
              <td className="p-3 font-semibold text-primary bg-surface-container-low/30">{row.label}</td>
              {row.values.map((val, vIdx) => (
                <td key={vIdx} className="p-3 text-on-surface-variant">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
