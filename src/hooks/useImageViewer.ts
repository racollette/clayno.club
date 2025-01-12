import { useState, useCallback } from "react";

// Create a singleton state outside the hook
let globalSelectedImage: string | null = null;
let globalSetSelectedImage: ((url: string | null) => void) | null = null;
const subscribers = new Set<() => void>();

export const useImageViewer = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    globalSelectedImage
  );

  // Initialize global setter if not already set
  if (!globalSetSelectedImage) {
    globalSetSelectedImage = (url: string | null) => {
      globalSelectedImage = url;
      subscribers.forEach((callback) => callback());
    };
  }

  // Subscribe to changes
  useState(() => {
    const callback = () => setSelectedImage(globalSelectedImage);
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  });

  const openImage = useCallback((imageUrl: string) => {
    if (globalSetSelectedImage) {
      globalSetSelectedImage(imageUrl);
      setSelectedImage(imageUrl);
    }
  }, []);

  const closeImage = useCallback(() => {
    if (globalSetSelectedImage) {
      globalSetSelectedImage(null);
      setSelectedImage(null);
    }
  }, []);

  return {
    selectedImage,
    isOpen: !!selectedImage,
    openImage,
    closeImage,
  };
};
