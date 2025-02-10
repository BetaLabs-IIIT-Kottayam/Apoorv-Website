import express from 'express';


import { authenticateUser } from '../middlewares/authMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.route('/')
    // .all(authenticateUser())
    .get(getDashboardStats)

export default router;