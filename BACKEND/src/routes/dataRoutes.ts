import express from 'express';
import * as controller from '../controllers/dataController';

const router = express.Router();

router.get('/reports', function(req, res, next) {
    controller.getReports(req, res, next);
});

router.get('/reports/export', function(req, res, next) {
    controller.exportReports(req, res, next);
});

router.post('/reports/import', function(req, res, next) {
    controller.importReports(req, res, next);
});

router.get('/reports/:id', function(req, res, next) {
    controller.getReportById(req, res, next);
});

router.post('/reports', function(req, res, next) {
    controller.createReport(req, res, next);
});

router.put('/reports/:id', function(req, res, next) {
    controller.updateReport(req, res, next);
});

router.delete('/reports/:id', function(req, res, next) {
    controller.deleteReport(req, res, next);
});

router.get('/users', function(req, res, next) {
    controller.getUsers(req, res, next);
});

router.get('/stats', function(req, res, next) {
    controller.getStats(req, res, next);
});

router.get('/search-unsafe', function(req, res, next) {
    controller.searchUnsafe(req, res, next);
});

export default router;
