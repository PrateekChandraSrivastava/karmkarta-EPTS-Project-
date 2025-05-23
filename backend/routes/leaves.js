import express from 'express';
import { LeaveRequest } from '../models/index.js';
import { Op } from 'sequelize';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fetch all leave requests
router.get('/', async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.findAll();
        res.status(200).json(leaveRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
});

// Add a new leave request
router.post('/', async (req, res) => {
    const {
        employeeId,
        employeeName,
        department,
        position,
        contactNumber,
        email,
        leaveType,
        startDate,
        endDate,
        reason
    } = req.body;

    // Validate required fields
    if (!employeeId || !employeeName || !department || !position || !leaveType || !startDate || !endDate) {
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    try {
        const newLeaveRequest = await LeaveRequest.create({
            employeeId,
            employeeName,
            department,
            position,
            contactNumber,
            email,
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'pending',
        });
        res.status(201).json(newLeaveRequest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create leave request', details: error.message });
    }
});

// Approve or reject a leave request
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const leaveRequest = await LeaveRequest.findByPk(id);
        if (!leaveRequest) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        leaveRequest.status = status;
        await leaveRequest.save();

        res.status(200).json({ message: `Leave request ${status} successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update leave request status' });
    }
});

// GET /leaves/report - fetch leave records for reporting/chart
router.get('/report', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, employeeId } = req.query;
        const where = {};
        if (startDate && endDate) {
            where.startDate = { [Op.gte]: startDate };
            where.endDate = { [Op.lte]: endDate };
        }
        if (employeeId && employeeId !== 'all') {
            where.employeeId = employeeId;
        }
        const records = await LeaveRequest.findAll({
            where,
            order: [['startDate', 'ASC']]
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;