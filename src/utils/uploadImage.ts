import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: "restome/menus",          // folder in Cloudinary
    format: "png",                    // or jpg/jpeg
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    public_id: file.originalname.split(".")[0], // optional: use original name
  }),
});

// Multer upload middleware
const uploadImage = (fieldName: string) => {
  const multerMiddleware = multer({ storage }).single(fieldName);

  // Return a wrapper middleware that ensures req.file.path has the Cloudinary URL
  return (req: any, res: any, next: any) => {
    multerMiddleware(req, res, (err) => {
      if (err) return next(err);
      // req.file is populated by multer
      if (req.file) {
        // Ensure Cloudinary URL is accessible
        req.fileUrl = req.file.path; // you can use req.fileUrl in your controller
      }

      next();
    });
  };
};

export default uploadImage;
