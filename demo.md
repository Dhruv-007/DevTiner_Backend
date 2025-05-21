const express =  require('express');
const connectDB = require('./config/database')
const User = require('./models/user')
const {ValidateSignUp} = require('./utils/signUpValidation')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser') // to read cookie need middlware
const jwt = require('jsonwebtoken')
const {userAuth} =  require("./middlewares/auth")

const app = express()

app.use(express.json())
app.use(cookieParser())   // to read cookie need middlware

app.post('/signup',async (req,res)=>{
    try {
        // validate the user
        ValidateSignUp(req)
        // password hashing
        const {firstName,lastName,emailId, password,gender,skills} =  req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);
        const user = new User({
            firstName, lastName, emailId, password:passwordHash,gender, skills
        })
        await user.save()
        res.send(user,"User saved successfully")
    } catch(error){
        res.status(400).send("Error: "+error.message)
    } 
})
// login user
app.post('/login', async (req,res)=>{
    try{
        const {emailId, password} = req.body
        const user =  await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Email not present in DB or is not correct")
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(isPasswordCorrect){
            // create a JWT token
           const token = await jwt.sign({_id:user?._id},"devTinder@123")
              console.log(token);

            // Add Token to cookie and send response to user
            res.cookie("token", token)
            res.send("Login Successfull")
        }else{
            throw new Error("Password is not correct.")
        }
    }catch{
        res.status(404).send("Failed to Login")
    }
    
})

//  Profile 
 app.get("/profile",userAuth, async (req,res) =>{
    try{
        const user =  req.user
        res.send(user)
    }catch(error){
        res.status(400).send("Something went wrong"+error.message)
    }
 })

//  

// find one user by email
app.get('/userByEmail',async (req,res)=>{
    const userEmail  = req.body.emailId;
    try{
        
        const user = await User.find({emailId:userEmail})
        if(user?.length === 0){
            res.status(404).send("User Not found")     
        }else{
            res.send(user)
        }
    }catch(error){
        res.status(400).send("Something went wrong"+error.message)
    }
})

// find all users
app.get("/allUsers", async (req,res)=>{
    const allUsers = await User.find({})
    try{
        if(allUsers?.length === 0){
            res.status(404).send("No users found")
        }else{
            res.send(allUsers)
        }
    }catch(error){
        res.status(400).send("Something went wrong"+error.message)
    }
})

//  Delete the user 
app.delete("/delete", async (req,res)=>{
    const userId = req.body.userId
   
    try{
        const user = await User.findOneAndDelete({ _id: userId })
         res.send("User deleted successfully")
    }catch(error){
        res.status(400).send("Something went wrong"+error.message)
    }
   
})

// update the user
app.patch("/update/:userId", async(req, res)=>{
     const userId = req.params.userId;
     const data = req.body;
     runValidators = true;
    try{
        const Allow_Update = ["firstName","age","gender","skills","lastName"];
        const isAllowedUpdate = Object.keys(data).every(k => Allow_Update.includes(k))
        if(!isAllowedUpdate){
            throw new Error("Cannot update email")
        }
      await User.findByIdAndUpdate({_id:userId}, data);
      res.send("User updated successfully")
    }catch(error){
        res.status(400).send("Something went wrong"+error.message)
    }
})


connectDB().then(()=>{
    console.log('connected to database');
    app.listen(3001,()=>{
        console.log("Server is running")
    })
}).catch((err)=>{
    console.log(err);
})


