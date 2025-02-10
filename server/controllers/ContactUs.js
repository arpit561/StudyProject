const { contactUsEmail } = require("../mail/templates/contactFormRes");
const { contactUsEmailToMe } = require("../mail/templates/contactToMe");
const mailSender = require("../utils/mailSender")
require("dotenv").config();


exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  const emailToMe= process.env.MAIL_USER;

  console.log(req.body.firstname)
  try {

    // contact email to viewer-->
    await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )

    // contact to me-->
    await mailSender(
      emailToMe,
      "Receeved data from SoloStudy website",
      contactUsEmailToMe(email, firstname, lastname, message, phoneNo, countrycode)
    )
    return res.json({
      success: true,
      message: "Both email send successfully",
    })

  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}
