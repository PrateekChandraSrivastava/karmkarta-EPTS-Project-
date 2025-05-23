import express from 'express';
import Feedback from '../models/Feedback.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /feedback - Add or update feedback (one feedback per from_user/to_employee pair)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { from_user, to_employee, comment, rating, date } = req.body;
        // Check if feedback already exists for this pair
        let feedback = await Feedback.findOne({ where: { from_user, to_employee } });
        if (feedback) {
            // Update existing feedback
            feedback.comment = comment;
            feedback.rating = rating;
            feedback.date = date;
            await feedback.save();
            return res.json({ message: 'Feedback updated', feedback });
        } else {
            // Create new feedback
            feedback = await Feedback.create({ from_user, to_employee, comment, rating, date });
            return res.status(201).json({ message: 'Feedback created', feedback });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /feedback - Retrieve feedback entries (optionally filtered by employee)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { to_employee } = req.query;
        let feedbacks;
        if (to_employee) {
            feedbacks = await Feedback.findAll({ where: { to_employee } });
        } else {
            feedbacks = await Feedback.findAll();
        }
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
