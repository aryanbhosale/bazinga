// src/components/Navbar.tsx
"use client";

import { Dispatch, SetStateAction } from "react";
import { FilterState } from "../app/page";
import SearchBar from "./SearchBar";

interface NavbarProps {
  filterState: FilterState;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  onAddPropertyClick: () => void;
  onPlaceSelected: (lat: number, lng: number, address: string) => void;
}

export default function Navbar({
  filterState,
  setFilterState,
  onAddPropertyClick,
  onPlaceSelected,
}: NavbarProps) {
  // ... your existing filter handlers

  return (
    <div className="navbar bg-base-200 p-2 flex flex-wrap md:justify-between items-center gap-2">
      {/* Left brand / Title */}
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">Bazinga Properties</span>
      </div>

      {/* Row of controls can wrap to next line if needed */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchBar onPlaceSelected={onPlaceSelected} />

        <select
          className="select select-bordered"
          value={filterState.forRent ? "rent" : "sale"}
          onChange={(e) =>
            setFilterState((prev) => ({ ...prev, forRent: e.target.value === "rent" }))
          }
        >
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        {/* Price range */}
        <div className="flex items-center space-x-1">
          <input
            type="number"
            placeholder="Min Price"
            className="input input-bordered w-24"
            value={filterState.minPrice}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
            }
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max Price"
            className="input input-bordered w-24"
            value={filterState.maxPrice}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
            }
          />
        </div>

        {/* Property Type */}
        <select
          className="select select-bordered"
          value={filterState.propertyType}
          onChange={(e) =>
            setFilterState((prev) => ({ ...prev, propertyType: e.target.value }))
          }
        >
          <option value="">All Types</option>
          <option value="Residential">Residential</option>
          <option value="Condo">Condo</option>
          <option value="Townhome">Townhome</option>
          <option value="Multi-Family">Multi-Family</option>
        </select>

        {/* Beds */}
        <select
          className="select select-bordered"
          value={filterState.beds}
          onChange={(e) =>
            setFilterState((prev) => ({ ...prev, beds: Number(e.target.value) }))
          }
        >
          <option value={0}>Beds (Any)</option>
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
          onChange={(e) =>
            setFilterState((prev) => ({ ...prev, baths: Number(e.target.value) }))
          }
        >
          <option value={0}>Baths (Any)</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
          <option value={5}>5+</option>
        </select>

        <button className="btn btn-primary" onClick={onAddPropertyClick}>
          Add Property
        </button>
      </div>
    </div>
  );
}
