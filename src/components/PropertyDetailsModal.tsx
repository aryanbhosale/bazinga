"use client";

import { useState } from "react";
import { Property } from "../utils/types";
import AddEditPropertyModal from "./AddEditPropertyModal";

interface PropertyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  property: Property;
}

export default function PropertyDetailsModal({
  open,
  onClose,
  property,
}: PropertyDetailsModalProps) {
  const [editMode, setEditMode] = useState(false);

  if (!open) return null;

  if (editMode) {
    return (
      <AddEditPropertyModal
        open={open}
        onClose={() => {
          setEditMode(false);
          onClose();
        }}
        existingProperty={property}
      />
    );
  }

  // If you store an address, show that. Otherwise lat/lng
  const addressLine = property.address
    ? property.address
    : `${property.lat}, ${property.lng}`;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-md rounded-lg shadow-lg p-0 overflow-hidden">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2 z-10 bg-white"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative w-full h-48">
          <img
            src={property.imageUrl || "/placeholder.png"}
            alt="Property"
            className="w-full h-full object-cover"
          />
          {/* Active badge */}
          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            Active
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Price */}
          <p className="text-lg font-bold text-black">
            ${property.price.toLocaleString()}
          </p>

          {/* Bed / Bath / Sqft */}
          <p className="text-sm text-gray-600">
            {property.bedrooms}bd • {property.bathrooms}ba •{" "}
            {property.squareFeet.toLocaleString()} sqft
          </p>

          {/* Address */}
          <p className="text-sm text-gray-500">{addressLine}</p>

          {/* MLS */}
          <p className="text-xs text-gray-400">
            MLS®: {property.id || "Unavailable"}
          </p>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            className="btn btn-primary btn-sm w-full"
            onClick={() => setEditMode(true)}
          >
            Edit Property
          </button>
        </div>
      </div>
    </div>
  );
}
