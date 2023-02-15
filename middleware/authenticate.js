const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

console.log(process.env.PORT);
const Authenticate = async (req, res, next) => {
  const token = req.cookies.jwtoken;
  console.log(token);
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    console.log("YHA");
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    return res.status(401).json({ error: err });
    console.log(err);
  }
};

module.exports = Authenticate;
