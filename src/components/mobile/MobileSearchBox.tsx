"use client";

import React from "react";
import SearchBox from "../toolbar/SearchBox";
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
  const handleLocationSelectWrapper = (lat: number, lng: number, displayName: string) => {
    onLocationSelect(lat, lng, displayName);
    onClose(); // Close the search panel after selection
  };

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
          <SearchBox
            onLocationSelect={handleLocationSelectWrapper}
            placeholder={placeholder}
            className={styles.fullSearchBox}
          />
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
