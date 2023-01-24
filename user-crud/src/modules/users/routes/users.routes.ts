import { Router } from 'express';
import { adaptRoute } from '@main/adapters/express-route-adapter';
import { createUserControllerFactory } from '@main/factories/createUserController.factory';
import { createFirstAdmControllerFactory } from '@main/factories/createFirstAdmController.factory';
import { listUserControllerFactory } from '@main/factories/listUserController.factory';
import { getUserControllerFactory } from '@main/factories/getUserController.factory';
import { adapterMiddleware } from '@main/adapters/express-middleware-adapter';
import { authenticationMiddleware } from '@shared/middleware/AuthenticationMiddleware';
import { authorizationMiddleware } from '@shared/middleware/AuthorizedMiddleware';

const createUserController = createUserControllerFactory();
const createFirstAdmController = createFirstAdmControllerFactory();
const listUserController = listUserControllerFactory();
const getUserController = getUserControllerFactory();

const usersRouter = Router();

usersRouter.post('/init', adaptRoute(createFirstAdmController));

usersRouter.use(adapterMiddleware(authenticationMiddleware));

usersRouter.get('/', adaptRoute(listUserController));
usersRouter.post('/', adaptRoute(createUserController));

usersRouter.get(
  '/:id',
  adapterMiddleware(authorizationMiddleware, 'id'),
  adaptRoute(getUserController),
);
usersRouter.patch(
  '/:id',
  adapterMiddleware(authorizationMiddleware, 'id'),
  adaptRoute(createUserController),
);

export { usersRouter };
