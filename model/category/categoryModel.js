import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
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

export const Category = mongoose.model("Category", categorySchema);