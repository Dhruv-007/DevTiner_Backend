const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,

    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        index:true,
        required: true,
        unique: true ,
      trim: true,
      validate: function(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid email")
        }
      }
    },
    password:{
        type: String,
        validate: function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password not strong ")
            }
          }
        },
    age:{
        type: Number,
        min:18
    },
    gender:{
        type: String,
        enum:["male","female","other"],
        required: true,
    },
    skills:{
        type:[String]
    },
    photoUrl:{
        type: String,
       default: "https://cdn.pixabay.com/photo/2023/08/20/20/36/irish-setter-8203155_1280.jpg"
    },
    about:{
        type: String,
        default: "I am a new user"
    },

   
},{
    timestamps: true
})

userSchema.methods.getJWT = async function  (){
    const user = this;
   const token =  await jwt.sign({_id:user?._id},"devTinder@123",{expiresIn:'7d'})
   return token;
}

userSchema.methods.validatePassword = async function (passwordByUser) {
     const user = this;
     const passwordHash = user.password;
    const isPasswordValidated = await bcrypt.compare(passwordByUser, passwordHash);
    return isPasswordValidated
}

const User = mongoose.model('User',userSchema);

module.exports = User;