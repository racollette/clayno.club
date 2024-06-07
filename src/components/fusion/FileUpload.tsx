import React, { type ChangeEvent, type FormEvent, useState } from "react";
import { useToast } from "~/@/components/ui/use-toast";
import { HiRefresh } from "react-icons/hi";

function FileUpload({ userId, refetch }: { userId: string; refetch: any }) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (fileName.endsWith(".mp3")) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Please select an .mp3 file",
        });
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setUploading(true);
    e.preventDefault();

    if (!file) {
      toast({
        title: "Please select a file to upload",
      });
      return;
    }

    if (!userId) {
      throw new Error("User is not logged in");
    }

    const formData = new FormData();
    formData.append("file", file, encodeURI(file.name));

    try {
      const response = await fetch(
        `https://api.clayno.club/audio?userId=${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        refetch();
        toast({
          title: "File uploaded successfully",
        });
      }

      setFile(null);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
      toast({
        title: "File upload failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-lg bg-neutral-700 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-row items-center gap-2">
          <input
            type="file"
            accept=".mp3"
            onChange={handleFileChange}
            className="hidden" // Hide the default input
            id="file-input" // Associate the label with the input using an id
          />
          <label
            htmlFor="file-input" // Associate the label with the input using htmlFor
            className="cursor-pointer whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
          >
            Select MP3 File
          </label>
          <button
            disabled={!file}
            className={`${
              file ? `bg-green-500` : "bg-neutral-500"
            } flex flex-row items-center rounded-md px-4 py-2 text-sm`}
            type="submit"
          >
            {uploading ? (
              <>
                Uploading
                <HiRefresh size={20} className="ml-2 animate-spin" />
              </>
            ) : (
              <span>Upload</span>
            )}
          </button>
        </div>
        <div className="flex items-center">
          <p className="text-xs">{file?.name}</p>
        </div>
      </form>
    </div>
  );
}

export default FileUpload;
