"use client";

import { useEffect, useState } from "react";

interface AddressDisplayProps {
  lat: number;
  lng: number;
  existingAddress?: string; // if we already have an address
}

export default function AddressDisplay({
  lat,
  lng,
  existingAddress,
}: AddressDisplayProps) {
  const [address, setAddress] = useState(existingAddress || "");

  useEffect(() => {
    // If we already have an address, or lat/lng are not valid, skip fetching
    if (existingAddress || !lat || !lng) return;

    const fetchAddress = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
        if (!apiKey) return;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
      }
    };

    fetchAddress();
  }, [lat, lng, existingAddress]);

  // If no lat/lng and no address, fallback
  if (!lat && !lng && !existingAddress) {
    return <span>Unknown Location</span>;
  }

  return <span>{address || `${lat}, ${lng}`}</span>;
}
