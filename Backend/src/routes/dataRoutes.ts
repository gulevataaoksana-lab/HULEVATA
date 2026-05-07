import { Router } from 'express';
import * as controller from '../controllers/dataController';

const router = Router();

router.get('/', controller.getReports);

router.get('/:id', controller.getReportById);

router.post('/', controller.createReport);

router.put('/:id', controller.updateReport);

router.delete('/:id', controller.deleteReport);

router.post('/import', controller.importReports);

export default router;