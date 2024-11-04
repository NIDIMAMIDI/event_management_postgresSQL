import { Router } from "express";
import { createCategory, createSubCategory, getCatergories, getSubCategoriesOfACategory } from "../../controllers/category/categoryControllers.js";
import { categoryValidator } from "../../utils/validator/category/categoriesValidator.js";
import {auth} from "../../middleware/authorization/authorizationMiddleware.js"
const categoryRouter = Router()


categoryRouter.get("/", auth,getCatergories)
categoryRouter.post("/", categoryValidator,createCategory)
categoryRouter.get("/:categoryId", auth,getSubCategoriesOfACategory)
categoryRouter.post("/:categoryId", categoryValidator,createSubCategory)
export default categoryRouter