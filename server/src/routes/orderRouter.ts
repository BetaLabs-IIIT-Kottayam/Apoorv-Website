import express from 'express';

import { authenticateUser } from '../middlewares/authMiddleware';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, verifyOrder } from '../controllers/orderController';

const router = express.Router();

router.route('/')
    .all(authenticateUser())
    .post(createOrder)
    .get(getAllOrders);

router.route('/:id')
    .all(authenticateUser())
    .get(getOrderById)
    .patch(updateOrderStatus);

router.post('/verify', authenticateUser(), verifyOrder);

export default router;