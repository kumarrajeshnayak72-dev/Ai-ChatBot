const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const registerController = async(req,res)=>{
    const{username,password} = req.body;

    const isUserExist = await userModel.findOne({username});

    if(isUserExist){
        return res.status(401).json({
            message:"User  Already Exist"
        })
    }
    const user = await userModel.create({
        username,
        password:await bcrypt.hash(password,10)
    })
    const token = jwt.sign({id:user._id},process.env.SECRET_KEY)
    res.cookie("token",token)

    return res.status(401).json({
        message:"User Registered Successfully",
    })
}

const loginController = async(req,res) =>{
    const{username,password} = req.body;

    const user = await userModel.findOne({username});

    if(!user){
        return res.status(401).json({
            message:"User Doesnot Exist"
        })
    }

    const ispassword = await bcrypt.compare(password,user.password);
    if(!ispassword){
         return res.status(401).json({
           message: "Password Incorrect",
         });

    }
    const token = jwt.sign({id:user._id},process.env.SECRET_KEY)
    res.cookie("token",token)
    return res.status(201).json({
        message:"User Login successfull",
        user
    })
}

module.exports = {registerController,loginController}