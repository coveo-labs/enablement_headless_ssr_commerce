import React from "react";

import { RegularFacetValue } from "@coveo/headless-react/ssr-commerce";

interface FacetValueItemProps extends Pick<RegularFacetValue, "value" | "state" | "numberOfResults"> {
  onChange: () => void;
}

export default function FacetValueItem({ value, state, numberOfResults, onChange }: FacetValueItemProps) {
  const checked = state !== "idle";
  const defaultContainerClasses = "flex items-center group";
  const defaultCheckboxClasses =
    "mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2";
  const defaultLabelClasses =
    "flex items-center justify-between w-full text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors duration-150";
  const defaultCountClasses = "text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium";

  const effectiveAriaLabel = `${checked ? "Deselect" : "Select"} facet value '${value}'`;

  return (
    <li className={defaultContainerClasses}>
      <input
        aria-label={effectiveAriaLabel}
        checked={checked}
        className={defaultCheckboxClasses}
        id={`${value}-checkbox`}
        onChange={onChange}
        type="checkbox"
      />
      <label htmlFor={`${value}-checkbox`} className={defaultLabelClasses}>
        <span className="font-medium">{value}</span>
        <span className={defaultCountClasses}>{numberOfResults}</span>
      </label>
    </li>
  );
}

export function SelectedCategoryFacetValueItem({ value, state, numberOfResults, onChange }: FacetValueItemProps) {
  const checked = state !== "idle";
  const containerClasses = "flex items-center group p-3 bg-blue-50 border border-blue-200 rounded-lg";
  const checkboxClasses =
    "mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2";
  const labelClasses = "flex items-center justify-between w-full text-sm text-gray-700 cursor-pointer font-medium";
  const countClasses = "text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium";

  const effectiveAriaLabel = `${checked ? "Deselect" : "Select"} facet value '${value}'`;

  return (
    <li className={containerClasses}>
      <input
        aria-label={effectiveAriaLabel}
        checked={checked}
        className={checkboxClasses}
        id={`${value}-checkbox`}
        onChange={onChange}
        type="checkbox"
      />
      <label htmlFor={`${value}-checkbox`} className={labelClasses}>
        <span className="text-blue-900">{value}</span>
        <span className={countClasses}>{numberOfResults}</span>
      </label>
    </li>
  );
}
