import dynamic from "next/dynamic";
import { AppProviders } from "@/context/AppProviders";
import { useKeyboardHandler } from "@/hooks/useKeyboardHandler";

const MapNoSSR = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  useKeyboardHandler(); // Add this line
  
  return (
    <AppProviders>
      <div style={{ height: '100dvh', width: '100vw' }}>
        <MapNoSSR />
      </div>
    </AppProviders>
  );
}
