const express = require('express');
const { ValidateSignUp } = require('../utils/signUpValidation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { now } = require('mongoose');



const authRouter = express.Router()

authRouter.post('/signup',async (req,res)=>{
    try {
        // validate the user
        ValidateSignUp(req)
        // password hashing
        const {firstName,lastName,emailId, password,gender,skills} =  req.body;
        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({
            firstName, lastName, emailId, password:passwordHash,gender, skills
        })
       const savedUser =   await user.save()
        res.json({message:"Account Created Suucessfully", data:savedUser})
    } catch(error){
        res.status(400).send("Error: "+error.message)
    } 
})
// login user
authRouter.post('/login', async (req,res)=>{
    console.log("Login Successfull")
    try{
        const {emailId, password} = req.body
        const user =  await User.findOne({emailId:emailId});
      
        if(!user){
            throw new Error("Email not present in DB or is not correct")
        }
        const isPasswordCorrect = await user.validatePassword(password)
      
        // if password is correct then create a toke
        if(isPasswordCorrect){
            // create a JWT token
           const token = await user.getJWT();
        //    console.log(token,"token")
         
            // Add Token to cookie and send response to user
            res.cookie("token", token)
            res.send(user)
       
            // res.json({message:"Login Successfull",user})
        }else{
            throw new Error("Password is not correct.")
        }
    }catch{
        res.status(404).send("Failed to Login")
    }  
})
    // logout API
    authRouter.post("/logout", async (req,res)=>{
        res.cookie("token", null ,{
        expires: new Date(Date.now())
        })
       res.json({message:"Logout Sucessfully"})
    })
  



module.exports = authRouter

