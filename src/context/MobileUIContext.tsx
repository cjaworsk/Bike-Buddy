"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

interface MobileUIContextType {
  showPOIMenu: boolean;
  setShowPOIMenu: (show: boolean) => void;
  togglePOIMenu: () => void;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  routePanelOpen: boolean;
  setRoutePanelOpen: (open: boolean) => void;
  toggleRoutePanel: () => void;
}

const MobileUIContext = createContext<MobileUIContextType | undefined>(undefined);

export function useMobileUI() {
  const context = useContext(MobileUIContext);
  if (!context) {
    throw new Error("useMobileUI must be used within a MobileUIProvider");
  }
  return context;
}

export function MobileUIProvider({ children }: { children: ReactNode }) {
  const [showPOIMenu, setShowPOIMenu] = useState(false);
  const [routePanelOpen, setRoutePanelOpen] = useState(false);
  
  const togglePOIMenu = () => setShowPOIMenu((prev) => !prev);
  const toggleRoutePanel = () => setRoutePanelOpen((prev) => !prev);
  
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPOIMenu) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // If click is outside of the drawer AND not the POI button, close
      if (
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        !(target as HTMLElement).closest('[title="Toggle POI"]')
      ) {
        setShowPOIMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showPOIMenu]);

  return (
    <MobileUIContext.Provider
      value={{ 
        showPOIMenu, 
        setShowPOIMenu, 
        togglePOIMenu, 
        drawerRef,
        routePanelOpen,
        setRoutePanelOpen,
        toggleRoutePanel
      }}
    >
      {children}
    </MobileUIContext.Provider>
  );
}
