// src/types/POI.ts
import { ObjectId } from "mongodb";

export type POIType = "toilet" | "drinking_water" | "cafe";
export type POISource = "osm" | "yelp"; // can add more later

export interface POI {
  _id?: ObjectId;

  // Core identifiers
  osmId: number;             // OSM element ID (or numeric id from other sources)
  type: POIType;             // toilet | drinking_water | cafe
  source: POISource;         // where the data came from
  name: string;

  // Location
  lat: number;
  lon: number;

  // Raw tags (straight from OSM or source API)
  tags?: Record<string, string>;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

