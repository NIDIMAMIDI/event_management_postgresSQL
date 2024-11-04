import { Router } from "express";
import { createProfile, editProfille, getProfile, getUsers, deleteProfile} from "../../controllers/user/userControllers.js";
import { auth } from "../../middleware/authorization/authorizationMiddleware.js";
import { profileValidation } from "../../utils/validator/profile/profileValidator.js";
import { restrictTo } from "../../middleware/restriction/resrictToMiddileware.js";


const userRouter = Router()
userRouter.use(auth)

//profile routes
userRouter.post("/create-profile", profileValidation, createProfile)
userRouter.post("/edit-profile",profileValidation, editProfille) 
userRouter.get("/get-profile", getProfile)
userRouter.delete('/delete-profile/:profileId', restrictTo('admin'), deleteProfile)


userRouter.get("/", auth,getUsers)

export default userRouter