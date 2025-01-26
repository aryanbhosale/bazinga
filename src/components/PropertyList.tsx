"use client";

import { Property } from "../utils/types";
import Image from "next/image";
import AddressDisplay from "./AddressDisplay";

interface PropertyListProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelect: (p: Property) => void;
}

export default function PropertyList({
  properties,
  selectedProperty,
  onSelect,
}: PropertyListProps) {
  return (
    <div className="w-full md:w-2/5 bg-base-100 border-r border-base-200 overflow-y-auto">
      {/* Title & Count */}
      <div className="p-4 border-b border-base-200">
        <h2 className="text-2xl font-bold mb-1">Malibu, CA Real Estate &amp; Homes for Sale</h2>
        <p className="text-sm text-gray-500">{properties.length} results</p>
      </div>

      {/* 2-col grid on md+ */}
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
              {/* “Active” badge in top-left */}
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

              {/* Image */}
              <div className="w-full h-48 relative">
                <Image
                  src={prop.imageUrl || "/placeholder.png"}
                  alt="Property"
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <p className="font-semibold text-lg leading-tight">
                  ${prop.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {prop.bedrooms}bd • {prop.bathrooms}ba • {prop.squareFeet.toLocaleString()} sqft
                </p>
                {/* Address or lat/lng */}
                <p className="text-sm text-gray-500">
                  {prop.address ? (
                    prop.address
                  ) : (
                    <AddressDisplay lat={prop.lat} lng={prop.lng} />
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
