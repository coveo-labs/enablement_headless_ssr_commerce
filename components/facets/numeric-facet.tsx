"use client";

import { NumericFacet as HeadlessNumericFacet, NumericFacetState } from "@coveo/headless-react/ssr-commerce";
import { useEffect, useRef, useState } from "react";
import FacetTitle from "./facet-title";
import FacetClearButton from "./facet-clear-button";
import { useFacetState } from "./use-facet-state";

interface NumericFacetProps {
  controller?: HeadlessNumericFacet;
  staticState: NumericFacetState;
}

export default function NumericFacet(props: NumericFacetProps) {
  const { controller, staticState } = props;

  const facetState = useFacetState(controller, staticState);

  const getInitialRange = (ctrl: HeadlessNumericFacet | undefined) => {
    const min = ctrl?.state.domain?.min || 0;
    const max = ctrl?.state.domain?.max || 100;

    return {
      start: ctrl?.state.manualRange?.start ?? min,
      end: ctrl?.state.manualRange?.end ?? max,
    };
  };

  const [currentManualRange, setCurrentManualRange] = useState(getInitialRange(controller));
  const [sliderValue, setSliderValue] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const manualRangeStartInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateState = () => {
      setCurrentManualRange(getInitialRange(controller));
      setSliderValue(null);
    };

    return controller?.subscribe(updateState);
  }, [controller]);

  const focusManualRangeStartInput = (): void => {
    if (manualRangeStartInputRef.current) {
      manualRangeStartInputRef.current.focus();
    }
  };

  const updateRange = () => {
    if (!sliderValue) {
      return;
    }

    const { start, end } = sliderValue;
    if (start < end) {
      setCurrentManualRange({ start, end });
      controller?.setRanges([
        {
          start,
          end,
          endInclusive: true,
          state: "selected",
        },
      ]);
      setSliderValue(null);
    }
  };

  const onChangeSliderStart = (value: number) => {
    const end = sliderValue?.end ?? currentManualRange.end;
    setSliderValue({ start: value, end });
  };

  const onChangeSliderEnd = (value: number) => {
    const start = sliderValue?.start ?? currentManualRange.start;
    setSliderValue({ start, end: value });
  };

  const calculateStyles = () => {
    const min = facetState.domain?.min || 0;
    const max = facetState.domain?.max || 100;
    const range = max - min;

    const values = sliderValue || currentManualRange;

    return {
      left: `${((values.start - min) / range) * 100}%`,
      width: `${((values.end - values.start) / range) * 100}%`,
    };
  };

  const renderManualRangeControls = () => {
    const { min = 0, max = 100 } = facetState.domain || {};
    const styles = calculateStyles();

    const displayValues = sliderValue || currentManualRange;

    return (
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        {/* Range values display */}
        <div className="flex justify-between mb-3 text-sm font-semibold text-gray-700">
          <span className="bg-white px-3 py-1 rounded-lg shadow-sm border">From: {displayValues.start}</span>
          <span className="bg-white px-3 py-1 rounded-lg shadow-sm border">To: {displayValues.end}</span>
        </div>

        <div className="relative h-12">
          {/* Min/Max labels */}
          <div className="flex justify-between mb-3 text-xs text-gray-500 font-medium">
            <span>{min}</span>
            <span>{max}</span>
          </div>

          {/* Range slider track */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full mt-5">
            {/* Selected range indicator */}
            <div className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={styles} />

            {/* Start range input */}
            <input
              ref={manualRangeStartInputRef}
              type="range"
              className="absolute top-[-6px] w-full appearance-none bg-transparent h-6 pointer-events-none range-input"
              min={min}
              max={max}
              value={displayValues.start}
              onChange={(e) => onChangeSliderStart(Number(e.target.value))}
              onMouseUp={updateRange}
              onTouchEnd={updateRange}
            />

            {/* End range input */}
            <input
              type="range"
              className="absolute top-[-6px] w-full appearance-none bg-transparent h-6 pointer-events-none range-input"
              min={min}
              max={max}
              value={displayValues.end}
              onChange={(e) => onChangeSliderEnd(Number(e.target.value))}
              onMouseUp={updateRange}
              onTouchEnd={updateRange}
            />
          </div>
        </div>

        {/* Custom slider thumb styling */}
        <style jsx>{`
          .range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            cursor: pointer;
            pointer-events: auto;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .range-input::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            cursor: pointer;
            pointer-events: auto;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    );
  };

  const renderFacetValues = () => {
    const isDisabled = !controller || facetState.isLoading;
    return (
      <div className="px-6 pb-6">
        <ul className="mt-4 space-y-3">
          {facetState.values.map((value, index) => {
            const checkboxId = `${value.start}-${value.end}-${value.endInclusive}`;
            return (
              <li className="flex items-center group" key={index}>
                <input
                  checked={value.state !== "idle"}
                  className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isDisabled}
                  id={checkboxId}
                  onChange={() => controller?.toggleSelect(value)}
                  type="checkbox"
                />
                <label
                  className="flex items-center justify-between w-full text-sm text-gray-700 cursor-pointer group-hover:text-gray-900 transition-colors duration-150"
                  htmlFor={checkboxId}
                >
                  <span className="font-medium">
                    {value.start} to {value.end}
                  </span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                    {value.numberOfResults}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <fieldset className="border-none">
      <FacetTitle title={facetState.displayName ?? facetState.facetId}>
        {facetState.hasActiveValues && (
          <FacetClearButton
            onClear={() => {
              controller?.deselectAll();
              focusManualRangeStartInput();
            }}
          />
        )}
      </FacetTitle>
      {renderManualRangeControls()}
      {renderFacetValues()}
    </fieldset>
  );
}
