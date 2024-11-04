import { Router } from 'express';
import { login, logout, register } from '../../controllers/auth/auth.controllers.js';
import { signupValidation } from '../../utils/validations/signup.validation.js';
import { loginValidation } from '../../utils/validations/login.validations.js';
import { authorization } from '../../middlewares/authorization/authorization.middlewares.js';
const authRouter = Router();

authRouter.post('/signup', signupValidation, register);

authRouter.post('/login', loginValidation, login);

authRouter.get('/logout', authorization, logout);

export default authRouter;
