const express =  require('express');
const connectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser') // to read cookie need middlware
var cors = require('cors')

// to resolve cors error
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

app.use(express.json())
app.use(cookieParser())   // to read cookie need middlware

// routes of apis
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user")

app.use("/",authRouter )
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/",userRouter )


connectDB().then(()=>{
    console.log('connected to database');
    app.listen(3001,()=>{
        console.log("Server is running")
    })
}).catch((err)=>{
    console.log(err);
})


