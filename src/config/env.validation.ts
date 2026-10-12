import Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().min(16).required(),
  PUBLIC_BASE_URL: Joi.string().uri().required(),
  UPLOAD_DIR: Joi.string().default('uploads'),
});