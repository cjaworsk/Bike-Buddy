// src/types/POIProperties.ts
export interface POIProperties {
  // Common across multiple POI types
  opening_hours?: string;
  wheelchair?: string;
  fee?: string;
  access?: string;

  // Toilets
  gender?: string;

  // Cafes
  cuisine?: string;
  website?: string;

  // Water fountains
  fountain_type?: string;
  indoor?: string;
  bottle?: string;
  dog?: string;
}

