import express from 'express';
import {heathCheck} from '../controllers/health.controller.js';

const router = express.Router();

router.get('/health', heathCheck);

export default router;
