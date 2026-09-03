import React from 'react';

interface DefinitionBoxProps {
  title?: string;
  definition: string;
}

export const DefinitionBox: React.FC<DefinitionBoxProps> = ({ title = "CORE DEFINITION", definition }) => {
  return (
    <div className="bg-surface-container-high border border-outline-variant rounded-lg p-md my-md">
      <h4 className="font-label-md text-label-md text-primary mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">menu_book</span>
        {title}
      </h4>
      <p className="font-body-md text-body-md text-on-surface">
        {definition}
      </p>
    </div>
  );
};
