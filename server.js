// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(".")); // serve index.html

// Multer storage config
const upload = multer({ dest: "uploads/" });

// API route
app.post("/api/create-bank-account", upload.single("idFile"), (req, res) => {
  const data = req.body;
  const file = req.file;

  if (!data.fullname || !data.email || !data.phone) {
    return res.status(400).json({ ok: false, message: "Missing fields" });
  }

  const record = {
    fullname: data.fullname,
    email: data.email,
    phone: data.phone,
    dob: data.dob,
    file: file ? file.filename : null,
    createdAt: new Date().toISOString(),
  };

  // Save to local file (demo)
  const savePath = path.join(__dirname, "records.json");
  let records = [];
  if (fs.existsSync(savePath)) {
    records = JSON.parse(fs.readFileSync(savePath));
  }
  records.push(record);
  fs.writeFileSync(savePath, JSON.stringify(records, null, 2));

  res.json({ ok: true, message: "Bank account request received!" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
