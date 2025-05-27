"use client";

import {
  CategoryFacetSearchResult,
  CategoryFacetState,
  CategoryFacetValue,
  CategoryFacet as HeadlessCategoryFacet,
} from "@coveo/headless-react/ssr-commerce";
import { useEffect, useState } from "react";
import FacetShowMoreLess from "./show-more-less";
import FacetSearch from "./facet-search";

interface ICategoryFacetProps {
  controller?: HeadlessCategoryFacet;
  staticState: CategoryFacetState;
}

export default function CategoryFacet(props: ICategoryFacetProps) {
  const { controller, staticState } = props;

  const [state, setState] = useState(staticState);
  const [showFacetSearchResults, setShowFacetSearchResults] = useState(false);

  useEffect(() => {
    controller?.subscribe(() => setState(controller.state));
  }, [controller]);

  const onChangeFacetSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value === "") {
      setShowFacetSearchResults(false);
      controller?.facetSearch.clear();
      return;
    }

    controller?.facetSearch.updateText(e.target.value);
    controller?.facetSearch.search();
    setShowFacetSearchResults(true);
  };

  const onClickClearFacetSearch = (): void => {
    setShowFacetSearchResults(false);
    controller?.facetSearch.clear();
  };

  const highlightFacetSearchResult = (displayValue: string): string => {
    const query = state.facetSearch.query;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedQuery, "gi");
    return displayValue.replace(regex, (match) => `<mark>${match}</mark>`);
  };

  const onClickFacetSearchResult = (value: CategoryFacetSearchResult): void => {
    controller?.facetSearch.select(value);
    controller?.facetSearch.clear();
    setShowFacetSearchResults(false);
  };

  const onClickClearSelectedFacetValues = (): void => {
    controller?.deselectAll();
  };

  const toggleSelectFacetValue = (value: CategoryFacetValue) => {
    if (controller?.isValueSelected(value)) {
      controller.deselectAll();
    }
    controller?.toggleSelect(value);
  };

  const renderFacetSearchResults = () => {
    return state.facetSearch.values.length === 0 ? (
      <span className="block text-sm text-gray-600 mt-2">
        No results for <strong>{state.facetSearch.query}</strong>
      </span>
    ) : (
      <ul className="mt-2 border-t border-gray-200 pt-2 max-h-60 overflow-y-auto">
        {state.facetSearch.values.map((value) => (
          <li
            className="py-1 hover:bg-gray-100 cursor-pointer flex items-center"
            key={value.rawValue}
            onClick={() => onClickFacetSearchResult(value)}
          >
            <input
              className="mr-2 h-4 w-4"
              aria-label={`Select facet search result '${value.displayValue}' in category '${value.path.join(" / ")}'`}
              disabled={!controller}
              id={value.rawValue}
              type="checkbox"
            />
            <label className="flex-grow text-sm" htmlFor={value.rawValue}>
              <span
                className="font-medium"
                dangerouslySetInnerHTML={{
                  __html: highlightFacetSearchResult(value.displayValue),
                }}
              />
              {value.path.length > 0 && (
                <span className="text-xs text-gray-500 ml-1">
                  {" "}
                  <small>in {value.path.join(" > ")}</small>
                </span>
              )}
            </label>
            <span className="text-xs text-gray-500"> ({value.count})</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderActiveFacetValueTree = () => {
    if (!state.hasActiveValues || !state.selectedValueAncestry) {
      return null;
    }

    const ancestry = state.selectedValueAncestry;
    const activeValueChildren = ancestry[ancestry.length - 1]?.children ?? [];

    return (
      <ul className="mt-2 space-y-1">
        {ancestry.map((ancestryValue) => {
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
    if (state.hasActiveValues) {
      return null;
    }

    return (
      <ul className="mt-2 space-y-1">
        {state.values.map((root) => {
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
          disabled={!controller || state.isLoading || !state.hasActiveValues}
          onClick={onClickClearSelectedFacetValues}
          type="reset"
        >
          X
        </button>
        {state.isLoading && <span className="block text-sm italic text-gray-600 mb-2"> Facet is loading...</span>}
        {renderRootValues()}
        {renderActiveFacetValueTree()}
        <FacetShowMoreLess
          onShowLessClick={controller?.showLessValues}
          onShowMoreClick={controller?.showMoreValues}
          isLoading={state.isLoading}
          canShowMoreValues={state.canShowMoreValues}
          canShowLessValues={state.canShowLessValues}
        />
      </div>
    );
  };

  return (
    <fieldset className="p-4 border border-gray-200 rounded shadow-sm bg-white">
      <legend className="font-bold text-gray-800 mb-2">{state.displayName ?? state.facetId}</legend>
      <FacetSearch {...state} onSearchInputChange={onChangeFacetSearchInput} onClearClick={onClickClearFacetSearch} />
      {showFacetSearchResults ? renderFacetSearchResults() : renderFacetValues()}
    </fieldset>
  );
}
