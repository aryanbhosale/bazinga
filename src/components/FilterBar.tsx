"use client";

import { Dispatch, SetStateAction } from "react";
import { FilterState } from "../app/page";
import SearchBar from "./SearchBar";
import PriceRangeDropdown from "./PriceRangeDropdown";

interface FilterBarProps {
  filterState: FilterState;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  onAddPropertyClick: () => void;
  onPlaceSelected: (lat: number, lng: number) => void;
}

export default function FilterBar({
  filterState,
  setFilterState,
  onAddPropertyClick,
  onPlaceSelected,
}: FilterBarProps) {
  const handlePriceChange = (min: number, max: number) => {
    setFilterState((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  return (
    <div className="bg-base-100 px-4 py-2 border-b border-base-200 flex flex-wrap gap-2 items-center">
      {/* A wider search bar */}
      <div className="flex-1 max-w-xl">
        <SearchBar
          onPlaceSelected={(lat, lng) => {
            onPlaceSelected(lat, lng);
          }}
          // Bigger input with a custom class
          inputClass="input input-bordered w-full text-base"
        />
      </div>

      {/* For sale / rent */}
      <select
        className="select select-bordered"
        value={filterState.forRent ? "rent" : "sale"}
        onChange={(e) =>
          setFilterState((prev) => ({ ...prev, forRent: e.target.value === "rent" }))
        }
      >
        <option value="sale">For sale</option>
        <option value="rent">For rent</option>
      </select>

      {/* Price Range dropdown */}
      <PriceRangeDropdown
        minPrice={filterState.minPrice}
        maxPrice={filterState.maxPrice}
        onChange={handlePriceChange}
      />

      {/* Property Type */}
      <select
        className="select select-bordered"
        value={filterState.propertyType}
        onChange={(e) => setFilterState((prev) => ({ ...prev, propertyType: e.target.value }))}
      >
        <option value="">All property types</option>
        <option value="Residential">Residential</option>
        <option value="Condo">Condo</option>
        <option value="Townhome">Townhome</option>
        <option value="Multi-Family">Multi-Family</option>
      </select>

      {/* Beds */}
      <select
        className="select select-bordered"
        value={filterState.beds}
        onChange={(e) => setFilterState((prev) => ({ ...prev, beds: Number(e.target.value) }))}
      >
        <option value={0}>All beds</option>
        <option value={1}>1+</option>
        <option value={2}>2+</option>
        <option value={3}>3+</option>
        <option value={4}>4+</option>
        <option value={5}>5+</option>
      </select>

      {/* Baths */}
      <select
        className="select select-bordered"
        value={filterState.baths}
        onChange={(e) => setFilterState((prev) => ({ ...prev, baths: Number(e.target.value) }))}
      >
        <option value={0}>All baths</option>
        <option value={1}>1+</option>
        <option value={2}>2+</option>
        <option value={3}>3+</option>
        <option value={4}>4+</option>
        <option value={5}>5+</option>
      </select>

      <button className="btn btn-primary btn-sm" onClick={onAddPropertyClick}>
        Add property
      </button>
    </div>
  );
}
