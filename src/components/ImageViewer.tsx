import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageViewerProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  isOpen,
  imageUrl,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when imageUrl changes
  useEffect(() => {
    setIsLoading(true);
  }, [imageUrl]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative h-[90vh] w-[90vw]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-600 border-t-neutral-100" />
          </div>
        )}
        <Image
          src={imageUrl}
          alt="Full screen view"
          fill
          className="rounded-xl object-contain"
          onLoadingComplete={() => setIsLoading(false)}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default ImageViewer;
