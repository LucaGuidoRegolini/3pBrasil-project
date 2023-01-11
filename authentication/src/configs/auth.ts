import { jwt_secret as jwt_secret_env } from '@configs/environment_variable';

export const authConfig = {
  jwt_secret: jwt_secret_env || 'secret',
  jwt_expiresIn: '1d',
};
