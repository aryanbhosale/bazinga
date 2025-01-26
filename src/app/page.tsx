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
import { SortOption } from "../components/Filters";
import MobileFiltersModal from "../components/MobileFiltersModal";
import useIsMobile from "../hooks/useIsMobile";

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
  const isMobile = useIsMobile(768);

  // Filter + Sort states
  const [filterState, setFilterState] = useState<FilterState>({
    forRent: false,
    minPrice: 0,
    maxPrice: 999999999,
    propertyType: "",
    beds: 0,
    baths: 0,
  });
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // Map + polygon
  const [mapCenter, setMapCenter] = useState({ lat: 34.03356615, lng: -118.7542039 });
  const [polygonCoords, setPolygonCoords] = useState<google.maps.LatLngLiteral[] | null>(null);

  // Show/hide map on mobile
  const [mapVisible, setMapVisible] = useState(false);

  // Show/hide the Add property modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Show/hide property details
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Show/hide the Filters modal on mobile
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedProperty(undefined);
  };

  // Filter
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

  // Polygon filter
  const insidePolygonProps = polygonCoords ? filterByPolygon(filtered, polygonCoords) : filtered;

  // Sort
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

      {/* If not mobile, show the normal FilterBar. Otherwise show a single "Filters" button */}
      {isMobile ? (
        <div className="px-4 py-2 border-b border-base-200 flex items-center justify-between">
          <button className="btn btn-ghost" onClick={() => setFiltersModalOpen(true)}>
            Filters
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setAddModalOpen(true)}>
            Add property
          </button>
        </div>
      ) : (
        <FilterBar
          filterState={filterState}
          setFilterState={setFilterState}
          onAddPropertyClick={() => setAddModalOpen(true)}
          onPlaceSelected={(lat, lng) => setMapCenter({ lat, lng })}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar always visible, even on mobile. (You can hide if you want) */}
        <Sidebar
          properties={finalProps}
          selectedProperty={selectedProperty}
          onSelect={handleSelectProperty}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {/* Map is hidden on small screens unless user toggles it */}
        <div className="hidden md:block flex-1 relative">
          <MapView
            properties={finalProps}
            selectedProperty={selectedProperty}
            onMarkerClick={handleSelectProperty}
            mapCenter={mapCenter}
            onPolygonDrawn={(coords) => setPolygonCoords(coords.length ? coords : null)}
          />
        </div>
      </div>

      {/* On mobile, toggles the map area */}
      {isMobile && (
        <div className="md:hidden p-2 border-t flex justify-center">
          {mapVisible ? (
            <div className="relative w-full h-64">
              <MapView
                properties={finalProps}
                selectedProperty={selectedProperty}
                onMarkerClick={handleSelectProperty}
                mapCenter={mapCenter}
                onPolygonDrawn={(coords) => setPolygonCoords(coords.length ? coords : null)}
              />
              <button
                onClick={() => setMapVisible(false)}
                className="btn btn-sm btn-ghost absolute top-2 right-2 z-50"
              >
                Hide Map
              </button>
            </div>
          ) : (
            <button onClick={() => setMapVisible(true)} className="btn btn-primary">
              Show Map
            </button>
          )}
        </div>
      )}

      {/* Property details modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          open={detailsModalOpen}
          onClose={closeDetailsModal}
          property={selectedProperty}
        />
      )}

      {/* Add / Edit property */}
      <AddEditPropertyModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

      {/* Mobile filters modal */}
      <MobileFiltersModal
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        filterState={filterState}
        setFilterState={setFilterState}
        onPlaceSelected={(lat, lng) => setMapCenter({ lat, lng })}
      />
    </div>
  );
}

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
