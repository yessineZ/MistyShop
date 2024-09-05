import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 3
    },
    price : {
        type : Number,
        required : true,
        min : 0
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        required : [true,"Image is required"] 
    },
    category : {
        type : String ,
        required : true 
    },
    isFeatured  : {
        type : Boolean,
        default : false
    }
},{timestamps : true });


const Product = mongoose.model('Product',ProductSchema);

export default Product;