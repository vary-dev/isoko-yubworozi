"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContentSkeleton({ count = 6, variant = "card" }: { count?: number; variant?: "card" | "book" }) {
  return (
    <div role="status" aria-label="Loading content" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[1.75rem] border border-gray-100 bg-white p-4 shadow-sm">
          <Skeleton className={variant === "book" ? "h-64 bg-isoko-dark/8" : "h-52 bg-isoko-dark/8"} />
          <Skeleton className="mt-5 h-3 w-1/3 bg-isoko-dark/8" />
          <Skeleton className="mt-3 h-6 w-11/12 bg-isoko-dark/8" />
          <Skeleton className="mt-3 h-4 w-2/3 bg-isoko-dark/8" />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
