const User = require("../models/User");
const Otp = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
require("dotenv").config();

// SendOTP-->
exports.sendotp = async (req, res) => {
  try {
    // fetch email from requset ki body
    const { email } = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({ email });

    ///if user already exist, then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Generated Otp: ", otp);

    // check unique otp or not
    let result = await Otp.findOne({ otp: otp });
    while (result) {
       otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await Otp.findOne({ otp: otp });
    }

    const otpPayload = { email, otp , expiresAt: Date.now() + 10 * 60 * 1000};

    // create an entry in db for otp
    const otpBody = await Otp.create(otpPayload);
    console.log("OtpBody: ", otpBody);

    // return response successfull
    res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  
// Signup-->
exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
		} = req.body;
		// Check if All Details are there or not
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp ||
			!accountType
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Find the most recent OTP for the email
		const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "OTP not found",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

		// Create the Additional Profile For User
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
		});
		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType: accountType,
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};


// Login--->
exports.login= async(req, res) => {

    try{
        // get data from req body
        const {email, password}= req.body;
        
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are required, try again",
              });
        }

        // check user exist or not
        const user= await User.findOne({email}).populate("additionalDetails").exec();
        if(!user){
            return res.status(401).json({
                success: false,
                message: " User is not registered, please signup first",
            });
        }

        // generate JWT, after password matching
        const matchedPassword= await bcrypt.compare(password, user.password);
        if(matchedPassword){
            const payload= {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token= jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h", 
            })
            user.token= token;
            user.password= undefined;

            // create cookie and send response
            const options= {
                expires: new Date(Date.now()+ 3* 24* 60* 60* 1000),  //3-days
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            })
        } else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        }
    } catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Login faliure, Please try again",
        }) 
    }
}


// ChangePassword--->
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password 
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		// if (newPassword !== confirmNewPassword) {
		// 	// If new password and confirm new password do not match, return a 400 (Bad Request) error
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "The password and confirm password does not match",
		// 	});
		// }

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				// passwordUpdated(
				// 	updatedUserDetails.email,
				// 	`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				// )
				"🔒 Password Updation", 
				`Your password has been successfully updated for the email ${updatedUserDetails.email}`,
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};