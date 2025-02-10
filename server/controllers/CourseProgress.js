const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the subsection is valid
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
                success: false,
                error: "Invalid subSection ID",
            });
        }

        // Check if CourseProgress exists for this user & course
        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId,  // Ensure progress is tracked per user
        });

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course Progress doesn't exist for this user",
            });
        } else {
            // Check if the subsection is already completed
            if (courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    success: false,
                    message: "SubSection already completed",
                });
            } else {
                // Mark subsection as completed
                courseProgress.completedVideos.push(subSectionId);
                await courseProgress.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Course progress updated successfully",
        });

    } catch (error) {
        console.error("Error updating course progress:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
