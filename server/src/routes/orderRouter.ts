import express from 'express';

import { authenticateUser } from '../middlewares/authMiddleware';
import { createOrder, getAllOrders, getOrderById, resendInvoice, updateOrderStatus, verifyPayment } from '../controllers/orderController';

const router = express.Router();

router.route('/')
    // .all(authenticateUser())
    .post(createOrder)
    .get(authenticateUser(),getAllOrders)
    .patch(authenticateUser(),updateOrderStatus);

router.post('/resend-invoice', authenticateUser(), resendInvoice);

router.post('/verifyPayment', verifyPayment)

router.route('/:id')
    // .all(authenticateUser())
    .get(authenticateUser(), getOrderById)


export default router;