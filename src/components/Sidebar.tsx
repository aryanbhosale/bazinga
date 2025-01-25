"use client";

import { Property } from "../utils/types";

interface SidebarProps {
  properties: Property[];
  selectedProperty?: Property;
  onSelect: (p: Property) => void;
}

export default function Sidebar({
  properties,
  selectedProperty,
  onSelect,
}: SidebarProps) {
  return (
    <div className="w-full md:w-80 bg-base-100 border-r border-base-200 overflow-y-auto h-full p-2">
      <h2 className="text-lg font-bold mb-2">Properties</h2>
      {properties.map((prop) => {
        const isActive = prop.id === selectedProperty?.id;
        return (
          <div
            key={prop.id}
            onClick={() => onSelect(prop)}
            className={`card card-compact mb-2 cursor-pointer shadow-sm 
              border border-base-200 hover:shadow-lg transition 
              ${isActive ? "ring ring-primary ring-offset-2" : ""}`}
          >
            <figure>
              <img
                src={prop.imageUrl || "/placeholder.png"}
                alt="Property"
                className="h-32 w-full object-cover"
              />
            </figure>
            <div className="card-body p-3">
              <h3 className="card-title text-sm">{prop.title}</h3>
              <p className="text-xs text-gray-500">{prop.description}</p>
              <p className="text-xs font-semibold mt-1">
                ${prop.price.toLocaleString()} | {prop.bedrooms} BR |{" "}
                {prop.bathrooms} BA | {prop.squareFeet.toLocaleString()} sqft
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
