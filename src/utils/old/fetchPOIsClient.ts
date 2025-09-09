// src/utils/fetchPOIsClient.ts
import type { POI, POIType } from "@/types/POI";

interface FetchPOIsOptions {
  type?: POIType | POIType[];
  bbox?: [number, number, number, number];
  limit?: number;
}

export async function fetchPOIsClient(options: FetchPOIsOptions = {}): Promise<POI[]> {
  const params = new URLSearchParams();

  if (options.type) {
    if (Array.isArray(options.type)) {
      params.set("type", options.type.join(","));
    } else {
      params.set("type", options.type);
    }
  }

  if (options.bbox) {
    params.set("bbox", options.bbox.join(","));
  }

  if (options.limit) {
    params.set("limit", String(options.limit));
  }

  const res = await fetch(`/api/pois?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch POIs: ${res.statusText}`);
  }
  return res.json();
}

