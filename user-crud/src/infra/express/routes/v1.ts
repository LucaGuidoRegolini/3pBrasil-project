import { usersRouter } from '@modules/users/routes/usersRouter';
import { Router } from 'express';

const v1Routes = Router();

v1Routes.use('/users', usersRouter);

export { v1Routes };
