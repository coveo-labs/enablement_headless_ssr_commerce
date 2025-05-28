"use client";

import { RegularFacet as HeadlessRegularFacet, RegularFacetState } from "@coveo/headless-react/ssr-commerce";
import FacetShowMoreLess from "./show-more-less";
import FacetSearch from "./facet-search";
import FacetSearchResults, { RegularFacetSearchResultsList } from "./facet-search-results";
import FacetTitle from "./facet-title";
import FacetClearButton from "./facet-clear-button";
import FacetValueItem from "./facet-value-item";
import { useFacetState } from "./useFacetState";

interface RegularFacetProps {
  controller?: HeadlessRegularFacet;
  staticState: RegularFacetState;
}

export default function RegularFacet(props: RegularFacetProps) {
  const { controller, staticState } = props;

  const facetState = useFacetState(controller, staticState);
  const { hasActiveValues, facetId, displayName, values, facetSearch } = facetState;

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
      <div className="px-6 pb-6">
        <ul className="list-none p-0 space-y-3 flex flex-col">
          {values.map((value) => (
            <FacetValueItem key={value.value} {...value} onChange={() => controller?.toggleSelect(value)} />
          ))}
        </ul>
        <div className="mt-4">
          <FacetShowMoreLess
            onShowLessClick={controller?.showLessValues}
            onShowMoreClick={controller?.showMoreValues}
            {...facetState}
          />
        </div>
      </div>
    );
  };

  return (
    <fieldset className="border-none flex flex-col w-full">
      <FacetTitle title={displayName ?? facetId}>
        {hasActiveValues && <FacetClearButton onClear={() => controller?.deselectAll()} />}
      </FacetTitle>
      <div className="px-6 w-full">
        <FacetSearch
          {...facetState}
          onSearchInputChange={onChangeFacetSearchInput}
          onClearClick={() => controller?.facetSearch.clear()}
        />
      </div>
      {facetSearch.query ? (
        <div className="px-6 pb-6 w-full">
          <FacetSearchResults query={facetState.facetSearch.query}>
            {facetState.facetSearch.values.length === 0 ? null : (
              <RegularFacetSearchResultsList
                {...facetSearch}
                onResultClick={(value) => {
                  controller?.facetSearch.select(value);
                  controller?.facetSearch.clear();
                }}
              />
            )}
          </FacetSearchResults>
        </div>
      ) : (
        renderFacetValues()
      )}
    </fieldset>
  );
}
