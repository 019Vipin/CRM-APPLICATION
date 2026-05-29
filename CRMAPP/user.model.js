const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:7
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minLength:10
    },
    userType:{
        type:String,
        enum:["CUSTOMER","ADMIN","ENGINEER"],
        required:true,
        default:"CUSTOMER"
    },
    userStatus:{
        type:String,
        enum:["APPROVED","PENDING","BLOCKED"],
        required:true,
        default:"APPROVED"
    }
},{timestamps:true});

module.exports=mongoose.model("user",userSchema);