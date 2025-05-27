"use client";

import {
  BaseFacetSearchResult,
  RegularFacet as HeadlessRegularFacet,
  RegularFacetState,
  RegularFacetValue,
} from "@coveo/headless-react/ssr-commerce";
import { useEffect, useState } from "react";
import FacetShowMoreLess from "./show-more-less";
import FacetSearch from "./facet-search";

interface IRegularFacetProps {
  controller?: HeadlessRegularFacet;
  staticState: RegularFacetState;
}

export default function RegularFacet(props: IRegularFacetProps) {
  const { controller, staticState } = props;

  const [state, setState] = useState(staticState);
  const [showFacetSearchResults, setShowFacetSearchResults] = useState(false);

  useEffect(() => {
    controller?.subscribe(() => setState(controller.state));
  }, [controller]);

  const focusFacetSearchInput = (): void => {
    // Focus is now handled internally by the FacetSearchControls component
  };

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

  const highlightFacetSearchResult = (displayValue: string): string => {
    const query = state.facetSearch.query;
    const regex = new RegExp(query, "gi");
    return displayValue.replace(regex, (match) => `<mark>${match}</mark>`);
  };

  const onClickFacetSearchResult = (value: BaseFacetSearchResult): void => {
    controller?.facetSearch.select(value);
    controller?.facetSearch.clear();
    setShowFacetSearchResults(false);
    focusFacetSearchInput();
  };

  const onClickFacetSearchClear = (): void => {
    setShowFacetSearchResults(false);
    controller?.facetSearch.clear();
    focusFacetSearchInput();
  };

  const onClickClearSelectedFacetValues = (): void => {
    controller?.deselectAll();
    focusFacetSearchInput();
  };

  const onChangeFacetValue = (facetValue: RegularFacetValue): void => {
    controller?.toggleSelect(facetValue);
    focusFacetSearchInput();
  };

  const renderFacetSearchResults = () => {
    return state.facetSearch.values.length === 0 ? (
      <span>
        No results for <strong>{state.facetSearch.query}</strong>
      </span>
    ) : (
      <ul className="list-none p-0">
        {state.facetSearch.values.map((value) => (
          <li
            className="cursor-pointer"
            key={value.rawValue}
            onClick={() => onClickFacetSearchResult(value)}
            style={{ width: "fit-content" }}
          >
            <input
              aria-label={`Select facet search result ${value.displayValue}`}
              className="mr-2"
              disabled={!controller}
              id={value.rawValue}
              type="checkbox"
            ></input>
            <label htmlFor={value.rawValue}>
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightFacetSearchResult(value.displayValue),
                }}
              ></span>
            </label>
            <span> ({value.count})</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderFacetValues = () => {
    return (
      <div>
        <button
          aria-label="Clear selected facet values"
          className="px-4 py-2 border-none rounded bg-gray-200 text-gray-700 text-base cursor-pointer transition-colors duration-200 hover:bg-gray-300"
          disabled={!controller || state.isLoading || !state.hasActiveValues}
          onClick={onClickClearSelectedFacetValues}
          type="reset"
        >
          X
        </button>
        {state.isLoading && <span> Facet is loading...</span>}
        <ul className="list-none p-0">
          {state.values.map((value) => (
            <li key={value.value}>
              <input
                aria-label={`${value.state === "idle" ? "Select" : "Deselect"} facet value '${value.value}'`}
                checked={value.state !== "idle"}
                className="mr-2"
                disabled={!controller || state.isLoading}
                id={value.value}
                onChange={() => onChangeFacetValue(value)}
                type="checkbox"
              ></input>
              <label htmlFor={value.value}>
                <span>{value.value}</span>
                <span> ({value.numberOfResults})</span>
              </label>
            </li>
          ))}
        </ul>
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
    <fieldset className="mx-2 pb-2 border-b-2 border-black">
      <legend className="font-bold bg-gray-100 block w-full p-2">{state.displayName ?? state.facetId}</legend>
      <FacetSearch {...state} onSearchInputChange={onChangeFacetSearchInput} onClearClick={onClickFacetSearchClear} />
      {showFacetSearchResults ? renderFacetSearchResults() : renderFacetValues()}
    </fieldset>
  );
}
