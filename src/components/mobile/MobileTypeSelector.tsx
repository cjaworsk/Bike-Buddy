"use client";

import React from "react";
import { usePoiTypes } from "@/hooks/usePoiTypes";
import { useMobileUI } from "@/context/MobileUIContext";
import styles from "./MobileTypeSelector.module.css";

export default function MobileTypeSelector() {
  const { types, toggleType, getButtonStyle } = usePoiTypes();
  const { showPOIMenu, drawerRef } = useMobileUI();

  if (!showPOIMenu) return null;

  return (
    <div ref={drawerRef} className={styles.drawerContainer}>
      {types.map(({ key, label, icon: IconComponent, isSelected }, index) => (
        <button
          key={key}
          onClick={() => toggleType(key)}
          className={`${styles.drawerButton} ${
            isSelected ? styles.selected : ""
          }`}
          style={{
            animationDelay: `${index * 0.1}s`,
            transform: `translateX(${-60 * (index + 1)}px)`, // Slide left from POI button
            ...getButtonStyle(key),
          }}
          title={label}
        >
          <IconComponent className={styles.icon} />
        </button>
      ))}
    </div>
  );
}

