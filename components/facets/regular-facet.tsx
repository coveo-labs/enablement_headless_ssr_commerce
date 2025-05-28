"use client";

import { RegularFacet as HeadlessRegularFacet, RegularFacetState } from "@coveo/headless-react/ssr-commerce";
import { useEffect, useState } from "react";
import FacetShowMoreLess from "./show-more-less";
import FacetSearch from "./facet-search";
import FacetSearchResults, { RegularFacetSearchResultsList } from "./facet-search-results";

interface IRegularFacetProps {
  controller?: HeadlessRegularFacet;
  staticState: RegularFacetState;
}

export default function RegularFacet(props: IRegularFacetProps) {
  const { controller, staticState } = props;

  const [facetState, setFacetState] = useState(staticState);
  const { isLoading, hasActiveValues, facetId, displayName, values, facetSearch } = facetState;

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

  const renderFacetValues = () => {
    return (
      <div>
        <button
          aria-label="Clear selected facet values"
          className="px-4 py-2 border-none rounded bg-gray-200 text-gray-700 text-base cursor-pointer transition-colors duration-200 hover:bg-gray-300"
          disabled={!controller || isLoading || !hasActiveValues}
          onClick={() => controller?.deselectAll()}
          type="reset"
        >
          X
        </button>
        {isLoading && <span> Facet is loading...</span>}
        <ul className="list-none p-0">
          {values.map((value) => (
            <li key={value.value}>
              <input
                aria-label={`${value.state === "idle" ? "Select" : "Deselect"} facet value '${value.value}'`}
                checked={value.state !== "idle"}
                className="mr-2"
                disabled={!controller || isLoading}
                id={value.value}
                onChange={() => controller?.toggleSelect(value)}
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
          {...facetState}
        />
      </div>
    );
  };

  return (
    <fieldset className="mx-2 pb-2 border-b-2 border-black">
      <legend className="font-bold bg-gray-100 block w-full p-2">{displayName ?? facetId}</legend>
      <FacetSearch
        {...facetState}
        onSearchInputChange={onChangeFacetSearchInput}
        onClearClick={() => controller?.facetSearch.clear()}
      />
      {facetSearch.query ? (
        <FacetSearchResults query={facetState.facetSearch.query}>
          {facetState.facetSearch.values.length === 0 ? null : (
            <RegularFacetSearchResultsList
              values={facetState.facetSearch.values}
              onResultClick={(value) => {
                controller?.facetSearch.select(value);
                controller?.facetSearch.clear();
              }}
              query={facetState.facetSearch.query}
            />
          )}
        </FacetSearchResults>
      ) : (
        renderFacetValues()
      )}
    </fieldset>
  );
}
