const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    userName:{
        type: String,
        require:[true,"Enter your UserName"],
    },
    email:{
        type:String,
        require:[true,"Enter your Email"],
        unique:[true,"Email address already registered"],
    },
    password:{
        type:String,
        require:[true,"Enter your password"],
    }
},{
    timestamps: true,
});

module.exports=mongoose.model("User",userSchema);