"use client";

import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { googleMapsLibraries } from "../config/googleMapsConfig"; //
import { useRef } from "react";

interface SearchBarProps {
  onPlaceSelected: (lat: number, lng: number, address: string) => void;
}

export default function SearchBar({ onPlaceSelected }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
    libraries: googleMapsLibraries,
  });

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";
        onPlaceSelected(lat, lng, address);
      }
    }
  };

  if (!isLoaded) {
    return (
      <input
        ref={inputRef}
        type="text"
        placeholder="Loading..."
        className="input input-bordered w-48 md:w-60"
        disabled
      />
    );
  }

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search address..."
        className="input input-bordered w-48 md:w-60"
      />
    </Autocomplete>
  );
}
