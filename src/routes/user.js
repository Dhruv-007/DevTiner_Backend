const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

// get pending connection api

userRouter.get("/user/request/recieved", userAuth, async(req, res)=>{
   try {
     const loggedInUser = req.user;
     
     const connectionRequest = await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status: "intrested"
     }).populate("fromUserId", "firstName lastname skills age gender photoUrl")

    await res.json({
        message:"Data fetched sucessfully",
        connectionRequest
    })

   } catch (error) {
     res.status(400).send(error.message)
   }
})

//  list of connected ppl

 userRouter.get("/user/connections", userAuth, async(req, res) =>{

     try {
        const loggedInUser = req.user;
     const connectionRequest = await ConnectionRequest.find({
       $or:[
        {toUserId: loggedInUser._id, status:"accepted"},
        {fromUserId:loggedInUser._id, status:"accepted"}
       ]
     }).populate("fromUserId", "firstName lastname skills age gender photoUrl").
     populate("toUserId", "firstName lastname skills age gender photoUrl")

     const data = connectionRequest.map((row) => {
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId;
      }
      return row.fromUserId
     })

    await res.json({
        message:"Data fetched sucessfully",
       data
    })
        
     } catch (error) {
         res.status(400).send(error.message)
     }
    



 })


// feed api 
userRouter.get("/user/feed", userAuth, async (req,res)=>{
    const loggedInUser =  req.user;

    //  1st -- ConnectRequest unique user  Id ( from and to)
    //  2nd --  fetch only ids, now search it on user model , for self user id, 
    //  3r === all ids should not be equal to connectionRequestIds.
   
    // Find all the connection req [send or recieved ]
    
    // const connectionRequest = await ConnectionRequest.find({
    //     $or:[{ fromUserId: loggedInUser._id },
    //         {toUserId : loggedInUser._id}]
    // })
})

module.exports = userRouter;