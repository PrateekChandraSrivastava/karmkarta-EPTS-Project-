import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './config.js';  // Import Sequelize instance
import './models/index.js'; // Only register models and associations
import authRoutes from './routes/auth.js';  // Import auth routes
import { verifyToken } from './middleware/authMiddleware.js';
import employeeRoutes from './routes/employees.js';
import taskRoutes from './routes/tasks.js';
import goalRoutes from './routes/goals.js';
import performanceMetricsRoutes from './routes/performanceMetrics.js';
import feedbackRoutes from './routes/feedback.js';
import reportRoutes from './routes/reports.js';
import leaveRoutes from './routes/leaves.js';
import complaintRoutes from './routes/complaints.js';
import attendanceRoutes from './routes/attendance.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '50mb' }));
// Increase the limit for URL-encoded payloads (if you use them, though not for this specific image upload)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Backend server is running!');
});


app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/tasks', taskRoutes);
app.use('/goals', goalRoutes);
app.use('/performance-metrics', performanceMetricsRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/reports', reportRoutes);
app.use('/leaves', leaveRoutes);
app.use('/complaints', complaintRoutes);
app.use('/attendance', attendanceRoutes);


// Protected route
app.get('/protected', verifyToken, (req, res) => {
    res.send(`Hello ${req.user.username}, you have access!`);
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send('Database connection successful!');
    } catch (error) {
        res.status(500).send(`Database connection failed: ${error.message}`);
    }
});

// Sync all defined models to the DB (only here)
sequelize
    .sync({ alter: true })  // Use { force: true } to drop and recreate tables (be cautious)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
        process.exit(1);
    });

// Log uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

