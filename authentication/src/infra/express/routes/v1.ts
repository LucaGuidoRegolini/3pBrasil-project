import { authenticationRoutes } from '@modules/authenticate/routers/authentication.routes';
import { Router } from 'express';

const v1Routes = Router();

v1Routes.use('/sessions', authenticationRoutes);

export { v1Routes };
