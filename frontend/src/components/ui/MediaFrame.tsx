"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Standard media container for cards and detail views.
 * - Reserves space via the wrapper's aspect ratio (no layout shift / CLS).
 * - `cover` for editorial photography, `contain` for book covers, equipment and
 *   product cutouts where the whole item must stay visible.
 * - Lazy-loads below the fold; `priority` only for genuinely critical images.
 * - Shows a stable neutral fallback when the URL is missing or fails to load,
 *   so card height and alignment never collapse.
 */
export default function MediaFrame({
  src,
  alt,
  className,
  sizes = "100vw",
  fit = "cover",
  position,
  priority = false,
  zoom = false,
  icon = "fa-solid fa-image",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  fit?: "cover" | "contain";
  position?: string;
  priority?: boolean;
  zoom?: boolean;
  icon?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-isoko-neutral", className)}>
      {showImage ? (
        <Image
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          sizes={sizes}
          src={src as string}
          alt={alt}
          style={{ objectFit: fit, objectPosition: position }}
          className={cn("transition-transform duration-500", zoom && "group-hover:scale-[1.04]")}
          onError={() => setFailed(true)}
        />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center bg-gradient-to-br from-isoko-neutral to-isoko-light/40">
          <i aria-hidden="true" className={`${icon} text-3xl text-isoko-muted/40`} />
        </div>
      )}
    </div>
  );
}
