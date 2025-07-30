// routes/crashGameRoutes/gameRoutes.js
import express from 'express';
import { saveCrashGameResult } from '../../controllers/crashGameController/gameController.js';

const router = express.Router();

router.post('/save', saveCrashGameResult);

export default router;
