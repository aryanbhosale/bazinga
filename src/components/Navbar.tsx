"use client";

import { Dispatch, SetStateAction } from "react";
import { FilterState } from "../app/page";

interface NavbarProps {
  filterState: FilterState;
  setFilterState: Dispatch<SetStateAction<FilterState>>;
  onAddPropertyClick: () => void;
}

export default function Navbar({
  filterState,
  setFilterState,
  onAddPropertyClick,
}: NavbarProps) {
  const handleForSaleRentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, forRent: e.target.value === "rent" }));
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({ ...prev, minPrice: Number(e.target.value) }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({ ...prev, maxPrice: Number(e.target.value) }));
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, propertyType: e.target.value }));
  };

  const handleBedsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, beds: Number(e.target.value) }));
  };

  const handleBathsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, baths: Number(e.target.value) }));
  };

  return (
    <div className="navbar bg-base-200 p-2 flex flex-wrap gap-2">
      <div className="flex-1">
        <span className="text-xl font-bold">Bazinga Properties</span>
      </div>

      {/* For Sale / Rent */}
      <select
        className="select select-bordered"
        value={filterState.forRent ? "rent" : "sale"}
        onChange={handleForSaleRentChange}
      >
        <option value="sale">For Sale</option>
        <option value="rent">For Rent</option>
      </select>

      {/* Price Range */}
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Min Price"
          className="input input-bordered w-24"
          value={filterState.minPrice}
          onChange={handleMinPriceChange}
        />
        <span className="font-semibold">-</span>
        <input
          type="number"
          placeholder="Max Price"
          className="input input-bordered w-24"
          value={filterState.maxPrice}
          onChange={handleMaxPriceChange}
        />
      </div>

      {/* Property Type */}
      <select
        className="select select-bordered"
        value={filterState.propertyType}
        onChange={handlePropertyTypeChange}
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
        onChange={handleBedsChange}
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
        onChange={handleBathsChange}
      >
        <option value={0}>Baths (Any)</option>
        <option value={1}>1+</option>
        <option value={2}>2+</option>
        <option value={3}>3+</option>
        <option value={4}>4+</option>
        <option value={5}>5+</option>
      </select>

      {/* Add property */}
      <button className="btn btn-primary" onClick={onAddPropertyClick}>
        Add Property
      </button>
    </div>
  );
}
