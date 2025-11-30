// Simple file-based storage (alternative to MongoDB)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const TRANSCRIPTS_FILE = path.join(DATA_DIR, 'transcripts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
function initFiles() {
  if (!fs.existsSync(STUDENTS_FILE)) {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(TRANSCRIPTS_FILE)) {
    fs.writeFileSync(TRANSCRIPTS_FILE, JSON.stringify([], null, 2));
  }
}

initFiles();

// Read data from file
function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write data to file
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Student operations
const StudentStorage = {
  // Create student
  create: async (studentData) => {
    const students = readData(STUDENTS_FILE);
    
    // Check if PRN already exists
    if (students.find(s => s.studentPRN === studentData.studentPRN)) {
      const error = new Error('Student with this PRN already exists');
      error.code = 11000;
      throw error;
    }
    
    const student = {
      _id: Date.now().toString(),
      ...studentData,
      createdAt: new Date().toISOString(),
    };
    
    students.push(student);
    writeData(STUDENTS_FILE, students);
    return student;
  },
  
  // Find by PRN
  findByPRN: async (prn) => {
    const students = readData(STUDENTS_FILE);
    return students.find(s => s.studentPRN === prn) || null;
  },
  
  // Find all
  findAll: async () => {
    return readData(STUDENTS_FILE).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  },
};

// Transcript operations
const TranscriptStorage = {
  // Create transcript
  create: async (transcriptData) => {
    const transcripts = readData(TRANSCRIPTS_FILE);
    
    const transcript = {
      _id: Date.now().toString(),
      ...transcriptData,
      uploadDate: new Date().toISOString(),
    };
    
    transcripts.push(transcript);
    writeData(TRANSCRIPTS_FILE, transcripts);
    return transcript;
  },
  
  // Find by PRN
  findByPRN: async (prn) => {
    const transcripts = readData(TRANSCRIPTS_FILE);
    return transcripts.filter(t => t.studentPRN === prn)
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  },
  
  // Find all
  findAll: async () => {
    return readData(TRANSCRIPTS_FILE).sort((a, b) => 
      new Date(b.uploadDate) - new Date(a.uploadDate)
    );
  },
  
  // Delete all (for testing)
  deleteAll: async () => {
    writeData(TRANSCRIPTS_FILE, []);
  },
};

module.exports = {
  StudentStorage,
  TranscriptStorage,
};

