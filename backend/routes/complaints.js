import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Complaint from '../models/Complaint.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /complaints - Create a new complaint
router.post('/', verifyToken, upload.single('attachment'), async (req, res) => {
  try {
    const { subject, description, priority, category } = req.body;
    const attachment = req.file ? req.file.filename : null;
    const complaint = await Complaint.create({
      subject,
      description,
      priority,
      category,
      attachment,
      userId: req.user.id,
      date: new Date(),
    });
    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /complaints - Get complaints for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Get all complaints
router.get('/all', verifyToken, async (req, res) => {
  try {
    // Optionally, check if req.user.role === 'admin' here
    const complaints = await Complaint.findAll({ order: [['date', 'DESC']] });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Update complaint status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    complaint.status = status;
    await complaint.save();
    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Add/update response
router.patch('/:id/response', verifyToken, async (req, res) => {
  try {
    const { response } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    complaint.response = response;
    complaint.status = 'In Progress';
    await complaint.save();
    res.json({ message: 'Response updated', complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
