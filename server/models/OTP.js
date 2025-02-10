const mongoose= require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema= new mongoose.Schema({
    email: {
        type: String,
        // require: true,
    },
    otp: {
        type: String,
        // require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5* 60,
    }
});

// a func --> to send otp verification email
async function sendVerificationEmail(email, otp) {
    try{
        console.log("Sending OTP:", otp); // Log the OTP to verify it's being passed correctly
        const mailResponse= await mailSender(email, "Verification Email", otpTemplate(otp));
        console.log("Email sent successfully ", mailResponse);

    } catch(error){ 
        console.log("Error occured while sending mails: ", error);
        throw error;
    }
}

otpSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports= mongoose.model("OTP", otpSchema);