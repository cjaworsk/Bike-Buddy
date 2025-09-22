// src/pages/api/pois-diff.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import type { WithId, Document } from "mongodb";
import { POI } from "@/types/POI";

// BoundingBox type
type BoundingBox = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { south, west, north, east, prevSouth, prevWest, prevNorth, prevEast } = req.query;

    if (!south || !west || !north || !east) {
      return res.status(400).json({ error: "Missing required bbox params" });
    }

    const bbox: BoundingBox = {
      south: parseFloat(south as string),
      west: parseFloat(west as string),
      north: parseFloat(north as string),
      east: parseFloat(east as string),
    };

    const prevBbox = prevSouth
      ? {
          south: parseFloat(prevSouth as string),
          west: parseFloat(prevWest as string),
          north: parseFloat(prevNorth as string),
          east: parseFloat(prevEast as string),
        }
      : null;

    const client = await clientPromise;
    const db = client.db("bikebuddy");
    const poisCollection = db.collection("pois");

    // Current POIs
    const currentPois = await poisCollection
      .find({
        lat: { $gte: bbox.south, $lte: bbox.north },
        lon: { $gte: bbox.west, $lte: bbox.east },
      })
      .toArray();

    if (!prevBbox) {
      // First fetch -> return everything as "added"
      const formatted = currentPois.map(formatPOI);
      return res.json({ added: formatted, removed: [] });
    }

    // Previous POIs
    const prevPois = await poisCollection
      .find({
        lat: { $gte: prevBbox.south, $lte: prevBbox.north },
        lon: { $gte: prevBbox.west, $lte: prevBbox.east },
      })
      .toArray();

    const currentMap = new Map(currentPois.map((p) => [p._id.toString(), p]));
    const prevMap = new Map(prevPois.map((p) => [p._id.toString(), p]));

    // Added = in current but not in prev
    const added = Array.from(currentMap.keys())
      .filter((id) => !prevMap.has(id))
      .map((id) => formatPOI(currentMap.get(id)!));

    // Removed = in prev but not in current
    const removed = Array.from(prevMap.keys())
      .filter((id) => !currentMap.has(id))
      .map((id) => formatPOI(prevMap.get(id)!));

    return res.json({ added, removed });
  } catch (error) {
    console.error("Error in /api/pois-diff:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Map MongoDB doc -> POI type
function formatPOI(p: WithId<Document>): POI {
  return {
    _id: p._id,
    osmId: Number(p.osmId),
    type: p.type as POI["type"],
    source: p.source as POI["source"],
    name: String(p.name),
    lat: Number(p.lat),
    lon: Number(p.lon),
    tags: (p.tags as Record<string, string>) || {},
    createdAt:
      p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
    updatedAt:
      p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
  };
}

/* Map MongoDB doc -> POI type
function formatPOI(p: WithId<Document>): POI {
  return {
    _id: p._id,
    osmId: p.osmId,
    type: p.type,
    source: p.source,
    name: p.name,
    lat: p.lat,
    lon: p.lon,
    tags: p.tags || {},
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
  };
}
*/
