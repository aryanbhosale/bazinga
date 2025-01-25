"use client";

import { useState } from "react";
import useProperties from "../hooks/useProperties";
import { Property } from "../utils/types";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";
import PropertyDetailsModal from "../components/PropertyDetailsModal";
import AddEditPropertyModal from "../components/AddEditPropertyModal";

// We'll store the user's filter selections here:
export interface FilterState {
  forRent: boolean;
  minPrice: number;
  maxPrice: number;
  propertyType: string; // "" means all
  beds: number; // 0 means any
  baths: number; // 0 means any
}

export default function HomePage() {
  const { properties, loading } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Track filter states
  const [filterState, setFilterState] = useState<FilterState>({
    forRent: false,
    minPrice: 0,
    maxPrice: 999999999,
    propertyType: "",
    beds: 0,
    baths: 0,
  });

  // Add Property modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Handle property selection from sidebar or marker
  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedProperty(undefined);
  };

  // Filter the real-time "properties"
  const filteredProperties = properties.filter((prop) => {
    if (filterState.forRent && !prop.forRent) return false;
    if (!filterState.forRent && prop.forRent) return false; // if you only want "for sale" here
    if (prop.price < filterState.minPrice) return false;
    if (prop.price > filterState.maxPrice) return false;
    if (filterState.propertyType && prop.propertyType !== filterState.propertyType)
      return false;
    if (prop.bedrooms < filterState.beds) return false;
    if (prop.bathrooms < filterState.baths) return false;
    return true;
  });

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
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onSelect={handleSelectProperty}
        />

        <div className="flex-1 relative">
          <MapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onMarkerClick={handleSelectProperty}
          />
        </div>
      </div>

      {/* Property details modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          open={detailsModalOpen}
          onClose={closeDetailsModal}
          property={selectedProperty}
        />
      )}

      {/* Add or Edit modal */}
      <AddEditPropertyModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
