"use client";

import React from 'react';
import { FaMap, FaMapMarkedAlt } from 'react-icons/fa';
import { useRoute } from '@/context/RouteContext';
import { usePoiFilters } from '@/context/PoiFilterContext';
import styles from './MobileInterface.module.css';

export default function MobileRouteButtons() {
  // Get route display from RouteContext
  const { routeData, showRouteDisplay, toggleRouteDisplay } = useRoute();
  
  // Get POI filtering from PoiFilterContext
  const { showAdjacentPOIs, toggleAdjacentPOIs } = usePoiFilters();

  // Don't show buttons if no route is loaded
  if (!routeData) return null;

  return (
    <div className={styles.routeButtons}>
      {/* Route Display Toggle Button */}
      <button
        onClick={toggleRouteDisplay}
        className={`${styles.routeButton} ${showRouteDisplay ? styles.routeButtonActive : ''}`}
        title={showRouteDisplay ? 'Hide Route' : 'Show Route'}
      >
        <FaMap size={16} />
      </button>

      {/* Separator line */}
      <div className={styles.routeButtonSeparator} />

      {/* Adjacent POIs Toggle Button */}
      <button
        onClick={toggleAdjacentPOIs}
        className={`${styles.routeButton} ${showAdjacentPOIs ? styles.routeButtonActive : ''}`}
        title={showAdjacentPOIs ? 'Show All POIs' : 'Show Only Adjacent POIs'}
      >
        <FaMapMarkedAlt size={16} />
      </button>
    </div>
  );
}
