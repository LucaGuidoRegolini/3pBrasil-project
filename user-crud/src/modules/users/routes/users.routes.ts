import { Router } from 'express';
import { adaptRoute } from '@main/adapters/express-route-adapter';
import { createUserControllerFactory } from '@main/factories/createUserController.factory';
import { createFirstAdmControllerFactory } from '@main/factories/createFirstAdmController.factory';
import { listUserControllerFactory } from '@main/factories/listUserController.factory';

const createUserController = createUserControllerFactory();
const createFirstAdmController = createFirstAdmControllerFactory();
const listUserController = listUserControllerFactory();

const usersRouter = Router();

usersRouter.post('/', adaptRoute(createUserController));
usersRouter.post('/init', adaptRoute(createFirstAdmController));

usersRouter.get('/', adaptRoute(listUserController));
usersRouter.get('/:id', adaptRoute(listUserController));

export { usersRouter };
