"use client";

import { useInstantProducts, useStandaloneSearchBox } from "@/lib/commerce-engine";
import { useEffect, useState } from "react";
import InstantProducts from "./instant-product";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const router = useRouter();
  const standaloneSearchBox = useStandaloneSearchBox();
  const instantProducts = useInstantProducts();

  const [isInputFocused, setIsInputFocused] = useState(false);
  useEffect(() => {
    if (standaloneSearchBox.state.redirectTo === "/search") {
      const url = `${standaloneSearchBox.state.redirectTo}?q=${encodeURIComponent(standaloneSearchBox.state.value)}`;
      router.push(url);
      standaloneSearchBox.methods?.afterRedirection();
    }
  }, [standaloneSearchBox.state.redirectTo, standaloneSearchBox.state.value, router, standaloneSearchBox.methods]);

  const onSearchBoxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    standaloneSearchBox.methods?.updateText(e.target.value);
    instantProducts.methods?.updateQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      standaloneSearchBox.methods?.submit();
      handleBlur();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 150);
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex items-stretch w-full max-w-md">
        <input
          type="search"
          className="flex-1 bg-white border border-gray-200 border-r-0 px-4 py-2.5 rounded-l-lg rounded-r-none text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          aria-label="searchbox"
          placeholder="Search products..."
          value={standaloneSearchBox.state.value}
          onChange={(e) => onSearchBoxInputChange(e)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          onClick={standaloneSearchBox.methods?.submit}
          className="bg-blue-600 text-white px-4 border border-blue-600 rounded-r-lg rounded-l-none transition-all duration-200 hover:bg-blue-700 hover:border-blue-700 flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isInputFocused && standaloneSearchBox.state.suggestions.length > 0 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[200%] min-w-[800px] bg-white border border-gray-200 rounded-lg shadow-xl z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2">
            <div className="md:col-span-2 p-4 border-r border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Suggestions</h3>
              <ul className="space-y-1">
                {standaloneSearchBox.state.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => standaloneSearchBox.methods?.selectSuggestion(suggestion.rawValue)}
                    dangerouslySetInnerHTML={{ __html: suggestion.highlightedValue }}
                    className="text-base text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer"
                  ></li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3 p-4">{instantProducts.state.products.length > 0 && <InstantProducts />}</div>
          </div>
        </div>
      )}
    </div>
  );
}
