"use client";

import { useState } from "react";
import { useToast } from "~/@/components/ui/use-toast";
import Image from "next/image";
import { useUploadThing } from "~/utils/uploadthing";
import { api } from "~/utils/api";
import { handleUserPFPDoesNotExist } from "~/utils/images";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";
import { Button } from "~/@/components/ui/button";

interface AvatarProps {
  userId: string;
  currentAvatar?: string | null;
  onSuccess?: () => void;
  holderDinos?: Array<{
    mint: string;
    pfp: string;
    name: string;
  }>;
}

export default function Avatar({
  userId,
  currentAvatar,
  onSuccess,
  holderDinos = [],
}: AvatarProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const updateUserAvatar = api.binding.updateUserAvatar.useMutation();
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (response) => {
      if (response?.[0]?.url) {
        await handleAvatarUpdate(response[0].url);
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

  const handleAvatarUpdate = async (imageUrl: string) => {
    try {
      await updateUserAvatar.mutateAsync({
        userId,
        imageUrl,
      });
      onSuccess?.();
      setIsDialogOpen(false);
      toast({
        title: "Avatar updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update avatar",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await startUpload([file]);
  };

  const handleDinoSelect = async (pfpUrl: string) => {
    await handleAvatarUpdate(pfpUrl);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="relative block h-20 w-20 cursor-pointer overflow-hidden rounded-full transition-opacity hover:opacity-80">
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
        </div>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] border-neutral-700 bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle>Choose Avatar</DialogTitle>
        </DialogHeader>

        <div className="-mr-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600 hover:scrollbar-thumb-neutral-500">
          <div className="flex flex-col gap-4">
            {/* Upload option */}
            <div>
              <h3 className="mb-2 text-sm font-medium">Upload Custom Image</h3>
              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 p-4 hover:bg-neutral-700">
                <div className="text-center">
                  <div className="text-sm">Click to upload</div>
                  <div className="text-xs text-neutral-400">
                    PNG, JPG up to 10MB
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Dino selection */}
            {holderDinos.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">
                  Select from Your Dinos
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {holderDinos.map((dino) => (
                    <button
                      key={dino.mint}
                      onClick={() => handleDinoSelect(dino.pfp)}
                      className="relative aspect-square overflow-hidden rounded-lg border border-neutral-700 hover:border-neutral-500"
                    >
                      <Image
                        src={`https://prod-image-cdn.tensor.trade/images/slug=claynosaurz/400x400/freeze=false/${dino.pfp}`}
                        alt={dino.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
