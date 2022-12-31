import { Router } from 'express';
import { CreateUserController } from '../controllers/createUserController';
import { createUserValidation } from './validations/userValidation';

const createUserController = new CreateUserController();

const usersRouter = Router();

usersRouter.post('/', createUserValidation, createUserController.handle);

export { usersRouter };
