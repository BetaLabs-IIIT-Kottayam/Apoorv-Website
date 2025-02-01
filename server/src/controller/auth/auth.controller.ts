import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { comparePassword, createToken, hashPassword } from "../../auth";
import { db } from "../../config/db";
import { users } from "../../models/schema";

// Register User Function
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error, please try again later" });
    next(error);
  }
};

// Login User Function
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length || !(await comparePassword(password, user[0].password))) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token: createToken(user[0].id) });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, please try again later" });
    next(error);
  }
};
