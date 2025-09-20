// MobileLocationButton.tsx
import React from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { useLocationContext } from "@/context/LocationContext";
import styles from "./MobileInterface.module.css";

export default function MobileLocationButton() {
  const { onCurrentLocationFound } = useLocationContext();

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onCurrentLocationFound(latitude, longitude);
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Could not get your current location");
      }
    );
  };

  return (
    <button
      className={styles.iconButton}
      onClick={handleLocationRequest}
      title="Current Location"
    >
      <BiCurrentLocation size={25} />
    </button>
  );
}
