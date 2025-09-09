// src/utils/fetchPOIs.ts
import clientPromise from "@/lib/mongodb";
import type { POI, POIType } from "@/types/POI";

interface FetchPOIsOptions {
  type?: POIType | POIType[];       // fetch a single type or multiple
  bbox?: [number, number, number, number]; // optional: [south, west, north, east]
  limit?: number;                   // optional: max number of POIs
}

export async function fetchPOIs(options: FetchPOIsOptions = {}): Promise<POI[]> {
  const client = await clientPromise;
  const db = client.db("pottypal");
  const collection = db.collection<POI>("pois");

  const filter: Record<string, any> = {};

  // filter by type
  if (options.type) {
    if (Array.isArray(options.type)) {
      filter.type = { $in: options.type };
    } else {
      filter.type = options.type;
    }
  }

  // filter by bounding box
  if (options.bbox) {
    const [south, west, north, east] = options.bbox;
    filter.lat = { $gte: south, $lte: north };
    filter.lon = { $gte: west, $lte: east };
  }

  const cursor = collection.find(filter);

  if (options.limit) {
    cursor.limit(options.limit);
  }

  const pois = await cursor.toArray();
  return pois;
}

