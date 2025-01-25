"use client";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const center = { lat: 34.03356615, lng: -118.7542039 }; // approximate Malibu

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // Optional: show the map type control (Map / Satellite)
    map.setOptions({
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DEFAULT,
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
    });
  }, []);

  useEffect(() => {
    if (selectedProperty && mapRef.current) {
      mapRef.current.panTo({ lat: selectedProperty.lat, lng: selectedProperty.lng });
      mapRef.current.setZoom(15);
    }
  }, [selectedProperty]);

  if (!isLoaded) {
    return <div className="flex-1 flex items-center justify-center">Loading Map...</div>;
  }

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
          icon={{
            url: "/marker.png", // place marker.png in /public
            scaledSize: new google.maps.Size(40, 40),
          }}
        />
      ))}
    </GoogleMap>
  );
}
