"use client";

import { CategoryFacetSearchResult, BaseFacetSearchResult } from "@coveo/headless-react/ssr-commerce";
import { ReactNode } from "react";
import FacetSearchValueItem from "./facet-search-value-item";

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
    <ul className="mt-2 border-t border-gray-200 pt-2 max-h-60 overflow-y-auto space-y-1">
      {values.map((value) => (
        <FacetSearchValueItem
          key={value.rawValue}
          id={value.rawValue}
          value={value.displayValue}
          count={value.count}
          onClick={() => onResultClick(value)}
          additionalContent={
            value.path.length > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                {" "}
                <small>in {value.path.join(" > ")}</small>
              </span>
            )
          }
        >
          <span
            dangerouslySetInnerHTML={{
              __html: highlightSearchQuery(value.displayValue, query),
            }}
          />
        </FacetSearchValueItem>
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
    <ul className="list-none p-0 space-y-1">
      {values.map((value) => (
        <FacetSearchValueItem
          key={value.rawValue}
          id={value.rawValue}
          value={value.displayValue}
          count={value.count}
          onClick={() => onResultClick(value)}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: highlightSearchQuery(value.displayValue, query),
            }}
          />
        </FacetSearchValueItem>
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
