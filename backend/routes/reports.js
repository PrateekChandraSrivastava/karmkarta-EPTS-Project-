import express from 'express';
import { Op } from 'sequelize';
import PerformanceMetric from '../models/PerformanceMetric.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Example: Get average KPI score per month
router.get('/kpi-averages', verifyToken, async (req, res) => {
    try {
        // You could write a raw SQL query or use Sequelize aggregations
        // Here we'll do a simple group by month using Sequelize (for demonstration)
        const reports = await PerformanceMetric.findAll({
            attributes: [
                [PerformanceMetric.sequelize.fn('date_trunc', 'month', PerformanceMetric.sequelize.col('date')), 'month'],
                [PerformanceMetric.sequelize.fn('AVG', PerformanceMetric.sequelize.col('value')), 'avgScore'],
            ],
            group: ['month'],
            order: [[PerformanceMetric.sequelize.literal('month'), 'ASC']],
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
