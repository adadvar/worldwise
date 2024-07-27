import { useState } from "react";

export function useGeolocation(defaultPosition: any = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(defaultPosition);

  function getPosition() {
    if (!navigator.geolocation)
      //@ts-ignore
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        //@ts-ignore
        setError(error.message);
        setIsLoading(false);
      }
    );
  }
  return { position, getPosition, isLoading, error };
}