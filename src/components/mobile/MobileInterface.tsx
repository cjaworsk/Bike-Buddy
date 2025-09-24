"use client";

import React, { useState, useEffect } from "react";
import { MobileUIProvider } from "@/context/MobileUIContext";
import styles from "./MobileInterface.module.css";
import MobileTypeSelector from "./MobileTypeSelector";
import MobileLocationButton from "./MobileLocationButton";
import MobileBottomPanel from "./MobileBottomPanel";
import MobilePOIButton from "./MobilePOIButton";
import MobileRouteButtons from "./MobileRouteButtons";
import MobileRoutePanel from "./MobileRoutePanel";

function MobileInterfaceInner() {
  const [showToolbar, setShowToolbar] = useState(false);

  // Show toolbar after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToolbar(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showToolbar) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Drawer (Type Selector) */}
      <MobileTypeSelector />

      {/* Top Right Buttons */}
      <div className={styles.topRightButtons}>
        <MobilePOIButton />
        <MobileLocationButton />
        {/* Route control buttons - no props needed now! */}
        <MobileRouteButtons />
      </div>

      {/* Bottom Panel */}
      <MobileBottomPanel />
      
      {/* Route Panel */}
      <MobileRoutePanel />
    </div>
  );
}

const MobileInterface: React.FC = () => {
  return (
    <MobileUIProvider>
      <MobileInterfaceInner />
    </MobileUIProvider>
  );
};

export default MobileInterface;
