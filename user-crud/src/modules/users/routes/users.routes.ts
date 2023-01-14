import { Router } from 'express';
import { adaptRoute } from '@main/adapters/express-route-adapter';
import { createUserControllerFactory } from '@main/factories/createUserController.factory';
import { createFirstAdmControllerFactory } from '@main/factories/createFirstAdmController.factory';

const createUserController = createUserControllerFactory();
const createFirstAdmController = createFirstAdmControllerFactory();

const usersRouter = Router();

usersRouter.post('/', adaptRoute(createUserController));
usersRouter.post('/init', adaptRoute(createFirstAdmController));

export { usersRouter };
