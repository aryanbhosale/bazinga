"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useRef, useEffect } from "react";
import { Property } from "../utils/types";

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onMarkerClick: (prop: Property) => void;
}

export default function MapView({
  properties,
  selectedProperty,
  onMarkerClick,
}: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const center = { lat: 34.03356615, lng: -118.7542039 }; // approximate Malibu

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (selectedProperty && mapRef.current) {
      mapRef.current.panTo({ lat: selectedProperty.lat, lng: selectedProperty.lng });
      mapRef.current.setZoom(15);
    }
  }, [selectedProperty]);

  if (!window.google) return <div>Loading map...</div>;

  return (
    <GoogleMap
      onLoad={onLoad}
      center={center}
      zoom={12}
      mapContainerClassName="w-full h-full"
    >
      {properties.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => onMarkerClick(p)}
        />
      ))}
    </GoogleMap>
  );
}
