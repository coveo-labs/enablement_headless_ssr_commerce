"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePagination } from "@/lib/commerce-engine";

export default function Pagination() {
  const pagination = usePagination();
  const { totalPages, page } = pagination.state;

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPages = 5;

    if (totalPages <= maxPages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let start = Math.max(0, page - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;
    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(0, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center my-8">
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        <button
          onClick={pagination.methods?.previousPage}
          disabled={page === 0}
          className="relative inline-flex items-center p-2 rounded-md text-sm font-medium disabled:text-gray-300 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {pageNumbers.map((curPage, index) => (
          <div key={`${curPage}-${index}`}>
            <button
              onClick={() => pagination.methods?.selectPage(curPage)}
              className={
                page === curPage
                  ? "h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium bg-indigo-600 text-white cursor-pointer"
                  : "h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
              }
              aria-current={page === curPage ? "page" : undefined}
            >
              {curPage + 1}
            </button>
          </div>
        ))}

        <button
          onClick={pagination.methods?.nextPage}
          disabled={page === totalPages - 1}
          className="relative inline-flex items-center p-2 rounded-md text-sm font-medium disabled:text-gray-300 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
