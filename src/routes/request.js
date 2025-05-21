const express = require('express')
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router()


//  sent coonection

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res) =>{
    try{
       const toUserId = req.params.toUserId;
       const fromUserId = req.user._id;
       const status = req.params.status;
     // Check for status strictly
        const isAllowedStatus = ["ignored","intrested"];
        if(!isAllowedStatus.includes(status)){
            throw new Error(`Status is not valid: ${status}`)
        }
    // check for connection already exist or not
       const checkExistngRequest = await ConnectionRequest.findOne({
        $or:[
            {toUserId,fromUserId},
            {toUserId:fromUserId, fromUserId:toUserId},
        ]    
       })
       if(checkExistngRequest){
         return res.status(400).json({
            message:"Connection request already exist",
        })
       }
    //    check if user exist or not
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(400).json({
            message:"User not found",
        })
      }


    const connectRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
       })

       const data =  await connectRequest.save();
       res.json({
        message:   req.user.firstName+ " " +"is " + status + " in " + toUser.firstName
        , data
    })

    }catch(error){
         res.status(400).send(error.message)
    }
})

// review connection request 

requestRouter.post("/request/review/:status/:requestedId", userAuth, async (req,res) =>{
    try {
      const loggedInUser =  req.user;
      const {status , requestedId} = req.params;
      console.log(req.params,"req")

      // check status
      const isAllowedStatus = ["accepted","rejected"]
       if(!isAllowedStatus.includes(status)){
        throw new Error(`${status} is not valid. `)
       }
 
      // check for coonection request

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestedId,
        toUserId:loggedInUser._id,
        status:"intrested"
      })
      if(!connectionRequest){
        throw new Error("Connection request not found.")
      }
       
      connectionRequest.status = status;

      const data = await connectionRequest.save();
       res.json({
        message:`Connection request is : ${status}`,
        data
       })
      
    } catch (error) {
       res.status(400).send(error.message)
    }


})

//  review the connection request
requestRouter.post("/request/review/:status/:requestedId", userAuth,)

module.exports = requestRouter

