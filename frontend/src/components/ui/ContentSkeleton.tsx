"use client";

import Skeleton from "@mui/material/Skeleton";

export default function ContentSkeleton({ count = 6, variant = "card" }: { count?: number; variant?: "card" | "book" }) {
  return (
    <div role="status" aria-label="Loading content" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <Skeleton animation="wave" variant="rounded" height={variant === "book" ? 190 : 210} sx={{ borderRadius: 3 }} />
          <Skeleton animation="wave" width="32%" height={24} sx={{ mt: 1 }} />
          <Skeleton animation="wave" width="90%" height={30} />
          <Skeleton animation="wave" width="65%" />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
