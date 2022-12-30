import { NotFoundError } from '@shared/errors';
import { Router } from 'express';
import { v1Routes } from './v1';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('User CRUD - 1.0.0');
});

routes.get('/health-checks', (req, res) => {
  return res.status(200).json({
    success: {
      responseType: 'SUCCESS_REQUEST',
      message: 'The application is healthy.',
    },
  });
});

routes.use('/v1', v1Routes);

routes.all('*', (req, res) => {
  throw new NotFoundError(`Cannot ${req.method} - ${req.path} on this server`);
});

export { routes };
