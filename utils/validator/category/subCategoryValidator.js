import Joi from "joi"
import { validateSchema } from "../../../helpers/validation/validationHelpers.js";
export const subCategoryValidation = async (req, res, next)=>{
    const subCategorySchema = Joi.object({
        categoryId: Joi.string().messages({
          'string.base': 'Category ID should be a type of ObjectId',
          'string.pattern.name': 'Category ID must be a valid ObjectId',
          'any.required': 'Category ID is a required field'
        }),
        name: Joi.string().min(5).max(20).required().messages({
          'string.base': 'Name should be a type of String',
          'string.empty': 'Name cannot be empty',
          'string.min': 'Name should have a minimum length of {#limit} characters',
          'string.max': 'Name should have a maximum length of {#limit} characters',
          'any.required': 'Name is a required field'
        }),
        icon: Joi.string().required().messages({
          'string.base': 'Icon should be a type of String',
          'string.empty': 'Icon cannot be empty',
          'any.required': 'Icon is a required field'
        }),
        status: Joi.string().valid('active', 'inactive').default('active').messages({
          'string.base': 'Status should be a type of text',
          'any.only': 'Status must be either active or inactive'
        })        
    });
    const error =  validateSchema(subCategorySchema, req.body);

    if(error){
           return res.status(400).json({
               status: "failure",
               message : error.details[0].message 
           })
           
    }
   
   next();

}