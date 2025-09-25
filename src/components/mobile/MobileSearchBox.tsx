"use client";

import React, { useRef, useEffect } from "react";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import styles from "./MobileInterface.module.css";

interface MobileSearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number, displayName: string) => void;
  placeholder: string;
}

const MobileSearchBox: React.FC<MobileSearchBoxProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  placeholder
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLocationSelectWrapper = (lat: number, lng: number, displayName: string) => {
    onLocationSelect(lat, lng, displayName);
    clearSearch(); // Clear the search after selection
    onClose(); // Close the search panel after selection
  };

  const {
    query,
    setQuery,
    results,
    isLoading,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleResultSelect,
    clearSearch,
    formatDisplayName,
    highlightText
  } = useLocationSearch({
    onLocationSelect: handleLocationSelectWrapper
  });

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Search Panel - slides down from top when open */}
      <div className={styles.searchPanel}>
        <div className={styles.searchPanelHeader}>
          <h3>Search Location</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.searchPanelContent}>
          {/* Search Input */}
          <div className={styles.searchInputContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={styles.searchInput}
              autoComplete="off"
            />
            {isLoading && (
              <span className={styles.searchLoading}>⟳</span>
            )}
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className={styles.searchResults}>
              {results.map((result, index) => (
                <button
                  key={result.place_id}
                  onClick={() => handleResultSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`${styles.searchResult} ${index === selectedIndex ? styles.selectedResult : ''}`}
                >
                  <div className={styles.resultName}>
                    {highlightText(formatDisplayName(result.display_name), query)}
                  </div>
                  <div className={styles.resultType}>
                    {result.type.replace('_', ' ')}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div className={styles.noResults}>
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close search panel when clicking outside */}
      <div 
        className={styles.searchOverlay}
        onClick={onClose}
      />
    </>
  );
};

export default MobileSearchBox;
