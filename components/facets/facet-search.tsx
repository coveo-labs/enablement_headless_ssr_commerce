"use client";

import { useRef } from "react";

interface FacetSearchProps {
  displayName?: string;
  facetId: string;
  facetSearch: {
    query: string;
    isLoading: boolean;
  };
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearClick: () => void;
}

export default function FacetSearch({
  displayName,
  facetId,
  facetSearch,
  onSearchInputChange,
  onClearClick,
}: FacetSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center space-x-2 mb-2" role="search">
      <label className="text-sm font-medium" htmlFor="facetSearchInput">
        Search:{" "}
      </label>
      <input
        className="flex-grow text-sm px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Search in facet '${displayName ?? facetId}'`}
        id="facetSearchInput"
        onChange={onSearchInputChange}
        ref={inputRef}
        value={facetSearch.query}
      />
      <button
        className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Clear facet search query"
        disabled={facetSearch.query === "" || facetSearch.isLoading}
        onClick={onClearClick}
        type="reset"
      >
        X
      </button>
      {facetSearch.isLoading && <span className="text-sm italic text-gray-600"> Facet search is loading...</span>}
    </div>
  );
}
