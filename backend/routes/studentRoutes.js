const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

router.post("/", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        res.json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
