import { Router } from 'express';
import * as controller from '../controllers/statusController';
const router = Router();
router.get('/', function(req, res, next) {
    controller.getStatuses(req, res, next);
});
router.get('/:id', function(req, res, next) {
    controller.getStatusById(req, res, next);
});
router.post('/', function(req, res, next) {
    controller.createStatus(req, res, next);
});
router.put('/:id', function(req, res, next) {
    controller.updateStatus(req, res, next);
});
router.delete('/:id', function(req, res, next) {
    controller.deleteStatus(req, res, next);
});
export default router;
