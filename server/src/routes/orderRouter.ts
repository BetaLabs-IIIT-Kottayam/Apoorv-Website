import express from 'express';

import { authenticateUser } from '../middlewares/authMiddleware';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, verifyPayment } from '../controllers/orderController';

const router = express.Router();

router.route('/')
    .post(createOrder)
    .all(authenticateUser())
    .get(getAllOrders);

router.route('/:id')
    .all(authenticateUser())
    .get(getOrderById)
    .patch(updateOrderStatus);

router.post('/verifyPayment', verifyPayment)

export default router;