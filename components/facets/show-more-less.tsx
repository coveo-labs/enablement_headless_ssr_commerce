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
    "px-4 py-2 border-none rounded bg-gray-200 text-gray-700 text-base cursor-pointer transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex space-x-2 mt-3">
      <button
        aria-label="Show more facet values"
        className={buttonBaseClass}
        disabled={isLoading || !canShowMoreValues}
        onClick={onShowMoreClick}
      >
        +
      </button>
      <button
        aria-label="Show less facet values"
        className={buttonBaseClass}
        disabled={isLoading || !canShowLessValues}
        onClick={onShowLessClick}
      >
        -
      </button>
    </div>
  );
}
