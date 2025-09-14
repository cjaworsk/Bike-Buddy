"use client";

import dynamic from "next/dynamic";

const MapNoSSR = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  return (
    <div className="relative h-[100dvh] w-screen">
      <MapNoSSR />
    </div>
  );
}
