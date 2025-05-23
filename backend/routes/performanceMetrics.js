import express from 'express';
import PerformanceMetric from '../models/PerformanceMetric.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /performance-metrics - Retrieve all metrics (optionally filter by employee_id)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { employee_id } = req.query;
        let metrics;
        if (employee_id) {
            metrics = await PerformanceMetric.findAll({ where: { employee_id } });
        } else {
            metrics = await PerformanceMetric.findAll();
        }
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /performance-metrics - Submit a new KPI score
router.post('/', verifyToken, async (req, res) => {
    try {
        const metric = await PerformanceMetric.create(req.body);
        res.status(201).json(metric);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /performance-metrics/report - fetch performance metrics for reporting/graph
router.get('/report', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, employeeId } = req.query;
        const where = {};
        if (startDate && endDate) {
            where.date = { [Op.between]: [startDate, endDate] };
        }
        if (employeeId && employeeId !== 'all') {
            where.employee_id = employeeId;
        }
        const records = await PerformanceMetric.findAll({
            where,
            order: [['date', 'ASC']]
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
