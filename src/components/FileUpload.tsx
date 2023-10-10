import React, { ChangeEvent, FormEvent, useState } from "react";

function FileUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    if (!userId) {
      throw new Error("User is not logged in");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://api.dinoherd.cc/audio?userId=${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("??");
      console.log(response);

      if (response.ok) {
        alert("File uploaded successfully");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="rounded-lg bg-neutral-700 p-4">
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;
