"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <div className="navbar bg-black text-white px-4 py-2">
      {/* Left: brand or menu */}
      <div className="flex-1 space-x-6">
        <Link href="#" className="font-semibold">
          Bazinga Properties
        </Link>
      </div>

      {/* Right: Save search / user icons, etc. */}
      <div className="flex-none space-x-3">
        
      </div>
    </div>
  );
}
