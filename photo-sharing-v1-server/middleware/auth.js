const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Store blacklisted tokens
const tokenBlacklist = new Set();

const generateToken = (user) => {
    return jwt.sign(
        { 
            _id: user._id,
            login_name: user.login_name,
            first_name: user.first_name
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ error: 'Token has been invalidated' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const invalidateToken = (token) => {
    if (token) {
        tokenBlacklist.add(token);
    }
};

module.exports = {
    generateToken,
    verifyToken,
    invalidateToken
}; 