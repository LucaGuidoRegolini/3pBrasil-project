import { Router } from 'express';
import { AuthenticateUserController } from '../controllers/authenticateUserController';
import { authenticationServiceFactory } from '@main/authenticationService.factory';

const authenticationRoutes = Router();

const authenticateUserController = new AuthenticateUserController(
  authenticationServiceFactory(),
);

authenticationRoutes.post('/', authenticateUserController.handle);

export { authenticationRoutes };
