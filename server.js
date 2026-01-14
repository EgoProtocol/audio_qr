// server.js
// Simple Express server for audio upload + QR generation
// Compatible with Render deployment

const express = require("express");
const multer = require("multer");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const app = express();

// ===== ENV =====
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ===== PATHS =====
const UPLOAD_DIR = path.join(__dirname, "uploads");
const PUBLIC_DIR = path.join(__dirname, "public");

// ===== Ensure uploads directory exists =====
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ===== Multer configuration =====
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const id = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max (safe default)
  },
});

// ===== Static files =====
app.use(express.static(PUBLIC_DIR));
app.use("/files", express.static(UPLOAD_DIR));

// ===== Upload route =====
app.post("/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filename = req.file.filename;
  const audioUrl = `${BASE_URL}/audio/${filename}`;

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
app.get("/audio/:filename", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "audio.html"));
});

// ===== Admin API - list uploaded files =====
app.get("/api/files", (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read uploads" });
    }

    const audioFiles = files
      .filter((f) => !f.startsWith("."))
      .map((filename, index) => ({
        id: String(index + 1).padStart(2, "0"),
        filename,
        downloadUrl: `/files/${filename}`,
      }));

    res.json(audioFiles);
  });
});

// ===== Admin page =====
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/admin.html"));
});

// ===== Start server =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${BASE_URL}`);
});
