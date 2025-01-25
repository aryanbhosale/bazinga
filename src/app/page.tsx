"use client";

import { useState } from "react";
import useProperties from "../hooks/useProperties";
import { Property } from "../utils/types";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import PropertyList from "../components/PropertyList";
import PropertyDetailsModal from "../components/PropertyDetailsModal";
import AddEditPropertyModal from "../components/AddEditPropertyModal";

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

  // Filter states
  const [filterState, setFilterState] = useState<FilterState>({
    forRent: false,
    minPrice: 0,
    maxPrice: 999999999,
    propertyType: "",
    beds: 0,
    baths: 0,
  });

  // Add property modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Handle property selection
  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedProperty(undefined);
  };

  // Filtering
  const filteredProperties = properties.filter((p) => {
    if (filterState.forRent && !p.forRent) return false;
    if (!filterState.forRent && p.forRent) return false;
    if (p.price < filterState.minPrice) return false;
    if (p.price > filterState.maxPrice) return false;
    if (filterState.propertyType && p.propertyType !== filterState.propertyType) return false;
    if (p.bedrooms < filterState.beds) return false;
    if (p.bathrooms < filterState.baths) return false;
    return true;
  });

  // For the search bar
  const [mapCenter, setMapCenter] = useState({ lat: 34.03356615, lng: -118.7542039 });
  const handlePlaceSelected = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        filterState={filterState}
        setFilterState={setFilterState}
        onAddPropertyClick={() => setAddModalOpen(true)}
        onPlaceSelected={(lat, lng) => handlePlaceSelected(lat, lng)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* 2/5 left side = the property list, 3/5 right side = map */}
        <PropertyList
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onSelect={handleSelectProperty}
        />

        <div className="flex-1 relative">
          <MapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onMarkerClick={handleSelectProperty}
            mapCenter={mapCenter}
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

      <AddEditPropertyModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
