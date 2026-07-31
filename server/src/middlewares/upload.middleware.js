import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg|pdf|xlsx|xls/;
  const extOk = allowed.test(file.originalname.toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk || mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Loại file không được hỗ trợ"), false);
  }
};

export const uploadMemory = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

export const uploadSingle = (field) => uploadMemory.single(field);
export const uploadMultiple = (field, max = 5) => uploadMemory.array(field, max);
