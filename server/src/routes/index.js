import express from 'express';
import healthRoute from './health.route.js';

const router = express.Router();
router.use('/api/v1', healthRoute);

export default router;
