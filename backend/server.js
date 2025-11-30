const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Check if using MongoDB or file storage
const USE_FILE_STORAGE = process.env.USE_FILE_STORAGE === 'true' || !process.env.MONGO_URI || process.env.MONGO_URI.includes('<db_password>');

let mongoose;
if (!USE_FILE_STORAGE) {
  mongoose = require("mongoose");
}

const studentRoutes = require("./routes/students");
const transcriptRoutes = require("./routes/transcripts");

const app = express();
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid conflicts

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (for mock IPFS)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api", require("./routes/contract"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Connect to database (MongoDB or file storage)
if (USE_FILE_STORAGE) {
  console.log("📁 Using file-based storage (no MongoDB needed!)");
  console.log("   Data stored in: backend/data/");
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`✅ Ready to accept requests!`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use!`);
      console.error(`   Run: netstat -ano | findstr :${PORT}`);
      console.error(`   Then: taskkill /PID <PID> /F`);
      process.exit(1);
    } else {
      throw err;
    }
  });
} else {
  // Use MongoDB
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/transcript-ledger")
    .then(() => {
      console.log("✅ Connected to MongoDB");
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`\n❌ Port ${PORT} is already in use!`);
          console.error(`   Run: netstat -ano | findstr :${PORT}`);
          console.error(`   Then: taskkill /PID <PID> /F`);
          process.exit(1);
        } else {
          throw err;
        }
      });
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error.message);
      console.error("\n💡 Tip: Set USE_FILE_STORAGE=true in .env to use file storage instead!");
      console.error("\n⚠️  Starting server anyway, but database operations will fail.");
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (⚠️ MongoDB NOT connected)`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`\n❌ Port ${PORT} is already in use!`);
          console.error(`   Run: netstat -ano | findstr :${PORT}`);
          console.error(`   Then: taskkill /PID <PID> /F`);
          process.exit(1);
        } else {
          throw err;
        }
      });
    });
}

module.exports = app;
