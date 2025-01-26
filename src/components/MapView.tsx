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

  // We'll keep track of the user's polygon so we can "clear" it.
  const [userPolygon, setUserPolygon] = useState<google.maps.Polygon | null>(null);

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
  };

  const handleDrawingManagerLoad = (drawingManager: google.maps.drawing.DrawingManager) => {
    drawingManagerRef.current = drawingManager;
  };

  // Called when user finishes drawing polygon
  const handleOverlayComplete = (e: google.maps.drawing.OverlayCompleteEvent) => {
    if (e.type === window.google.maps.drawing.OverlayType.POLYGON) {
      // Remove any old polygon
      if (userPolygon) userPolygon.setMap(null);

      const polygon = e.overlay as google.maps.Polygon;
      setUserPolygon(polygon);

      // gather coords
      const path = polygon.getPath();
      const coords: google.maps.LatLngLiteral[] = [];
      for (let i = 0; i < path.getLength(); i++) {
        const latLng = path.getAt(i);
        coords.push({ lat: latLng.lat(), lng: latLng.lng() });
      }
      onPolygonDrawn(coords);

      // End drawing mode
      setIsDrawingMode(false);
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
    } else {
      // if not polygon, remove it
      e.overlay.setMap(null);
    }
  };

  // Toggle between normal mode & polygon drawing mode
  const toggleDrawingMode = () => {
    if (!drawingManagerRef.current) return;
    if (isDrawingMode) {
      // turn off
      drawingManagerRef.current.setDrawingMode(null);
      setIsDrawingMode(false);
    } else {
      // turn on polygon mode
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      setIsDrawingMode(true);
    }
  };

  const clearDrawings = () => {
    // remove the polygon from map
    if (userPolygon) {
      userPolygon.setMap(null);
      setUserPolygon(null);
    }
    // also clear the polygon coords in parent
    onPolygonDrawn([]);
  };

  if (!isLoaded) {
    return <div className="w-full h-full flex items-center justify-center">Loading Map...</div>;
  }

  return (
    <GoogleMap onLoad={handleMapLoad} center={mapCenter} zoom={12} mapContainerClassName="w-full h-full" options={{
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT, // or BOTTOM_LEFT, etc.
      },
    }}>
      {/* The custom controls at top-left or top-right */}
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

      {/* DrawingManager with "drawingControl: false" so no default UI icons */}
      <DrawingManager
        onLoad={handleDrawingManagerLoad}
        onOverlayComplete={handleOverlayComplete}
        options={{
          drawingControl: false,
        }}
      />

      {/* The markers */}
      {properties.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => onMarkerClick(p)}
          icon={{
            url: "/marker.png",
            scaledSize: new google.maps.Size(40, 40),
          }}
        />
      ))}
    </GoogleMap>
  );
}
