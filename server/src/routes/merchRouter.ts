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
    .post(
        authenticateUser(), 
        upload.array('files'), createMerch)

router.route('/:id')
    .get(getMerchById)
    .patch(
        authenticateUser(), 
        upload.array('files'), updateMerch)
    .delete(
        authenticateUser(), 
        deleteMerch)

export default router;