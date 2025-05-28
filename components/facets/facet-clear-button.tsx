interface FacetClearButtonProps {
  onClear: () => void;
}

export default function FacetClearButton({ onClear }: FacetClearButtonProps) {
  const buttonClass =
    "group relative inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-red-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ml-2";

  return (
    <button
      className={buttonClass}
      aria-label="Clear selected facet values"
      onClick={onClear}
      type="reset"
      title="Clear selected facet values"
    >
      <span className="flex items-center space-x-1">
        <svg
          className="w-3 h-3 transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Clear</span>
      </span>
    </button>
  );
}
