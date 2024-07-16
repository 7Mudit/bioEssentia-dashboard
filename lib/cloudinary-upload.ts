import { createImageUpload } from "novel/plugins";
import { toast } from "react-hot-toast";

export const Upload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "cozvz1zo");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  console.log(data);
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Failed to upload image");
  }
};

export const uploadFn = createImageUpload({
  onUpload: Upload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
