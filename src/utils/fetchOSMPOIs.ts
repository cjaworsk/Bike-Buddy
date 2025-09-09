// src/utils/fetchOSMPOIs.ts
import type { POI, POIType } from "@/types/POI";

/**
 * Fetch POIs from Overpass API within a bbox.
 * @param type The POI type ("toilet" | "drinking_water" | "cafe")
 * @param bbox Bounding box: [south, west, north, east]
 */
export async function fetchOSMPOIs(
  type: POIType,
  bbox: [number, number, number, number]
): Promise<POI[]> {
  const [south, west, north, east] = bbox;

  // Map POIType → OSM tag query
  let key = "";
  if (type === "toilet") key = "amenity=toilets";
  if (type === "drinking_water") key = "amenity=drinking_water";
  if (type === "cafe") key = "amenity=cafe";

  const query = `
    [out:json][timeout:25];
    (
      node[${key}](${south},${west},${north},${east});
      way[${key}](${south},${west},${north},${east});
      relation[${key}](${south},${west},${north},${east});
    );
    out center;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  if (!res.ok) {
    throw new Error(`Overpass query failed: ${res.statusText}`);
  }

  const data = await res.json();

  // Normalize into POI objects
  return data.elements.map((el: any) => ({
    osmId: el.id,
    type,
    source: "osm",
    name: el.tags?.name || type,
    lat: el.lat ?? el.center?.lat ?? 0,
    lon: el.lon ?? el.center?.lon ?? 0,
    tags: el.tags ?? {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) as POI[];
}

