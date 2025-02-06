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
    .get(getAllMerch)
    .all(authenticateUser())
    .post(upload.array('files'), createMerch)

router.route('/:id')
    .get(getMerchById)
    .all(authenticateUser())
    .patch(upload.array('files'), updateMerch)
    .delete(deleteMerch)

export default router;