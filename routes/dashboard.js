const firebaseConfig = require("../public/config/firebase");
const path = require("path");
const express = require("express");
const router = express.Router();
const { getAuth } = require("firebase-admin/auth");
const { verifyToken } = require("./authMiddleware");

const firebaseAuth = getAuth();

router.get("/", verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

module.exports = router;
