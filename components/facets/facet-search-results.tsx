"use client";

import { CategoryFacetSearchResult, BaseFacetSearchResult } from "@coveo/headless-react/ssr-commerce";
import { ReactNode } from "react";

interface FacetSearchResultsProps {
  query: string;
  children: ReactNode;
}
interface FacetSearchResultListProps<T> {
  values: T[];
  onResultClick: (value: T) => void;
  query: string;
}

function highlightSearchQuery(displayValue: string, query: string): string {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "gi");
  return displayValue.replace(regex, (match) => `<mark>${match}</mark>`);
}

export function CategoryFacetSearchResultsList({
  values,
  onResultClick,
  query,
}: FacetSearchResultListProps<CategoryFacetSearchResult>) {
  return (
    <ul className="mt-2 border-t border-gray-200 pt-2 max-h-60 overflow-y-auto">
      {values.map((value) => (
        <li
          className="py-1 hover:bg-gray-100 cursor-pointer flex items-center"
          key={value.rawValue}
          onClick={() => onResultClick(value)}
        >
          <input
            className="mr-2 h-4 w-4"
            aria-label={`Select facet search result '${value.displayValue}' in category '${value.path.join(" / ")}'`}
            disabled={false}
            id={value.rawValue}
            type="checkbox"
            readOnly
          />
          <label className="flex-grow text-sm" htmlFor={value.rawValue}>
            <span
              className="font-medium"
              dangerouslySetInnerHTML={{
                __html: highlightSearchQuery(value.displayValue, query),
              }}
            />
            {value.path.length > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                {" "}
                <small>in {value.path.join(" > ")}</small>
              </span>
            )}
          </label>
          <span className="text-xs text-gray-500"> ({value.count})</span>
        </li>
      ))}
    </ul>
  );
}

export function RegularFacetSearchResultsList({
  values,
  onResultClick,
  query,
}: FacetSearchResultListProps<BaseFacetSearchResult>) {
  return (
    <ul className="list-none p-0">
      {values.map((value) => (
        <li
          className="cursor-pointer"
          key={value.rawValue}
          onClick={() => onResultClick(value)}
          style={{ width: "fit-content" }}
        >
          <input
            aria-label={`Select facet search result ${value.displayValue}`}
            className="mr-2"
            disabled={false}
            id={value.rawValue}
            type="checkbox"
            readOnly
          />
          <label htmlFor={value.rawValue}>
            <span
              dangerouslySetInnerHTML={{
                __html: highlightSearchQuery(value.displayValue, query),
              }}
            />
          </label>
          <span> ({value.count})</span>
        </li>
      ))}
    </ul>
  );
}

export default function FacetSearchResults({ query, children }: FacetSearchResultsProps) {
  if (!children) {
    return (
      <span className="block text-sm text-gray-600 mt-2">
        No results for <strong>{query}</strong>
      </span>
    );
  }

  return <>{children}</>;
}

export type { BaseFacetSearchResult, CategoryFacetSearchResult };
