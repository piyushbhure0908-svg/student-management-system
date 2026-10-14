const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    course: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 6 },
    phone: { type: String, default: "", trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
