import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);
export const createToken = (id: number) =>
  jwt.sign({ id }, SECRET, { expiresIn: "1d" });
