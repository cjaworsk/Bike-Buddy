 // scripts/seedPOIs.ts
import "dotenv/config";
import clientPromise from "../src/lib/mongodb.ts";
import type { POI, POIType } from "../src/types/POI.ts";
import { fetchOSMPOIs } from "../src/utils/fetchOSMPOIs.ts";

const POI_TYPES: POIType[] = ["toilet", "drinking_water", "cafe"];

// Bounding box for California (south, west, north, east)
const CALIFORNIA_BBOX: [number, number, number, number] = [
  32.534156, -124.409591, 42.009518, -114.131211,
];

// How many vertical slices to split California into
const SLICES = 7;
const DELAY_MS = 3000; // wait 3s between requests
const MAX_RETRIES = 3;

// Utility: sleep
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Split California into N horizontal slices
function splitBoundingBox(
  bbox: [number, number, number, number],
  slices: number
): [number, number, number, number][] {
  const [south, west, north, east] = bbox;
  const latStep = (north - south) / slices;

  return Array.from({ length: slices }, (_, i) => [
    south + i * latStep,
    west,
    south + (i + 1) * latStep,
    east,
  ]);
}

async function seed() {
  const client = await clientPromise;
  const db = client.db("bikingbuddy");
  const poiCollection = db.collection<POI>("pois");

  // Clear existing
  await poiCollection.deleteMany({});
  console.log("Cleared existing POIs collection.");

  const slices = splitBoundingBox(CALIFORNIA_BBOX, SLICES);
  let totalInserted = 0;

  for (const type of POI_TYPES) {
    console.log(`\n=== Fetching POIs of type: ${type} ===`);

    for (let i = 0; i < slices.length; i++) {
      const bbox = slices[i];
      let retries = 0;
      let pois: POI[] = [];

      while (retries < MAX_RETRIES) {
        try {
          pois = await fetchOSMPOIs(type, bbox);
          break; // success → exit retry loop
        } catch (err) {
          retries++;
          console.warn(
            `⚠️ Error fetching ${type} slice ${i + 1}/${slices.length} (attempt ${retries}/${MAX_RETRIES}):`,
            (err as Error).message
          );
          if (retries < MAX_RETRIES) {
            console.log("Retrying in 5s...");
            await sleep(5000);
          }
        }
      }

      if (pois.length > 0) {
        const result = await poiCollection.insertMany(pois);
        totalInserted += result.insertedCount;
        console.log(
          `✅ Seeded ${type} slice ${i + 1}/${slices.length} → ${result.insertedCount} POIs`
        );
      } else {
        console.log(`❌ Skipped ${type} slice ${i + 1}/${slices.length} (no data)`);
      }

      await sleep(DELAY_MS);
    }
  }

  console.log(`\n🎉 Finished seeding. Inserted ${totalInserted} POIs total.`);
  await client.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });

