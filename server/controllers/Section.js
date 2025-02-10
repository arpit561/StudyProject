const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");


// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};



// updateSection--->
exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId, courseId } = req.body;

    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const updatedCourse = await Course.findById(courseId)
    .populate({
      path: "courseContent", 
      populate: {
        path: "subSection"
      }
    }).exec();

    // return response
    return res.status(200).json({
      success: true,
      data: {updatedCourse, section},
      message: "Section updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update section, Please try again",
      error: error.message,
    });
  }
};


// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
		const { sectionId, courseId } = req.body;

		// Remove section reference from Course
		await Course.findByIdAndUpdate(courseId, {
			$pull: { courseContent: sectionId },
		});

		// Find section
		const section = await Section.findById(sectionId);
		console.log("Deleting section:", sectionId, "from course:", courseId);

		if (!section) {
			return res.status(404).json({
				success: false,
				message: "Section not found",
			});
		}

		// Delete all associated subsections
		await SubSection.deleteMany({ _id: { $in: section.subSection } });

		// Delete the section
		await Section.findByIdAndDelete(sectionId);

		// Get the updated course data
		const updatedCourse = await Course.findById(courseId)
			.populate({
				path: "courseContent",
				populate: { path: "subSection" },
			})
			.exec();

		// ✅ Ensure only one response is sent
		return res.status(200).json({
			success: true,
			message: "Section deleted successfully",
			data: updatedCourse,
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
