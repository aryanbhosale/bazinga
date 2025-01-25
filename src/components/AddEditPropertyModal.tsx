"use client";

import { useState } from "react";
import { Property } from "../utils/types";
import useProperties from "../hooks/useProperties";

interface AddEditPropertyModalProps {
  open: boolean;
  onClose: () => void;
  existingProperty?: Property; 
}

export default function AddEditPropertyModal({
  open,
  onClose,
  existingProperty,
}: AddEditPropertyModalProps) {
  const { addProperty, updateProperty } = useProperties();

  const isEdit = !!existingProperty;

  const [title, setTitle] = useState(existingProperty?.title || "");
  const [description, setDescription] = useState(
    existingProperty?.description || ""
  );
  const [price, setPrice] = useState(existingProperty?.price || 0);
  const [bedrooms, setBedrooms] = useState(existingProperty?.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(existingProperty?.bathrooms || 0);
  const [squareFeet, setSquareFeet] = useState(
    existingProperty?.squareFeet || 0
  );
  const [propertyType, setPropertyType] = useState(
    existingProperty?.propertyType || "Residential"
  );
  const [lat, setLat] = useState(existingProperty?.lat || 34.0);
  const [lng, setLng] = useState(existingProperty?.lng || -118.7);
  const [imageUrl, setImageUrl] = useState(existingProperty?.imageUrl || "");
  const [forRent, setForRent] = useState(existingProperty?.forRent || false);

  const handleSubmit = async () => {
    if (isEdit && existingProperty) {
      await updateProperty(existingProperty.id, {
        title,
        description,
        price,
        bedrooms,
        bathrooms,
        squareFeet,
        propertyType,
        lat,
        lng,
        imageUrl,
        forRent,
      });
    } else {
      await addProperty({
        title,
        description,
        price,
        bedrooms,
        bathrooms,
        squareFeet,
        propertyType,
        lat,
        lng,
        imageUrl,
        forRent,
      });
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">
            {isEdit ? "Edit Property" : "Add New Property"}
          </h3>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-sm">Title</span>
            <input
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Description</span>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Price</span>
            <input
              type="number"
              className="input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
          <div className="flex space-x-2">
            <label className="block flex-1">
              <span className="text-sm">Bedrooms</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
              />
            </label>
            <label className="block flex-1">
              <span className="text-sm">Bathrooms</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm">Square Feet</span>
            <input
              type="number"
              className="input input-bordered w-full"
              value={squareFeet}
              onChange={(e) => setSquareFeet(Number(e.target.value))}
            />
          </label>
          <label className="block">
            <span className="text-sm">Property Type</span>
            <select
              className="select select-bordered w-full"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option>Residential</option>
              <option>Condo</option>
              <option>Townhome</option>
              <option>Multi-Family</option>
            </select>
          </label>
          <div className="flex space-x-2">
            <label className="block flex-1">
              <span className="text-sm">Latitude</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
              />
            </label>
            <label className="block flex-1">
              <span className="text-sm">Longitude</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm">Image URL</span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          <label className="flex items-center space-x-2">
            <span className="text-sm">For Rent?</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={forRent}
              onChange={(e) => setForRent(e.target.checked)}
            />
          </label>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
