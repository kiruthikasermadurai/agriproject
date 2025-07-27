import { User } from "../models/User.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

export const signup = async (req , res) => {
    try {
        console.log("Received Data:", req.body);
        const { name, email, password, role, phoneNo, location } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phoneNo,
            location,
            isVerified: false, // Default verification status
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body; // ✅ Fixed variable name
        console.log("Received login data:", req.body);

        const user = await User.findOne({ email });
        console.log("User found:", user);
        console.log("Role in DB:", user.role);
        console.log("Role received:", role);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Convert both role values to lowercase to avoid case mismatch
        if (user.role.toLowerCase() !== role.toLowerCase()) {
            return res.status(400).json({ message: `Invalid role selected. Expected ${user.role}.` });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


