import { celebrate, Joi, Segments } from 'celebrate';

export const createUserSessionValidation = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
});
