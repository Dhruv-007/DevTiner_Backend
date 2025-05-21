const moongose = require('mongoose');;

const connectionRequestSchema = new moongose.Schema({
    fromUserId:{
        type: moongose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    toUserId:{
        type: moongose.Schema.Types.ObjectId,
         ref:"User",
        required: true
    },
    status:{
        type: String,
        enum:["ignored","intrested", "accepted", "rejected"],
            message: '{VALUE} is not supported',
            required: true
    }
},
{
    timestamps: true
}
)

    // create a index
    connectionRequestSchema.index({fromUserId:1, toUserId:1})

    // check for sending request to self
    connectionRequestSchema.pre("save", function(next){
        const connectionRequest = this;
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
           throw new Error("Cannot send connection request to self")
        }
        next();
    })

const ConnectionRequestModel = new  moongose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequestModel;