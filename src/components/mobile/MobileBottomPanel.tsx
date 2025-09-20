import React, { useState, useRef } from "react";
import { useRoute } from "@/context/RouteContext";
import { useLocationContext } from "@/context/LocationContext";
import { useMobileRouteUpload } from "@/hooks/useMobileRouteUpload";
import { BiSearch } from "react-icons/bi";
import styles from "./MobileBottomPanel.module.css";

type PanelState = "collapsed" | "search" | "expanded";

// Define the interface
interface SearchResult {
  id: number;
  lat: number;
  lng: number;
  name: string;
  address?: string;
  type?: string;
}

export default function MobileBottomPanel() {
  const [panelState, setPanelState] = useState<PanelState>("collapsed");
  const [searchQuery, setSearchQuery] = useState("");
  //const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { removeRoute } = useRoute();
  const { onLocationSelect } = useLocationContext();
  const { handleFileUpload, error, clearError } = useMobileRouteUpload();
  
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      // Simulate search results - replace with actual search API
      setSearchResults([
        { id: 1, name: "Starbucks Coffee", address: "123 Main St", lat: 37.7749, lng: -122.4194 },
        { id: 2, name: "Golden Gate Park", address: "San Francisco, CA", lat: 37.7694, lng: -122.4862 }
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search submission
      console.log("Search submitted:", searchQuery);
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    onLocationSelect(result.lat, result.lng, result.name);
    setSearchQuery(result.name);
    setSearchResults([]);
    setPanelState("collapsed");
  };

  const handleBackdropClick = () => {
    if (panelState !== "collapsed") {
      setPanelState("collapsed");
      setSearchQuery("");
      setSearchResults([]);
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
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder="Search for places..."
              className={styles.searchInput}
            />
          </form>
        </div>

        {/* Search Results - Shown in search state */}
        {panelState === "search" && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultSelect(result)}
                className={styles.searchResult}
              >
                <div className={styles.resultName}>{result.name}</div>
                <div className={styles.resultAddress}>{result.address}</div>
              </button>
            ))}
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
