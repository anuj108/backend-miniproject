const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();
const BASE_URL = process.env.BASE_URL;

router.post("/upload", upload.single("file"), async (req, res) => {
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `${BASE_URL}/file/${req.file.filename}`;
  return res.send(imgUrl);
});

module.exports = router;
