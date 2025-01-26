// src/components/Sidebar.tsx
"use client";

import { Property } from "../utils/types";
import Image from "next/image";
import AddressDisplay from "./AddressDisplay";
import { SortOption } from "./Filters"; // or define your own

interface SidebarProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelect: (p: Property) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

export default function Sidebar({
  properties,
  selectedProperty,
  onSelect,
  sortOption,
  setSortOption,
}: SidebarProps) {
  return (
    <div className="w-full md:w-2/5 bg-base-100 border-r border-base-200 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Real Estate & Homes for Sale</h2>
          <p className="text-sm text-gray-500">{properties.length} results</p>
        </div>
        {/* Sort dropdown */}
        <div className="dropdown dropdown-end z-30">
          <label tabIndex={0} className="btn btn-ghost btn-xs border text-xs normal-case">
            Sort
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded w-48">
            <li>
              <a
                className={sortOption === "newest" ? "active" : ""}
                onClick={() => setSortOption("newest")}
              >
                Newest
              </a>
            </li>
            <li>
              <a
                className={sortOption === "oldest" ? "active" : ""}
                onClick={() => setSortOption("oldest")}
              >
                Oldest
              </a>
            </li>
            <li>
              <a
                className={sortOption === "price_desc" ? "active" : ""}
                onClick={() => setSortOption("price_desc")}
              >
                Price (high to low)
              </a>
            </li>
            <li>
              <a
                className={sortOption === "price_asc" ? "active" : ""}
                onClick={() => setSortOption("price_asc")}
              >
                Price (low to high)
              </a>
            </li>
            <li>
              <a
                className={sortOption === "square_feet" ? "active" : ""}
                onClick={() => setSortOption("square_feet")}
              >
                Square Feet
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {properties.map((prop) => {
          const isActive = prop.id === selectedProperty?.id;

          return (
            <div
              key={prop.id}
              onClick={() => onSelect(prop)}
              className={`relative border rounded-lg bg-base-100 shadow-sm cursor-pointer hover:shadow-md transition ${
                isActive ? "ring ring-primary ring-offset-2" : ""
              }`}
            >
              <span className="absolute top-2 left-2 px-2 py-1 bg-neutral text-white text-xs rounded">
                Active
              </span>

              {/* Heart icon in top-right */}
              <span className="absolute top-2 right-2 text-white">
                <button className="btn btn-sm btn-circle btn-ghost text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.435 4.649c-1.024-1.23-2.574-1.949-4.146-1.949-1.952 0-3.465 1.062-4.289 2.57C12.274 3.762 10.762 2.7 8.81 2.7c-1.572 0-3.122.718-4.146 1.95-1.104 1.328-1.45 3.105-.857 4.743.585 1.617 1.989 3.661 4.204 5.978 2.29 2.39 4.272 3.957 4.369 4.025l.62.448.62-.448c.097-.068 2.079-1.635 4.369-4.025 2.215-2.317 3.619-4.36 4.204-5.978.593-1.638.247-3.415-.857-4.743z"
                    />
                  </svg>
                </button>
              </span>

              <div className="w-full h-40 relative">
                <Image
                  src={prop.imageUrl || "/placeholder.png"}
                  alt="Property"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>

              <div className="p-3 space-y-1">
                <p className="font-semibold text-lg leading-tight">
                  ${prop.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {prop.bedrooms}bd • {prop.bathrooms}ba • {prop.squareFeet} sqft
                </p>
                <p className="text-sm text-gray-500">
                  {prop.address ? prop.address : <AddressDisplay lat={prop.lat} lng={prop.lng} />}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
