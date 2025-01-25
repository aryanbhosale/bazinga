"use client";

import { useState } from "react";
import useProperties from "../hooks/useProperties";
import { Property } from "../utils/types";

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
  const [description, setDescription] = useState(existingProperty?.description || "");
  const [price, setPrice] = useState(existingProperty?.price || 0);
  const [bedrooms, setBedrooms] = useState(existingProperty?.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(existingProperty?.bathrooms || 0);
  const [squareFeet, setSquareFeet] = useState(existingProperty?.squareFeet || 0);
  const [propertyType, setPropertyType] = useState(existingProperty?.propertyType || "Residential");
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
      <div className="modal-box relative">
        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Property" : "Add New Property"}
        </h3>
        <div className="space-y-2">
          <label className="block">
            <span>Title</span>
            <input
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block">
            <span>Description</span>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="block">
            <span>Price</span>
            <input
              type="number"
              className="input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
          <div className="flex space-x-2">
            <label className="block flex-1">
              <span>Bedrooms</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
              />
            </label>
            <label className="block flex-1">
              <span>Bathrooms</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="block">
            <span>Square Feet</span>
            <input
              type="number"
              className="input input-bordered w-full"
              value={squareFeet}
              onChange={(e) => setSquareFeet(Number(e.target.value))}
            />
          </label>
          <label className="block">
            <span>Property Type</span>
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
              <span>Latitude</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
              />
            </label>
            <label className="block flex-1">
              <span>Longitude</span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="block">
            <span>Image URL</span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          <label className="flex items-center space-x-2">
            <span>For Rent?</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={forRent}
              onChange={(e) => setForRent(e.target.checked)}
            />
          </label>
        </div>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
