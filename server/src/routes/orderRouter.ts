import express from 'express';

import { authenticateUser } from '../middlewares/authMiddleware';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, verifyPayment } from '../controllers/orderController';

const router = express.Router();

router.route('/')
    // .all(authenticateUser())
    .post(createOrder)
    .get(getAllOrders);

router.post('/verifyPayment', verifyPayment)

router.route('/:id')
    // .all(authenticateUser())
    .get(authenticateUser(), getOrderById)
    .patch(authenticateUser(),updateOrderStatus);


export default router;