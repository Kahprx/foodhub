import cloudinary from "cloudinary";

const isCloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export const uploadToCloudinary = async (fileBuffer, folder = "foodhub", mimetype = "image/png") => {
  if (!isCloudinaryConfigured()) {
    return { url: `data:${mimetype};base64,${fileBuffer.toString("base64")}`, provider: "base64" };
  }

  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, provider: "cloudinary" });
      }
    );
    stream.end(fileBuffer);
  });
};
