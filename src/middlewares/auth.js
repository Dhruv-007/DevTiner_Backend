const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Read the token
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token not found");
    }
    //  validate the token

    const decodedObj = await jwt.verify(token, "devTinder@123");
    const { _id } = decodedObj;
    // find the user by id
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
};

module.exports = {
  userAuth,
};
