"use client";

import { TaskImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: TaskImage[];
  alt?: string;
  className?: string;
}

// Placeholder images for when no images are provided
const placeholderImages = [
  "https://images.unsplash.com/photo-1606077089119-92075161bb60?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
];

export function ImageGallery({
  images,
  alt = "Task image",
  className,
}: ImageGalleryProps) {
  const hasImages = images.length > 0;
  const displayUrls = hasImages
    ? images.map((img) => ({ url: img.url, alt: img.altText ?? alt }))
    : placeholderImages.map((url) => ({ url, alt }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayUrls.length - 1 : prev - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === displayUrls.length - 1 ? 0 : prev + 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (displayUrls.length === 0) {
    return (
      <div
        className={cn(
          "relative w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center text-gray-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-2" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image Container */}
      <div className="relative w-full aspect-4/3 md:aspect-video bg-gray-100 rounded-2xl overflow-hidden group">
        {/* Current Image */}
        <Image
          src={displayUrls[currentIndex].url}
          alt={`${displayUrls[currentIndex].alt} ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />

        {/* Navigation Arrows */}
        {displayUrls.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {displayUrls.length}
        </div>
      </div>

      {/* Thumbnails */}
      {displayUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
          {displayUrls.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden transition-all",
                currentIndex === index
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={image.url}
                alt={`${image.alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
