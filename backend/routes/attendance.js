import { Op } from 'sequelize';
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// GET /attendance/today - Get today's attendance records for the logged-in user
router.get('/today', verifyToken, async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const records = await Attendance.findAll({
            where: { userId: req.user.id, date: today },
            order: [['time', 'ASC']]
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /attendance/status - Get current status for the logged-in user
router.get('/status', verifyToken, async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const lastRecord = await Attendance.findOne({
            where: { userId: req.user.id, date: today },
            order: [['time', 'DESC']]
        });
        res.json({ status: lastRecord ? lastRecord.action : 'checked-out', lastAction: lastRecord ? lastRecord.time : null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /attendance - Add a new check-in/out record
router.post('/', verifyToken, async (req, res) => {
    try {
        const { action } = req.body;
        const now = new Date();
        // Fetch the current user's username
        const userName = req.user.username || '';
        const record = await Attendance.create({
            userId: req.user.id,
            userName,
            action,
            time: now.toTimeString().slice(0, 8),
            date: now.toISOString().slice(0, 10)
        });
        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /attendance/report - Admin/manager: fetch attendance records for monitoring
router.get('/report', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, employeeId } = req.query;
        const where = {};
        if (startDate && endDate) {
            where.date = { [Op.between]: [startDate, endDate] };
        }
        if (employeeId && employeeId !== 'all') {
            where.userId = employeeId;
        }
        const records = await Attendance.findAll({
            where,
            order: [['date', 'DESC'], ['time', 'ASC']]
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
