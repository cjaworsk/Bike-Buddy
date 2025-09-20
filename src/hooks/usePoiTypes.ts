import { usePoiFilters } from "@/context/PoiFilterContext";
import { FaRestroom, FaCoffee } from "react-icons/fa";
import { MdLocalDrink } from "react-icons/md";
import { POIType } from "@/types/POI";

interface TypeOption {
  key: POIType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isSelected: boolean;
}

export function usePoiTypes() {
  const { activeTypes, toggleType } = usePoiFilters();

  // Define all POI types in one place
  const baseTypes: Omit<TypeOption, "isSelected">[] = [
    { key: "toilet", label: "Toilets", icon: FaRestroom, color: "#007BFF" },
    { key: "drinking_water", label: "Water", icon: MdLocalDrink, color: "#20C997" },
    { key: "cafe", label: "Cafe", icon: FaCoffee, color: "#FF8C00" },
  ];

  // Decorate each type with selection state
  const types: TypeOption[] = baseTypes.map((t) => ({
    ...t,
    isSelected: activeTypes.includes(t.key),
  }));

  const getButtonStyle = (key: POIType) => {
    const type = types.find((t) => t.key === key);
    if (!type) return {};
    return type.isSelected
      ? { backgroundColor: type.color, borderColor: type.color, color: "white" }
      : {};
  };

  return {
    types,
    toggleType,
    getButtonStyle,
  };
}

