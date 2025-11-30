const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  studentPRN: {
    type: String,
    required: true,
    index: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  docName: {
    type: String,
    required: true,
  },
  ipfsCid: {
    type: String,
    required: true,
  },
  ipfsUrl: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  uploaderInstitution: {
    type: String,
    default: "Institution",
  },
  metadata: {
    gpa: String,
    degree: String,
    semester: String,
  },
  txHash: {
    type: String,
    default: "",
  },
  blockNumber: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Transcript", transcriptSchema);
