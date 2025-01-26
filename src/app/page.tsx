"use client";

import { useState } from "react";
import useProperties from "../hooks/useProperties";
import { Property } from "../utils/types";
import TopBar from "../components/TopBar";
import FilterBar from "../components/FilterBar";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import PropertyDetailsModal from "../components/PropertyDetailsModal";
import AddEditPropertyModal from "../components/AddEditPropertyModal";
import { SortOption } from "../components/Filters"; // or define it here

export interface FilterState {
  forRent: boolean;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  beds: number;
  baths: number;
}

export default function HomePage() {
  const { properties, loading } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Basic filter states
  const [filterState, setFilterState] = useState<FilterState>({
    forRent: false,
    minPrice: 0,
    maxPrice: 999999999,
    propertyType: "",
    beds: 0,
    baths: 0,
  });

  // Sorting
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // Add property modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Map center
  const [mapCenter, setMapCenter] = useState({ lat: 34.03356615, lng: -118.7542039 });

  // Polygon coords for drawing
  const [polygonCoords, setPolygonCoords] = useState<google.maps.LatLngLiteral[] | null>(null);

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedProperty(undefined);
  };

  // 1) filter
  const filtered = properties.filter((p) => {
    if (filterState.forRent && !p.forRent) return false;
    if (!filterState.forRent && p.forRent) return false;
    if (p.price < filterState.minPrice) return false;
    if (p.price > filterState.maxPrice) return false;
    if (filterState.propertyType && p.propertyType !== filterState.propertyType) return false;
    if (p.bedrooms < filterState.beds) return false;
    if (p.bathrooms < filterState.baths) return false;
    return true;
  });

  // 2) polygon
  const insidePolygonProps = polygonCoords
    ? filterByPolygon(filtered, polygonCoords)
    : filtered;

  // 3) sort
  const finalProps = applySort(insidePolygonProps, sortOption);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
    <div className="z-50">
      <FilterBar
        filterState={filterState}
        setFilterState={setFilterState}
        onAddPropertyClick={() => setAddModalOpen(true)}
        onPlaceSelected={(lat, lng) => setMapCenter({ lat, lng })}
      />
    </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          properties={finalProps}
          selectedProperty={selectedProperty}
          onSelect={handleSelectProperty}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
        <div className="flex-1 relative">
          <MapView
            properties={finalProps}
            selectedProperty={selectedProperty}
            onMarkerClick={handleSelectProperty}
            mapCenter={mapCenter}
            onPolygonDrawn={(coords) => setPolygonCoords(coords.length ? coords : null)}
          />
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetailsModal
          open={detailsModalOpen}
          onClose={closeDetailsModal}
          property={selectedProperty}
        />
      )}

      <AddEditPropertyModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
}

// your existing sorting logic
function applySort(props: Property[], sortOption: SortOption): Property[] {
  const sorted = [...props];
  switch (sortOption) {
    case "newest":
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case "oldest":
      sorted.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "square_feet":
      sorted.sort((a, b) => b.squareFeet - a.squareFeet);
      break;
  }
  return sorted;
}

// polygon filter
function filterByPolygon(props: Property[], coords: google.maps.LatLngLiteral[]): Property[] {
  if (typeof window === "undefined" || !window.google?.maps?.geometry) {
    return props;
  }
  const polygon = new window.google.maps.Polygon({ paths: coords });
  return props.filter((p) => {
    const point = new window.google.maps.LatLng(p.lat, p.lng);
    return window.google.maps.geometry.poly.containsLocation(point, polygon);
  });
}
