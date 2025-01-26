"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { FilterState } from "../app/page";
import SearchBar from "./SearchBar";
import PriceRangeDropdown from "./PriceRangeDropdown";

interface MobileFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filterState: FilterState;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  onPlaceSelected: (lat: number, lng: number) => void;
}

export default function MobileFiltersModal({
  open,
  onClose,
  filterState,
  setFilterState,
  onPlaceSelected,
}: MobileFiltersModalProps) {
  const [tempFilter, setTempFilter] = useState<FilterState>({ ...filterState });

  if (!open) return null;

  const handleApply = () => {
    // Once user hits "Apply," we commit local changes to main filter state
    setFilterState(tempFilter);
    onClose();
  };

  const handlePriceChange = (min: number, max: number) => {
    setTempFilter((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  return (
    <div className="fixed inset-0 bg-base-100 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-base-200">
        <h2 className="text-lg font-bold">Filters</h2>
        <button onClick={onClose} className="btn btn-ghost">
          ✕
        </button>
      </div>

      {/* Body: scrollable */}
      <div className="p-4 flex-1 overflow-auto space-y-4">
        {/* Optional search bar inside the filters */}
        <SearchBar
          onPlaceSelected={(lat, lng, address) => {
            onPlaceSelected(lat, lng);
          }}
          inputClass="input input-bordered w-full text-base"
        />

        {/* For sale / rent */}
        <div>
          <label className="block mb-1 font-semibold">Listing Type</label>
          <select
            className="select select-bordered w-full"
            value={tempFilter.forRent ? "rent" : "sale"}
            onChange={(e) =>
              setTempFilter((prev) => ({ ...prev, forRent: e.target.value === "rent" }))
            }
          >
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block mb-1 font-semibold">Price Range</label>
          <PriceRangeDropdown
            minPrice={tempFilter.minPrice}
            maxPrice={tempFilter.maxPrice}
            onChange={handlePriceChange}
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block mb-1 font-semibold">Property Type</label>
          <select
            className="select select-bordered w-full"
            value={tempFilter.propertyType}
            onChange={(e) => setTempFilter((prev) => ({ ...prev, propertyType: e.target.value }))}
          >
            <option value="">All property types</option>
            <option value="Residential">Residential</option>
            <option value="Condo">Condo</option>
            <option value="Townhome">Townhome</option>
            <option value="Multi-Family">Multi-Family</option>
          </select>
        </div>

        {/* Beds */}
        <div>
          <label className="block mb-1 font-semibold">Beds</label>
          <select
            className="select select-bordered w-full"
            value={tempFilter.beds}
            onChange={(e) => setTempFilter((prev) => ({ ...prev, beds: Number(e.target.value) }))}
          >
            <option value={0}>All beds</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5+</option>
          </select>
        </div>

        {/* Baths */}
        <div>
          <label className="block mb-1 font-semibold">Baths</label>
          <select
            className="select select-bordered w-full"
            value={tempFilter.baths}
            onChange={(e) => setTempFilter((prev) => ({ ...prev, baths: Number(e.target.value) }))}
          >
            <option value={0}>All baths</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5+</option>
          </select>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="p-4 border-t border-base-200 flex space-x-2">
        <button
          className="btn btn-ghost flex-1"
          onClick={() => {
            // reset to defaults
            setTempFilter({
              forRent: false,
              minPrice: 0,
              maxPrice: 999999999,
              propertyType: "",
              beds: 0,
              baths: 0,
            });
          }}
        >
          Reset
        </button>
        <button className="btn btn-primary flex-1" onClick={handleApply}>
          See Properties
        </button>
      </div>
    </div>
  );
}
