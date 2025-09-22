import Image from "next/image";
import { usePoiFilters } from "@/context/PoiFilterContext";
import { POIType } from "@/types/POI";

// Define a proper type for POI options
interface TypeOption {
  key: POIType;
  label: string;
  icon: string; // path to the icon image
}

export default function TypeSelector() {
  const { activeTypes, toggleType, filteredPois } = usePoiFilters();

  // POI Types + Icons (assumes you have these in /public/icons/)
  const types: TypeOption[] = [
    { key: "toilet", label: "Toilets", icon: "/toilet.png" },
    { key: "drinking_water", label: "Water", icon: "/water.png" },
    { key: "cafe", label: "Cafe", icon: "/coffee.png" },
  ];

  // Count POIs by type for display
  const getTypeCount = (type: POIType): number => {
    return filteredPois.filter(poi => poi.type === type).length;
  };

  return (
    <div className="type-selector-container">
      {types.map((typeOption: TypeOption) => {
        const { key, label, icon } = typeOption;
        const isSelected = activeTypes.includes(key);
        const count = getTypeCount(key);

        return (
          <button
            key={key}
            onClick={() => toggleType(key)}
            className={`type-button ${isSelected ? 'isSelected' : ''}`}
            title={`${label}: ${count} visible`}
          >
            <Image 
              className="type-button-icon"
              src={icon}
              alt={label}
              width={20}
              height={20}
            />
            <span className="type-button-label">
              {label} ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
