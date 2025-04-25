const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

// Test OMDB API endpoint
app.get("/api/test-omdb", async (req, res) => {
  try {
    const omdbApiKey = process.env.OMDB_API_KEY || 'f692bea5';
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${omdbApiKey}&s=matrix&type=movie&page=1`);
    
    if (response.data.Response === 'True') {
      res.status(200).json({ 
        status: "success", 
        message: "OMDB API is working correctly",
        results: response.data.Search.slice(0, 2) // Return just a couple of movies as a test
      });
    } else {
      res.status(500).json({ 
        status: "error", 
        message: "OMDB API returned an error", 
        error: response.data.Error 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to connect to OMDB API", 
      error: error.message 
    });
  }
});

// TMDB API proxy endpoint
app.get("/api/tmdb/*", async (req, res) => {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY || '2e853e239a10686485ea5d598515cf2d';
    const path = req.path.replace('/api/tmdb', '');
    const query = req.query;
    
    const response = await axios.get(`https://api.themoviedb.org/3${path}`, {
      params: {
        api_key: tmdbApiKey,
        ...query
      }
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('TMDB API Error:', error);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to connect to TMDB API", 
      error: error.message 
    });
  }
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
console.log("MONGODB_URI:", process.env.MONGODB_URI);
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
