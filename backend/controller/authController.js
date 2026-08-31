const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");


// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            password,
            role
        } = req.body;

        console.log(name);


        // Check fields
        if (
            !name ||
            !email ||
            !phone ||
            !password||
            !role
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }


        // Check existing user
        const existingUser =
            await User.findOne({ email });


        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role,
        });


    //    Generate JWT
        const token =
            generateToken(user);


        return res.status(201).json({

            message:
                "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.role,
            },

        });
        console.log("success!")

    } catch (error) {

        console.log("message" , error);

        return res.status(500).json({
            message: "hello",
            error : error
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
    try {

        const {
            email,
            password,
        } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }


        // Find user
        const user =
            await User.findOne({ email });


        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password",
            });
        }


        // Check password
        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {
            return res.status(401).json({
                message:
                    "Invalid email or password",
            });
        }


        // Generate token
        const token =
            generateToken(user);


        res.json({

            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                roles: user.roles,
            },

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


// ==========================================
// GET MY PROFILE
// ==========================================

const getMe = async (req, res) => {
    try {

        const user =
            await User.findById(
                req.user.userId
            ).select("-password");


        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }


        res.json({
            user,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


module.exports = {
    register,
    login,
    getMe,
};