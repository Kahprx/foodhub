import { uploadToCloudinary } from "../services/upload.service.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Chưa có file upload" });
    }

    const folder = req.body.folder || "foodhub";
    const result = await uploadToCloudinary(req.file.buffer, folder, req.file.mimetype);

    return res.status(200).json({
      success: true,
      url: result.url,
      provider: result.provider,
      originalName: req.file.originalname,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadMultipleImages = async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "Chưa có file upload" });
    }

    const folder = req.body.folder || "foodhub";
    const results = [];
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, folder, file.mimetype);
      results.push({ url: result.url, provider: result.provider, originalName: file.originalname });
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
