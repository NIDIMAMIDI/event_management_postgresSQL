import { Category } from "../../model/category/categoryModel.js"
import { SubCategory } from "../../model/category/subCategoryModel.js";
export const createCategory = async(req, res, next)=>{
    try{
        const existingCategory = await Category.findOne({name:req.body.name.toLowerCase()})

        if(existingCategory){
            return res.status(400).json({
                status:"failure",
                message:"Category name already exists"
            })
        }

        req.body.name = req.body.name.toLowerCase() // Convert name to lowercase before creating
        const category = await Category.create(req.body);
        res.status(201).json({
            status:"success",
            categoriesData:{
                category
            }
        })
    }catch(err){
        res.status(500).json({
            status:"failure",
            message: err.message
        })
    }
}

export const createSubCategory = async(req, res, next)=>{
    try{
        const {categoryId} = req.params
        const {name, icon, role} = req.body
        // check weather the sub category is present in that categort or not
        const existingSubCategory = await SubCategory.findOne({categoryId : categoryId, name:name.toLowerCase()})
        // if existing subCategory return the failure status
        if(existingSubCategory) {
            return res.status(400).json({
                status: "failure",
                message : "Subcategory is already available in the category"
            })
        }

        // if subCategory is not present then create that sub category
        const subCategory = await SubCategory.create({categoryId, name : name.toLowerCase(), icon, role})
        res.status(201).send({
            status:"success",
            data:{
                subCategory
            }
        })
    }catch(err){
        res.status(500).json({
            status:"failure",
            message:err.message
        })
    }
}

export const getCatergories = async (req, res, next)=>{
    try{
        const categoriesData = await Category.find({});
        res.status(200).json({
            status:"success",
            categories:{
                categoriesData
            }
        })
    }catch(err){
        res.status(500).json({
            status:"failure",
            message:err.message
        })
    }
}

export const getSubCategoriesOfACategory = async(req, res, next)=>{
    try{
        const {categoryId} = req.params
        console.log(categoryId);
        const subCategories = await SubCategory.find({categoryId});
        res.status(200).json({
            status:"success",
            subCategoriesData :{
                subCategories
            }
        })
    }catch(err){
        res.status(500).json({
            status:"failure",
            message:err.message
        })
    }
}