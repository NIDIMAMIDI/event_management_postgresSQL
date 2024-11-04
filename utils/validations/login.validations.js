/* eslint-disable max-len */
import Joi from 'joi';
import { validateSchema } from '../../helpers/validation/validation.helpers.js';

export const loginValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required'
      }),
      password: Joi.string()
        .min(8)
        .max(20)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).*$/)
        .required()
        .messages({
          'string.min': 'Password must be at least {#limit} characters long', // {#limit} gives min length
          'string.max': 'Password must not exceed {#limit} characters', // {#limit} gives max length
          'string.pattern.base':
            'Password must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
          'string.empty': 'Password is required'
        })
    });

    // Validate the request body
    const { error } = await validateSchema(schema, req.body);

    if (error) {
      return res.status(400).json({
        status: 'failure',
        errors: error.details[0].message
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
