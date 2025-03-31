'use client';

import {
  NumericFacet as HeadlessNumericFacet,
  NumericFacetState,
} from '@coveo/headless-react/ssr-commerce';
import {useEffect, useRef, useState} from 'react';

interface INumericFacetProps {
  controller?: HeadlessNumericFacet;
  staticState: NumericFacetState;
}

export default function NumericFacet(props: INumericFacetProps) {
  const {controller, staticState} = props;

  const [state, setState] = useState(staticState);
  const [currentManualRange, setCurrentManualRange] = useState({
    start:
      controller?.state.manualRange?.start ??
      controller?.state.domain?.min ??
      controller?.state.values[0]?.start ??
      0,
    end:
      controller?.state.manualRange?.end ??
      controller?.state.domain?.max ??
      controller?.state.values[0]?.end ??
      0,
  });

  const manualRangeStartInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    controller?.subscribe(() => {
      setState(controller.state),
        setCurrentManualRange({
          start:
            controller.state.manualRange?.start ??
            controller.state.domain?.min ??
            controller.state.values[0]?.start ??
            0,
          end:
            controller.state.manualRange?.end ??
            controller.state.domain?.max ??
            controller.state.values[0]?.end ??
            0,
        });
    });
  }, [controller]);

  const focusManualRangeStartInput = (): void => {
    manualRangeStartInputRef.current!.focus();
  };

  const invalidRange =
    currentManualRange.start >= currentManualRange.end ||
    isNaN(currentManualRange.start) ||
    isNaN(currentManualRange.end);

  const onChangeSliderStart = (value: number) => {
    const newStart = value;
    const newEnd = currentManualRange.end;
    if (newStart < newEnd) {
      setCurrentManualRange({ start: newStart, end: newEnd });
      controller?.setRanges([{
        start: newStart,
        end: newEnd,
        endInclusive: true,
        state: 'selected',
      }]);
    }
  };

  const onChangeSliderEnd = (value: number) => {
    const newStart = currentManualRange.start;
    const newEnd = value;
    if (newStart < newEnd) {
      setCurrentManualRange({ start: newStart, end: newEnd });
      controller?.setRanges([{
        start: newStart,
        end: newEnd,
        endInclusive: true,
        state: 'selected',
      }]);
    }
  };

  const onClickClearSelectedFacetValues = (): void => {
    controller?.deselectAll();
    focusManualRangeStartInput();
  };

  const renderManualRangeControls = () => {
    return (
      <div className="ManualRangeControls">
        <div className="ManualRangeLabels">
          <span>From: {currentManualRange.start}</span>
          <span>To: {currentManualRange.end}</span>
        </div>
        <div className="RangeSliderContainer">
          <div className="RangeLabels">
            <span>{state.domain?.min || 0}</span>
            <span>{state.domain?.max || 100}</span>
          </div>
          <div className="RangeTrack">
            <div 
              className="RangeFill" 
              style={{
                left: `${((currentManualRange.start - (state.domain?.min || 0)) / ((state.domain?.max || 100) - (state.domain?.min || 0))) * 100}%`,
                width: `${((currentManualRange.end - currentManualRange.start) / ((state.domain?.max || 100) - (state.domain?.min || 0))) * 100}%`
              }}
            />
            <input
              ref={manualRangeStartInputRef}
              type="range"
              className="RangeInput RangeInputStart"
              min={state.domain?.min || 0}
              max={state.domain?.max || 100}
              value={currentManualRange.start}
              onChange={(e) => onChangeSliderStart(Number(e.target.value))}
            />
            <input
              type="range"
              className="RangeInput RangeInputEnd"
              min={state.domain?.min || 0}
              max={state.domain?.max || 100}
              value={currentManualRange.end}
              onChange={(e) => onChangeSliderEnd(Number(e.target.value))}
            />
          </div>
        </div>
        <style jsx>{`
          .ManualRangeControls {
            margin: 1rem 0;
          }
          .ManualRangeLabels {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }
          .RangeSliderContainer {
            position: relative;
            height: 40px;
          }
          .RangeLabels {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .RangeTrack {
            position: relative;
            width: 100%;
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            margin-top: 20px;
          }
          .RangeFill {
            position: absolute;
            height: 100%;
            background: #3498db;
            border-radius: 2px;
          }
          .RangeInput {
            position: absolute;
            top: -8px;
            width: 100%;
            -webkit-appearance: none;
            pointer-events: none;
            background: transparent;
            height: 20px;
          }
          .RangeInput::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            pointer-events: auto;
            border: 2px solid white;
          }
          .RangeInput::-moz-range-thumb {
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

  const renderFacetValues = () => {
    return (
      <div className="FacetValues">
        <button
          aria-label="Clear selected facet values"
          className="FacetClear"
          disabled={!controller || state.isLoading || !state.hasActiveValues}
          onClick={onClickClearSelectedFacetValues}
          title="Clear selected facet values"
          type="reset"
        >
          X
        </button>
        {state.isLoading && <span> Facet is loading...</span>}
        <ul>
          {state.values.map((value, index) => {
            const checkboxId = `${value.start}-${value.end}-${value.endInclusive}`;
            return (
              <li className="FacetValue" key={index}>
                <input
                  checked={value.state !== 'idle'}
                  className="FacetValueCheckbox facet-checkbox"
                  disabled={!controller}
                  id={checkboxId}
                  onChange={() => controller?.toggleSelect(value)}
                  type="checkbox"
                />
                <label className="FacetValueLabel" htmlFor={checkboxId}>
                  <span className="FacetValueName">
                    {value.start} to {value.end}
                  </span>
                  <span className="FacetValueNumberOfProducts">
                    {' '}
                    ({value.numberOfResults})
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        <button
          aria-label="Show more facet values"
          className="FacetShowMore"
          disabled={!controller || state.isLoading || !state.canShowMoreValues}
          onClick={controller?.showMoreValues}
          title="Show more facet values"
        >
          +
        </button>
        <button
          aria-label="Show less facet values"
          className="FacetShowLess"
          disabled={!controller || state.isLoading || !state.canShowLessValues}
          onClick={controller?.showLessValues}
          title="Show less facet values"
        >
          -
        </button>
      </div>
    );
  };

  return (
    <fieldset className="NumericFacet facet-box">
      <legend className="FacetDisplayName">
        {state.displayName ?? state.facetId}
      </legend>
      {renderManualRangeControls()}
      {renderFacetValues()}
    </fieldset>
  );
}
