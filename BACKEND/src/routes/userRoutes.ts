import { Router } from 'express';
import * as controller from '../controllers/userController';

const router = Router();

router.get('/', function(req, res, next) {
    controller.getUsers(req, res, next);
});

router.get('/:id', function(req, res, next) {
    controller.getUserById(req, res, next);
});

router.post('/', function(req, res, next) {
    controller.createUser(req, res, next);
});

router.put('/:id', function(req, res, next) {
    controller.updateUser(req, res, next);
});

router.delete('/:id', function(req, res, next) {
    controller.deleteUser(req, res, next);
});

export default router;