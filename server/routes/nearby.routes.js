import express from 'express';
import { getNearbyPGs } from '../controllers/nearby.controller.js';

const router = express.Router();

router.get('/', getNearbyPGs);

export default router;
