import { celebrate, Joi, Segments } from 'celebrate';

export const createUserValidation = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    cpf: Joi.string().required(),
    phone: Joi.string().required(),
    type: Joi.string().required(),
  },
});
