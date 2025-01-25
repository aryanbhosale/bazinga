"use client";

import { Dispatch, SetStateAction } from "react";

export type SortOption =
  | "newest"
  | "oldest"
  | "price_desc"
  | "price_asc"
  | "square_feet";

interface FiltersProps {
  sortOption: SortOption;
  setSortOption: Dispatch<SetStateAction<SortOption>>;
}

export default function Filters({ sortOption, setSortOption }: FiltersProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="font-semibold">Sort By:</label>
      <select
        className="select select-bordered"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price_desc">Price (High to Low)</option>
        <option value="price_asc">Price (Low to High)</option>
        <option value="square_feet">Square Feet</option>
      </select>
    </div>
  );
}
