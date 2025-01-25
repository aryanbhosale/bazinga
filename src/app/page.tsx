"use client";

import { LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Filters, { SortOption } from "../components/Filters";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import PropertyDetailsModal from "../components/PropertyDetailsModal";
import AddEditPropertyModal from "../components/AddEditPropertyModal";
import useProperties from "../hooks/useProperties";
import { Property } from "../utils/types";

export default function HomePage() {
  const {
    properties,
    loading,
    // addProperty, // not needed here because we open AddEditPropertyModal
    // updateProperty, // used in the modal
    fetchProperties,
  } = useProperties();

  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(
    undefined
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filteredProps, setFilteredProps] = useState<Property[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // When a marker or sidebar item is clicked
  const handlePropertySelect = (prop: Property) => {
    setSelectedProperty(prop);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedProperty(undefined);
  };

  // Sort the properties client‐side according to sortOption
  useEffect(() => {
    let sorted = [...properties];
    if (sortOption === "newest") {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortOption === "price_desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "price_asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "square_feet") {
      sorted.sort((a, b) => b.squareFeet - a.squareFeet);
    }
    setFilteredProps(sorted);
  }, [properties, sortOption]);

  // If user picks a place from the search bar
  const handlePlaceSelected = (lat: number, lng: number, address: string) => {
    // center map on the place or do something else
    // For demonstration, we won't do anything here except log it
    console.log("Place selected:", address, lat, lng);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY || ""}
      libraries={["places"]} // or ["places", "geometry", etc.], if needed
    >
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="p-2 flex space-x-2 items-center">
          <SearchBar onPlaceSelected={handlePlaceSelected} />
          <Filters sortOption={sortOption} setSortOption={setSortOption} />
          <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            Add Property
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block w-80 shrink-0 h-full">
            <Sidebar
              properties={filteredProps}
              selectedProperty={selectedProperty}
              onSelect={handlePropertySelect}
            />
          </div>
          <div className="flex-1 relative h-full">
            <MapView
              properties={filteredProps}
              selectedProperty={selectedProperty}
              onMarkerClick={handlePropertySelect}
            />
          </div>
        </div>

        {selectedProperty && (
          <PropertyDetailsModal
            open={showDetailsModal}
            onClose={handleCloseModal}
            property={selectedProperty}
          />
        )}

        <AddEditPropertyModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
        />
      </div>
    </LoadScript>
  );
}
