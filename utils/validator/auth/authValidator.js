import Joi from 'joi';
import { validateSchema } from '../../../helpers/validation/validationHelpers.js';
const strongPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;

export const authValidator = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    password: Joi.string().regex(strongPasswordRegex).required().messages({
      'string.base': 'Password should be String',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password should have at least 8 characters',
      'string.pattern.base':
        'Password must at least one upper case alphabet, one lower case alphabet, one digit, one special character, and between 8 and 15 characters long',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('user', 'admin').default('user').messages({
      'string.base': 'Role should be a string',
      'any.only': "Role can only be 'user' or 'admin'"
    })
  });
  const error = validateSchema(schema, req.body);

  if (error) {
    return res.status(400).json({
      status: 'failure',
      message: error.details[0].message
    });
  }

  next();
};
