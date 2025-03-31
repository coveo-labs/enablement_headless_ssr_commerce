'use client';

import {
  useInstantProducts,
  useSearchBox,
} from '@/lib/commerce-engine';
import {useState} from 'react';
import InstantProducts from './instant-product';

export default function SearchBox() {
  const {state, methods} = useSearchBox();
  const {state: instantProductsState, methods: instantProductsController} =
    useInstantProducts();

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);

  const onSearchBoxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelectingSuggestion(true);
    methods?.updateText(e.target.value);
    instantProductsController?.updateQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
      setIsSelectingSuggestion(false);
    }, 150);
  };

  return (
    <div>
      <input
        type="search"
        className="search-input"
        aria-label="searchbox"
        placeholder="search"
        value={state.value}
        onChange={(e) => onSearchBoxInputChange(e)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      ></input>
      {state.value !== '' && (
        <span>
          <button 
            onClick={() => { 
              methods?.clear(); 
              methods?.submit(); 
            }} 
            className="clear-button clear-btn"
          >
            X
          </button>
        </span>
      )}
      <button onClick={methods?.submit} className="search-button search-btn">Search</button>

      {isInputFocused && state.suggestions.length > 0 && (
        <div className="search-suggestions-alt">
          <div className="suggestions-left">
            <ul>
              {state.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => methods?.selectSuggestion(suggestion.rawValue)}
                  dangerouslySetInnerHTML={{ __html: suggestion.highlightedValue }}
                ></li>
              ))}
            </ul>
          </div>
          <div className="instant-products-right">
            {instantProductsState.products.length > 0 && <InstantProducts />}
          </div>
        </div>
      )}
    </div>
  );
}
