const asyncHandler=require("express-async-handler")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const User=require("../models/userModels");


//@route POST /api/user/register
//@access PUBLIC
const registerUser= asyncHandler(async(req,res)=>{
    const {userName,email,password}=req.body;

    if(!userName || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable= await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!");
    }
    //Hash password --- stroring this hashed password
    const hashedPassword= await bcrypt.hash(password,10);
    console.log("Hashed Password: ",hashedPassword);

    const user=await User.create({
        userName,
        email,
        password: hashedPassword,
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id:user.id, email:user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
});


//@route POST /api/user/login
//@access PUBLIC
const loginUser= asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user=await User.findOne({email});     //if user exists we need to check its password

    if(user && (await(bcrypt.compare(password,user.password)))){
        // password matches, so we provide a access token
        const accessToken=jwt.sign({
            user:{
                userName: user.userName,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
        );
        res.status(200).json({accessToken});
        //we are using accessTokens to access the private routes
    }else{
        res.status(401);
        throw new Error("email or password not valid")
    }
})

//@route POST /api/user/current
//@access PRIVATE
const currentUser= asyncHandler(async(req,res)=>{
    res.json(req.user);
})

module.exports={registerUser,loginUser,currentUser};