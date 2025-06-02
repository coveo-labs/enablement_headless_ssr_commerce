import { useEffect, useState } from "react";

interface FacetController<T> {
  subscribe: (callback: () => void) => (() => void) | undefined;
  state: T;
}

/**
 * Custom hook to manage facet state across different facet types
 * @param controller - The headless facet controller
 * @param staticState - The initial static state
 * @returns The current facet state
 */
export function useFacetState<T>(controller: FacetController<T> | undefined, staticState: T): T {
  const [facetState, setFacetState] = useState(staticState);

  useEffect(() => {
    return controller?.subscribe(() => setFacetState(controller.state));
  }, [controller]);

  return facetState;
}
