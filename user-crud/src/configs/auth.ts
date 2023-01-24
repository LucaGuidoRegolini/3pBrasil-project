import { jwt_secret_env } from './environment_variable';

export const authConfig = {
  jwt_secret: jwt_secret_env || 'secret',
  saltOrRounds: 10,
  method: 'Bearer',
};

export interface tokenPropsInterface {
  id: string;
  email: string;
  type: string;
}
