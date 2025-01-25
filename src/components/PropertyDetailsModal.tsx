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

  const handleClose = () => {
    setEditMode(false);
    onClose();
  };

  if (editMode) {
    return (
      <AddEditPropertyModal
        open={open}
        onClose={handleClose}
        existingProperty={property}
      />
    );
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-lg font-bold mb-2">{property.title}</h3>
        <img
          src={property.imageUrl}
          alt="Property"
          className="w-full h-48 object-cover mb-2"
        />
        <p>{property.description}</p>
        <p className="mt-2">
          <strong>Price:</strong> ${property.price.toLocaleString()}
        </p>
        <p>
          <strong>Bedrooms:</strong> {property.bedrooms}
        </p>
        <p>
          <strong>Bathrooms:</strong> {property.bathrooms}
        </p>
        <p>
          <strong>Square Feet:</strong> {property.squareFeet.toLocaleString()}
        </p>
        <p>
          <strong>Latitude / Longitude:</strong> {property.lat} / {property.lng}
        </p>
        <p>
          <strong>For Rent:</strong> {property.forRent ? "Yes" : "No"}
        </p>

        <div className="modal-action">
          <button className="btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
