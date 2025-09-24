// MobileRoutePanel.tsx
import React, { useRef, useState } from "react";
import { useRoute } from "@/context/RouteContext";
import { usePoiFilters } from "@/context/PoiFilterContext";
import { useMobileRouteUpload } from "@/hooks/useMobileRouteUpload";
import { useMobileUI } from "@/context/MobileUIContext";
import styles from "./MobileInterface.module.css";

export default function MobileRoutePanel() {
  const { removeRoute, showRouteDisplay, toggleRouteDisplay, routeData } = useRoute();
  const { showAdjacentPOIs, toggleAdjacentPOIs } = usePoiFilters();
  const { handleFileUpload, error, clearError } = useMobileRouteUpload();
  const { routePanelOpen, toggleRoutePanel } = useMobileUI();
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName("");
    }
    await handleFileUpload(e);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!routePanelOpen) {
    return null;
  }


  return (
    <>
      {/* Backdrop */}
      <div 
        className={styles.backdrop} 
        onClick={(e) => {
          e.stopPropagation();
          toggleRoutePanel();
        }} 
      />
      
      {/* Route Panel */}
      <div className={styles.routePanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.routePanelContent}>
          {/* Drag Handle */}
          <div className={styles.dragHandle} />
          
          <h4 className={styles.sectionTitle}>Route Options</h4>

          {/* Toggle Buttons Row */}
          <div className={styles.toggleButtonsRow}>
            <button
              onClick={() => {
                toggleRouteDisplay();
              }}
              className={`${styles.toggleButton} ${showRouteDisplay ? styles.toggleButtonActive : ''}`}
            >
              Show Route
            </button>
            
            <button
              onClick={() => {
                  toggleAdjacentPOIs();
              }}
              className={`${styles.toggleButton} ${showAdjacentPOIs ? styles.toggleButtonActive : ''}`}
            >
              Show POI
            </button>
          </div>

          {/* Custom File Upload */}
          <div className={styles.customFileUpload}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".gpx"
              onChange={handleCustomFileUpload}
              style={{ display: 'none' }}
            />
            <button onClick={triggerFileInput} className={styles.fileUploadButton}>
              Choose GPX File
            </button>
            <span className={styles.fileName}>
              {selectedFileName || routeData?.name || "No file chosen"}
            </span>
          </div>

          {/* Remove Route Button */}
          <button
            onClick={() => {
              removeRoute();
              setSelectedFileName(""); // Clear filename when route is removed
              toggleRoutePanel(); // Close panel after removing route
            }}
            className={styles.removeRouteButton}
          >
            Remove Route
          </button>

          {/* Error Display */}
          {error && (
            <div className={styles.errorMessage}>
              {error}
              <button onClick={clearError} className={styles.clearError}>
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
