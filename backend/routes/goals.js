import express from 'express';
import Goal from '../models/Goal.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /goals - Retrieve all goals
router.get('/', verifyToken, async (req, res) => {
    try {
        const goals = await Goal.findAll();
        res.json(goals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /goals/:id - Retrieve a specific goal
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const goal = await Goal.findByPk(req.params.id);
        if (!goal) return res.status(404).json({ error: 'Goal not found' });

        res.json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /goals - Create a new goal
router.post('/', verifyToken, async (req, res) => {
    try {
        const newGoal = await Goal.create(req.body);
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /goals/:id - Update an existing goal
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const goal = await Goal.findByPk(req.params.id);
        if (!goal) return res.status(404).json({ error: 'Goal not found' });

        await goal.update(req.body);
        res.json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /goals/:id - Delete a goal
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const goal = await Goal.findByPk(req.params.id);
        if (!goal) return res.status(404).json({ error: 'Goal not found' });

        await goal.destroy();
        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
