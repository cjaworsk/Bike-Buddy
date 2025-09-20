import React from "react";
import { LuMapPin } from "react-icons/lu";
import { useMobileUI } from "@/context/MobileUIContext";
import styles from "./MobileInterface.module.css";

export default function MobilePOIButton() {
  const { showPOIMenu, togglePOIMenu } = useMobileUI();

  return (
    <button
      type="button"
      onClick={togglePOIMenu}
      title="Toggle POI"
      className={`${styles.iconButton} ${showPOIMenu ? styles.active : ""}`}
    >
      <div className={styles.iconWithLabel}>
        <LuMapPin size={22} />
        <span className={styles.iconLabel}>POI</span>
      </div>
    </button>
  );
}

