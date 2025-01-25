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
          onClose(); // or keep open after saving
        }}
        existingProperty={property}
      />
    );
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-lg">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-lg font-bold mb-2">{property.title}</h3>
        <img
          src={property.imageUrl || "/placeholder.png"}
          alt="Property"
          className="w-full h-48 object-cover mb-2"
        />
        <p>{property.description}</p>
        <div className="mt-2 text-sm space-y-1">
          <div>
            <span className="font-semibold">Price:</span>{" "}
            ${property.price.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Bedrooms:</span> {property.bedrooms}
          </div>
          <div>
            <span className="font-semibold">Bathrooms:</span> {property.bathrooms}
          </div>
          <div>
            <span className="font-semibold">Square Feet:</span>{" "}
            {property.squareFeet.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Property Type:</span>{" "}
            {property.propertyType}
          </div>
          <div>
            <span className="font-semibold">For Rent?</span>{" "}
            {property.forRent ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-semibold">Location:</span> {property.lat}, {property.lng}
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
