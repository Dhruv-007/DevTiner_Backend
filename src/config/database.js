const mongoose =  require('mongoose');

const connectDB  = async () =>{
    await mongoose.connect('mongodb+srv://DevTinder:W84ckrGLCeImJN1Z@cluster0.vxazn5e.mongodb.net/')
}

module.exports = connectDB;



