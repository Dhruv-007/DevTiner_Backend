const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const SAVE_USER_DATA =  "firstName lastname skills age gender photoUrl"
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
     populate("toUserId", SAVE_USER_DATA)

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
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;

    //  1st -- ConnectRequest unique user  Id ( from and to)
    //  2nd --  fetch only ids, now search it on user model , for self user id, 
    //  3r === all ids should not be equal to connectionRequestIds.
   
    // Find all the connection req [send or recieved ]
    const connectionRequest = await ConnectionRequest.find({
        $or:[{ fromUserId: loggedInUser._id },
            {toUserId : loggedInUser._id}]
    }).select("fromUserId toUserId")

    // blocked user, tht shouldnt be seend on feed

    const hideUserFromFeed = new Set();
    connectionRequest.forEach(req => {
        hideUserFromFeed.add(req.fromUserId.toString())
        hideUserFromFeed.add(req.toUserId.toString())
    })

    //  now from db of user , collect all id tht are not present in hidefromFeed and show

    const users = await User.find({
        $and: [ {_id: { $nin: Array.from(hideUserFromFeed)}},   // $nin means not in this array
              {_id:{$ne: loggedInUser._id}}   // $ne means not equal to
        ]}).select(SAVE_USER_DATA).skip(skip).limit(limit)

    res.json({ message:"Date fetched Successfull !!!",
          users})

})

module.exports = userRouter;