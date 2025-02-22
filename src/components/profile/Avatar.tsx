"use client";

import { useState } from "react";
import { useToast } from "~/@/components/ui/use-toast";
import Image from "next/image";
import { useUploadThing } from "~/utils/uploadthing";
import { api } from "~/utils/api";
import { handleUserPFPDoesNotExist } from "~/utils/images";

interface AvatarProps {
  userId: string;
  currentAvatar?: string | null;
  onSuccess?: () => void;
}

export default function Avatar({
  userId,
  currentAvatar,
  onSuccess,
}: AvatarProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const updateUserAvatar = api.binding.updateUserAvatar.useMutation();
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (response) => {
      if (response?.[0]?.url) {
        try {
          await updateUserAvatar.mutateAsync({
            userId,
            imageUrl: response[0].url,
          });
          onSuccess?.();
        } catch (error) {
          toast({
            title: "Failed to update avatar",
            variant: "destructive",
          });
        }
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      toast({
        title: "Failed to upload image",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await startUpload([file]);
  };

  return (
    <label className="relative block h-20 w-20 cursor-pointer overflow-hidden rounded-full transition-opacity hover:opacity-80">
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          Uploading...
        </div>
      )}
      <Image
        src={currentAvatar || "/images/default-avatar.png"}
        alt="Avatar"
        fill
        className="object-cover"
        onError={handleUserPFPDoesNotExist}
      />
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={isUploading}
      />
    </label>
  );
}
