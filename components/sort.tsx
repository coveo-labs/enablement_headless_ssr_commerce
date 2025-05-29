"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useSort } from "@/lib/commerce-engine";
import { SortBy, SortCriterion } from "@coveo/headless-react/ssr-commerce";

export default function Sort() {
  const sort = useSort();
  const availableSorts = sort.state.availableSorts;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SortCriterion>(availableSorts[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (sortCriterion: SortCriterion) => {
    setSelectedOption(sortCriterion);
    setIsOpen(false);
    sort.methods?.sortBy(sortCriterion);
  };

  const sortLabel = (sortCriterion: SortCriterion) =>
    sortCriterion.by === SortBy.Fields ? sortCriterion.fields[0].displayName : sortCriterion.by;

  return (
    <div className="relative w-full max-w-[240px]" ref={dropdownRef}>
      <div
        className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg bg-white shadow-sm cursor-pointer hover:border-gray-300 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">Sort by: </span>
          <span className="ml-2 text-sm text-gray-900 capitalize">{sortLabel(selectedOption)}</span>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 max-h-60 overflow-auto">
            {availableSorts.map((sortOption) => (
              <div
                key={sortLabel(sortOption)}
                className={`
                  px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors capitalize
                  ${sort.methods?.isSortedBy(sortOption) ? "bg-gray-50 text-blue-600 font-medium" : "text-gray-700"}
                `}
                onClick={() => handleOptionSelect(sortOption)}
              >
                {sortLabel(sortOption)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
