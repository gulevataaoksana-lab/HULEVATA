import { Router } from 'express';
import * as controller from '../controllers/dataController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', controller.getReports);
router.get('/:id', controller.getReportById);

router.post('/', authMiddleware, controller.createReport);
router.put('/:id', authMiddleware, controller.updateReport);
router.delete('/:id', authMiddleware, controller.deleteReport);
router.post('/import', authMiddleware, controller.importReports);

export default router;