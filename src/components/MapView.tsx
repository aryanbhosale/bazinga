"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { googleMapsLibraries } from "../config/googleMapsConfig";
import { useEffect, useRef } from "react";
import { Property } from "../utils/types";

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onMarkerClick: (prop: Property) => void;
  mapCenter: { lat: number; lng: number };
}

export default function MapView({
  properties,
  selectedProperty,
  onMarkerClick,
  mapCenter,
}: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
    libraries: googleMapsLibraries,
  });

  useEffect(() => {
    if (selectedProperty && mapRef.current) {
      mapRef.current.panTo({ lat: selectedProperty.lat, lng: selectedProperty.lng });
      mapRef.current.setZoom(15);
    }
  }, [selectedProperty]);

  // If user picks a place from SearchBar, we also recenter here
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(mapCenter);
      mapRef.current.setZoom(12);
    }
  }, [mapCenter]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center">Loading Map...</div>;
  }

  return (
    <GoogleMap
      onLoad={handleMapLoad}
      center={mapCenter}
      zoom={12}
      mapContainerClassName="w-full h-full"
    >
      {properties.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => onMarkerClick(p)}
          icon={{
            url: "/marker.png", // or keep the default
            scaledSize: new google.maps.Size(40, 40),
          }}
        />
      ))}
    </GoogleMap>
  );
}
