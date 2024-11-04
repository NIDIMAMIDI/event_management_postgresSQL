import { Router } from "express";
import userRouter from "./user/userRotes.js";
import authRouter from "./auth/authRoutes.js";
import categoryRouter from "./category/categoryRoutes.js";
const router = Router()

router.use("/users", userRouter)
router.use('/auth', authRouter)
router.use('/category', categoryRouter)
export default router