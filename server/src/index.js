const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: "./.env" });

// Route files
const authRoutes = require("./routes/authRoutes");

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// Serve static assets in production
// Set static folder
const staticPath = path.resolve(__dirname, "../../dist");
app.use(express.static(staticPath));

// Any route that is not an API route should serve the index.html
app.get("*", (req, res) => {
  // Only serve the frontend for non-API routes
  if (!req.url.startsWith("/api")) {
    res.sendFile(path.resolve(staticPath, "index.html"));
  } else {
    res.status(404).json({ message: "API endpoint not found" });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend available at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
