"use client";

import React from 'react';
import { FaRoute } from 'react-icons/fa';
//import { useRoute } from '@/context/RouteContext';
import { useMobileUI } from '@/context/MobileUIContext';
import styles from './MobileInterface.module.css';

export default function MobileRouteButtons() {
  // Get route data from RouteContext
  //const { routeData } = useRoute();
  
  // Get UI state from MobileUIContext
  const { toggleRoutePanel, routePanelOpen } = useMobileUI();

  console.log('MobileRouteButtons render - routePanelOpen:', routePanelOpen);

  // Always show the single route button
  return (
    <div className={styles.routeButtons}>
      <button
        onClick={() => {
          console.log('Route button clicked, current state:', routePanelOpen);
          toggleRoutePanel();
        }}
        className={`${styles.routeButton} ${routePanelOpen ? styles.routeButtonActive : ''}`}
        title="Route Options"
      >
        <FaRoute size={16} />
      </button>
    </div>
  );
}
