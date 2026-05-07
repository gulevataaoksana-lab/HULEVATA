import { Router } from 'express';
import * as controller from '../controllers/statusController';

const router = Router();

router.get('/', controller.getStatuses);
router.get('/:id', controller.getStatusById);
router.post('/', controller.createStatus);
router.put('/:id', controller.updateStatus);
router.delete('/:id', controller.deleteStatus);

export default router;