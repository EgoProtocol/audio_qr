// server.js
// Simple Express server for audio upload + QR generation
// Compatible with Render deployment + Cloudinary storage

const express = require("express");
const multer = require("multer");
const QRCode = require("qrcode");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

// ===== ENV =====
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ===== PATHS =====
const PUBLIC_DIR = path.join(__dirname, "public");

// ===== Cloudinary configuration =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== Multer + Cloudinary storage =====
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "audio_qr",
    resource_type: "video", // Cloudinary uses "video" for audio files
    allowed_formats: ["mp3", "wav", "ogg", "m4a", "aac", "flac"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max
  },
});

// ===== Static files =====
app.use(express.static(PUBLIC_DIR));

// ===== Upload route =====
app.post("/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // req.file.path contains the Cloudinary URL
  // req.file.filename contains the public_id
  const publicId = req.file.filename;
  const audioUrl = `${BASE_URL}/audio/${publicId}`;

  try {
    const qrCode = await QRCode.toDataURL(audioUrl);

    res.json({
      audioUrl,
      qrCode,
    });
  } catch (err) {
    res.status(500).json({ error: "QR generation failed" });
  }
});

// ===== Public audio page =====
app.get("/audio/:publicId", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "audio.html"));
});

// ===== Get audio file URL from Cloudinary =====
app.get("/files/:publicId", (req, res) => {
  const { publicId } = req.params;
  const url = cloudinary.url(publicId, {
    resource_type: "video",
    secure: true,
  });
  res.redirect(url);
});

// ===== Admin API - list uploaded files =====
app.get("/api/files", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:audio_qr AND resource_type:video")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const audioFiles = result.resources.map((file, index) => ({
      id: String(index + 1).padStart(2, "0"),
      filename: file.public_id.replace("audio_qr/", "") + "." + file.format,
      downloadUrl: file.secure_url,
      publicId: file.public_id,
    }));

    res.json(audioFiles);
  } catch (err) {
    console.error("Cloudinary error:", err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// ===== Admin page =====
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/admin.html"));
});

// ===== Start server =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${BASE_URL}`);
});
