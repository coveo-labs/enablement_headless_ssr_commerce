"use client";

import {
  CategoryFacetState,
  CategoryFacetValue,
  CategoryFacet as HeadlessCategoryFacet,
} from "@coveo/headless-react/ssr-commerce";
import FacetShowMoreLess from "./show-more-less";
import FacetSearch from "./facet-search";
import FacetSearchResults, { CategoryFacetSearchResultsList } from "./facet-search-results";
import FacetTitle from "./facet-title";
import FacetClearButton from "./facet-clear-button";
import FacetValueItem, { SelectedCategoryFacetValueItem } from "./facet-value-item";
import { useFacetState } from "./useFacetState";

interface CategoryFacetProps {
  controller?: HeadlessCategoryFacet;
  staticState: CategoryFacetState;
}

export default function CategoryFacet(props: CategoryFacetProps) {
  const { controller, staticState } = props;

  const facetState = useFacetState(controller, staticState);
  const { hasActiveValues, selectedValueAncestry, values, displayName, facetId, facetSearch } = facetState;

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
      <div className="px-6 pb-6">
        <ul className="mt-4 space-y-3">
          {selectedValueAncestry.map((ancestryValue) => {
            return (
              <SelectedCategoryFacetValueItem
                key={`${ancestryValue.value}-ancestry`}
                {...ancestryValue}
                onChange={() => toggleSelectFacetValue(ancestryValue)}
              />
            );
          })}
          {activeValueChildren.length > 0 && (
            <li className="ml-6 mt-2">
              <ul className="space-y-2 pl-4 border-l-2 border-gray-200">
                {activeValueChildren.map((child) => {
                  return (
                    <FacetValueItem
                      key={`${child.value}-child`}
                      {...child}
                      onChange={() => toggleSelectFacetValue(child)}
                    />
                  );
                })}
              </ul>
            </li>
          )}
        </ul>
      </div>
    );
  };

  const renderRootValues = () => {
    if (hasActiveValues) {
      return null;
    }

    return (
      <div className="px-6 pb-6">
        <ul className="mt-4 space-y-3">
          {values.map((root) => {
            return (
              <FacetValueItem key={`${root.value}-root`} {...root} onChange={() => toggleSelectFacetValue(root)} />
            );
          })}
        </ul>
      </div>
    );
  };

  const renderFacetValues = () => {
    return (
      <div className="pb-6">
        {renderRootValues()}
        {renderActiveFacetValueTree()}
        <div className="px-6 mt-4">
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
    <fieldset className="border-none">
      <FacetTitle title={displayName ?? facetId}>
        {hasActiveValues && <FacetClearButton onClear={() => controller?.deselectAll()} />}
      </FacetTitle>
      <div className="px-6">
        <FacetSearch
          {...facetState}
          onSearchInputChange={onChangeFacetSearchInput}
          onClearClick={() => controller?.facetSearch.clear()}
        />
      </div>
      {facetSearch.query ? (
        <div className="px-6 pb-6">
          <FacetSearchResults query={facetSearch.query}>
            {facetSearch.values.length === 0 ? null : (
              <CategoryFacetSearchResultsList
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
