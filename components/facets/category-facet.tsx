"use client";

import {
  CategoryFacetState,
  CategoryFacetValue,
  CategoryFacet as HeadlessCategoryFacet,
} from "@coveo/headless-react/ssr-commerce";
import { useEffect, useState } from "react";
import FacetShowMoreLess from "./show-more-less";
import FacetSearch from "./facet-search";
import FacetSearchResults, { CategoryFacetSearchResultsList } from "./facet-search-results";

interface CategoryFacetProps {
  controller?: HeadlessCategoryFacet;
  staticState: CategoryFacetState;
}

export default function CategoryFacet(props: CategoryFacetProps) {
  const { controller, staticState } = props;

  const [facetState, setFacetState] = useState(staticState);
  const { hasActiveValues, selectedValueAncestry, values, isLoading, displayName, facetId, facetSearch } = facetState;

  useEffect(() => {
    controller?.subscribe(() => setFacetState(controller.state));
  }, [controller]);

  const onChangeFacetSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value === "") {
      controller?.facetSearch.clear();
      return;
    }

    controller?.facetSearch.updateText(e.target.value);
    controller?.facetSearch.search();
  };

  const toggleSelectFacetValue = (value: CategoryFacetValue) => {
    if (controller?.isValueSelected(value)) {
      controller.deselectAll();
    }
    controller?.toggleSelect(value);
  };

  const renderActiveFacetValueTree = () => {
    if (!hasActiveValues || !selectedValueAncestry) {
      return null;
    }

    const activeValueChildren = selectedValueAncestry[selectedValueAncestry.length - 1]?.children ?? [];

    return (
      <ul className="mt-2 space-y-1">
        {selectedValueAncestry.map((ancestryValue) => {
          const checkboxId = `ancestryFacetValueCheckbox-${ancestryValue.value}`;
          return (
            <li
              className="flex items-center py-1 border-b border-gray-100 font-medium"
              key={`${ancestryValue.value}-ancestry`}
            >
              <input
                className="mr-2 h-4 w-4"
                checked={controller?.isValueSelected(ancestryValue)}
                disabled={!controller}
                id={checkboxId}
                onChange={() => toggleSelectFacetValue(ancestryValue)}
                type="checkbox"
              />
              <label className="flex-grow text-sm flex items-center" htmlFor={checkboxId}>
                <span className="mr-1">{ancestryValue.value}</span>
                <span className="text-xs text-gray-500"> ({ancestryValue.numberOfResults})</span>
              </label>
            </li>
          );
        })}
        {activeValueChildren.length > 0 && (
          <ul className="ml-6 space-y-1 pt-1">
            {activeValueChildren.map((child) => {
              const checkboxId = `facetValueChildCheckbox-${child.value}`;
              return (
                <li className="flex items-center py-1" key={`${child.value}-child`}>
                  <input
                    className="mr-2 h-4 w-4"
                    checked={false}
                    disabled={!controller}
                    id={checkboxId}
                    onChange={() => toggleSelectFacetValue(child)}
                    type="checkbox"
                  />
                  <label className="flex-grow text-sm flex items-center" htmlFor={checkboxId}>
                    <span className="mr-1">{child.value}</span>
                    <span className="text-xs text-gray-500"> ({child.numberOfResults})</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </ul>
    );
  };

  const renderRootValues = () => {
    if (hasActiveValues) {
      return null;
    }

    return (
      <ul className="mt-2 space-y-1">
        {values.map((root) => {
          return (
            <li className="flex items-center py-1" key={`${root.value}-root`}>
              <input
                className="mr-2 h-4 w-4"
                checked={false}
                disabled={!controller}
                id={`${root.value}-root`}
                onChange={() => toggleSelectFacetValue(root)}
                type="checkbox"
              />
              <label className="flex-grow text-sm flex items-center" htmlFor={`${root.value}-root`}>
                <span className="mr-1">{root.value}</span>
                <span className="text-xs text-gray-500"> ({root.numberOfResults})</span>
              </label>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderFacetValues = () => {
    return (
      <div className="relative">
        <button
          className="absolute right-0 top-0 text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Clear selected facet values"
          disabled={!controller || isLoading || !hasActiveValues}
          onClick={() => controller?.deselectAll()}
          type="reset"
        >
          X
        </button>
        {isLoading && <span className="block text-sm italic text-gray-600 mb-2"> Facet is loading...</span>}
        {renderRootValues()}
        {renderActiveFacetValueTree()}
        <FacetShowMoreLess
          onShowLessClick={controller?.showLessValues}
          onShowMoreClick={controller?.showMoreValues}
          {...facetState}
        />
      </div>
    );
  };

  return (
    <fieldset className="p-4 border border-gray-200 rounded shadow-sm bg-white">
      <legend className="font-bold text-gray-800 mb-2">{displayName ?? facetId}</legend>
      <FacetSearch
        {...facetState}
        onSearchInputChange={onChangeFacetSearchInput}
        onClearClick={() => controller?.facetSearch.clear()}
      />
      {facetSearch.query ? (
        <FacetSearchResults query={facetSearch.query}>
          {facetSearch.values.length === 0 ? null : (
            <CategoryFacetSearchResultsList
              values={facetSearch.values}
              onResultClick={(value) => {
                controller?.facetSearch.select(value);
                controller?.facetSearch.clear();
              }}
              query={facetSearch.query}
            />
          )}
        </FacetSearchResults>
      ) : (
        renderFacetValues()
      )}
    </fieldset>
  );
}
