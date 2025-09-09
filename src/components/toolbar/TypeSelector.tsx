/*
import Image from "next/image";
import { usePoiFilters } from "@/context/PoiFilterContext";

export default function TypeSelector() {
  const { selectedTypes, toggleType } = usePoiFilters();

  // POI Types + Icons (assumes you have these in /public/icons/)
  const types = [
    { key: "toilet", label: "Toilets", icon: "/toilet.png" },
    { key: "drinking_water", label: "Water", icon: "/water.png" },
    { key: "cafe", label: "Cafe", icon: "/coffee.png" },
  ];

  return (
    <div className="flex flex-row gap-3 rounded-lg">
      {types.map(({ key, label, icon }) => {
        const isSelected = selectedTypes.includes(key as any);

        return (
          <button
            key={key}
            onClick={() => toggleType(key as any)}
            className={`type-button flex flex-row items-center font-bold justify-center px-2 py-1 rounded-lg 
              ${isSelected 
                ? "isSelected" 
                : "border-slate-300 bg-white hover:bg-slate-100"}
              `}
          >
            <Image
              src={icon}
              alt={label}
              width={20}
              height={20}
              className="mb-1"
            />
            <span className="text-xs text-slate-600 px-2">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
*/ 
import Image from "next/image";
import { usePoiFilters } from "@/context/PoiFilterContext";

export default function TypeSelector() {
  const { selectedTypes, toggleType } = usePoiFilters();

  // POI Types + Icons (assumes you have these in /public/icons/)
  const types = [
    { key: "toilet", label: "Toilets", icon: "/toilet.png" },
    { key: "drinking_water", label: "Water", icon: "/water.png" },
    { key: "cafe", label: "Cafe", icon: "/coffee.png" },
  ];

  return (
    <div className="type-selector-container">
      {types.map(({ key, label, icon }) => {
        const isSelected = selectedTypes.includes(key as any);

        return (
          <button
            key={key}
            onClick={() => toggleType(key as any)}
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
