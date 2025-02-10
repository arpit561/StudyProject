const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const mongoose= require("mongoose");

// createRating--->
exports.createRating= async(req, res) => {

    try{

    // get userId
    const userId= req.user.id;

    // fetch data from the body
    const {rating, review, courseId}= req.body;

    //check if user is enrolled or not
    const courseDetails= await Course.findOne(
        {_id: courseId,
            studentsEnrolled: {$elemMatch: {$eq: userId}},
        }
    )

    if(!courseDetails){
        return res.status(404).json({
            success: false,
            message: "Student is not enrolled in the course"
        })
    }

    //check if user already reviewed the course
    const alreadyReviewed= await RatingAndReview.findOne({
              user: userId,
              course: courseId,
    })

    if(alreadyReviewed){
        return res.status(403).json({
            success: false,
            message: "Course is ready reviewed by the user",
        })
    }

    // create rating and review
    const ratingReview= await RatingAndReview.create({
        rating: rating,
        review: review,
        course: courseId,
        user: userId,
    })

    // update course with rating/review
    const updatedCourseDetails= await Course.findByIdAndUpdate({_id: courseId},
        {
            $push: {
                ratingAndReviews: ratingReview._id,
            }
        },
        {new: true})
        console.log("updatedCourseDetails--->", updatedCourseDetails);

        // return response
        return res.status(200).json({ 
            success: true,
            message: "Rating and Review created successfully",
            ratingReview,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }   
}



// getAverageRating--->
exports.getAverageRating= async(req, res) => {
    
    try{
        // get courseId
        const courseId= req.body.courseId;

        // calc avg rating
        const result= await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),//courseId is converted String into ObjectId
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating "}
                }
            } 
        ])

        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        // if no rating/review exist
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no rating given till now",
            averageRating: 0,
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        }) 
    }
}


// getAllRating--->
exports.getAllRating= async(req, res) => {

    try{
        const allReviews= await RatingAndReview.find({})
                           .sort({rating: "desc"})
                           .populate({
                            path: "user",
                            select: "firstName lastName email image",
                           })
                           .populate({
                            path: "course",
                            select: "courseName",
                           }).exec();

         // return response                  
         return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        })
                           
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
