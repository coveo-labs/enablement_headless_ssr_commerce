"use client";

import { RegularFacetState } from "@coveo/headless-react/ssr-commerce";

interface FacetSearchProps extends Omit<RegularFacetState, "type"> {
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
  const controlStyles = "w-8 h-8 bg-gray-200 rounded text-sm flex items-center justify-center flex-shrink-0";
  const buttonHoverStyles = "hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center space-x-2 mb-2" role="search">
      <label className="text-sm font-medium" htmlFor={`facetSearchInput-${facetId}`}>
        Search:{" "}
      </label>
      <input
        className="flex-grow text-sm px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Search in facet '${displayName ?? facetId}'`}
        id={`facetSearchInput-${facetId}`}
        onChange={onSearchInputChange}
        value={facetSearch.query}
      />
      {facetSearch.isLoading ? (
        <div className={controlStyles}>
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <button
          className={`${controlStyles} ${buttonHoverStyles}`}
          aria-label="Clear facet search query"
          disabled={facetSearch.query === ""}
          onClick={onClearClick}
          type="reset"
        >
          X
        </button>
      )}
    </div>
  );
}
