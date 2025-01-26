"use client";

import { useState } from "react";

interface PriceRangeDropdownProps {
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceRangeDropdown({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeDropdownProps) {
  const [open, setOpen] = useState(false);

  // local states while user edits
  const [tempMin, setTempMin] = useState(minPrice || 0);
  const [tempMax, setTempMax] = useState(maxPrice || 999999999);

  const label = (() => {
    if (minPrice <= 0 && maxPrice >= 999999999) {
      return "Any price";
    }
    const minLabel = minPrice === 0 ? "No min" : `$${minPrice}`;
    const maxLabel = maxPrice >= 999999999 ? "No max" : `$${maxPrice}`;
    return `${minLabel} - ${maxLabel}`;
  })();

  const handleApply = () => {
    onChange(tempMin, tempMax);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="btn btn-bordered"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>

      {open && (
        <div className="absolute bg-base-100 shadow-lg border rounded p-3 w-64 z-50 mt-2 right-0">
          <div className="flex space-x-2 mb-2">
            <div className="flex-1">
              <label className="text-sm text-gray-500">Min</label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="No min"
                value={tempMin || ""}
                onChange={(e) => setTempMin(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500">Max</label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="No max"
                value={tempMax >= 999999999 ? "" : tempMax}
                onChange={(e) =>
                  setTempMax(e.target.value ? Number(e.target.value) : 999999999)
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setTempMin(0);
                setTempMax(999999999);
              }}
              className="btn btn-ghost btn-sm"
            >
              Reset
            </button>
            <button onClick={handleApply} className="btn btn-primary btn-sm">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
