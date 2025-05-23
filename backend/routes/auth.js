import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// In production, use an environment variable for the secret
const JWT_SECRET = 'your_jwt_secret';
const SALT_ROUNDS = 10;

// Registration endpoint
router.post('/register', async (req, res) => {
    // Added name to destructuring, email was already there implicitly by usage
    const { username, password, role, name, email, department, designation, manager_id } = req.body;

    if (!username || !password || !role || !email || !name) { // Added email and name to validation
        return res.status(400).json({ error: 'Username, password, role, name, and email are required' });
    }
    try {
        const existingUserByUsername = await User.findOne({ where: { username } });
        if (existingUserByUsername) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
            name, // Save the name
            email, // Save the email
            department, // Save department if provided
            jobTitle: designation, // Assuming designation maps to jobTitle in User model
            // Other fields like phone, address, bio can be added if needed at user creation
        });

        // Remove automatic Employee creation from here.
        // This will be handled by a separate call from the frontend to an /employees endpoint.

        // Return only essential user info, or a success message.
        // The token is typically not sent on registration, but on login.
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser.id, username: newUser.username, name: newUser.name, email: newUser.email, role: newUser.role }
        });

    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: err.message });
    }
});


// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Compare the password with the stored hashed password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Create a JWT token (valid for 1 hour)
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, name: user.name, email: user.email, department: user.department, position: user.jobTitle, phone: user.phone }, // Added more details to token
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Return all fields, defaulting to empty string if null
        res.json({
            id: user.id,
            username: user.username || '',
            name: user.name || '',
            email: user.email || '',
            department: user.department || '',
            phone: user.phone || '',
            role: user.role || '',
            imageUrl: user.imageUrl || '', // This will be Base64 or path
            gender: user.gender || '',
            address: user.address || '',
            jobTitle: user.jobTitle || '',
            bio: user.bio || '',
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update current user profile
router.put('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, email, department, phone, gender, address, jobTitle, bio, profileImageBase64 } = req.body;
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.department = department ?? user.department;
        user.phone = phone ?? user.phone;
        user.gender = gender ?? user.gender;
        user.address = address ?? user.address;
        user.jobTitle = jobTitle ?? user.jobTitle;
        user.bio = bio ?? user.bio;

        if (profileImageBase64 !== undefined) {
            if (profileImageBase64 === null || profileImageBase64 === '') {
                user.imageUrl = null;
            } else {
                user.imageUrl = profileImageBase64;
            }
        }

        await user.save();

        res.json({
            id: user.id,
            username: user.username || '',
            name: user.name || '',
            email: user.email || '',
            department: user.department || '',
            phone: user.phone || '',
            role: user.role || '',
            imageUrl: user.imageUrl || '',
            gender: user.gender || '',
            address: user.address || '',
            jobTitle: user.jobTitle || '',
            bio: user.bio || '',
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        if (err.name === 'SequelizeDatabaseError' && err.parent && err.parent.code === '22001') {
            return res.status(400).json({ error: 'Profile image is too large. Please choose a smaller file.' });
        }
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
