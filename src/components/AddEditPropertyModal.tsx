"use client";

import { useEffect, useState } from "react";
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

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [squareFeet, setSquareFeet] = useState(0);
  const [propertyType, setPropertyType] = useState("Residential");
  const [lat, setLat] = useState(34.0);
  const [lng, setLng] = useState(-118.7);
  const [imageUrl, setImageUrl] = useState("");
  const [forRent, setForRent] = useState(false);

  // Validation error state
  const [error, setError] = useState<string>("");

  // Reset the form when the modal is opened
  useEffect(() => {
    if (open) {
      if (isEdit && existingProperty) {
        setTitle(existingProperty.title);
        setDescription(existingProperty.description);
        setPrice(existingProperty.price);
        setBedrooms(existingProperty.bedrooms);
        setBathrooms(existingProperty.bathrooms);
        setSquareFeet(existingProperty.squareFeet);
        setPropertyType(existingProperty.propertyType);
        setLat(existingProperty.lat);
        setLng(existingProperty.lng);
        setImageUrl(existingProperty.imageUrl);
        setForRent(existingProperty.forRent);
      } else {
        setTitle("");
        setDescription("");
        setPrice(0);
        setBedrooms(0);
        setBathrooms(0);
        setSquareFeet(0);
        setPropertyType("Residential");
        setLat(34.0);
        setLng(-118.7);
        setImageUrl("");
        setForRent(false);
      }
      setError(""); // Clear any old errors
    }
  }, [open, existingProperty, isEdit]);

  const validateLatLng = (): boolean => {
    if (lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90.");
      return false;
    }
    if (lng < -180 || lng > 180) {
      setError("Longitude must be between -180 and 180.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Simple validation checks
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Image URL is required.");
      return;
    }
    if (price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    if (bedrooms <= 0) {
      setError("Bedrooms must be at least 1.");
      return;
    }
    if (bathrooms <= 0) {
      setError("Bathrooms must be at least 1.");
      return;
    }
    if (squareFeet <= 0) {
      setError("Square feet must be greater than 0.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!validateLatLng()) {
      return; // Lat/lng validation failed
    }

    setError(""); // Clear any old errors

    // If all checks pass, either update or add
    try {
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
      onClose(); // Close modal after successful operation
    } catch (err) {
      console.error("Error saving property:", err);
      setError("Failed to save property. Please try again.");
    }
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

        {error && (
          <div className="alert alert-error shadow-sm mb-2">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block">
            <span>Title <span className="text-red-500">*</span></span>
            <input
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block">
            <span>Description <span className="text-red-500">*</span></span>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className="block">
            <span>Price <span className="text-red-500">*</span></span>
            <input
              type="number"
              className="input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>

          <div className="flex space-x-2">
            <label className="block flex-1">
              <span>Bedrooms <span className="text-red-500">*</span></span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
              />
            </label>
            <label className="block flex-1">
              <span>Bathrooms <span className="text-red-500">*</span></span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
              />
            </label>
          </div>

          <label className="block">
            <span>Square Feet <span className="text-red-500">*</span></span>
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
              <span>Latitude <span className="text-red-500">*</span></span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
              />
            </label>
            <label className="block flex-1">
              <span>Longitude <span className="text-red-500">*</span></span>
              <input
                type="number"
                className="input input-bordered w-full"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
              />
            </label>
          </div>

          <label className="block">
            <span>Image URL <span className="text-red-500">*</span></span>
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
