import { Router } from "express";
import multer from "multer";

import cloudinary from "../lib/cloudinary.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Only image files are allowed."));
    }
  },
});

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
        return;
      }

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "socialconnect/profiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file!.buffer);
      });

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully!",
        url: result.secure_url,
      });
    } catch (error) {
      console.error("Image upload error:", error);

      res.status(500).json({
        success: false,
        message: "Image upload failed.",
      });
    }
  }
);

export default router;