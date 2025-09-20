// MobileRoutePanel.tsx
import React, { useState } from "react";
import { useRoute } from "@/context/RouteContext";
import { useMobileRouteUpload } from "@/hooks/useMobileRouteUpload";
import styles from "./MobileInterface.module.css";

export default function MobileRoutePanel() {
  const [showPanel, setShowPanel] = useState(true);
  const { removeRoute } = useRoute();
  const { handleFileUpload, error, clearError } = useMobileRouteUpload();

  return (
    <div className={styles.bottomContainer}>
      {showPanel && (
        <div className={styles.routePanel}>
          <div className={styles.routePanelContent}>
            <h4>Route Options</h4>

            <input
              type="file"
              accept=".gpx"
              onChange={handleFileUpload}
              className={styles.fileInput}
            />

            <button
              onClick={() => {
                removeRoute();
                setShowPanel(false);
              }}
              className={styles.removeRouteButton}
              title="Remove current route"
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
        </div>
      )}
    </div>
  );
}

