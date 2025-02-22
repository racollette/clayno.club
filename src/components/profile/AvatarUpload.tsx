"use client";

import { useState } from "react";
import { useToast } from "~/@/components/ui/use-toast";
import Image from "next/image";
import { useUploadThing } from "~/utils/uploadthing";
import { api } from "~/utils/api";

interface AvatarUploadProps {
  userId: string;
  currentAvatar?: string | null;
  onSuccess: () => void;
}

export default function AvatarUpload({
  userId,
  currentAvatar,
  onSuccess,
}: AvatarUploadProps) {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const updateUserAvatar = api.binding.updateUserAvatar.useMutation();

  const { startUpload, isUploading: isUploadingFile } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: async (response) => {
        console.log("Client upload complete:", response);
        if (response?.[0]?.url) {
          const uploadedUrl = response[0].url;

          try {
            // Update the user's avatar in the database
            await updateUserAvatar.mutateAsync({
              userId,
              imageUrl: uploadedUrl,
            });

            setPreview(uploadedUrl);
            toast({
              title: "Avatar updated successfully",
            });
            onSuccess();
          } catch (error) {
            console.error("Failed to update avatar in database:", error);
            toast({
              title: "Failed to update avatar",
              variant: "destructive",
            });
          }
        } else {
          console.error("Upload completed but no URL received:", response);
          toast({
            title: "Upload completed but failed to update avatar",
            variant: "destructive",
          });
        }
        setIsUploading(false);
      },
      onUploadError: (error: Error) => {
        console.log("Upload error:", error);
        toast({
          title: "Failed to update avatar",
          description: error.message,
          variant: "destructive",
        });
        setIsUploading(false);
      },
      onUploadProgress: (progress) => {
        console.log("Upload progress:", progress);
      },
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await startUpload([file]);
  };

  return (
    <label className="relative block h-20 w-20 cursor-pointer overflow-hidden rounded-full transition-opacity hover:opacity-80">
      {(isUploading || isUploadingFile) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          Uploading...
        </div>
      )}
      <Image
        src={preview || currentAvatar || "/images/default-avatar.png"}
        alt="Avatar preview"
        fill
        className="object-cover"
      />
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={isUploading || isUploadingFile}
      />
    </label>
  );
}
