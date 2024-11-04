import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    name: {
        type:String,
        required:true,
        trim : true,
    }, 
    icon:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum:['active', 'inactive'],
        default:'active'
    }
})

export const SubCategory = mongoose.model("SubCategory", categorySchema);