import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express" {
    interface Request {
        userId?: string; // Made optional to prevent TypeScript errors when uninitialized
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.cookies?.auth_token; // Optional chaining to prevent errors

        if (!token) {
            res.status(401).json({
                message: "Unauthorized: No token provided",
            });
            return; // Ensure the function stops execution
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string,
        ) as JwtPayload;

        if (!decoded || typeof decoded.userId !== "string") {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return; // Ensure function stops execution
        }

        req.userId = decoded.userId; // Assigning userId after validation
        next(); // Move to the next middleware
    } catch {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default verifyToken;
