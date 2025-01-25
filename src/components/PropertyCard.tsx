"use client";

import { Property } from "../utils/types";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="p-4 border-b border-base-200">
      <div className="font-semibold">{property.title}</div>
      <div className="text-sm text-gray-500">{property.description}</div>
      <div className="text-sm mt-1">
        ${property.price.toLocaleString()} | {property.bedrooms} BR |{" "}
        {property.bathrooms} BA | {property.squareFeet.toLocaleString()} sqft
      </div>
    </div>
  );
}
