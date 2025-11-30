// File-based Transcript model (alternative to MongoDB)
const { TranscriptStorage } = require('../storage/fileStorage');

class Transcript {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../data/transcripts.json');
    
    if (this._id) {
      // Update existing
      const transcripts = await TranscriptStorage.findAll();
      const index = transcripts.findIndex(t => t._id === this._id);
      if (index !== -1) {
        transcripts[index] = {
          ...transcripts[index],
          studentPRN: this.studentPRN !== undefined ? this.studentPRN : transcripts[index].studentPRN,
          studentName: this.studentName !== undefined ? this.studentName : transcripts[index].studentName,
          docName: this.docName !== undefined ? this.docName : transcripts[index].docName,
          ipfsCid: this.ipfsCid !== undefined ? this.ipfsCid : transcripts[index].ipfsCid,
          ipfsUrl: this.ipfsUrl !== undefined ? this.ipfsUrl : transcripts[index].ipfsUrl,
          uploaderInstitution: this.uploaderInstitution !== undefined ? this.uploaderInstitution : transcripts[index].uploaderInstitution,
          metadata: this.metadata !== undefined ? this.metadata : transcripts[index].metadata,
          txHash: this.txHash !== undefined ? this.txHash : transcripts[index].txHash,
          blockNumber: this.blockNumber !== undefined ? this.blockNumber : transcripts[index].blockNumber,
        };
        fs.writeFileSync(filePath, JSON.stringify(transcripts, null, 2));
        Object.assign(this, transcripts[index]);
        return this;
      }
    }
    
    // Create new
    return await TranscriptStorage.create({
      studentPRN: this.studentPRN,
      studentName: this.studentName,
      docName: this.docName,
      ipfsCid: this.ipfsCid,
      ipfsUrl: this.ipfsUrl,
      uploaderInstitution: this.uploaderInstitution || 'Institution',
      metadata: this.metadata || {},
      txHash: this.txHash || '',
      blockNumber: this.blockNumber || 0,
    });
  }
  
  static async findById(id) {
    const transcripts = await TranscriptStorage.findAll();
    const found = transcripts.find(t => t._id === id);
    return found ? new Transcript(found) : null;
  }

  static async find(query = {}) {
    let transcripts;
    if (query.studentPRN) {
      transcripts = await TranscriptStorage.findByPRN(query.studentPRN);
    } else {
      transcripts = await TranscriptStorage.findAll();
    }
    return transcripts.map(t => new Transcript(t));
  }
  
  toObject() {
    return { ...this };
  }

  static deleteMany(query = {}) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../data/transcripts.json');
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return Promise.resolve();
  }
}

module.exports = Transcript;

