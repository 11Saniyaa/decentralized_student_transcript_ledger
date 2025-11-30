// File-based Student model (alternative to MongoDB)
const { StudentStorage } = require('../storage/fileStorage');

class Student {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    if (this._id) {
      // Update existing (simple implementation - just recreate)
      const students = require('../storage/fileStorage').StudentStorage.findAll();
      const all = await students;
      const index = all.findIndex(s => s._id === this._id);
      if (index !== -1) {
        all[index] = this;
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../data/students.json');
        fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
      }
      return this;
    } else {
      // Create new
      return await StudentStorage.create({
        studentName: this.studentName,
        studentPRN: this.studentPRN,
        email: this.email,
        department: this.department,
        year: this.year,
        dob: this.dob || '',
      });
    }
  }

  static async findOne(query) {
    if (query.studentPRN) {
      const student = await StudentStorage.findByPRN(query.studentPRN);
      return student ? new Student(student) : null;
    }
    return null;
  }

  static async find(query = {}) {
    const students = await StudentStorage.findAll();
    return students.map(s => new Student(s));
  }
  
  toObject() {
    return { ...this };
  }

  static deleteMany(query = {}) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../data/students.json');
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return Promise.resolve();
  }
}

module.exports = Student;

