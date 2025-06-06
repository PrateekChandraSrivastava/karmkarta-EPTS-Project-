import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Use environment variable in production

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Expecting format "Bearer <token>"
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ error: 'Invalid token' });
            req.user = decoded; // Add user data to the request object
            next();
        });
    } else {
        res.status(401).json({ error: 'No token provided' });
    }
};
