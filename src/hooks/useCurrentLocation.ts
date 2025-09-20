export function useCurrentLocation(
  onLocationSelect: (lat: number, lng: number, displayName: string) => void,
  onCurrentLocationFound?: (lat: number, lng: number) => void
) {
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLocationSelect(latitude, longitude, "Current Location");
        if (onCurrentLocationFound) {
          onCurrentLocationFound(latitude, longitude);
        }
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Could not get your current location");
      }
    );
  };

  return { requestLocation };
}

