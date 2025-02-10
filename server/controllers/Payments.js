const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto= require("crypto");
const CourseProgress = require("../models/CourseProgress");


// For Multiple Course--->
//initiate the razorpay order
exports.capturePayment = async(req, res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0) {
        return res.json({success:false, message:"Please provide Course Id"});
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try{
            console.log("Printing CourseID: ", course_id.courseId)
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            const uid  = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }

            totalAmount += course.price;
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


//verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            await enrollStudents(courses, userId, res);
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}


const enrollStudents = async(courses, userId, res) => {

    if(!courses || !userId) {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

    for(const courseId of courses) {
        try{
            //find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push:{studentsEnrolled:userId}},
            {new:true},
        )

        if(!enrolledCourse) {
            return res.status(500).json({success:false,message:"Course not Found"});
        }

        const courseProgress= await CourseProgress.create({
            courseId: courseId,
            userId: userId,
            completedVideos: [],
        })

        //find the student and add the course to their list of enrolledCOurses
        const enrolledStudent = await User.findByIdAndUpdate(userId,
            {$push:{
                courses: courseId,
                coursesProgress: courseProgress._id,
            }},{new:true})
            
        ///bachhe ko mail send kardo
        const emailResponse = await mailSender(
            enrollStudents.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
        )    
        // console.log("Email Sent Successfully", emailResponse.response);
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }

}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}${enrolledStudent.lastName}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}



// For Single Course--->
// // Capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {

//   //get courseld and UserID
//   const {course_id} =req.body;
//   const userId= req.user.id;

//   // valid courseID
//   if(!course_id){
//     return res.json({
//         success: false,
//         message: 'Please provide valid course ID',
//     })
//   }

//   //valid courseDetail
//   let course;
//   try{
//     course= await Course.findById(course_id);
//     if(!course){
//         return res.json({
//             success: false,
//             message: 'Could not find the course',
//         })
//       }

//   // user already pay for the same course 
//   const uid= new mongoose.Types.ObjectId(userId); //convert the stringType userId into ObjectType userId
//   if(course.studentsEnrolled.includes(uid)){
//     return res.status(200).json({
//         success: false,
//         message: 'Student is already enrolled',
//     })
//   }
//   } catch(error){
//     console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message ,
//         })
//   }

//   // order create
//   const amount= course.price;
//   const currency= "INR";
  
//   const options= {
//     amount: amount* 100,
//     currency,
//     receipt: Math.random(Date.now()).toString,
//     notes: {
//         course_id,
//         userId,
//     }
//   }

//   try{
//     // initiate the payments using razoypay
//     const paymentResponse= instance.orders.create(options);
//     console.log(paymentResponse);

//     // return response
//     return res.status(200).json({
//         success: true,
//         courseName: course.courseName,
//         courseDescription: course.courseDescription,
//         thumbnail: course.thumbnail,
//         orderId: paymentResponse.id,
//         currency: paymentResponse.currency,
//         amount: paymentResponse.amount,
//     })

//   } catch(error){
//     console.log(error);
//     return res.status(500).json({
//         success: false,
//         message: "Could not initiate order" ,
//     })
//   }  
// };


// // verifySignature of razorpay and server--->
// exports.verifySignature= async(req, res) => {
//     const webhookSecret= "12345678";    //serverSecret

//     const signtaure= req.headers["x-razorpay-signature"];

//     // 3 important steps
//     const shasum= crypto.createHmac("sha256", webhookSecret); //hashing algorithm
//     shasum.update(JSON.stringify(req.body)); //converts into string format
//     const digest= shasum.digest("hex");

//     if(signtaure === digest){
//         console.log("Payment is Authorised");

//         const {coursId, userId}= req.body.payload.payment.entity.notes; 

//         try{
//             // fulfil the action-->

//             // find the course and enroll the student in it
//             const enrolledCourse= await Course.findByIdAndUpdate(
//                 {_id: coursId},
//                 {$push: {studentsEnrolled: userId}},
//                 {new: true},
//             )
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success: false,
//                     message: "Course not found" ,
//                 })
//             }
//             console.log(enrolledCourse);

//             // find the student and add course to their list of enrolled courses
//             const enrolledStudent= await User.findOneAndUpdate(
//                 {_id: userId},
//                 {$push: {courses: coursId}},
//                 {new: true},
//             ) 
//             console.log(enrolledStudent); 

//             // send mail of confirmation
//             const emailResponse= await mailSender(
//                 enrolledStudent.email,
//                 courseEnrollmentEmail(enrolledCourse.courseName, 
//                 `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
//             )
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified and course added"
//             })
//         } catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success: false,
//                 message: error.message,
//             })
//         }

//     } else{
//         return res.status(400).json({
//             success: false,
//             message: "Invalid input",
//         })
//     }

// }