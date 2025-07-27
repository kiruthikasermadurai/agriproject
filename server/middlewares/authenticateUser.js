import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // To load environment variables from .env file

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Attach the decoded token to req.user

        // Optional role check
        const allowedRoles = ['farmer']; // Update based on your app's roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. You don't have permission." });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired" });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Authentication failed", error });
    }
};

export default authenticateUser;
