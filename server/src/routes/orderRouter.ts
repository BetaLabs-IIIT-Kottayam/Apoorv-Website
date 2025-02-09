import express from 'express';

import { authenticateUser } from '../middlewares/authMiddleware';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, verifyPayment } from '../controllers/orderController';

const router = express.Router();

router.route('/')
    // .all(authenticateUser())
    .post(createOrder)
    .get(getAllOrders);

router.route('/:id')
    .all(authenticateUser())
    .get(getOrderById)
    .patch(updateOrderStatus);

router.post('/verifyPayment', authenticateUser(), verifyPayment)

export default router;