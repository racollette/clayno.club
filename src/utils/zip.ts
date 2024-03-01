import JSZip from "jszip";

export const zip = async (items: any, type: string) => {
  const zip = new JSZip();

  const fetchAndAddToZip = async (item: any) => {
    try {
      const response = await fetch(
        `${
          type === "gif" ? item.gif : type === "pfp" ? item.pfp : item.classPFP
        }`
      );

      const blob = await response.blob();
      zip.file(`${item.name}.${type === "gif" ? `gif` : `png`}`, blob);
    } catch (error) {
      console.error(`Failed to fetch image`, error);
    }
  };

  const promises = items.map(fetchAndAddToZip);

  try {
    await Promise.all(promises);
    const content = await zip.generateAsync({ type: "blob" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = "images.zip"; // Set the zip file name
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  } catch (error) {
    console.error("Error creating or downloading zip file:", error);
  }
};
