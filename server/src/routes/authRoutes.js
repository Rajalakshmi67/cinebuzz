const express = require("express");
const { signup, signin, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Register and login routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", protect, getMe);

module.exports = router;
