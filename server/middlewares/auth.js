const jwt = require("jsonwebtoken");
// const User = require("../models/User");
require("dotenv").config();


// Auth-->
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
      console.log("Token backend: ",token)

    //   if token is missing, return response
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token is missing"
        })
    }

    // Verify the token
    try{
        const decode= jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        req.user= decode; //Attach user data to the request object
    }catch(err){
        // verification issue
        return res.status(401).json({
            success: false,
            message: "Token is invalid",
        })
    }
    next();
  } catch (error) {
    return res.status(401).json({
        success: false,
        message: "Something went wrong while validating the token",
    })
  }
};



// isStudent--->
exports.isStudent= async(req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for student only ",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role can't be verified, Please try again",
        })
    }
}


// isInstructor--->
exports.isInstructor= async(req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for Instructor only ",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role can't be verified, Please try again",
        })
    }
}


// isAdmin--->
exports.isAdmin= async(req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for Admin only ",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User role can't be verified, Please try again",
        })
    }
}