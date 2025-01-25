"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1 px-2">
        <Link href="/" className="text-xl font-bold">
          Bazinga Properties
        </Link>
      </div>
    </div>
  );
}
