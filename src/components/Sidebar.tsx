"use client";

import { Property } from "../utils/types";
import PropertyCard from "./PropertyCard";

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
    <div className="w-full md:w-80 bg-base-100 border-r border-base-200 overflow-y-auto h-full">
      <div className="p-4 font-bold text-lg border-b border-base-200">
        Properties
      </div>
      {properties.map((p) => {
        const isSelected = p.id === selectedProperty?.id;
        return (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className={`cursor-pointer hover:bg-base-200 ${
              isSelected ? "bg-base-200" : ""
            }`}
          >
            <PropertyCard property={p} />
          </div>
        );
      })}
    </div>
  );
}
