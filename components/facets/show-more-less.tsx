"use client";

interface FacetShowMoreLessProps {
  onShowMoreClick?: () => void;
  onShowLessClick?: () => void;
  isLoading: boolean;
  canShowMoreValues: boolean;
  canShowLessValues: boolean;
}

export default function FacetShowMoreLess({
  onShowLessClick,
  onShowMoreClick,
  canShowLessValues,
  canShowMoreValues,
  isLoading,
}: FacetShowMoreLessProps) {
  const buttonBaseClass =
    "group relative inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:shadow-sm";

  return (
    <div className="flex items-center space-x-3 mt-4">
      <button
        aria-label="Show more facet values"
        className={buttonBaseClass}
        disabled={isLoading || !canShowMoreValues}
        onClick={onShowMoreClick}
      >
        <span className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Show more</span>
        </span>
      </button>
      <button
        aria-label="Show less facet values"
        className={buttonBaseClass}
        disabled={isLoading || !canShowLessValues}
        onClick={onShowLessClick}
      >
        <span className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
          <span>Show less</span>
        </span>
      </button>
    </div>
  );
}
