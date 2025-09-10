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
  const { selectedTypes, toggleType } = usePoiFilters();

  // POI Types + Icons (assumes you have these in /public/icons/)
  const types:TypeOption[] = [
    { key: "toilet", label: "Toilets", icon: "/toilet.png" },
    { key: "drinking_water", label: "Water", icon: "/water.png" },
    { key: "cafe", label: "Cafe", icon: "/coffee.png" },
  ];

  return (
    <div className="type-selector-container">
      {types.map((typeOption: TypeOption) => {
        const { key, label, icon } = typeOption;
        const isSelected = selectedTypes.includes(key);

        return (
          <button
            key={key}
            onClick={() => toggleType(key)}
            className={`type-button ${isSelected ? 'isSelected' : ''}`}
          >
            <Image className="type-button-icon"
              src={icon}
              alt={label}
              width={20}
              height={20}
            />
            <span className="type-button-label"> {label}</span>
          </button>
        );
      })}
    </div>
  );
}
