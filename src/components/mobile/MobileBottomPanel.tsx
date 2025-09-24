import React, { useState, useRef } from "react";
import { useRoute } from "@/context/RouteContext";
import { useLocationContext } from "@/context/LocationContext";
import { useMobileRouteUpload } from "@/hooks/useMobileRouteUpload";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { BiSearch } from "react-icons/bi";
import styles from "./MobileBottomPanel.module.css";

type PanelState = "collapsed" | "search" | "expanded";

export default function MobileBottomPanel() {
  const [panelState, setPanelState] = useState<PanelState>("collapsed");
  const { removeRoute } = useRoute();
  const { onLocationSelect } = useLocationContext();
  const { handleFileUpload, error, clearError } = useMobileRouteUpload();
  
  // Use the location search hook
  const {
    query,
    setQuery,
    results,
    isLoading,
    selectedIndex,
    setSelectedIndex,
    handleResultSelect: hookHandleResultSelect,
    formatDisplayName,
    highlightText
  } = useLocationSearch({
    onLocationSelect: (lat, lng, displayName) => {
      onLocationSelect(lat, lng, displayName);
      setQuery(displayName.split(',')[0]);
      setPanelState("collapsed");
    }
  });
  
  // Touch/drag handling for slide up gesture
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = startY.current - currentY;
    
    // If swiping up significantly, expand panel
    if (deltaY > 50) {
      setPanelState("expanded");
      isDragging.current = false;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleSearchFocus = () => {
    setPanelState("search");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      hookHandleResultSelect(results[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(selectedIndex < results.length - 1 ? selectedIndex + 1 : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : results.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          hookHandleResultSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          hookHandleResultSelect(results[0]);
        }
        break;
      case "Escape":
        setPanelState("collapsed");
        setQuery("");
        break;
    }
  };

  const handleBackdropClick = () => {
    if (panelState !== "collapsed") {
      setPanelState("collapsed");
      setQuery("");
    }
  };

  return (
    <>
      {/* Backdrop for search/expanded states */}
      {panelState !== "collapsed" && (
        <div className={styles.backdrop} onClick={handleBackdropClick} />
      )}
      
      <div 
        ref={panelRef}
        className={`${styles.panel} ${styles[panelState]}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className={styles.dragHandle} />
        
        {/* Search Bar - Always Visible */}
        <div className={styles.searchSection}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <BiSearch className={styles.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onKeyDown={handleKeyDown}
              placeholder="Search for places..."
              className={styles.searchInput}
            />
            {isLoading && (
              <div className={styles.searchLoading}>⟳</div>
            )}
          </form>
        </div>

        {/* Search Results - Shown in search state */}
        {panelState === "search" && results.length > 0 && (
          <div className={styles.searchResults}>
            {results.map((result, index) => (
              <button
                key={result.place_id}
                onClick={() => hookHandleResultSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`${styles.searchResult} ${index === selectedIndex ? styles.selectedResult : ''}`}
              >
                <div className={styles.resultName}>
                  {highlightText(formatDisplayName(result.display_name), query)}
                </div>
                <div className={styles.resultAddress}>
                  {result.type.replace('_', ' ')}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {panelState === "search" && query.length >= 2 && !isLoading && results.length === 0 && (
          <div className={styles.noResults}>
            {`No results found for "${query}"`}
          </div>
        )}

        {/* Route Panel - Shown in expanded state */}
        {panelState === "expanded" && (
          <div className={styles.routeSection}>
            <h3 className={styles.sectionTitle}>Route Options</h3>
            
            <input
              type="file"
              accept=".gpx"
              onChange={handleFileUpload}
              className={styles.fileInput}
            />

            <button
              onClick={() => {
                removeRoute();
                setPanelState("collapsed");
              }}
              className={styles.removeRouteButton}
            >
              Remove Route
            </button>

            {error && (
              <div className={styles.errorMessage}>
                {error}
                <button onClick={clearError} className={styles.clearError}>
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
