"use client";

import { useStandaloneSearchBox } from "../lib/commerce-engine";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StandaloneSearchBox() {
  const standaloneSearchBox = useStandaloneSearchBox();

  const router = useRouter();

  useEffect(() => {
    if (standaloneSearchBox.state.redirectTo === "/search") {
      const url = `${standaloneSearchBox.state.redirectTo}?q=${encodeURIComponent(standaloneSearchBox.state.value)}`;
      router.push(url, { scroll: false });
      standaloneSearchBox.methods?.afterRedirection();
    }
  }, [standaloneSearchBox.state.redirectTo, standaloneSearchBox.state.value, router, standaloneSearchBox.methods]);

  const onSearchBoxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    standaloneSearchBox.methods?.updateText(e.target.value);
  };

  return (
    <div>
      <input
        type="search"
        className="search-input"
        aria-label="searchbox"
        placeholder="search"
        value={standaloneSearchBox.state.value}
        onChange={(e) => onSearchBoxInputChange(e)}
      ></input>
      {standaloneSearchBox.state.value !== "" && (
        <span>
          <button onClick={standaloneSearchBox.methods?.clear} className="clear-button clear-btn">
            X
          </button>
        </span>
      )}
      <button onClick={() => standaloneSearchBox.methods?.submit()} className="search-button search-btn">
        Search
      </button>

      {standaloneSearchBox.state.suggestions.length > 0 && (
        <ul className="search-suggestions">
          {standaloneSearchBox.state.suggestions.map((suggestion, index) => (
            <li key={index} className="search-suggestion-item">
              <span
                onClick={() => standaloneSearchBox.methods?.selectSuggestion(suggestion.rawValue)}
                dangerouslySetInnerHTML={{
                  __html: suggestion.highlightedValue,
                }}
                className="search-suggestion-text"
              ></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
