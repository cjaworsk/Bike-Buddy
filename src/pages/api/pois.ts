import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import type { POI, POIType } from "@/types/POI";
import { Filter } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("bikebuddy");
    const collection = db.collection<POI>("pois");

    const { type, south, west, north, east, limit } = req.query;

    // ---- Build Mongo filter ----
    const filter: Filter<POI> = {}; // ✅ typed filter

    // Filter by POI type(s)
    if (type) {
      if (Array.isArray(type)) {
        filter.type = { $in: type as POIType[] };
      } else {
        filter.type = type as POIType;
      }
    }

    // Bounding box filter
    if (south && west && north && east) {
      const s = parseFloat(south as string);
      const w = parseFloat(west as string);
      const n = parseFloat(north as string);
      const e = parseFloat(east as string);

      if ([s, w, n, e].every((val) => !isNaN(val))) {
        filter.lat = { $gte: s, $lte: n };
        filter.lon = { $gte: w, $lte: e };
      }
    }

    // ---- Query Mongo ----
    let cursor = collection.find(filter);

    if (limit && !Array.isArray(limit)) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit)) {
        cursor = cursor.limit(parsedLimit);
      }
    }

    const pois = await cursor.toArray();

    res.status(200).json(pois);
  } catch (err) {
    console.error("❌ API /pois failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

