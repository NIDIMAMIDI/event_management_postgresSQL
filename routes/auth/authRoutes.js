import { Router } from "express";
import { authValidator } from "../../utils/validator/auth/authValidator.js";
import { signup, login, forgotPassWord} from "../../controllers/auth/authControllers.js";
import { getLoginHistoryById } from "../../controllers/loginHistory/loginHistoryControllers.js";
import { restrictTo } from "../../middleware/restriction/resrictToMiddileware.js";
import { auth } from "../../middleware/authorization/authorizationMiddleware.js";
const authRouter = Router()



//authentication Routes
authRouter.post("/signup", authValidator, signup)
authRouter.post("/login", authValidator, login)

// Route to get login history by user ID
authRouter.get('/login-history',auth, restrictTo('admin'), getLoginHistoryById);
authRouter.post('/forgot-password', forgotPassWord)
export default authRouter