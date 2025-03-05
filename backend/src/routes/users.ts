import express, { Request, Response } from "express";
import User from "@/models/user.js";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Middleware to validate the request
const validateRegister = [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "email is required").isEmail(),
    check(
        "password",
        "password with minimum 8 characters is required",
    ).isLength({ min: 8 }),
];

// /api/users/register
router.post(
    "/register",
    validateRegister,
    async (req: Request, res: Response): Promise<void> => {
        // Validate the request and return errors if any
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array() });
            return; // End function execution after sending response
        }

        try {
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            user = new User(req.body);
            await user.save();

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY as string,
                {
                    expiresIn: "1d",
                },
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
            });

            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Something went wrong" });
        }
    },
);

export default router;
