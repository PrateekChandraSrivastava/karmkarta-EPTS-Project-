import express from 'express';
import Task from '../models/Task.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /tasks - Retrieve all tasks
router.get('/', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// GET /tasks/:id - Retrieve a specific task by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /tasks - Create a new task
router.post('/', verifyToken, async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
    }
});

// PUT /tasks/:id - Update an existing task
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const [updated] = await Task.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedTask = await Task.findByPk(req.params.id);
            res.json(updatedTask);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Task.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete task' });
    }
});

// GET /tasks/report - fetch task records for reporting/chart
router.get('/report', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, employeeId } = req.query;
        const where = {};
        if (startDate && endDate) {
            // Ensure correct date format and inclusivity
            where.dueDate = { [Op.gte]: startDate, [Op.lte]: endDate };
        }
        if (employeeId && employeeId !== 'all') {
            where.employeeId = String(employeeId);
        }
        // Debug: log the where clause
        console.log('Task report where:', where);
        const records = await Task.findAll({
            where,
            order: [['dueDate', 'ASC']]
        });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
