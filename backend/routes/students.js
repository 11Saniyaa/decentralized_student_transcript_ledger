const express = require("express");
const router = express.Router();

// Use file storage if MongoDB not configured, otherwise use MongoDB
const USE_FILE_STORAGE = process.env.USE_FILE_STORAGE === 'true' || !process.env.MONGO_URI || process.env.MONGO_URI.includes('<db_password>');
const Student = USE_FILE_STORAGE ? require("../models/StudentFile") : require("../models/Student");

// Create a new student
router.post("/", async (req, res) => {
  try {
    const { studentName, studentPRN, email, department, year, dob } = req.body;

    // Validate required fields
    if (!studentName || !studentPRN || !email || !department || !year) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: "Please fill in all required fields: Name, PRN, Email, Department, and Year"
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const student = new Student({
      studentName: studentName.trim(),
      studentPRN: studentPRN.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      year: year.trim(),
      dob: dob || "",
    });

    const saved = await student.save();
    res.status(201).json({ 
      message: "Student created successfully", 
      student: saved.toObject ? saved.toObject() : saved 
    });
  } catch (error) {
    console.error("Error creating student:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: "Student with this PRN already exists",
        details: `A student with PRN "${req.body.studentPRN}" is already registered`
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: Object.values(error.errors).map((e) => e.message).join(', ')
      });
    }
    res.status(500).json({ 
      error: error.message || "Internal server error",
      details: "Please check your MongoDB connection and try again"
    });
  }
});

// Get student by PRN
router.get("/:prn", async (req, res) => {
  try {
    const student = await Student.findOne({ studentPRN: req.params.prn });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    // File storage already returns sorted, MongoDB needs .sort()
    const sorted = USE_FILE_STORAGE ? students : students.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
