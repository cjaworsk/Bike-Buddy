"use client";

import React, { useState, useEffect } from "react";

import { LuMapPin } from "react-icons/lu";
import { BiCurrentLocation } from "react-icons/bi";
import styles from "./MobileToolbar.module.css";
import { RouteData } from "@/types/RouteData";
import MobileTypeSelector from "./MobileTypeSelector";
import SearchBox from "./SearchBox";

interface MobileToolbarProps {
  onRouteLoad: (routeData: RouteData) => void;
  onRouteRemove: () => void;
  onPOIToggle: (show: boolean) => void;
  onLocationSelect: (lat: number, lng: number, displayName: string) => void;
  onCurrentLocationFound?: (lat: number, lng: number) => void; // New prop for blue dot
}

const MobileToolbar: React.FC<MobileToolbarProps> = ({
  onRouteLoad,
  onRouteRemove,
  //onPOIToggle,
  onLocationSelect,
  onCurrentLocationFound,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showPOIMenu, setShowPOIMenu] = useState(false);

  useEffect(() => {
    // Delay toolbar rendering until map is loaded (mimicking MapToolbar)
    const timer = setTimeout(() => setShowToolbar(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get current location on mount for initial map view
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Set as initial map view and show blue dot
          onLocationSelect(latitude, longitude, "Current Location");
          if (onCurrentLocationFound) {
            onCurrentLocationFound(latitude, longitude);
          }
        },
        (error) => {
          console.warn("Could not get initial location:", error);
          // Fallback to a default location if geolocation fails
          // You can set this to your preferred default location
          onLocationSelect(37.7749, -122.4194, "San Francisco, CA"); // Example default
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Fallback if geolocation is not supported
      onLocationSelect(37.7749, -122.4194, "San Francisco, CA"); // Example default
    }
  }, [onLocationSelect, onCurrentLocationFound]);

  const parseGPX = (gpxText: string) => {
    const parser = new DOMParser();
    const gpx = parser.parseFromString(gpxText, 'text/xml');
    
    // Get route name
    const routeName = gpx.querySelector('trk name')?.textContent || 
                     gpx.querySelector('rte name')?.textContent || 
                     'Imported Route';
    
    // Get all track points from all segments
    const trackPoints: Array<{lat: number, lon: number}> = [];
    
    // Try tracks first (most common)
    const tracks = gpx.querySelectorAll('trk');
    tracks.forEach(track => {
      const segments = track.querySelectorAll('trkseg');
      segments.forEach(segment => {
        const points = segment.querySelectorAll('trkpt');
        points.forEach(point => {
          const lat = parseFloat(point.getAttribute('lat') || '0');
          const lon = parseFloat(point.getAttribute('lon') || '0');
          if (lat !== 0 && lon !== 0) {
            trackPoints.push({ lat, lon });
          }
        });
      });
    });
    
    // If no tracks, try routes
    if (trackPoints.length === 0) {
      const routes = gpx.querySelectorAll('rte');
      routes.forEach(route => {
        const points = route.querySelectorAll('rtept');
        points.forEach(point => {
          const lat = parseFloat(point.getAttribute('lat') || '0');
          const lon = parseFloat(point.getAttribute('lon') || '0');
          if (lat !== 0 && lon !== 0) {
            trackPoints.push({ lat, lon });
          }
        });
      });
    }
    
    return {
      name: routeName,
      points: trackPoints
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      // Currently only supporting GPX files (matching your MapButton implementation)
      if (!file.name.toLowerCase().endsWith('.gpx')) {
        alert('Only GPX files are currently supported');
        return;
      }
      
      const parsed = parseGPX(text);
      
      if (parsed.points.length === 0) {
        alert('No valid GPS points found in the GPX file');
        return;
      }
      
      console.log("Route loaded:", parsed.name, `${parsed.points.length} points`);
      onRouteLoad(parsed);
      setShowPanel(false); // Close panel after loading
      
      // Reset file input so same file can be selected again
      e.target.value = '';
    } catch (error) {
      console.error('Error parsing GPX file:', error);
      alert('Error reading GPX file. Please check the file format.');
    }
  };

  const handlePOIToggle = () => {
    setShowPOIMenu(!showPOIMenu);
  };

  /*const handleRouteLoadClick = () => {
    // Toggle the expandable panel instead of directly loading route
    setShowPanel(!showPanel);
  };*/

  const handleCurrentLocation = () => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect(latitude, longitude, "Current Location");
          // Also notify parent about current location for blue dot
          if (onCurrentLocationFound) {
            onCurrentLocationFound(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  if (!showToolbar) return null;

  return (
    <div className={styles.container}>
      {/* POI Type Selector Component - Renders when showPOIMenu is true */}
      <MobileTypeSelector 
        isOpen={showPOIMenu}
        onClose={() => setShowPOIMenu(false)}
      />

      {/* Floating buttons top-right */}
      <div className={styles.topRightButtons}>
        <button
          className={`${styles.iconButton} ${showPOIMenu ? styles.active : ''}`}
          onClick={handlePOIToggle}
          title="Toggle POI"
        >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LuMapPin size={22} style={{ marginTop: '-4px' }} />
            <span style={{ 
              position: 'absolute', 
              bottom: '-6px', 
              fontSize: '8px', 
              fontWeight: 'bold',
              color: 'inherit',
              lineHeight: '1'
            }}>
              POI
            </span>
          </div>
        </button>

        {/* Current location button */}
        <button
          className={styles.iconButton}
          onClick={handleCurrentLocation}
          title="Current Location"
        >
          <BiCurrentLocation size={25} />
        </button>
      </div>

      {/* Bottom search bar using SearchBox component */}
      <div className={styles.searchContainer}>
        <SearchBox
          onLocationSelect={onLocationSelect}
          placeholder="Search locations..."
          className={styles.searchBox}
        />
        
        {/* Expand/collapse button */}
        <button 
          className={styles.expandButton}
          onClick={() => setShowPanel(!showPanel)}
          title={showPanel ? "Collapse" : "Expand route options"}
        >
          {showPanel ? "▼" : "▲"}
        </button>
      </div>

      {/* Expandable route panel */}
      {showPanel && (
        <div className={styles.routePanel}>
          <div className={styles.routePanelContent}>
            <h3>Route Options</h3>
            <input
              type="file"
              accept=".gpx"
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
            <button 
              onClick={() => onRouteRemove()}
              className={styles.removeRouteButton}
              title="Remove current route"
            >
              Remove Route
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileToolbar;
