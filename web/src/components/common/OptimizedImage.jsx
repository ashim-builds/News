"use client";

import { useState } from "react";

const FALLBACK_IMAGE = "/logo.jpg";

/**
 * High-Performance Optimized Image Component
 * - 0 Cumulative Layout Shift (CLS) via fixed aspect ratio container
 * - Off-main-thread decoding via decoding="async" for smooth 60fps scrolling
 * - Lazy loading for off-screen images via loading="lazy"
 * - Shimmer skeleton placeholder while loading
 * - Smooth fade-in transition upon load
 * - Fallback handling for broken links
 */
export default function OptimizedImage({
  src,
  alt = "Image",
  className = "",
  containerClassName = "",
  aspectRatio = "aspect-video", // e.g. "aspect-video", "aspect-[4/3]", "aspect-square"
  priority = false,
  fallback = FALLBACK_IMAGE,
  objectFit = "object-cover",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError || !src ? fallback : src;

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 ${aspectRatio} ${containerClassName}`}
    >
      {/* Animated Skeleton Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Optimized Image */}
      <img
        src={imageSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setIsLoaded(true);
          }
        }}
        className={`w-full h-full ${objectFit} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
