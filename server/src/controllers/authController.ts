import JWT from "jsonwebtoken";
import { Request, Response } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors/index";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError("Please provide username and password");
    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials");
    }

    const token = JWT.sign({ 
        userId: user._id,
        username: user.username,
        role: user.role
      }, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    });

    res.status(StatusCodes.OK).json({
        user,
        token
    });
};

// const createAdmin = async () => {
//     const adminExists = await User.findOne({ role: "admin" });

//     if (!adminExists) {
//         const admin = new User({
//             username: process.env.ADMIN_USERNAME,
//             password: process.env.ADMIN_PASSWORD,
//             role: "admin"
//         });

//         await admin.save();
//         console.log("Admin user created");
//     } else {
//         console.log("Admin user already exists");
//     }
// };

export {
    login,
    // createAdmin
};
