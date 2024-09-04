import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true ,
        minlength : 3
    },
    email : {
        type : String , 
        required : true ,
        unique : true ,
        trim : true ,
        lowercase : true ,
        match : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ,

    },
    password : {
        type : String , 
        required : true ,
        minlength : 6
    },
    gender : {
        type : String , 
        enum : ['Male','Female'] 
    },
    cartItems : [
        {
            quantity : {
                type : Number ,
                default : 1
            },
            product : {
                type : mongoose.Schema.Types.ObjectId , 
                ref : 'Product' 
            }
        }
    ],
    role : {
        type : String ,
        enum : ['customer', 'admin'],
        default : 'customer'
    },




},{timestamps: true});


const User = mongoose.model('User',UserSchema) ;

export default User ;