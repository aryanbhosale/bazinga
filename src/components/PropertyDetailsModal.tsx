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
      <div className="modal-box relative max-w-md">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2">{property.title}</h3>

        {/* Image */}
        <img
          src={property.imageUrl || "/placeholder.png"}
          alt="Property"
          className="w-full h-48 object-cover mb-3 rounded"
        />

        {/* Price + bed/bath/sqft in one line */}
        <p className="text-lg font-semibold mb-1">
          ${property.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          {property.bedrooms}bd • {property.bathrooms}ba •{" "}
          {property.squareFeet.toLocaleString()} sqft
        </p>

        {/* Address line (or lat/lng) */}
        <p className="text-sm text-gray-500 mb-2">{addressLine}</p>

        {/* Optionally show forRent status / propertyType */}
        <p className="text-sm mb-2">
          <span className="font-semibold">Property Type:</span>{" "}
          {property.propertyType}
        </p>
        <p className="text-sm mb-4">
          <span className="font-semibold">For Rent?</span>{" "}
          {property.forRent ? "Yes" : "No"}
        </p>

        {/* Description (if not too long) */}
        {property.description && (
          <p className="text-sm mb-4">{property.description}</p>
        )}

        {/* Edit button */}
        <div className="modal-action">
          <button className="btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
