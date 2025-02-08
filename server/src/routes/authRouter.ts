import express from "express";

import { getMe, login, logout } from "../controllers/authController";

const router = express.Router();

router.route("/login").post(login);

router.route("/me").get(getMe);

router.route("/logout").post(logout);

export default router;
