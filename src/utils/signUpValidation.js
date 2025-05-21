const validator = require('validator');

const ValidateSignUp =(req) => {
const {firstName, lastName, emailId, password } = req.body;
if(!firstName || !lastName){
    throw new Error("Name is required");
} else if (!validator.isEmail(emailId)){
    throw new Error("Invalid email")
}else if (!validator.isStrongPassword(password)){
    throw new Error("Password is not strong")
}
}

const validateEditProfile = (req) => {
    const allowedEditFields = 
    ["firstName", "lastName","emailId","photoUrl","about", "skills", "age","gender"];
    const isEditAllowed = Object.keys(req.body).every((field)=> 
        allowedEditFields.includes(field))
    console.log(isEditAllowed,"isEditAllowed");
   return isEditAllowed;
}

module.exports = {
    ValidateSignUp,
    validateEditProfile

}