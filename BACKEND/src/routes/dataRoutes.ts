import express from 'express';
import * as controller from '../controllers/dataController';
const router = express.Router();
router.get('/:id', function(req, res, next) {
    controller.updateReport(req, res, next);
});
router.get('/', function(req, res, next) {
    controller.getReports(req, res, next);
});
router.post('/', function(req, res, next) {
    controller.createReport(req, res, next);
});
router.put('/:id', function(req, res, next) {
    controller.updateReport(req, res, next);
});
router.delete('/:id', function(req, res, next) {
    controller.deleteReport(req, res, next);
});
export default router;