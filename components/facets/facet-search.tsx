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
  const controlStyles =
    "w-8 h-8 bg-white border border-gray-300 rounded-md shadow-sm flex items-center justify-center flex-shrink-0";
  const buttonHoverStyles =
    "group hover:bg-red-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300";

  return (
    <div className="flex items-center space-x-2 mb-2" role="search">
      <label className="text-sm font-medium" htmlFor={`facetSearchInput-${facetId}`}>
        Filter values:{" "}
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
        facetSearch.query && (
          <button
            className={`${controlStyles} ${buttonHoverStyles}`}
            aria-label="Clear facet search query"
            onClick={onClearClick}
            type="reset"
          >
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )
      )}
    </div>
  );
}
