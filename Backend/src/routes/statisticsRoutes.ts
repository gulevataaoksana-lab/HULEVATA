import { Router } from 'express';
import * as controller from '../controllers/statisticsController';

const router = Router();

router.post('/report', controller.getReportStats);

export default router;