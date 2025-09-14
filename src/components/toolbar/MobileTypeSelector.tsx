import React, { useEffect } from "react";
import { usePoiFilters } from "@/context/PoiFilterContext";
import { POIType } from "@/types/POI";
import { FaRestroom, FaCoffee } from "react-icons/fa";
import { MdLocalDrink } from "react-icons/md";
import styles from "./MobileTypeSelector.module.css";

// Define a proper type for POI options
interface TypeOption {
  key: POIType;
  label: string;
  icon: React.ComponentType<{ className?: string }>; // React icon component
}

interface MobileTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileTypeSelector: React.FC<MobileTypeSelectorProps> = ({
  isOpen,
  onClose,
}) => {
  // Use POI filter context
  const { selectedTypes, toggleType } = usePoiFilters();

  // POI Types + Icons using react-icons
  const types: TypeOption[] = [
    { key: "toilet", label: "Toilets", icon: FaRestroom },
    { key: "drinking_water", label: "Water", icon: MdLocalDrink },
    { key: "cafe", label: "Cafe", icon: FaCoffee },
  ];

  // Colors that match the map markers
  const getButtonStyle = (key: POIType, isSelected: boolean) => {
    const colors: Record<POIType, string> = {
      toilet: "#007BFF",
      drinking_water: "#20C997", 
      cafe: "#FF8C00"  // Changed from 'coffee' to 'cafe'
    };

    return isSelected ? {
      backgroundColor: colors[key],
      borderColor: colors[key],
      color: 'white'
    } : {};
  };

  // Close when clicking outside the POI buttons or the flag button
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on:
      // - The POI button container or any of its children
      // - The flag button that opens/closes this menu
      if (!target.closest(`.${styles.buttonContainer}`) && 
          !target.closest('[title="Toggle POI"]')) {
        onClose();
      }
    };

    // Use a small delay to avoid immediately closing when the flag button opens the menu
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Floating buttons that slide left from the flag - NO BACKDROP */}
      <div className={styles.buttonContainer}>
        {types.map((typeOption: TypeOption, index) => {
          const { key, label, icon: IconComponent } = typeOption;
          const isSelected = selectedTypes.includes(key);
          
          return (
            <button
              key={key}
              onClick={() => toggleType(key)}
              className={`${styles.floatingButton} ${isSelected ? styles.selected : ''}`}
              style={{
                // Stagger the animation delay for each button
                animationDelay: `${index * 0.1}s`,
                // Apply color-specific styling when selected
                ...getButtonStyle(key, isSelected)
              }}
              title={label}
            >
              <IconComponent className={styles.icon} />
            </button>
          );
        })}
      </div>
    </>
  );
};

export default MobileTypeSelector;
