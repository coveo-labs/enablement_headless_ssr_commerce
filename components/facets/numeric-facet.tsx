"use client";

import { NumericFacet as HeadlessNumericFacet, NumericFacetState } from "@coveo/headless-react/ssr-commerce";
import { useEffect, useRef, useState } from "react";

interface NumericFacetProps {
  controller?: HeadlessNumericFacet;
  staticState: NumericFacetState;
}

export default function NumericFacet(props: NumericFacetProps) {
  const { controller, staticState } = props;

  const [state, setState] = useState(staticState);

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
    controller?.subscribe(() => {
      setState(controller.state);
      setCurrentManualRange(getInitialRange(controller));
      setSliderValue(null);
    });
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

  const onClickClearSelectedFacetValues = (): void => {
    controller?.deselectAll();
    focusManualRangeStartInput();
  };

  const calculateStyles = () => {
    const min = state.domain?.min || 0;
    const max = state.domain?.max || 100;
    const range = max - min;

    const values = sliderValue || currentManualRange;

    return {
      left: `${((values.start - min) / range) * 100}%`,
      width: `${((values.end - values.start) / range) * 100}%`,
    };
  };

  const renderManualRangeControls = () => {
    const { min = 0, max = 100 } = state.domain || {};
    const styles = calculateStyles();

    const displayValues = sliderValue || currentManualRange;

    return (
      <div className="my-4">
        {/* Range values display */}
        <div className="flex justify-between mb-2 text-sm font-medium">
          <span>From: {displayValues.start}</span>
          <span>To: {displayValues.end}</span>
        </div>

        <div className="relative h-10">
          {/* Min/Max labels */}
          <div className="flex justify-between mb-2.5 text-xs text-gray-600">
            <span>{min}</span>
            <span>{max}</span>
          </div>

          {/* Range slider track */}
          <div className="relative w-full h-1 bg-gray-200 rounded mt-5">
            {/* Selected range indicator */}
            <div className="absolute h-full bg-blue-500 rounded" style={styles} />

            {/* Start range input */}
            <input
              ref={manualRangeStartInputRef}
              type="range"
              className="absolute top-[-8px] w-full appearance-none bg-transparent h-5 pointer-events-none range-input"
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
              className="absolute top-[-8px] w-full appearance-none bg-transparent h-5 pointer-events-none range-input"
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
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            pointer-events: auto;
            border: 2px solid white;
          }
          .range-input::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            pointer-events: auto;
            border: 2px solid white;
          }
        `}</style>
      </div>
    );
  };

  /**
   * Renders the facet value list with checkboxes
   */
  const renderFacetValues = () => {
    // Simplify repeated conditions
    const isDisabled = !controller || state.isLoading;

    // Common button class
    const buttonClass =
      "text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
      <div className="relative">
        <button
          aria-label="Clear selected facet values"
          className={`absolute right-0 top-0 ${buttonClass}`}
          disabled={isDisabled || !state.hasActiveValues}
          onClick={onClickClearSelectedFacetValues}
          title="Clear selected facet values"
          type="reset"
        >
          X
        </button>

        {state.isLoading && <span className="block text-sm italic text-gray-600 mb-2">Facet is loading...</span>}

        <ul className="mt-2 space-y-1">
          {state.values.map((value, index) => {
            const checkboxId = `${value.start}-${value.end}-${value.endInclusive}`;
            return (
              <li className="flex items-center py-1" key={index}>
                <input
                  checked={value.state !== "idle"}
                  className="mr-2 h-4 w-4 cursor-pointer"
                  disabled={isDisabled}
                  id={checkboxId}
                  onChange={() => controller?.toggleSelect(value)}
                  type="checkbox"
                />
                <label className="flex-grow text-sm flex items-center cursor-pointer" htmlFor={checkboxId}>
                  <span className="mr-1">
                    {value.start} to {value.end}
                  </span>
                  <span className="text-xs text-gray-500">({value.numberOfResults})</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <fieldset className="m-2 pb-2 border-b-2 border-black">
      <legend className="font-bold bg-gray-100 block w-full p-2">{state.displayName ?? state.facetId}</legend>
      {renderManualRangeControls()}
      {renderFacetValues()}
    </fieldset>
  );
}
