import React from "react";
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

  if (!isOpen) return null;

  return (
    <>
      {/* Transparent backdrop */}
      <div className={styles.backdrop} onClick={onClose} />
      
      {/* Floating buttons that slide left from the flag */}
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
                animationDelay: `${index * 0.1}s`
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
