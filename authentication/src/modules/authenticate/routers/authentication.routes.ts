import { Router } from 'express';
import { AuthenticateUserController } from '../controllers/authenticateUserController';
import { authenticationServiceFactory } from '@main/factories/authenticationService.factory';
import { adaptRoute } from '@main/adapters/express-route-adapter';

const authenticationRoutes = Router();

const authenticateUserController = new AuthenticateUserController(
  authenticationServiceFactory(),
);

authenticationRoutes.post('/', adaptRoute(authenticateUserController));

export { authenticationRoutes };
