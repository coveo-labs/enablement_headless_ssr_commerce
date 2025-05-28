import React from "react";

interface FacetSearchValueItemProps {
  /** Unique identifier for the checkbox input */
  id: string;
  /** The display text for the facet value */
  value: string;
  /** Number of results for this facet value */
  count: number;
  /** Whether the input should be disabled */
  disabled?: boolean;
  /** Callback when the value is clicked */
  onClick: () => void;
  /** Optional aria-label for accessibility */
  /** Optional children to render inside the label (for highlighting, etc.) */
  children?: React.ReactNode;
  /** Optional additional content to show after the value (e.g., category path) */
  additionalContent?: React.ReactNode;
}

/**
 * Specialized component for facet search result items with consistent styling
 * but optimized for search result interactions (click instead of change)
 */
export default function FacetSearchValueItem({
  id,
  value,
  count,
  disabled = false,
  onClick,
  children,
  additionalContent,
}: FacetSearchValueItemProps) {
  const defaultContainerClasses =
    "flex items-center group cursor-pointer hover:bg-gray-50 transition-colors duration-150 py-2 px-3 rounded-md";
  const defaultCheckboxClasses =
    "mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2";
  const defaultLabelClasses = "flex items-center justify-between w-full text-sm text-gray-700 cursor-pointer";
  const defaultCountClasses = "text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium ml-2";

  const effectiveAriaLabel = `Select facet search result '${value}'`;

  return (
    <li className={defaultContainerClasses} onClick={onClick}>
      <input
        aria-label={effectiveAriaLabel}
        checked={false}
        className={defaultCheckboxClasses}
        disabled={disabled}
        id={id}
        type="checkbox"
        readOnly
      />
      <label htmlFor={id} className={defaultLabelClasses}>
        <div className="flex-grow">
          <span className="font-medium">{children || value}</span>
          {additionalContent}
        </div>
        <span className={defaultCountClasses}>({count})</span>
      </label>
    </li>
  );
}
