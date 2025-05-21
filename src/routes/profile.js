const express = require('express')
const { userAuth } = require('../middlewares/auth')
const { findByIdAndUpdate } = require('../models/user')
const User = require('../models/user')
const { validateEditProfile } = require('../utils/signUpValidation')


const profileRouter = express.Router()

//  Profile 
 profileRouter.get("/profile/view",userAuth, async (req,res) =>{
    try{
        const user =  req.user
        res.send(user)
    }catch(error){
        res.status(400).send("Something went wrong"+error.message)
    }
 })

//  Edit profile api
profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try {
       if(!validateEditProfile(req)){
        throw new Error("Invalid Edit Request.")
       };
        const LoggedInUser = req.user;
        console.log(LoggedInUser);
        Object.keys(req.body).forEach((key) => {
            LoggedInUser[key] = req.body[key];
        });
         console.log(LoggedInUser,"loggedInUser");
        res.send(`${LoggedInUser.firstName} Profile updated successfully `)

        // proceed with update
    } catch (error) {
        // handle validation error
        res.status(400).json({ error: error.message });
    }
})


module.exports = profileRouter

