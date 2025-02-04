import express from 'express';

import {
    createMerch,
    getAllMerch,
    getMerchById,
    updateMerch,
    deleteMerch
} from '../controllers/merchController';
import upload from '../middlewares/uploadMiddleware';
import { authenticateUser } from '../middlewares/authMiddleware';


const router = express.Router();

// Merch routes
router.route('/')
    .all(authenticateUser())
    .post(upload.array('files'), createMerch)
    .get(getAllMerch);

router.route('/:id')
    .all(authenticateUser())
    .get(getMerchById)
    .patch(upload.array('files'), updateMerch)
    .delete(deleteMerch);

export default router;