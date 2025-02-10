import express from 'express';


import { authenticateUser } from '../middlewares/authMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.route('/')
    // .all(authenticateUser())
    .get(authenticateUser(), getDashboardStats)

export default router;