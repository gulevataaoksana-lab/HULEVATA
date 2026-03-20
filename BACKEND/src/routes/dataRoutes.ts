import express from 'express';
import * as controller from '../controllers/dataController';
const router = express.Router();
router.get('/', controller.getReports);
router.post('/', controller.createReport);
router.put('/:id', controller.updateReport);
router.delete('/:id', controller.deleteReport);
export default router;