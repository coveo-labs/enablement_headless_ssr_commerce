"use client";

import { useFacetGenerator } from "@/lib/commerce-engine";
import CategoryFacet from "./category-facet";
import NumericFacet from "./numeric-facet";
import RegularFacet from "./regular-facet";

export default function FacetGenerator() {
  const { state, methods } = useFacetGenerator();

  return (
    <nav className="flex flex-col space-y-6">
      {state.map((facetState) => {
        const facetId = facetState.facetId;
        let facetComponent;

        switch (facetState.type) {
          case "regular":
            facetComponent = (
              <RegularFacet controller={methods?.getFacetController(facetId, "regular")} staticState={facetState} />
            );
            break;

          case "numericalRange":
            facetComponent = (
              <NumericFacet
                controller={methods?.getFacetController(facetId, "numericalRange")}
                staticState={facetState}
              />
            );
            break;

          case "hierarchical":
            facetComponent = (
              <CategoryFacet
                controller={methods?.getFacetController(facetId, "hierarchical")}
                staticState={facetState}
              />
            );
            break;

          default:
            return null;
        }

        return (
          <div
            key={facetId}
            className="bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 w-full max-w-full"
          >
            {facetComponent}
          </div>
        );
      })}
    </nav>
  );
}
