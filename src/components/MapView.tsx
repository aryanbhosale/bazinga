"use client";

import { GoogleMap, Marker, DrawingManager } from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import { googleMapsLibraries } from "../config/googleMapsConfig";
import { useEffect, useRef, useState } from "react";
import { Property } from "../utils/types";

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onMarkerClick: (prop: Property) => void;
  mapCenter: { lat: number; lng: number };
  onPolygonDrawn: (coords: google.maps.LatLngLiteral[]) => void;
}

export default function MapView({
  properties,
  selectedProperty,
  onMarkerClick,
  mapCenter,
  onPolygonDrawn,
}: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [userPolygon, setUserPolygon] = useState<google.maps.Polygon | null>(null);
  const [markerScale, setMarkerScale] = useState(5); // Initial marker size

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

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(mapCenter);
      mapRef.current.setZoom(12);
    }
  }, [mapCenter]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    // Add event listener for zoom changes
    map.addListener("zoom_changed", () => {
      const zoom = map.getZoom() || 12;
      const scale = Math.max(5, zoom); // Adjust the scale dynamically
      setMarkerScale(scale);
    });
  };

  const handleDrawingManagerLoad = (drawingManager: google.maps.drawing.DrawingManager) => {
    drawingManagerRef.current = drawingManager;
  };

  const handleOverlayComplete = (e: google.maps.drawing.OverlayCompleteEvent) => {
    if (e.type === window.google.maps.drawing.OverlayType.POLYGON) {
      if (userPolygon) userPolygon.setMap(null);

      const polygon = e.overlay as google.maps.Polygon;
      setUserPolygon(polygon);

      const path = polygon.getPath();
      const coords: google.maps.LatLngLiteral[] = [];
      for (let i = 0; i < path.getLength(); i++) {
        const latLng = path.getAt(i);
        coords.push({ lat: latLng.lat(), lng: latLng.lng() });
      }
      onPolygonDrawn(coords);

      setIsDrawingMode(false);
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
    } else {
      e.overlay.setMap(null);
    }
  };

  const toggleDrawingMode = () => {
    if (!drawingManagerRef.current) return;
    if (isDrawingMode) {
      drawingManagerRef.current.setDrawingMode(null);
      setIsDrawingMode(false);
    } else {
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      setIsDrawingMode(true);
    }
  };

  const clearDrawings = () => {
    if (userPolygon) {
      userPolygon.setMap(null);
      setUserPolygon(null);
    }
    onPolygonDrawn([]);
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
      options={{
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: window.google.maps.ControlPosition.TOP_RIGHT,
        },
      }}
    >
      {isLoaded && (
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 30 }}>
          <button
            onClick={toggleDrawingMode}
            className={`btn btn-sm ${isDrawingMode ? "btn-accent" : ""} mr-2`}
          >
            {isDrawingMode ? "Finish Drawing" : "Draw"}
          </button>
          <button onClick={clearDrawings} className="btn btn-sm">
            Clear
          </button>
        </div>
      )}

      <DrawingManager
        onLoad={handleDrawingManagerLoad}
        onOverlayComplete={handleOverlayComplete}
        options={{
          drawingControl: false,
        }}
      />

      {/* Dynamic black circle markers */}
      {properties.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => onMarkerClick(p)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "black",
            fillOpacity: 1,
            scale: markerScale, // Use dynamic marker scale
            strokeColor: "black",
            strokeWeight: 1,
          }}
        />
      ))}
    </GoogleMap>
  );
}
